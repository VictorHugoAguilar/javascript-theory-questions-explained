# Custom directives

# Introducción

Las directivas son funciones que pueden extender Lit al personalizar cómo se representa una expresión de plantilla. Las directivas son útiles y poderosas porque pueden tener estado, acceder al DOM, recibir notificaciones cuando las plantillas se desconectan y se vuelven a conectar, y actualizan expresiones de forma independiente fuera de una llamada de representación.

Usar una directiva en su plantilla es tan simple como llamar a una función en una expresión de plantilla:

```jsx
html`<div>
       ${fancyDirective('some text')}
     </div>`
```

Lit se envía con una serie de directivas integradas como `repeat()` y `cache()`. Los usuarios también pueden escribir sus propias directivas personalizadas.

Hay dos tipos de directivas:

- Funciones simples
- Directivas basadas en clases

Una función simple devuelve un valor para representar. Puede tomar cualquier número de argumentos, o ningún argumento en absoluto.

```jsx
export noVowels = (str) => str.replaceAll(/[aeiou]/ig,'x');
```

Una directiva basada en clases le permite hacer cosas que una función simple no puede. Use una directiva basada en clases para:

- Acceda al DOM renderizado directamente (por ejemplo, agregue, elimine o reordene los nodos DOM renderizados).
- Persistir estado entre renders.
- Actualice el DOM de forma asíncrona, fuera de una llamada de procesamiento.
- Limpie los recursos cuando la directiva esté desconectada del DOM

El resto de esta página describe directivas basadas en clases.

# Creating class-based directives (creación de directivas basadas en clases)

Para crear una directiva basada en clases:

- Implemente la directiva como una clase que extiende la clase **Directive**.
- Pase su clase a la fábrica de `directivas()` para crear una función de directiva que se pueda usar en las expresiones de plantilla de Lit.

```jsx
import {Directive, directive} from 'lit/directive.js';

// Define directive
class HelloDirective extends Directive {
  render() {
    return `Hello!`;
  }
}
// Create the directive function
const hello = directive(HelloDirective);

// Use directive
const template = html`<div>${hello()}</div>`;
```

Cuando se evalúa esta plantilla, la función directiva (`hello()`) devuelve un objeto DirectivoResultado, que le indica a Lit que cree o actualice una instancia de la clase directiva (`HelloDirective`). Luego, Lit llama a los métodos en la instancia de la directiva para ejecutar su lógica de actualización.

Algunas directivas necesitan actualizar el DOM de forma asincrónica, fuera del ciclo de actualización normal. Para crear una directiva asíncrona, extienda la clase base `AsyncDirective` en lugar de `Directive`.

# Lifecycle of a class-based directive

La clase directiva tiene algunos métodos de ciclo de vida integrados:

- El constructor de clases, para la inicialización única.
- `render()`, para representación declarativa.
- `update()`, para acceso DOM imperativo.

Debe implementar la devolución de llamada `render()` para todas las directivas. Implementar `update()` es opcional. La implementación predeterminada de `update()` llama y devuelve el valor de `render()`.

Las directivas asíncronas, que pueden actualizar el DOM fuera del ciclo de actualización normal, usan algunas devoluciones de llamadas adicionales del ciclo de vida.

## One-time setup: constructor()

Cuando Lit encuentra un `DirectiveResult` en una expresión por primera vez, construirá una instancia de la clase de directiva correspondiente (haciendo que se ejecute el constructor de la directiva y cualquier inicializador de campo de clase):

```jsx
class MyDirective extends Directive {
  // Class fields will be initialized once and can be used to persist
  // state between renders
  value = 0;
  // Constructor is only run the first time a given directive is used
  // in an expression
  constructor(partInfo) {
    super(partInfo);
    console.log('MyDirective created');
  }
  ...
}
```

Siempre que se use la misma función de directiva en la misma expresión en cada representación, la instancia anterior se reutiliza, por lo que el estado de la instancia persiste entre las presentaciones.

El constructor recibe un solo objeto `PartInfo`, que proporciona metadatos sobre la expresión en la que se usó la directiva. Esto puede ser útil para proporcionar verificación de errores en los casos en que una directiva está diseñada para usarse solo en tipos específicos de expresiones (consulte Limitación de una directiva a un tipo de expresión).

## Declarative rendering: render()

El método `render()` debería devolver el valor para renderizar en el DOM. Puede devolver cualquier valor renderizable, incluido otro DirectivoResultado.

Además de hacer referencia al estado en la instancia de la directiva, el método `render()` también puede aceptar argumentos arbitrarios pasados a la función de directiva:

```jsx
const template = html`<div>${myDirective(name, rank)}</div>`
```

Los parámetros definidos para el método `render()` determinan la firma de la función directiva:

```jsx
class MaxDirective extends Directive {
  maxValue = Number.MIN_VALUE;
  // Define a render method, which may accept arguments:
  render(value, minValue = Number.MIN_VALUE) {
    this.maxValue = Math.max(value, this.maxValue, minValue);
    return this.maxValue;
  }
}
const max = directive(MaxDirective);

// Call the directive with `value` and `minValue` arguments defined for `render()`:
const template = html`<div>${max(someNumber, 0)}</div>`;
```

## Imperative DOM access: update()

En casos de uso más avanzados, es posible que su directiva necesite acceder al DOM subyacente e imperativamente leerlo o mutarlo. Puede lograr esto anulando la devolución de llamada `update()`.

La devolución de llamada `update()` recibe dos argumentos:

- Un objeto `Part` con una API para gestionar directamente el DOM asociado a la expresión.
- Una matriz que contiene los argumentos `render()`.

Su método `update()` debería devolver algo que Lit pueda representar, o el valor especial `noChange` si no se requiere una nueva representación. La devolución de llamada `update()` es bastante flexible, pero los usos típicos incluyen:

- Leer datos del DOM y usarlos para generar un valor para representar.
- Actualizar imperativamente el DOM usando el elemento o la referencia parentNode en el objeto Part. En este caso, update() generalmente devuelve noChange, lo que indica que Lit no necesita realizar ninguna otra acción para representar la directiva.

### Partes

Cada posición de expresión tiene su propio objeto Part específico:

- `ChildPart` para expresiones en posición secundaria HTML.
- `AttributePart` para expresiones en posición de valor de atributo HTML.
- `BooleanAttributePart` para expresiones en un valor de atributo booleano (nombre con el prefijo `?`).
- `EventPart` para expresiones en una posición de detector de eventos (nombre con el prefijo `@`).
- `PropertyPart` para expresiones en la posición del valor de propiedad (nombre con el prefijo `.`).
- `ElementPart` para expresiones en la etiqueta del elemento.

Además de los metadatos específicos de la parte contenidos en `PartInfo`, todos los tipos de partes brindan acceso al elemento DOM asociado con la expresión (o `parentNode`, en el caso de `ChildPart`), al que se puede acceder directamente en `update()`. Por ejemplo:

```jsx
// Renders attribute names of parent element to textContent
class AttributeLogger extends Directive {
  attributeNames = '';
  update(part) {
    this.attributeNames = part.parentNode.getAttributeNames?.().join(' ');
    return this.render();
  }
  render() {
    return this.attributeNames;
  }
}
const attributeLogger = directive(AttributeLogger);

const template = html`<div a b>${attributeLogger()}</div>`;
// Renders: `<div a b>a b</div>`
```

Además, el módulo direct-helpers.js incluye una serie de funciones auxiliares que actúan sobre los objetos `Part` y se pueden usar para crear, insertar y mover dinámicamente partes dentro de `ChildPart` de una directiva.

### Llamando a render() desde update()

La implementación predeterminada de `update()` simplemente llama y devuelve el valor de `render()`. Si anula `update()` y aún desea llamar a `render()` para generar un valor, debe llamar a `render()` explícitamente.

Los argumentos `render()` se pasan a `update()` como una matriz. Puede pasar los argumentos a `render()` así:

```jsx
class MyDirective extends Directive {
  update(part, [fish, bananas]) {
    // ...
    return this.render(fish, bananas);
  }
  render(fish, bananas) { ... }
}
```

## Differences between update() and render()

Si bien la devolución de llamada `update()` es más poderosa que la devolución de llamada `render()`, hay una distinción importante: cuando se usa el paquete `@lit-labs/ssr` para la representación del lado del servidor (SSR), solo se llama al método `render()` el servidor. Para ser compatibles con SSR, las directivas deben devolver valores de `render()` y solo usar `update()` para la lógica que requiere acceso al DOM.

# Signaling no change (sin señalización de cambio)

A veces, una directiva puede no tener nada nuevo para Lit para representar. Señala esto devolviendo `noChange` desde el método `update()` o `render()`. Esto es diferente de devolver `undefined`, lo que hace que Lit borre la `Part` asociada con la directiva. Devolver `noChange` deja el valor renderizado previamente en su lugar.

Hay varias razones comunes para devolver `noChange`:

- Según los valores de entrada, no hay nada nuevo que representar.
- El método `update()` actualizó el DOM de forma imperativa.
- En una directiva asíncrona, una llamada a `update()` o `render()` puede devolver `noChange` porque todavía no hay nada que representar.

Por ejemplo, una directiva puede realizar un seguimiento de los valores anteriores que se le pasaron y realizar su propia verificación sucia para determinar si la salida de la directiva debe actualizarse. El método `update()` o `render()` puede devolver `noChange` para indicar que no es necesario volver a representar la salida de la directiva.

```jsx
import {Directive} from 'lit/directive.js';
import {noChange} from 'lit';
class CalculateDiff extends Directive {
  render(a, b) {
    if (this.a !== a || this.b !== b) {
      this.a = a;
      this.b = b;
      // Expensive & fancy text diffing algorithm
      return calculateDiff(a, b);
    }
    return noChange;
  }
}
```

# Limiting a directive to one expression type (limitar una directiva a un tipo de expresión)

Algunas directivas solo son útiles en un contexto, como una expresión de atributo o una expresión secundaria. Si se coloca en el contexto incorrecto, la directiva debería arrojar un error apropiado.

Por ejemplo, la directiva `classMap` valida que solo se use en un `AttributePart` y solo para el atributo de clase`:

```jsx
class ClassMap extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (
      partInfo.type !== PartType.ATTRIBUTE ||
      partInfo.name !== 'class'
    ) {
      throw new Error('The `classMap` directive must be used in the `class` attribute');
    }
  }
  ...
}
```

# Async directives

Las directivas de ejemplo anteriores son síncronas: devuelven valores de forma síncrona desde sus devoluciones de llamada del ciclo de vida `render()`/`update()`, por lo que sus resultados se escriben en el DOM durante la devolución de llamada de `updated()` del componente.

A veces, desea que una directiva pueda actualizar el DOM de forma asíncrona, por ejemplo, si depende de un evento asíncrono como una solicitud de red.

Para actualizar el resultado de una directiva de forma asincrónica, una directiva debe ampliar la clase base **AsyncDirective**, que proporciona una API `setValue()`. `setValue()` permite que una directiva "inserte" un nuevo valor en su expresión de plantilla, fuera del ciclo normal de `update`/`render` de la plantilla.

Aquí hay un ejemplo de una directiva asíncrona simple que representa un valor de Promesa:

```jsx
class ResolvePromise extends AsyncDirective {
  render(promise) {
    Promise.resolve(promise).then((resolvedValue) => {
      // Rendered asynchronously:
      this.setValue(resolvedValue);
    });
    // Rendered synchronously:
    return `Waiting for promise to resolve`;
  }
}
export const resolvePromise = directive(ResolvePromise);
```

Aquí, la plantilla renderizada muestra "Esperando que se resuelva la promesa", seguido del valor resuelto de la promesa, siempre que se resuelva.

Las directivas asíncronas a menudo necesitan suscribirse a recursos externos. Para evitar pérdidas de memoria, las directivas asíncronas deben cancelar la suscripción o desechar los recursos cuando la instancia de la directiva ya no esté en uso. Para este propósito, `AsyncDirective` proporciona las siguientes API y devoluciones de llamada adicionales del ciclo de vida:

- `disconnected()`: se llama cuando una directiva ya no está en uso. Las instancias de directiva se desconectan en tres casos:
    - Cuando el árbol DOM en el que está contenida la directiva se elimina del DOM
    - Cuando el elemento host de la directiva está desconectado
    - Cuando la expresión que produjo la directiva ya no se resuelve en la misma directiva.
    
    Después de que una directiva recibe una devolución de llamada `disconnected`, debe liberar todos los recursos a los que se haya suscrito durante la `updated` o el `render` para evitar pérdidas de memoria.
    
- `reconnected()`: se llama cuando se vuelve a usar una directiva previamente desconectada. Debido a que los subárboles DOM se pueden desconectar temporalmente y luego volver a conectar más tarde, es posible que una directiva desconectada deba reaccionar ante la reconexión. Ejemplos de esto incluyen cuando DOM se elimina y se almacena en caché para su uso posterior, o cuando un elemento de host se mueve y provoca una desconexión y reconexión. La devolución de llamada `reconnected()` siempre debe implementarse junto con `disconnected()`, para restaurar una directiva desconectada a su estado de funcionamiento.
- `isConnected`: refleja el estado de conexión actual de la directiva.

> ℹ️ Tenga en cuenta que es posible que `AsyncDirective` continúe recibiendo actualizaciones mientras está desconectado si su árbol contenedor se vuelve a representar. Debido a esto, la `update` y/o el `render` siempre deben verificar el indicador `this.isConnected` antes de suscribirse a cualquier recurso de larga duración para evitar pérdidas de memoria.
> 

A continuación se muestra un ejemplo de una directiva que se suscribe a un `Observable` y maneja la desconexión y la reconexión de manera adecuada:

```jsx
class ObserveDirective extends AsyncDirective {
  // When the observable changes, unsubscribe to the old one and
  // subscribe to the new one
  render(observable) {
    if (this.observable !== observable) {
      this.unsubscribe?.();
      this.observable = observable
      if (this.isConnected)  {
        this.subscribe(observable);
      }
    }
    return noChange;
  }
  // Subscribes to the observable, calling the directive's asynchronous
  // setValue API each time the value changes
  subscribe(observable) {
    this.unsubscribe = observable.subscribe((v) => {
      this.setValue(v);
    });
  }
  // When the directive is disconnected from the DOM, unsubscribe to ensure
  // the directive instance can be garbage collected
  disconnected() {
    this.unsubscribe();
  }
  // If the subtree the directive is in was disconneted and subsequently
  // re-connected, re-subscribe to make the directive operable again
  reconnected() {
    this.subscribe(this.observable);
  }
}
export const observe = directive(ObserveDirective);
```


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
