# Lifecycle

# Introducción

Los componentes iluminados utilizan los métodos de ciclo de vida de elementos personalizados estándar. Además, Lit presenta un ciclo de actualización reactiva que genera cambios en DOM cuando cambian las propiedades reactivas.

## Ciclo de vida del elemento personalizado estándar

Los componentes iluminados son elementos personalizados estándar y heredan los métodos del ciclo de vida de los elementos personalizados.

> ℹ️ Si necesita personalizar cualquiera de los métodos de ciclo de vida de elementos personalizados estándar, asegúrese de llamar a la súper implementación (como `super.connectedCallback()`) para que se mantenga la funcionalidad Lit estándar.
> 

## Constructor()

Se llama cuando se crea un elemento. Además, se invoca cuando se actualiza un elemento existente, lo que sucede cuando se carga la definición de un elemento personalizado después de que el elemento ya está en el DOM.

### Lit behavior

Solicita una actualización asincrónica mediante el método `requestUpdate()`, de modo que cuando se actualiza un componente de Lit, realiza una actualización de inmediato.

Guarda las propiedades ya establecidas en el elemento. Esto garantiza que los valores establecidos antes de la actualización se mantengan y anulen correctamente los valores predeterminados establecidos por el componente.

### Use cases

Realice tareas de inicialización únicas que deben realizarse antes de la primera actualización. Por ejemplo, cuando no se usan decoradores, los valores predeterminados para las propiedades se pueden establecer en el constructor, como se muestra en Declaración de propiedades en un campo de propiedades estáticas.

```jsx
constructor() {
  super();
  this.foo = 'foo';
  this.bar = 'bar';
}
```

## connectedCallback()

Se invoca cuando se agrega un componente al DOM del documento.

### Lit behavior

Lit inicia el primer ciclo de actualización del elemento después de conectar el elemento. En preparación para el renderizado, Lit también se asegura de que se cree `renderRoot` (normalmente, su `shadowRoot`).

Una vez que un elemento se ha conectado al documento al menos una vez, las actualizaciones del componente continuarán independientemente del estado de conexión del elemento.

### Use cases

En `connectedCallback(),` debe configurar tareas que solo deben ocurrir cuando el elemento está conectado al documento. El más común de estos es agregar detectores de eventos a nodos externos al elemento, como un controlador de eventos keydown agregado a la ventana. Por lo general, cualquier cosa que se haga en `connectedCallback()` se debe deshacer cuando el elemento se desconecta, por ejemplo, eliminar los detectores de eventos en la ventana para evitar pérdidas de memoria.

```jsx
connectedCallback() {
  super.connectedCallback()
  addEventListener('keydown', this._handleKeydown);
}
```

## disconnectedCallback()

Se invoca cuando se elimina un componente del DOM del documento.

### Lit behavior

Pausa el ciclo de actualización reactiva. Se reanuda cuando el elemento está conectado.

### Use cases

Esta devolución de llamada es la señal principal para el elemento de que ya no se puede usar; como tal, `disconnectedCallback()` debe garantizar que nada contenga una referencia al elemento (como detectores de eventos agregados a nodos externos al elemento), de modo que sea libre de recolectar basura. Debido a que los elementos pueden volver a conectarse después de desconectarse, como en el caso de un elemento que se mueve en el DOM o se almacena en caché, es posible que sea necesario restablecer dichas referencias o escuchas a través de `disconnectedCallback()` para que el elemento continúe funcionando como se esperaba en estos escenarios. Por ejemplo, elimine los detectores de eventos de los nodos externos al elemento, como un controlador de eventos keydown agregado a la ventana.

```jsx
disconnectedCallback() {
  super.disconnectedCallback()
  window.removeEventListener('keydown', this._handleKeydown);
}
```

> ℹ️ **No es necesario eliminar los detectores de eventos internos**. No es necesario que elimine los detectores de eventos agregados en el propio DOM del componente, incluidos los agregados declarativamente en su plantilla. A diferencia de los detectores de eventos externos, estos no evitarán que el componente se recopile como basura.
> 

## attributeChangedCallback()

Se invoca cuando cambia uno de los `observedAttributes` del elemento.

### Lit behavior

Lit usa esta devolución de llamada para sincronizar los cambios en los atributos con las propiedades reactivas. Específicamente, cuando se establece un atributo, se establece la propiedad correspondiente. Lit también configura automáticamente la matriz de `observedAttributes` del elemento para que coincida con la lista de propiedades reactivas del componente.

### Use cases

Rara vez necesita implementar esta devolución de llamada.

## adoptedCallback()

Se invoca cuando un componente se mueve a un nuevo documento.

> ℹ️ Tenga en cuenta que `adoptCallback` no está polillenado.
> 

### Lit behavior

Lit no tiene un comportamiento predeterminado para esta devolución de llamada.

### Use cases

Esta devolución de llamada solo debe usarse para casos de uso avanzado cuando el comportamiento del elemento debe cambiar cuando cambia los documentos.

# Reactive update cycle

Además del ciclo de vida estándar de los elementos personalizados, los componentes de Lit también implementan un ciclo de actualización reactivo.

El ciclo de actualización reactiva se activa cuando cambia una propiedad reactiva o cuando se llama explícitamente al método `requestUpdate()`. Lit realiza actualizaciones de forma asincrónica, por lo que los cambios de propiedad se procesan por lotes: si cambian más propiedades después de que se solicita una actualización, pero antes de que comience, todos los cambios se capturan en la misma actualización.

Las actualizaciones ocurren en el momento de la microtarea, lo que significa que ocurren antes de que el navegador dibuje el siguiente cuadro en la pantalla. Consulte el artículo de Jake Archibald sobre microtareas para obtener más información sobre el tiempo del navegador.

En un nivel alto, el ciclo de actualización reactiva es:

1. Se programa una actualización cuando una o más propiedades cambian o cuando se llama a `requestUpdate().`
2. La actualización se realiza antes de que se pinte el siguiente cuadro.
    1. Se establecen los atributos reflectantes.
    2. Se llama al método de renderizado del componente para actualizar su DOM interno.
3. La actualización se completa y la promesa `updateComplete` se resuelve.

Con más detalle, se ve así:

### Pre-Update

![Untitled](Lifecycle%208e08b4f08c754cff84bf0ec04df687a3/Untitled.png)

![Untitled](Lifecycle%208e08b4f08c754cff84bf0ec04df687a3/Untitled%201.png)

### **Update**

![Untitled](Lifecycle%208e08b4f08c754cff84bf0ec04df687a3/Untitled%202.png)

### Post-Update

![Untitled](Lifecycle%208e08b4f08c754cff84bf0ec04df687a3/Untitled%203.png)

## The changedProperties map

Muchos métodos de actualización reactiva reciben un `Map` de propiedades modificadas. Las claves del `Map` son los nombres de propiedad y sus valores son los valores de propiedad anteriores. Siempre puede encontrar los valores de propiedad actuales usando `this.property` o `this[property]`.

**Tipos de TypeScript para propiedades modificadas**
Si está usando TypeScript y desea una verificación de tipos sólida para el `Map` de `changedProperties`, puede usar `PropertyValues<this>`, que infiere el tipo correcto para cada nombre de propiedad.

```jsx
import {LitElement, html, PropertyValues} from 'lit';
...
  shouldUpdate(changedProperties: PropertyValues<this>) {
    ...
  }
```

Si le preocupa menos la tipificación fuerte, o si solo está comprobando los nombres de las propiedades, no los valores anteriores, podría usar un tipo menos restrictivo como `Map<string, any>`.

Tenga en cuenta que `PropertyValues<this>` no reconoce propiedades privadas o protegidas. Si está comprobando propiedades protegidas o privadas, deberá utilizar un tipo menos restrictivo.

**Cambio de propiedades durante una actualización**
Cambiar una propiedad durante la actualización (hasta el método `render()` incluido) actualiza el mapa de `changedProperties`, pero no desencadena una nueva actualización. Cambiar una propiedad después de `render()` (por ejemplo, en el método `updated()`) desencadena un nuevo ciclo de actualización, y la propiedad modificada se agrega a un nuevo mapa de `changedProperties` para usarse en el próximo ciclo.

## Triggering an update

Se activa una actualización cuando cambia una propiedad reactiva o se llama al método `requestUpdate()`. Dado que las actualizaciones se realizan de forma asincrónica, todos los cambios que se produzcan antes de que se realice la actualización darán como resultado una sola actualización.

### **hasChanged()**

Se llama cuando se establece una propiedad reactiva. De forma predeterminada, `hasChanged()` realiza una verificación de igualdad estricta y, si devuelve verdadero, se programa una actualización.

### **requestUpdate()**

Llame a `requestUpdate()` para programar una actualización explícita. Esto puede ser útil si necesita que el elemento se actualice y se represente cuando cambia algo que no está relacionado con una propiedad. Por ejemplo, un componente de temporizador podría llamar a `requestUpdate()` cada segundo.

```jsx
connectedCallback() {
  super.connectedCallback();
  this._timerInterval = setInterval(() => this.requestUpdate(), 1000);
}

disconnectedCallback() {
  super.disconnectedCallback();
  clearInterval(this._timerInterval);
}
```

La lista de propiedades que han cambiado se almacena en un mapa de `changedProperties` que se pasa a los métodos de ciclo de vida posteriores. Las claves del mapa son los nombres de propiedad y sus valores son los valores de propiedad anteriores.

Opcionalmente, puede pasar un nombre de propiedad y un valor anterior al llamar a `requestUpdate()`, que se almacenará en el mapa de `changedProperties`. Esto puede ser útil si implementa un getter y setter personalizado para una propiedad. Consulte Propiedades reactivas para obtener más información sobre la implementación de captadores y definidores personalizados.

```jsx
this.requestUpdate('state', this._previousState);
```

## Realización de una actualización

Cuando se realiza una actualización, se llama al método `performUpdate()`. Este método llama a una serie de otros métodos de ciclo de vida.

Cualquier cambio que normalmente desencadenaría una actualización que ocurre mientras se actualiza un componente no programa una nueva actualización. Esto se hace para que los valores de propiedad se puedan calcular durante el proceso de actualización. Las propiedades modificadas durante la actualización **se reflejan en el mapa de `changedProperties`**, por lo que los métodos de ciclo de vida posteriores pueden actuar sobre los cambios.

### **shouldUpdate()**

Llamado para determinar si se requiere un ciclo de actualización.

| Arguments | changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values. |
| --- | --- |
| Updates | No. Property changes inside this method do not trigger an element update. |
| Call super? | Not necessary. |
| Called on server? | No. |

Si `shouldUpdate()` devuelve `true`, lo que hace de manera predeterminada, entonces la actualización continúa con normalidad. Si devuelve `false`, no se llamará al resto del ciclo de actualización, pero la promesa de `updateComplete` aún se resuelve.

Puede implementar `shouldUpdate()` para especificar qué cambios de propiedad deben generar actualizaciones. Utilice el mapa de `changedProperties` para comparar los valores actuales y anteriores.

```jsx
shouldUpdate(changedProperties) {
  // Only update element if prop1 changed.
  return changedProperties.has('prop1');
}
```

### willUpdate()

Llamado antes de `update()` para calcular los valores necesarios durante la actualización.

| Arguments | changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values. |
| --- | --- |
| Updates? | No. Property changes inside this method do not trigger an element update. |
| Call super? | Not necessary. |
| Called on server? | Yes. |

Implemente willUpdate() para calcular los valores de propiedad que dependen de otras propiedades y se usan en el resto del proceso de actualización.

```jsx
willUpdate(changedProperties) {
  // only need to check changed properties for an expensive computation.
  if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
    this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
  }
}

render() {
  return html`SHA: ${this.sha}`;
}
```

### update()

Llamado para actualizar el DOM del componente.

| Arguments | changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values. |
| --- | --- |
| Updates? | No. Property changes inside this method do not trigger an element update. |
| Call super? | Yes. Without a super call, the element’s attributes and template will not update. |
| Called on server? | No. |

Refleja los valores de propiedad de los atributos y llama a `render()` para actualizar el DOM interno del componente.

En general, no debería necesitar implementar este método.

### render()

Llamado por `update()` y debe implementarse para devolver un resultado renderizable (como un `TemplateResult`) utilizado para representar el DOM del componente.

| Arguments | None. |
| --- | --- |
| Updates? | No. Property changes inside this method do not trigger an element update. |
| Call super? | Not necessary. |
| Called on server? | Yes. |

El método `render()` no tiene argumentos, pero normalmente hace referencia a las propiedades del componente. Consulte Representación para obtener más información.

```jsx
render() {
  const header = `<header>${this.header}</header>`;
  const content = `<section>${this.content}</section>`;
  return html`${header}${content}`;
}
```

## Completing an update

Después de llamar a `update()` para generar cambios en el DOM del componente, puede realizar acciones en el DOM del componente utilizando estos métodos.

### firstUpdated()

Llamado después de que el DOM del componente se haya actualizado por primera vez, inmediatamente antes de que se llame a `updated()`.

| Arguments | changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values. |
| --- | --- |
| Updates? | Yes. Property changes inside this method schedule a new update cycle. |
| Call super? | Not necessary. |
| Called on server? | No. |

Implemente `firstUpdated()` para realizar un trabajo único después de que se haya creado el DOM del componente. Algunos ejemplos pueden incluir enfocar un elemento renderizado en particular o agregar un ResizeObserver o IntersectionObserver a un elemento.

```jsx
firstUpdated() {
  this.renderRoot.getElementById('my-text-area').focus();
}
```

### updated()

Se llama cada vez que finaliza la actualización del componente y el DOM del elemento se ha actualizado y renderizado.

| Arguments | changedProperties: Map with keys that are the names of changed properties and values that are the corresponding previous values. |
| --- | --- |
| Updates? | Yes. Property changes inside this method trigger an element update. |
| Call super? | Not necessary. |
| Called on server? | No. |

Implemente `updated()` para realizar tareas que usan el elemento DOM después de una actualización. Por ejemplo, el código que realiza una animación puede necesitar medir el elemento DOM.

```jsx
updated(changedProperties) {
  if (changedProperties.has('collapsed')) {
    this._measureDOM();
  }
}
```

### updateComplete

La promesa `updateComplete` se resuelve cuando el elemento ha terminado de actualizarse. Use `updateComplete` para esperar una actualización. El valor resuelto es un valor booleano que indica si el elemento ha terminado de actualizarse. Será `true` si no hay actualizaciones pendientes una vez finalizado el ciclo de actualización.

Cuando un elemento se actualiza, puede hacer que sus elementos secundarios también se actualicen. De forma predeterminada, la promesa `updateComplete` se resuelve cuando se completa la actualización del elemento, pero no espera a que ningún elemento secundario haya completado sus actualizaciones. Este comportamiento se puede personalizar anulando `getUpdateComplete`.

Hay varios casos de uso para saber cuándo se ha completado la actualización de un elemento:

1. **Test** Al escribir pruebas, puede esperar la promesa `updateComplete` antes de hacer afirmaciones sobre el DOM de un componente. Si las afirmaciones dependen de que se completen las actualizaciones para todo el árbol descendiente del componente, la espera de `requestAnimationFrame` suele ser una mejor opción, ya que la programación predeterminada de Lit usa la cola de microtareas del navegador, que se vacía antes de los cuadros de animación. Esto garantiza que todas las actualizaciones de Lit pendientes en la página se hayan completado antes de la devolución de llamada de `requestAnimationFrame`.
2. **Measurement** Algunos componentes pueden necesitar medir DOM para implementar ciertos diseños. Si bien siempre es mejor implementar diseños usando CSS puro en lugar de medidas basadas en JavaScript, a veces las limitaciones de CSS hacen que esto sea inevitable. En casos muy simples, y si está midiendo componentes Lit o ReactiveElement, puede ser suficiente esperar a `updateComplete` después de los cambios de estado y antes de medir. Sin embargo, debido a que `updateComplete` no espera la actualización de todos los descendientes, recomendamos usar `ResizeObserver` como una forma más sólida de activar el código de medición cuando cambian los diseños.
3. **Event** Es una buena práctica despachar eventos de los componentes después de que se haya completado el renderizado, de modo que los oyentes del evento vean el estado completamente renderizado del componente. Para hacerlo, puede esperar la promesa `updateComplete` antes de activar el evento.

```jsx
async _loginClickHandler() {
  this.loggedIn = true;
  // Wait for `loggedIn` state to be rendered to the DOM
  await this.updateComplete;
  this.dispatchEvent(new Event('login'));
}
```

La promesa `updateComplete` se rechaza si hay un error no controlado durante el ciclo de actualización.

## Handling errors in the update cycle

Si tiene una excepción no detectada en un método de ciclo de vida como `render()` o `update()`, hace que se rechace la promesa updateComplete. Si tiene código en un método de ciclo de vida que puede generar una excepción, es una buena práctica colocarlo dentro de una instrucción `try/catch`.

También es posible que desee utilizar una `try/catch` si está esperando la promesa `updateComplete`:

```jsx
try {
  await this.updateComplete;
} catch (e) {
  /* handle error */
}
```

En algunos casos, el código puede aparecer en lugares inesperados. Como fallback (alternativa), puede agregar un controlador para `window.onunhandledrejection` para detectar estos problemas. Por ejemplo, podría usar este informe de errores en un servicio de back-end para ayudar a diagnosticar problemas que son difíciles de reproducir.

```jsx
window.onunhandledrejection = function(e) {
  /* handle error */
}
```

## Implementing additional customization

Esta sección cubre algunos métodos menos comunes para personalizar el ciclo de actualización.

### scheduleUpdate()

Reemplazar `scheduleUpdate()` para personalizar el momento de la actualización. Se llama a `scheduleUpdate()` cuando está a punto de realizarse una actualización y, de forma predeterminada, llama a `performUpdate()` inmediatamente. Anúlelo para diferir la actualización: esta técnica se puede usar para desbloquear el subproceso de representación/evento principal.

Por ejemplo, el siguiente código programa la actualización para que se realice después de que se pinte el siguiente cuadro, lo que puede reducir los bloqueos si la actualización es costosa:

```jsx
async scheduleUpdate() {
  await new Promise((resolve) => setTimeout(resolve));
  super.scheduleUpdate();
}
```

Si anula `ScheduleUpdate()`, es su responsabilidad llamar a `super.scheduleUpdate()` para realizar la actualización pendiente.

> ℹ️ Función asíncrona opcional. Este ejemplo muestra una función asíncrona que implícitamente devuelve una promesa. También puede escribir `scheduleUpdate()` como una función que devuelve explícitamente una Promesa. En cualquier caso, la próxima actualización no comienza hasta que se resuelve la promesa devuelta por `scheduleUpdate()`.
> 

### perfomUpdate()

Implementa el ciclo de actualización reactiva, llamando a los otros métodos, como `shouldUpdate()`, `update()` y `updated()`.

Llame a `performUpdate()` para procesar inmediatamente una actualización pendiente. Por lo general, esto no debería ser necesario, pero se puede hacer en casos excepcionales cuando necesite actualizar de forma sincrónica. (Si no hay ninguna actualización pendiente, puede llamar a `requestUpdate()` seguido de `performUpdate()` para forzar una actualización síncrona).

> ℹ️  Use `scheduleUpdate()` para personalizar la programación. Si desea personalizar cómo se programan las actualizaciones, anule `scheduleUpdate()`. Anteriormente, recomendamos anular `performUpdate()` para este propósito. Eso continúa funcionando, pero hace que sea más difícil llamar a `performUpdate()` para procesar una actualización pendiente de forma síncrona.
> 

### hasUpdated

La propiedad `hasUpdated` devuelve verdadero si el componente se ha actualizado al menos una vez. Puede usar hasUpdated en cualquiera de los métodos del ciclo de vida para realizar el trabajo solo si el componente aún no se ha actualizado.

### getUpdateComplete()

Para esperar condiciones adicionales antes de cumplir la promesa `updateComplete`, invalide el método `getUpdateComplete()`. Por ejemplo, puede ser útil esperar la actualización de un elemento secundario. Primero espere `super.getUpdateComplete()`, luego cualquier estado posterior.

> ℹ️ Se recomienda anular el método `getUpdateComplete()` en lugar del captador `updateComplete` para garantizar la compatibilidad con los usuarios que utilizan la salida ES5 de TypeScript (consulte TypeScript n.º 338).
> 

```jsx
class MyElement extends LitElement {
  async getUpdateComplete() {
    await super.getUpdateComplete();
    await this._myChild.updateComplete;
  }
}
```

# External lifecycle hooks: controllers and decorators

Además de las clases de componentes que implementan las devoluciones de llamada del ciclo de vida, es posible que el código externo, como los decoradores, deba conectarse al ciclo de vida de un componente.

Lit ofrece dos conceptos para que el código externo se integre con el ciclo de vida de la actualización reactiva: static `addInitializer()` y `addController()`:

### static addInitializer()

`addInitializer()` permite que el código que tiene acceso a una definición de clase Lit ejecute código cuando se construyen instancias de la clase.

Esto es muy útil al escribir decoradores personalizados. Los decoradores se ejecutan en el momento de la definición de la clase y pueden hacer cosas como reemplazar definiciones de campos y métodos. Si también necesitan trabajar cuando se crea una instancia, deben llamar a `addInitializer()`. Será común usar esto para agregar un controlador reactivo para que los decoradores puedan conectarse al ciclo de vida del componente:

```jsx
// A Babel "Stage 2" decorator
const myDecorator = (descriptor) => {
  ...descriptor,
  finisher(ctor) {
    ctor.addInitializer((instance) => {
      // This is run during construction of the element
      new MyController(instance);
    });
  },
};
```

Decorar un campo hará que cada instancia ejecute un inicializador que agrega un controlador:

```jsx
class MyElement extends LitElement {
  @myDecorator foo;
}
```

Los inicializadores se almacenan por constructor. Agregar un inicializador a una subclase no lo agrega a una superclase. Dado que los inicializadores se ejecutan en los constructores, los inicializadores se ejecutarán en el orden de la jerarquía de clases, comenzando con las superclases y progresando hasta la clase de la instancia.

### addController()

`addController()` agrega un controlador reactivo a un componente Lit para que el componente invoque las devoluciones de llamada del ciclo de vida del controlador. Consulte los documentos del controlador reactivo para obtener más información.

### removeController()

`removeController()` elimina un controlador reactivo para que ya no reciba devoluciones de llamada del ciclo de vida de este componente.

# Server-side reactive update cycle

El paquete de renderizado del lado del servidor de Lit se encuentra actualmente en desarrollo activo, por lo que la siguiente información está sujeta a cambios.

No se llama a todo el ciclo de actualización al renderizar Lit en el servidor. Los siguientes métodos se llaman en el servidor.

![Untitled](Lifecycle%208e08b4f08c754cff84bf0ec04df687a3/Untitled%204.png)

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
