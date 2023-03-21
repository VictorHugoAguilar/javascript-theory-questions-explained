# Events

# Dónde agregar sus event listeners

Debe agregar listeners de eventos en un método que se garantice que se active antes de que ocurra el evento. Sin embargo, para un rendimiento de carga óptimo, debe agregar su detector de eventos lo más tarde posible.

Las formas más comunes de agregar un detector de eventos:

- Declarativamente, en la plantilla de su componente
- En el constructor del componente, para oyentes agregados en el propio componente.
- En el `connectedCallback`, para los oyentes que necesitan hacer referencia a
- DOM fuera del componente (por ejemplo, `Window` o `Document`).
- Después de la primera pintura, si está agregando muchos oyentes, el rendimiento de la primera pintura es fundamental.

## Agregar detectores de eventos declarativos

Puede usar enlaces lit-html `@event` en su plantilla para agregar detectores de eventos a su componente.

### Ejemplo

```jsx
render() {
  return html`<button @click="${this._handleClick}">`;
}
```

Los event listeners declarativos se agregan cuando se representa la plantilla. Esta suele ser la mejor manera de agregar oyentes a elementos en su DOM con plantilla.

## Añadir event listeners en el constructor

Si necesita escuchar un evento que podría ocurrir antes de que su componente se haya agregado a DOM, es posible que deba agregar el detector de eventos en el constructor de su componente.

El constructor de componentes es un buen lugar para agregar detectores de eventos en el propio elemento host.

### Ejemplo

```jsx
constructor() {
  super();
  this.addEventListener('focus', this._handleFocus);
}
```

## Añadir event listeners en `**connectedCallback**`

`connectCallback` es una callback de ciclo de vida en la API de elementos personalizados. `connectedCallback` se activa cada vez que se agrega un elemento personalizado a un elemento conectado a un documento. Consulte la documentación de MDN sobre el uso de devoluciones de llamada del ciclo de vida de elementos personalizados para obtener más información.

Si su componente agrega un event listeners a cualquier cosa excepto a sí mismo o a sus elementos secundarios, por ejemplo, a `Window`, `Document` o algún elemento en el `DOM principal, debe agregar el detector en `connectedCallback` y eliminarlo en `disconnectedCallback`.

- Quitar el event listeners en `disconnectedCallback` garantiza que cualquier memoria asignada por su componente se limpiará cuando su componente se destruya o se desconecte de la página.
- Agregar el event listeners en `connectedCallback` (en lugar de, por ejemplo, el constructor o `firstUpdated`) garantiza que su componente volverá a crear su detector de eventos si se desconecta y luego se vuelve a conectar a DOM.

### Ejemplo

```jsx
connectedCallback() {
  super.connectedCallback();
  window.addEventListener('resize', this._handleResize);
}
disconnectedCallback() {
  window.removeEventListener('resize', this._handleResize);
  super.disconnectedCallback();
}
```

## Agregue event listeners después de la primera pintura

A veces, es posible que desee aplazar la adición de un event listenner hasta después de la primera pintura, por ejemplo, si está agregando muchos detectores y el rendimiento de la primera pintura es fundamental.

LitElement no tiene una callback de ciclo de vida específica llamada después de la primera pintura, pero puede usar este patrón con la devolución de llamada de ciclo de vida `firstUpdated`:

```jsx
async firstUpdated() {
  // Give the browser a chance to paint
  await new Promise((r) => setTimeout(r, 0));
  this.addEventListener('click', this._handleClick);
}
```

`firstUpdated` se dispara después de la primera vez que su componente se actualizó y llamó a su método de renderizado, pero antes de que el navegador haya tenido la oportunidad de pintar. La línea `Promise/setTimeout` cede al navegador

# Usando `this` en event listeners

Event listeners se añade usando la declaración `@events` syntax en la plantilla se vinculan automáticamente al componente.

Por lo tanto, puede usar esto para referirse a su instancia de componente dentro de cualquier controlador de eventos declarativo:

```jsx
class MyElement extends LitElement {
  render() {
    return html`<button @click="${this._handleClick}">click</button>`;
  }
  _handleClick(e) {
    console.log(this.prop);
  }
}
```

Al agregar detectores de manera imperativa con `addEventListener`, deberá vincular el detector de eventos usted mismo si necesita una referencia a la instancia del componente. Por ejemplo:

```jsx
this.boundResizeHandler = this.handleResize.bind(this);
window.addEventListener("resize", this.boundResizeHandler);
```

O use una función de flecha como un campo de clase:

```jsx
export class MyElement extends LitElement {
  private _handleResize = () => { /* handle the event */ }

  constructor() {
    window.addEventListener('resize', this._handleResize);
  }
}
```

# Configuración de las opciones del event listener

Cuando agrega imperativamente un detector de eventos, mediante `addEventListener`, puede especificar varias opciones de detectores de eventos. Por ejemplo, para usar un detector de eventos pasivo en JavaScript simple, haría algo como esto:

```jsx
someElement.addEventListener("touchstart", this._handleTouchStart, {
  passive: true,
});
```

El decorador `eventOptions` le permite agregar opciones de detectores de eventos a un detector que se agrega declarativamente en su plantilla.

```jsx
import {LitElement, html, eventOptions} from 'lit-element';
...

@eventOptions({passive: true})
private _handleTouchStart() { ... }

render() {
  return html`
    <div @touchstart=${this._handleTouchStart}><div>
  `;
}
```

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores. Consulte Uso de decoradores para obtener más información.

El objeto pasado a eventOptions se usa como parámetro de opciones para addEventListener.

# Casos de uso

- Activar un evento personalizado desde un componente basado en LitElement.
- Manejar un evento personalizado activado por un componente basado en LitElement.
- Manejar un evento disparado por un elemento secundario DOM de la sombra de su componente.
- Agregue detectores de eventos imperativamente.

## Disparar un evento desde un componente basado en LitElement

Disparar un custom event:

```jsx
class MyElement extends LitElement {
  render() {
    return html`<div>Hello World</div>`;
  }
  firstUpdated(changedProperties) {
    let event = new CustomEvent("my-event", {
      detail: {
        message: "Something important happened",
      },
    });
    this.dispatchEvent(event);
  }
}
```

Disparar un standard event:

```jsx
class MyElement extends LitElement {
  render() {
    return html`<div>Hello World</div>`;
  }
  updated(changedProperties) {
    let click = new Event("click");
    this.dispatchEvent(click);
  }
}
```

## Manejar un evento activado por un componente basado en LitElement

Si desea escuchar un evento activado desde un componente basado en LitElement desde dentro de otro LitElement o desde una plantilla lit-html, puede usar la sintaxis de eventos declarativos lit-html:

```jsx
<my-element @my-event="${(e) => { console.log(e.detail.message) }}"></my-element>
```

Para escuchar eventos activados desde un componente basado en LitElement en otros contextos, como HTML u otro framework, use el mecanismo estándar para escuchar eventos DOM.

En HTML simple y JavaScript, esta sería la API `addEventListener`:

```jsx
const myElement = document.querySelector("my-element");
myElement.addEventListener("my-event", (e) => {
  console.log(e);
});
```

# Trabajando con eventos y shadow DOM

Cuando trabaje con eventos y shadow DOM, hay algunas cosas que debe saber.

## Evento burbujeante

Algunos eventos surgen a través del árbol DOM, de modo que cualquier elemento de la página los puede detectar.

Que un evento burbujee o no depende del valor de su propiedad bubbles. Para verificar si un evento en particular burbujea:

```jsx
handleEvent(e){
  console.log(e.bubbles);
}
```

## Reorientación de eventos

Los eventos burbujeantes activados desde el DOM de la sombra se reorientan para que, para cualquier oyente externo a su componente, parezcan provenir de su propio componente.

### Ejemplo

```jsx
<my-element onClick="(e) => console.log(e.target)"></my-element>
```

```jsx
render() {
  return html`
    <button id="mybutton" @click="${(e) => console.log(e.target)}">
      click me
    </button>`;
}
```

Al manejar un evento de este tipo, puede encontrar de dónde se originó con `compositePath`:

```jsx
handleMyEvent(event) {
  console.log('Origin: ', event.composedPath()[0]);
}
```

## Custom events

De forma predeterminada, un evento personalizado burbujeante activado dentro del shadow DOM dejará de burbujear cuando llegue a la raíz shadow.

Para hacer que un evento personalizado pase a través de los límites del DOM oculto, debe configurar los indicadores de `bubbles` y `composed` en `true`:

```jsx
firstUpdated(changedProperties) {
  let myEvent = new CustomEvent('my-event', {
    detail: { message: 'my-event happened.' },
    bubbles: true,
    composed: true });
  this.dispatchEvent(myEvent);
}
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
