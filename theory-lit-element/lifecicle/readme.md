# Lifecycle

Los componentes basados en LitElement se actualizan de forma asincrónica en respuesta a los cambios de propiedad observados. Los cambios de propiedad se procesan por lotes: si cambian más propiedades después de solicitar una actualización, pero antes de que comience la actualización, todos los cambios se capturan en la misma actualización.

En un nivel alto, el ciclo de vida de la actualización es:

1. Se establece una propiedad.
2. Compruebe si se necesita una actualización. Si se necesita una actualización, solicítela.
3. Realice la actualización:
    - Propiedades y atributos del proceso.
    - Renderiza el elemento.
4. Resolver una Promesa, indicando que la actualización está completa.

## LitElement y el bucle de eventos del navegador

El navegador ejecuta código JavaScript procesando una cola de tareas en el bucle de eventos. En cada iteración del bucle de eventos, el navegador toma una tarea de la cola y la ejecuta hasta su finalización.

Cuando se completa la tarea, antes de tomar la siguiente tarea de la cola, el navegador asigna tiempo para realizar el trabajo de otras fuentes, incluidas las actualizaciones de DOM, las interacciones del usuario y la cola de microtareas.

De forma predeterminada, las actualizaciones de LitElement se solicitan de forma asíncrona y se ponen en cola como microtareas. Esto significa que el Paso 3 anterior (Realizar la actualización) se ejecuta al final de la siguiente iteración del bucle de eventos.

Puede cambiar este comportamiento para que el Paso 3 espere una Promesa antes de realizar la actualización. Consulte `performUpdate` para obtener más información.

## Ciclo de vida callbacks

LitElement también hereda las devoluciones de llamada del ciclo de vida predeterminado del estándar de componentes web:

- `connectedCallback`: se invoca cuando se agrega un componente al DOM del documento.
- `disconnectCallback`: se invoca cuando se elimina un componente del DOM del documento.
- `adoptCallback`: se invoca cuando un componente se mueve a un nuevo documento.
- `atributeChangedCallback`: se invoca cuando cambia el atributo del componente.

> ℹ️ Tenga en cuenta que adoptCallback no está polillenado.
> 

## Todos los métodos de ciclo de vida deben llamar al supermétodo.

### Ejemplo

```jsx
connectedCallback() {
  super.connectedCallback()

  console.log('connected')
}
```

## Promesas y funciones asíncronas

LitElement usa objetos `Promise` para programar y responder a actualizaciones de elementos.

El uso de `async` y `await` facilita el trabajo con Promises. Por ejemplo, puede esperar la promesa de actualización completa:

```jsx
// `async` makes the function return a Promise & lets you use `await`
async myFunc(data) {
  // Set a property, triggering an update
  this.myProp = data;

  // Wait for the updateComplete promise to resolve
  await this.updateComplete;
  // ...do stuff...
  return 'done';
}
```

Debido a que las funciones `async` devuelven una Promesa, también puede esperarlas:

```jsx
let result = await myFunc('stuff');
// `result` is resolved! You can do something with it
```

## Casos de uso variados

Las razones comunes para conectarse al ciclo de vida del elemento personalizado o al ciclo de vida de actualización de LitElement son las inicializaciones, la administración de datos derivados y el manejo de eventos que se originan fuera de la plantilla de su elemento. La siguiente lista proporciona algunos casos de uso y enfoques comunes. En varios casos hay más de una forma de lograr un objetivo determinado. La lectura de esta lista junto con la referencia técnica detallada le proporcionará una imagen bastante completa y le permitirá decidir qué se adapta mejor a las necesidades de su componente.

- Use `property.hasChanged` para **verificar** "¿Es esto un cambio? ¿Quiero ejecutar el ciclo de vida de actualización?".
- Utilice el `constructor` de elementos para **inicializar las propiedades de LitElement** con valores predeterminados. (Los valores de atributo del DOM no están disponibles cuando se ejecuta el constructor).
- Use `firstUpdated` para **inicializar campos privados de atributos DOM** (ya que el constructor no tiene acceso a ellos). Tenga en cuenta que el procesamiento ya se ejecutó en este punto y sus cambios pueden desencadenar otro ciclo de vida de actualización. Si es imperativo que obtenga acceso a los valores de los atributos antes de que ocurra el primer procesamiento, considere usar `connectedCallback`, pero deberá hacer la lógica adicional para descubrir la "primera" actualización usted mismo, ya que se puede llamar a `connectedCallback` varias veces.
- Use `updated` para mantener actualizados los datos derivados o reaccionar a los cambios. Si encuentra que está causando re-renderizaciones, considere usar `updated` en su lugar.
- Use `getters` de propiedades JS personalizados para datos derivados que son "baratos" de calcular y si no es probable que cambien con frecuencia y su elemento no se vuelve a re-render con frecuencia.
- Utilice `requestUpdate` para desencadenar un ciclo de vida de actualización cuando LitElement no pueda recogerlo. (Por ejemplo, si tiene una **propiedad observada** que es una matriz y agrega un elemento a esa matriz en lugar de reemplazar toda la matriz, LitElement no "verá" este cambio, porque la referencia a la matriz no cambió).
- Use `connectedCallback` para registrar controladores de eventos fuera de la plantilla de su elemento, ¡pero no olvide eliminarlos en `disconnectedCallback`!

# Referencia de métodos y propiedades

En orden de llamada, los métodos y propiedades en el ciclo de vida de actualización son:

1. someProperty.hasChanged
2. requestUpdate
3. performUpdate
4. shouldUpdate
5. update
6. render
7. firstUpdated
8. updated
9. updateComplete

## someProperty.hasChanged

Todas las propiedades declaradas tienen una función, `hasChanged`, que se llama cada vez que se establece la propiedad; si `hasChanged` devuelve verdadero, se programa una actualización.

## requestUpdate

```jsx
// Manually start an update
this.requestUpdate();

// Call from within a custom property setter
this.requestUpdate(propertyName, oldValue);
```

| Params | propertyNameoldValue | Nombre de la propiedad a actualizar. Valor de la propiedad anterior. |
| --- | --- | --- |
| Returns | Promise | Devuelve updateComplete Promise, que se resuelve al finalizar la actualización. |
| Updates? | No | Los cambios de propiedad dentro de este método no activarán una actualización del elemento. |

Si `hasChanged` devolvió verdadero, se activa `requestUpdate` y continúa la actualización.

Para iniciar manualmente la actualización de un elemento, llame a `requestUpdate` sin parámetros.

Para implementar un establecedor de propiedades personalizadas que admita opciones de propiedad, pase el nombre de la propiedad y su valor anterior como parámetros.

### **Example: Manually start an element update**

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  constructor() {
    super();

    // Request an update in response to an event
    this.addEventListener('load-complete', async (e) => {
      console.log(e.detail.message);
      console.log(await this.requestUpdate());
    });
  }
  render() {
    return html`
      <button @click="${this.fire}">Fire a "load-complete" event</button>
    `;
  }
  fire() {
    let newMessage = new CustomEvent('load-complete', {
      detail: { message: 'hello. a load-complete happened.' }
    });
    this.dispatchEvent(newMessage);
  }
}
customElements.define('my-element', MyElement);
```

### **Example: Call `requestUpdate` from a custom property setter**

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return { prop: { type: Number } };
  }

  set prop(val) {
    let oldVal = this._prop;
    this._prop = Math.floor(val);
    this.requestUpdate('prop', oldVal);
  }

  get prop() { return this._prop; }

  constructor() {
    super();
    this._prop = 0;
  }

  render() {
    return html`
      <p>prop: ${this.prop}</p>
      <button @click="${() =>  { this.prop = Math.random()*10; }}">
        change prop
      </button>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## performUpdate

```jsx
/**
 * Implement to override default behavior.
 */
performUpdate() { ... }
```

| Returns | void or Promise | Realiza una actualización. |
| --- | --- | --- |
| Updates? | No | Los cambios de propiedad dentro de este método no activarán una actualización del elemento. |

Cuando se realiza una actualización, se llama al método `performUpdate()`. Este método llama a una serie de otros métodos de ciclo de vida.

Cualquier cambio que normalmente desencadenaría una actualización que ocurre mientras se actualiza un componente no programa una nueva actualización. Esto se hace para que los valores de propiedad se puedan calcular durante el proceso de actualización. Las propiedades modificadas durante la actualización se reflejan en el mapa de `changedProperties`, por lo que los métodos de ciclo de vida posteriores pueden actuar sobre los cambios.

De forma predeterminada, `performUpdate` se programa como una microtarea después del final de la siguiente ejecución del bucle de eventos del navegador. Para programar `performUpdate`, impleméntelo como un método asíncrono que espera algún estado antes de llamar a `super.performUpdate()`. Por ejemplo:

```jsx
async performUpdate() {
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  super.performUpdate();
}
```

## shouldUpdate

```jsx
/**
 * Implement to override default behavior.
 */
shouldUpdate(changedProperties) { ... }
```

| Params | changedProperties | Map. Las claves son los nombres de las propiedades modificadas; Los valores son los valores anteriores correspondientes. |
| --- | --- | --- |
| Returns | Boolean | If true, update proceeds. Default return value is true. |
| Updates? | No | Los cambios de propiedad dentro de este método no activarán una actualización de elemento. |

Controla si una actualización debe continuar. Implemente `shouldUpdate` para especificar qué cambios de propiedad deben generar actualizaciones. De forma predeterminada, este método siempre devuelve `true`.

### **Example: Customize which property changes should cause updates**

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: { type: Number },
      prop2: { type: Number }
    };
  }
  constructor() {
    super();
    this.prop1 = 0;
    this.prop2 = 0;
  }

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>
      <button @click="${() => this.prop1=this.change()}">Change prop1</button>
      <button @click="${() => this.prop2=this.change()}">Change prop2</button>
    `;
  }

  /**
   * Only update element if prop1 changed.
   */
  shouldUpdate(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    return changedProperties.has('prop1');
  }

  change() {
    return Math.floor(Math.random()*10);
  }
}
customElements.define('my-element', MyElement);
```

## update

| Params | changedProperties | Map. Las claves son los nombres de las propiedades modificadas; Los valores son los valores anteriores correspondientes. |
| --- | --- | --- |
| Updates? | No | Los cambios de propiedad dentro de este método no desencadenan una actualización de elementos. |

Refleja los valores de propiedad de los atributos y llama a `render` para renderizar DOM a través de lit-html. Proporcionado aquí como referencia. No es necesario anular o llamar a este método. Pero si lo anula, asegúrese de llamar a `super.update(changedProperties)` o nunca se llamará a render.

## render

```jsx
/**
 * Implement to override default behavior.
 */
render() { ... }
```

| Returns | TemplateResult | Debe devolver un lit-html TemplateResult. |
| --- | --- | --- |
| Updates? | No | Los cambios de propiedad dentro de este método no activarán una actualización del elemento. |

Los cambios de propiedad dentro de este método no activarán una actualización del elemento.

## firstUpdated

```jsx
/**
 * Implement to override default behavior.
 */
firstUpdated(changedProperties) { ... }
```

| Params | changedProperties | Map. Las claves son los nombres de las propiedades modificadas; Los valores son los valores anteriores correspondientes. |
| --- | --- | --- |
| Updates? | Yes | Los cambios de propiedad dentro de este método desencadenarán una actualización del elemento. |

Los cambios de propiedad dentro de este método desencadenarán una actualización del elemento.

### **Example: Focus an input element on first update**

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      textAreaId: { type: String },
      startingText: { type: String }
    };
  }
  constructor() {
    super();
    this.textAreaId = 'myText';
    this.startingText = 'Focus me on first update';
  }
  render() {
    return html`
      <textarea id="${this.textAreaId}">${this.startingText}</textarea>
    `;
  }
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    const textArea = this.shadowRoot.getElementById(this.textAreaId);
    textArea.focus();
  }
}
customElements.define('my-element', MyElement);
```

## updated

```jsx
/**
 * Implement to override default behavior.
 */
updated(changedProperties) { ... }
```

| Params | changedProperties | Map. Las claves son los nombres de las propiedades modificadas; Los valores son los valores anteriores correspondientes. |
| --- | --- | --- |
| Updates? | Yes | Los cambios de propiedad dentro de este método desencadenarán una actualización del elemento. |

Llamado cuando el DOM del elemento ha sido actualizado y renderizado. Implementar para realizar alguna tarea después de una actualización.

### **Example: Focus an element after update**

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: { type: Number },
      prop2: { type: Number }
    };
  }
  constructor() {
    super();
    this.prop1 = 0;
    this.prop2 = 0;
  }
  render() {
    return html`
      <style>button:focus { background-color: aliceblue; }</style>

      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>

      <button id="a" @click="${() => this.prop1=Math.random()}">prop1</button>
      <button id="b" @click="${() => this.prop2=Math.random()}">prop2</button>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    let b = this.shadowRoot.getElementById('b');
    b.focus();
  }
}
customElements.define('my-element', MyElement);
```

## updateComplete

```jsx
// Await Promise property.
await this.updateComplete;
```

| Type | Promise | Resuelve con un Boolean cuando el elemento se ha terminado de actualizar. |
| --- | --- | --- |
| Resolves | true si no hay mas actualizaciones pendientes.false si este ciclo de actualización desencadenó otra actualización. |  |

La promesa `updateComplete` se resuelve cuando el elemento ha terminado de actualizarse. Use `updateComplete` para esperar una actualización:

```jsx
await this.updateComplete;
// do stuff
```

```jsx
this.updateComplete.then(() => { /* do stuff */ });
```

### Ejemplo

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: { type: Number }
    };
  }

  constructor() {
    super();
    this.prop1 = 0;
  }

  render() {
    return html`
      <p>prop1: ${this.prop1}</p>
      <button @click="${this.changeProp}">prop1</button>
    `;
  }

  async getMoreState() {
    return;
  }

  async changeProp() {
    this.prop1 = Math.random();
    await Promise.all([this.updateComplete, this.getMoreState()]);
    console.log('Update complete. Other state completed.');
  }
}

customElements.define('my-element', MyElement);
```

## Anulando updateComplete

Para esperar un estado adicional antes de cumplir la promesa updateComplete, invalide el método _getUpdateComplete. Por ejemplo, puede ser útil esperar aquí la actualización de un elemento secundario. Primero espere `super._getUpdateComplete()`, luego cualquier estado posterior.

Se recomienda anular el método `_getUpdateComplete` en lugar del captador updateComplete para garantizar la compatibilidad con los usuarios que utilizan la salida ES5 de TypeScript (consulte TypeScript n.º 338).

```jsx
class MyElement extends LitElement {
  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await this._myChild.updateComplete;
  }
}
```

# Ejemplos:

## Controle cuándo se procesan las actualizaciones

Implementar `performUpdate`:

```jsx
async performUpdate() {
  await new Promise((resolve) => requestAnimationFrame(() => resolve());
  super.performUpdate();
}
```

## Personalice qué cambios de propiedad deberían causar una actualización

Implementar shouldUpdate:

```jsx
shouldUpdate(changedProps) {
  return changedProps.has('prop1');
}
```

## Personalizar lo que constituye un cambio de propiedad

Especifique hasChanged para la propiedad. Consulte la documentación de Propiedades.

## Administrar cambios de propiedad y actualizaciones para subpropiedades de objetos

Las mutaciones (cambios en las subpropiedades de los objetos y los elementos de la matriz) no son observables. En su lugar, reescriba todo el objeto o llame a requestUpdate después de una mutación.

```jsx
// Option 1: Rewrite whole object, triggering an update
this.prop1 = Object.assign({}, this.prop1, { subProp: 'data' });

// Option 2: Mutate a subproperty, then call requestUpdate
this.prop1.subProp = 'data';
this.requestUpdate();
```

## Actualizar en respuesta a algo que no es un cambio de propiedad

Llamar `requestUpdate`

```jsx
// Request an update in response to an event
this.addEventListener('load-complete', async (e) => {
  console.log(e.detail.message);
  console.log(await this.requestUpdate());
})
```

## Solicite una actualización independientemente de los cambios de propiedad

Llamar a `requestUpdated()`

```jsx
this.requestUpdate();
```

## Solicitar una actualización para una propiedad específica

Llamar `requestUpdate(propName, oldValue)`:

```jsx
let oldValue = this.prop1;
this.prop1 = 'new value';
this.requestUpdate('prop1', oldValue);
```

## Hacer algo después de la primera actualización

Implement `firstUpdated`:

```jsx
firstUpdated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

## Haz algo después de cada actualización

Implement `updated`:

```jsx
updated(changedProps) {
  console.log(changedProps.get('prop1'));
}
```

## Hacer algo la próxima vez que se actualice el elemento

Await the `updateComplete` promise:

```jsx
await this.updateComplete;
// do stuff
```

```jsx
this.updateComplete.then(() => {
  // do stuff
});
```

## Esperar a que un elemento termine de actualizarse

Await the `updateComplete` promise:

```jsx
let done = await updateComplete;
```

```jsx
updateComplete.then(() => {
  // finished updating
});
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
