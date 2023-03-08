# Events

# Introducción

Los eventos son la forma estándar en que los elementos comunican los cambios. Estos cambios generalmente ocurren debido a la interacción del usuario. Por ejemplo, un botón envía un evento de clic cuando un usuario hace clic en él; una entrada envía un evento de cambio cuando el usuario ingresa un valor en él.

Además de estos eventos estándar que se envían automáticamente, los elementos Lit pueden enviar eventos personalizados. Por ejemplo, un elemento de menú podría enviar un evento para indicar que el elemento seleccionado cambió; un elemento emergente puede enviar un evento cuando se abre o se cierra la ventana emergente.

Cualquier código Javascript, incluidos los propios elementos Lit, puede escuchar y tomar medidas en función de los eventos. Por ejemplo, un elemento de la barra de herramientas puede filtrar una lista cuando se selecciona un elemento de menú; un elemento de inicio de sesión puede procesar un inicio de sesión cuando maneja un clic en el botón de inicio de sesión.

# Listening to events

Además del estándar `addEventListener` API, Lit presenta una forma declarativa de agregar detectores de eventos.

## Adding event listeners in the element template

Puede usar expresiones `@` en su template para agregar detectores de eventos a elementos en la plantilla de su componente. Los detectores de eventos declarativos se agregan cuando se representa la plantilla.

```jsx
import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  static properties = {
    count: {type: Number},
  };

  constructor() {
    super();
    this.count = 0;
  }
  render() {
    return html`
      <p><button @click="${this._increment}">Click Me!</button></p>
      <p>Click count: ${this.count}</p>
    `;
  }
  _increment(e) {
    this.count++;
  }
}
customElements.define('my-element', MyElement);
```

### Customizing event listener options

Si necesita personalizar las opciones de eventos que se utilizan para un detector de eventos declarativo (como pasivo o captura), puede especificarlas en el detector mediante el decorador `@eventOptions`. El objeto pasado a `@eventOptions` se pasa como parámetro de opciones a `addEventListener`.

```jsx
import {LitElement, html} from 'lit';
import {eventOptions} from 'lit/decorators.js';
//...
@eventOptions({passive: true})
private _handleTouchStart(e) { console.log(e.type) }
```

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores. Consulte Habilitación de decoradores para obtener más información.
> 

Si no usa decoradores, puede personalizar las opciones del detector de eventos pasando un objeto a la expresión del detector de eventos. El objeto debe tener un método `handleEvent()` y puede incluir cualquiera de las opciones que normalmente aparecerían en el argumento de `options` para `addEventListener().`

```jsx
render() {
  return html`<button @click=${{handleEvent: () => this.onClick(), once: true}}>click</button>`
}
```

## Adding event listeners to the component or its shadow root

Para recibir una notificación de un evento enviado desde los elementos secundarios ranurados del componente, así como los elementos secundarios representados en DOM oculto a través de la plantilla del componente, puede agregar un oyente al propio componente mediante el método DOM estándar `addEventListener`.  

El constructor de componentes es un buen lugar para agregar `addEventListener()` en el componente.

```jsx
constructor() {
  super();
  this.addEventListener('click', (e) => console.log(e.type, e.target.localName));
}
```

Agregar detectores de eventos al componente en sí es una forma de delegación de eventos y se puede hacer para reducir el código o mejorar el rendimiento. Ver delegación de eventos para más detalles. Por lo general, cuando se hace esto, la propiedad de `target` del evento se usa para tomar medidas en función del elemento que activó el evento.

Sin embargo, los eventos activados desde el shadow DOM del componente son redirigidos cuando los escucha un detector de eventos en el componente. Esto significa que el objetivo del evento es el propio componente. Consulte Trabajar con eventos en shadow DOM para obtener más información.

El retargeting puede interferir con la delegación de eventos y, para evitarlo, se pueden agregar detectores de eventos a la propia raíz oculta del componente. Dado que `shadowRoot` no está disponible en el `constructor`, se pueden agregar detectores de eventos en el método `createRenderRoot` de la siguiente manera. Tenga en cuenta que es importante asegurarse de devolver la raíz oculta del método `createRenderRoot`.

```jsx
class MyElement extends LitElement {
  static properties = {
    hostName: {},
    shadowName: {},
  };
  constructor() {
    super();
    this.addEventListener('click', (e) => (this.hostName = e.target.localName));
    this.hostName = '';
    this.shadowName = '';
  }
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener(
      'click',
      (e) => (this.shadowName = e.target.localName)
    );
    return root;
  }
  render() {
    return html`
      <p><button>Click Me!</button></p>
      <p>Component target: ${this.hostName}</p>
      <p>Shadow target: ${this.shadowName}</p>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## Adding event listeners to other elements

Si su componente agrega un detector de eventos a cualquier cosa excepto a sí mismo o a su DOM con plantilla, por ejemplo, a `Window`, `Document` o algún elemento en el DOM principal, debe agregar el detector en `connectedCallback` y eliminarlo en `disconnectedCallback`.

- Quitar el event listener (detector de eventos) en `disconnectedCallback` garantiza que cualquier memoria asignada por su componente se limpiará cuando su componente se destruya o se desconecte de la página.
- Agregar el event listener (detector de eventos) en `connectedCallback` (en lugar de, por ejemplo, el constructor o firstUpdated) garantiza que su componente volverá a crear su detector de eventos si se desconecta y luego se vuelve a conectar a DOM.

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

## Optimizing for performance

Agregar detectores de eventos es extremadamente rápido y, por lo general, no representa un problema de rendimiento. Sin embargo, para los componentes que se usan en alta frecuencia y necesitan muchos detectores de eventos, puede optimizar el rendimiento de la primera representación reduciendo la cantidad de detectores utilizados a través de la delegación de eventos y agregando detectores de forma asíncrona después de la representación.

### Delegación de eventos

El uso de la delegación de eventos puede reducir la cantidad de detectores de eventos utilizados y, por lo tanto, mejorar el rendimiento. A veces también es conveniente centralizar el manejo de eventos para reducir el código. La delegación de eventos solo se puede usar para manejar eventos que `bubble`. Consulte Envío de eventos para obtener detalles sobre la propagación.

Los eventos burbujeantes se pueden escuchar en cualquier elemento antecesor en el DOM. Puede aprovechar esto agregando un detector de eventos único en un componente principal para recibir una notificación de un evento burbujeante enviado por cualquiera de sus descendientes en el DOM. Utilice la propiedad de `target` del evento para realizar una acción específica en función del elemento que envió el evento.

```jsx
class MyElement extends LitElement {
  static properties = {
    clicked: {},
  };

  constructor() {
    super();
    this.clicked = '';
  }
  render() {
    return html`
      <div @click="${this._clickHandler}">
        <button>Item 1</button>
        <button>Item 2</button>
        <button>Item 3</button>
      </div>
      <p>Clicked: ${this.clicked}</p>
    `;
  }
  _clickHandler(e) {
    this.clicked =
      e.target === e.currentTarget ? 'container' : e.target.textContent;
  }
}
customElements.define('my-element', MyElement);
```

### Asynchronously adding event listeners

Para agregar un  event listener (detector de eventos) después de la render, use el método `firstUpdated`. Esta es una devolución de llamada del ciclo de vida de Lit que se ejecuta después de que el componente se actualice por primera vez y represente su DOM con plantilla.

La devolución de llamada `firstUpdated` se activa después de la primera vez que su componente se actualizó y llamó a su método de `render`, pero antes de que el navegador haya tenido la oportunidad de pintar.

Para asegurarse de que el oyente se agregue después de que el usuario pueda ver el componente, puede esperar una Promesa que se resuelva después de que el navegador pinte.

```jsx
async firstUpdated() {
  // Give the browser a chance to paint
  await new Promise((r) => setTimeout(r, 0));
  this.addEventListener('click', this._handleClick);
}
```

## Understanding this in event listeners

Los event listener (detectores de eventos) agregados mediante la sintaxis `@` declarativa en la plantilla se vinculan automáticamente al componente.

Por lo tanto, puede usar `this` para referirse a su instancia de componente dentro de cualquier controlador de eventos declarativo:

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

Al agregar listener (oyentes) imperativamente con `addEventListener`, querrá usar una función de flecha para que `this` se refiera al componente:

```jsx
export class MyElement extends LitElement {
  private _handleResize = () => {
    // `this` refers to the component
    console.log(this.isConnected);
  }

  constructor() {
    window.addEventListener('resize', this._handleResize);
  }
}
```

## Listening to events fired from repeated templates

Al escuchar eventos en elementos repetidos, a menudo es conveniente usar la delegación de eventos si el evento hace burbujas. Cuando un evento no burbujea, se puede agregar un oyente en los elementos repetidos. He aquí un ejemplo de ambos métodos:

```jsx
class MyElement extends LitElement {
  static properties = {
    clicked: {},
    focused: {},
  };

  constructor() {
    super();
    this.clicked = '';
    this.focused = '';
  }
  data = [1, 2, 3];
  render() {
    return html`
      <div key="container" @click=${this._clickHandler}>
        ${this.data.map(
          (i) => html`
          <button key=${i} @focus=${this._focusHandler}>Item ${i}</button>
        `
        )}
      </div>
      <p>Clicked: ${this.clicked}</p>
      <p>Focused: ${this.focused}</p>
    `;
  }
  _clickHandler(e) {
    this.clicked = e.target.getAttribute('key');
  }
  _focusHandler(e) {
    this.focused = e.target.textContent;
  }
}
customElements.define('my-element', MyElement);
```

# Dispatching events

Todos los nodos DOM pueden enviar eventos usando el método `dispatchEvent`. Primero, cree una instancia de evento, especificando el tipo de evento y las opciones. Luego páselo a `dispatchEvent` de la siguiente manera:

```jsx
const event = new Event('my-event', {bubbles: true, composed: true});
myElement.dispatchEvent(event);
```

La opción de `bubble` permite que el evento fluya hacia arriba en el árbol DOM a los ancestros del elemento de despacho. Es importante establecer esta marca si desea que el evento pueda participar en la delegación de eventos.

Es útil configurar la opción `composed` para permitir que el evento se envíe por encima del árbol DOM oculto en el que existe el elemento.

## When to dispatch an event

Los eventos deben enviarse en respuesta a la interacción del usuario o cambios asincrónicos en el estado del componente. Por lo general, no deben enviarse en respuesta a cambios de estado realizados por el propietario del componente a través de sus API de propiedades o atributos. Por lo general, así es como funcionan los elementos de la plataforma web nativa.

Por ejemplo, cuando un usuario escribe un `value` en un elemento de `input`, se envía un evento de cambio, pero si el código establece la propiedad de `value` de la `input`, no se envía un evento de cambio.

De manera similar, un componente de menú debe enviar un evento cuando el usuario selecciona un elemento de menú, pero no debe enviar un evento si, por ejemplo, se establece la propiedad `selectedItem` del menú.

Esto generalmente significa que un componente debe enviar un evento en respuesta a otro evento que está escuchando.

*my-dispatcher.js*

```jsx
import {LitElement, html} from 'lit';

class MyDispatcher extends LitElement {
  get _input() {
    return (this.___input ??= this.renderRoot?.querySelector('input') ?? null);
  }
  render() {
    return html`
      <p>Name: <input></p>
      <p><button @click=${this._dispatchLogin}>Login</button></p>
    `;
  }
  _dispatchLogin() {
    const name = this._input.value.trim();
    if (name) {
      const options = {
        detail: {name},
        bubbles: true,
        composed: true,
      };
      this.dispatchEvent(new CustomEvent('mylogin', options));
    }
  }
}
customElements.define('my-dispatcher', MyDispatcher);
```

*my-listener.js*

```jsx
import {LitElement, html} from 'lit';
class MyListener extends LitElement {
  static properties = {
    name: {},
  };

  constructor() {
    super();
    this.name = '';
  }
  render() {
    return html`
      <p @mylogin=${this._loginListener}><slot></slot></p>
      <p>Login: ${this.name}</p>`;
  }
  _loginListener(e) {
    this.name = e.detail.name;
  }
}
customElements.define('my-listener', MyListener);
```

*index.html*

```jsx
<script type="module" src="./my-listener.js"></script>
<script type="module" src="./my-dispatcher.js"></script>

<my-listener>
  <my-dispatcher></my-dispatcher>
</my-listener>
```

## Dispatching events after an element updates

A menudo, un evento debe activarse solo después de que un elemento se actualice y se represente. Esto podría ser necesario si se pretende que un evento comunique un cambio en el estado representado en función de la interacción del usuario. En este caso, se puede esperar la promesa de `updateComplete` del componente después de cambiar el estado, pero antes de enviar el evento.

*my-dispatcher.js*

```jsx
import {LitElement, html} from 'lit';

class MyDispatcher extends LitElement {
  static properties = {
    open: {type: Boolean},
  };

  constructor() {
    super();
    this.open = true;
  }
  render() {
    return html`
      <p><button @click=${this._notify}>${
      this.open ? 'Close' : 'Open'
    }</button></p>
      <p ?hidden=${!this.open}>Content!</p>
    `;
  }
  async _notify() {
    this.open = !this.open;
    await this.updateComplete;
    const name = this.open ? 'opened' : 'closed';
    this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true}));
  }
}
customElements.define('my-dispatcher', MyDispatcher);
```

*my-listener.js*

```jsx
import {LitElement, html} from 'lit';

class MyListener extends LitElement {
  static properties = {
    height: {type: Number},
  };

  constructor() {
    super();
    this.height = null;
  }
  render() {
    return html`
      <p @opened=${this._listener} @closed=${this._listener}><slot></slot></p>
      <p>Height: ${this.height}px</p>`;
  }
  _listener() {
    this.height = null;
  }
  updated() {
    if (this.height === null) {
      requestAnimationFrame(
        () => (this.height = this.getBoundingClientRect().height)
      );
    }
  }
}
customElements.define('my-listener', MyListener);
```

*index.html*

```jsx
<script type="module" src="./my-listener.js"></script>
<script type="module" src="./my-dispatcher.js"></script>

<my-listener>
  <my-dispatcher></my-dispatcher>
</my-listener>
```

## Using standard or custom events

Los eventos se pueden enviar mediante la construcción de un `Event` o un `CustomEvent`. Cualquiera de los dos es un enfoque razonable. Cuando se usa un `CustomEvent`, cualquier dato de evento se pasa en la propiedad de detalle del evento. Al usar un `event`, se puede crear una subclase de evento y adjuntarle una API personalizada.

### Firing a custom event:

```jsx
const event = new CustomEvent('my-event', {
  detail: {
    message: 'Something important happened'
  }
});
this.dispatchEvent(event);
```

### Firing a standard event:

```jsx
class MyEvent extends Event {
  constructor(message) {
    super();
    this.type = 'my-event';
    this.message = message;
  }
}

const event = new MyEvent('Something important happened');
this.dispatchEvent(event);
```

# Working with events in shadow DOM

Cuando se usa shadow DOM, hay algunas modificaciones al sistema de eventos estándar que es importante comprender. Shadow DOM existe principalmente para proporcionar un mecanismo de alcance en el DOM que encapsula detalles sobre estos elementos "sombra". Como tal, los eventos en shadow DOM encapsulan ciertos detalles de elementos DOM externos.

## Understanding composed event dispatching

De forma predeterminada, un evento enviado dentro de un shadow root no será visible fuera de ese shadow root. Para hacer que un evento pase a través de los límites del DOM oculto, debe establecer la propiedad compuesta en `true`. Es común emparejar `composed` con `bubbles` para que todos los nodos en el árbol DOM puedan ver el evento:

```jsx
_dispatchMyEvent() {
  let myEvent = new CustomEvent('my-event', {
    detail: { message: 'my-event happened.' },
    bubbles: true,
    composed: true });
  this.dispatchEvent(myEvent);
}
```

Si un evento está `composed` y `bubbles`, puede ser recibido por todos los ancestros del elemento que envía el evento, incluidos los ancestros en los shadown root externos. Si un evento está `composed` pero no `bubbles`, solo se puede recibir en el elemento que envía el evento y en el elemento host que contiene la shadown root.

Tenga en cuenta que la mayoría de los eventos estándar de la interfaz de usuario, incluidos todos los eventos del mouse, táctiles y del teclado, son `bubbles` y `composed`.

## Understanding event retargeting

Los eventos **compuestos** enviados desde dentro de una shadown root se reorientan, lo que significa que para cualquier oyente en un elemento que aloja una raíz oculta o cualquiera de sus ancestros, parecen provenir del elemento alojador. Dado que los componentes de Lit se convierten en raíces ocultas, todos los eventos compuestos que se envían desde el interior de un componente de Lit parecen ser enviados por el propio componente de Lit. La propiedad de destino del evento es el componente Lit.

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

En casos avanzados donde se requiere determinar el origen de un evento, use la API `event.composedPath()`. Este método devuelve una matriz de todos los nodos atravesados por el envío del evento, incluidos aquellos dentro de las raíces ocultas. Debido a que esto rompe la encapsulación, se debe tener cuidado para evitar confiar en los detalles de implementación que pueden estar expuestos. Los casos de uso comunes incluyen determinar si el elemento en el que se hizo clic era una etiqueta de anclaje, para fines de enrutamiento del lado del cliente.

```jsx
handleMyEvent(event) {
  console.log('Origin: ', event.composedPath()[0]);
}
```

# Communicating between the event dispatcher and listener

Los eventos existen principalmente para comunicar cambios del dispatcher de eventos al event listener, pero los eventos también se pueden usar para comunicar información del listener back al dispatcher.

Una forma de hacerlo es exponer la API en eventos que los oyentes pueden usar para personalizar el comportamiento de los componentes. Por ejemplo, un oyente puede establecer una propiedad en la propiedad de detalle de un evento personalizado que el componente de dispatcher luego usa para personalizar el comportamiento.

Otra forma de comunicarse entre el dispatcher y el listener es a través del método `preventDefault()`. Se puede llamar para indicar que la acción estándar del evento no debe ocurrir. Cuando el oyente llama a `preventDefault()`, la propiedad `defaultPrevented` del evento se vuelve `true`. El listener puede usar esta bandera para personalizar el comportamiento.

Ambas técnicas se utilizan en el siguiente ejemplo:

*my-dispatcher.js*

```jsx
import {LitElement, html} from 'lit';

class MyDispatcher extends LitElement {
  static properties = {
    label: {},
    message: {},
  };

  constructor() {
    super();
    this.label = 'Check me!';
    this.message = this.defaultMessage;
  }
  defaultMessage = '🙂';
  _resetMessage;
  render() {
    return html`
      <label><input type="checkbox" @click=${this._tryChange}>${this.label}</label>
      <div>${this.message}</div>
    `;
  }
  _tryChange(e) {
    const detail = {message: this.message};
    const event = new CustomEvent('checked', {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      e.preventDefault();
    }
    this.message = detail.message;
  }
  updated() {
    clearTimeout(this._resetMessage);
    this._resetMessage = setTimeout(
      () => (this.message = this.defaultMessage),
      1000
    );
  }
}
customElements.define('my-dispatcher', MyDispatcher);
```

*my-listener.js*

```jsx
import {LitElement, html} from 'lit';

class MyListener extends LitElement {
  static properties = {
    canCheck: {},
  };

  constructor() {
    super();
    this.canCheck = false;
  }
  render() {
    return html`
      <p @checked=${this._checkedHandler}><slot></slot></p>
      <hr>
      <p>${this.canCheck ? 'Allowing' : 'Preventing'} check</p>
      <p><button @click=${this._clickHandler}>Toggle</button></p>`;
  }
  _checkedHandler(e) {
    if (!this.canCheck) {
      e.preventDefault();
      e.detail.message = '✅ Prevented!!';
    }
  }
  _clickHandler() {
    this.canCheck = !this.canCheck;
  }
}
customElements.define('my-listener', MyListener);
```

*index.html*

```jsx
<script type="module" src="./my-listener.js"></script>
<script type="module" src="./my-dispatcher.js"></script>

<my-listener>
  <my-dispatcher></my-dispatcher>
</my-listener>
```


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
