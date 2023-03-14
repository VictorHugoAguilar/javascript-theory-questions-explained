# Controllers

# Introducción

Lit 2 introduce un nuevo concepto para la reutilización y composición de código llamados controladores reactivos.

Un controlador reactivo es un objeto que puede conectarse al ciclo de actualización reactiva de un componente. Los controladores pueden agrupar el estado y el comportamiento relacionados con una función, lo que la hace reutilizable en múltiples definiciones de componentes.

Puede usar controladores para implementar características que requieren su propio estado y acceso al ciclo de vida del componente, como:

- Manejo de eventos globales como eventos de mouse
- Administrar tareas asincrónicas como obtener datos a través de la red
- Ejecución de animaciones

Los **controladores reactivos** le permiten construir componentes al componer piezas más pequeñas que no son componentes en sí mismas. Se pueden considerar como definiciones de componentes parciales reutilizables, con su propia identidad y estado.

*clock-controller.js*

```jsx
export class ClockController {
  host;

  value = new Date();
  timeout;
  _timerID;

  constructor(host, timeout = 1000) {
    (this.host = host).addController(this);
    this.timeout = timeout;
  }
  hostConnected() {
    // Start a timer when the host is connected
    this._timerID = setInterval(() => {
      this.value = new Date();
      // Update the host with new value
      this.host.requestUpdate();
    }, this.timeout);
  }
  hostDisconnected() {
    // Clear the timer when the host is disconnected
    clearInterval(this._timerID);
    this._timerID = undefined;
  }
}
```

*my-element.js*

```jsx
import {LitElement, html} from 'lit';
import {ClockController} from './clock-controller.js';

class MyElement extends LitElement {
  // Create the controller and store it
  clock = new ClockController(this, 100);

  // Use the controller in render()
  render() {
    const formattedTime = timeFormat.format(this.clock.value);
    return html`Current time: ${formattedTime}`;
  }
}
customElements.define('my-element', MyElement);

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});
```

*index.html*

```jsx
<!doctype html>
<html>
  <head>
    <script type="module" src="./my-element.js"></script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```

Los controladores reactivos son similares en muchos aspectos a los mixins de clase. La principal diferencia es que tienen su propia identidad y no se agregan al prototipo del componente, lo que ayuda a contener sus API y le permite usar varias instancias de controlador por componente de host. Consulte Controladores y mixins para obtener más detalles.

# Using a controller

Cada controlador tiene su propia API de creación, pero normalmente creará una instancia y la almacenará con el componente:

```jsx
class MyElement extends LitElement {
  private clock = new ClockController(this, 1000);
}
```

El componente asociado con una instancia de controlador se denomina componente de host.

La instancia del controlador se registra para recibir devoluciones de llamada del ciclo de vida del componente del host y activa una actualización del host cuando el controlador tiene nuevos datos para procesar. Así es como el ejemplo de `ClockController` representa periódicamente la hora actual.

Un controlador normalmente expondrá alguna funcionalidad para ser utilizada en el método `render()` del host. Por ejemplo, muchos controladores tendrán algún estado, como un valor actual:

```jsx
render() {
    return html`
      <div>Current time: ${this.clock.value}</div>
    `;
  }
```

Dado que cada controlador tiene su propia API, consulte la documentación específica del controlador sobre cómo usarlos.

# Writing a controller

Un controlador reactivo es un objeto asociado con un componente de host, que implementa una o más devoluciones de llamada del ciclo de vida del host o interactúa con su host. Se puede implementar de varias formas, pero nos centraremos en el uso de clases de JavaScript, con constructores para inicialización y métodos para ciclos de vida.

## Controller initialization

Un controlador se registra con su componente host llamando a `host.addController(this)`. Por lo general, un controlador almacena una referencia a su componente host para que pueda interactuar con él más tarde.

```jsx
class ClockController {
  constructor(host) {
    // Store a reference to the host
    this.host = host;
    // Register for lifecycle updates
    host.addController(this);
  }
}
```

Puede agregar otros parámetros de constructor para una configuración única.

```jsx
class ClockController {
  constructor(host, timeout) {
    this.host = host;
    this.timeout = timeout;
    host.addController(this);
  }
```

Una vez que su controlador esté registrado con el componente de host, puede agregar devoluciones de llamada de ciclo de vida y otros campos y métodos de clase al controlador para implementar el estado y el comportamiento deseados.

## Lifecycle

El ciclo de vida del controlador reactivo, definido en la interfaz `ReactiveController`, es un subconjunto del ciclo de actualización reactivo. LitElement llama a cualquier controlador instalado durante las devoluciones de llamada de su ciclo de vida. Estas devoluciones de llamada son opcionales.

- `hostConectado()`:
    - Se llama cuando el host está conectado.
    - Llamado después de crear renderRoot, por lo que existirá una raíz oculta en este punto.
    - Útil para configurar detectores de eventos, observadores, etc.
- `hostUpdate()`:
    - Llamado antes de los métodos update() y render() del host.
    - Útil para leer DOM antes de que se actualice (por ejemplo, para animaciones).
- `hostUpdated()`:
    - Llamado después de las actualizaciones, antes del método updated() del host.
    - Útil para leer DOM después de modificarlo (por ejemplo, para animaciones).
- `hostDesconectado()`:
    - Se llama cuando el host está desconectado.
    - Útil para limpiar elementos agregados en hostConnected(), como detectores de eventos y observadores.

## API de host del controlador

Un host de controlador reactivo implementa una pequeña API para agregar controladores y solicitar actualizaciones, y es responsable de llamar a los métodos de ciclo de vida de su controlador.

Esta es la API mínima expuesta en un host de controlador:

- `addController(controller: ReactiveController)`
- `removeController(controller: ReactiveController)`
- `requestUpdate()`
- `updateComplete: Promise<boolean>`

También puede crear controladores que sean específicos para `HTMLElement`, `ReactiveElement`, `LitElement` y requieran más de esas API; o incluso controladores que están vinculados a una clase de elemento específica u otra interfaz.

`LitElement` y `ReactiveElement` son hosts de controlador, pero los hosts también pueden ser otros objetos, como clases base de otras bibliotecas de componentes web, componentes de marcos u otros controladores.

## Construyendo controladores a partir de otros controladores

Los controladores también pueden estar compuestos por otros controladores. Para hacer esto, cree un controlador secundario y envíele el host.

```jsx
class DualClockController {
  constructor(host, delay1, delay2) {
    this.clock1 = new ClockController(host, delay1);
    this.clock2 = new ClockController(host, delay2);
  }

  get time1() { return this.clock1.value; }
  get time2() { return this.clock2.value; }
}
```

## Controllers and directives

La combinación de controladores con directivas puede ser una técnica muy poderosa, especialmente para las directivas que deben funcionar antes o después de la representación, como las directivas de animación; o controladores que necesitan referencias a elementos específicos en una plantilla.

Hay dos patrones principales de uso de controladores con directivas:

- Directivas del controlador. Estas son directivas que en sí mismas son controladores para conectarse al ciclo de vida del host.
- Controladores que poseen directivas. Estos son controladores que crean una o más directivas para usar en la plantilla del host.
Para obtener más información sobre cómo escribir directivas, consulte Directivas personalizadas.

### Directivas del controlador

Los controladores reactivos no necesitan almacenarse como campos de instancia en el host. Todo lo que se agrega a un host mediante `addController()` es un controlador. En particular, una directiva también puede ser un controlador. Esto permite que una directiva se conecte al ciclo de vida del host.

### Controladores que poseen directivas

Las directivas no necesitan ser funciones independientes, también pueden ser métodos en otros objetos, como controladores. Esto puede ser útil en los casos en que un controlador necesita una referencia específica a un elemento en una plantilla.

Por ejemplo, imagine un ResizeController que le permita observar el tamaño de un elemento con un ResizeObserver. Para trabajar necesitamos una instancia de ResizeController y una directiva que se coloca en el elemento que queremos observar:

```jsx
class MyElement extends LitElement {
  _textSize = new ResizeController(this);

  render() {
    return html`
      <textarea ${this._textSize.observe()}></textarea>
      <p>The width is ${this._textSize.contentRect?.width}</p>
    `;
  }
}
```

Para implementar esto, crea una directiva y la llama desde un método:

```jsx
class ResizeDirective {
  /* ... */
}
const resizeDirective = directive(ResizeDirective);

export class ResizeController {
  /* ... */
  observe() {
    // Pass a reference to the controller so the directive can
    // notify the controller on size changes.
    return resizeDirective(this);
  }
}
```

# Use cases

Los controladores reactivos son muy generales y tienen un conjunto muy amplio de posibles casos de uso. Son particularmente buenos para conectar un componente a un recurso externo, como la entrada del usuario, la gestión del estado o las API remotas. Aquí hay algunos casos de uso comunes.

## Entradas externas

Los controladores reactivos se pueden utilizar para conectarse a entradas externas. Por ejemplo, eventos de teclado y mouse, observadores de cambio de tamaño u observadores de mutación. El controlador puede proporcionar el valor actual de la entrada para usar en la representación y solicitar una actualización del host cuando cambie el valor.

### Ejemplo: MouseMoveController

Este ejemplo muestra cómo un controlador puede realizar trabajos de configuración y limpieza cuando su host está conectado y desconectado, y solicitar una actualización cuando cambia una entrada:

*my-element.js*

```jsx
import {LitElement, html} from 'lit';
import {MouseController} from './mouse-controller.js';

class MyElement extends LitElement {
  mouse = new MouseController(this);

  render() {
    return html`
      <h3>The mouse is at:</h3>
      <pre>
        x: ${this.mouse.pos.x}
        y: ${this.mouse.pos.y}
      </pre>
    `;
  }
}
customElements.define('my-element', MyElement);
```

*mouse-controller.js*

```jsx
export class MouseController {
  host;
  pos = {x: 0, y: 0};

  _onMouseMove = ({clientX, clientY}) => {
    this.pos = {x: clientX, y: clientY};
    this.host.requestUpdate();
  };

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener('mousemove', this._onMouseMove);
  }
```

*index.html*

```jsx
<!doctype html>
<html>
  <head>
    <script type="module" src="./my-element.js"></script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```

## Tareas asíncronas

Las tareas asincrónicas, como los cálculos de ejecución prolongada o la E/S de la red, normalmente tienen un estado que cambia con el tiempo y deberán notificar al host cuando cambie el estado de la tarea (finalización, errores, etc.).

Los controladores son una excelente manera de agrupar la ejecución y el estado de las tareas para facilitar su uso dentro de un componente. Una tarea escrita como controlador generalmente tiene entradas que un host puede configurar y salidas que un host puede representar.

`@lit-labs/task` contiene un controlador de tareas genérico que puede extraer entradas del host, ejecutar una función de tarea y representar diferentes plantillas según el estado de la tarea.

Puede usar Task para crear un controlador personalizado con una API adaptada a su tarea específica. Aquí envolvemos Task en un `NamesController` que puede obtener uno de una lista específica de nombres de una API REST de demostración. `NameController` expone una propiedad kind como entrada y un método `render()` que puede representar una de las cuatro plantillas según el estado de la tarea. La lógica de la tarea y cómo actualiza el host se extraen del componente del host.

*names-controller.js*

```jsx
import {initialState, Task} from '@lit-labs/task';
import * as Names from './names-api.js';

export class NamesController {
  host;
  value;
  kinds = Names.kinds;
  task;
  _kind = '';

  constructor(host) {
    this.host = host;
    this.task = new Task(
      host,
      async ([kind]) => {
        if (!kind?.trim()) {
          return initialState;
        }
        try {
          const response = await fetch(`${Names.baseUrl}${kind}`);
          const data = await response.json();
          return data.results;
        } catch {
          throw new Error(`Failed to fetch "${kind}"`);
        }
      },
      () => [this.kind]
    );
  }

  set kind(value) {
    this._kind = value;
    this.host.requestUpdate();
  }
  get kind() {
    return this._kind;
  }

  render(renderFunctions) {
    return this.task.render(renderFunctions);
  }
}
```

*my-element.js*

```jsx
import {LitElement, html} from 'lit';
import {NamesController} from './names-controller.js';

export class MyElement extends LitElement {
  names = new NamesController(this);

  render() {
    return html`
      <h3>Names List</h3>
      Kind: <select @change=${this._kindChange}>
      ${this.names.kinds.map((k) => html`<option value=${k}>${k}</option>`)}
    </select>
    ${this.names.render({
      complete: (result) => html`
        <p>List of ${this.names.kind}</p>
        <ul>${result.map((i) => html`<li>${i.name}</li>`)}
        </ul>
      `,
      initial: () => html`<p>Select a kind...</p>`,
      pending: () => html`<p>Loading ${this.names.kind}...</p>`,
      error: (e) => html`<p>${e}</p>`,
    })}`;
  }

  _kindChange(e) {
    this.names.kind = e.target.value;
  }
}
customElements.define('my-element', MyElement);
```

*name-api.js*

```jsx
export const baseUrl = 'https://swapi.dev/api/';

export const kinds = [
  '',
  'people',
  'starships',
  'species',
  'planets',
  // Inserted to demo an error state.
  'error',
];
```

*index.html*

```jsx
<!doctype html>
<html>
  <head>
    <script type="module" src="./my-element.js"></script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
