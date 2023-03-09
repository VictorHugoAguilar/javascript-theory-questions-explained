# Built-in directives

# Introducción

Las directivas son funciones que pueden extender Lit al personalizar la forma en que se representa una expresión. Lit incluye una serie de directivas integradas para ayudar con una variedad de necesidades de representación:

| Directive | Summary |
| --- | --- |
| Styling |  |
| classMap | Asigna una lista de clases a un elemento en función de un objeto. |
| styleMap | Establece una lista de propiedades de estilo para un elemento basado en un objeto. |
| Loops and Conditionals |  |
| when | Representa una de dos plantillas en función de una condición. |
| choose | Representa una de muchas plantillas en función de un valor clave. |
| map | Transforma un iterable con una función. |
| repeat | Representa valores de un iterable en el DOM, con claves opcionales para permitir la diferenciación de datos y la estabilidad del DOM. |
| join | Intercalar valores de un iterable con un valor de unión. |
| range | Crea un iterable de números en una secuencia, útil para iterar un número específico de veces. |
| ifDefined | Establece un atributo si el valor está definido y elimina el atributo si no está definido. |
| Caching and change detection |  |
| cache | Los cachés representan el DOM al cambiar las plantillas en lugar de descartar el DOM. |
| keyed | Asocia un valor renderizable con una clave única, lo que obliga al DOM a volver a renderizar si la clave cambia. |
| guard | Solo vuelve a evaluar la plantilla cuando cambia una de sus dependencias. |
| live | Establece un atributo o propiedad si difiere del valor DOM en vivo en lugar del último valor representado. |
| Referencing rendered DOM |  |
| ref | Obtiene una referencia a un elemento representado en la plantilla. |
| Rendering special values |  |
| templateContent | Representa el contenido de un elemento `<template>` . |
| unsafeHTML | Representa una cadena como HTML en lugar de texto. |
| unsafeSVG | Representa una cadena como SVG en lugar de texto. |
| Asynchronous rendering |  |
| until | Representa contenido de marcador de posición hasta que se resuelven una o más promesas. |
| asyncAppend | Agrega valores de un 'AsyncIterable' en el DOM a medida que se obtienen. |
| asyncReplace | Representa el valor más reciente de un 'AsyncIterable' en el DOM a medida que se obtiene. |


> ℹ️ Empaca solo lo que usas. Estas se llaman directivas "incorporadas" porque son parte del paquete Lit. Pero cada directiva es un módulo separado, por lo que su aplicación solo incluye las directivas que importa.
>

# Styling

## classMap

Establece una lista de clases para un elemento basado en un objeto.

| clave | valor |
| --- | --- |
| Import | import {classMap} from 'lit/directives/class-map.js'; |
| Signature | classMap(classInfo: {[name: string]: string | boolean | number}) |
| Usable location | expresión de atributo de `class` (debe ser la única expresión en el atributo de clase) |

La directiva `classMap` usa la API `element.classList` para agregar y quitar clases de manera eficiente a un elemento en función de un objeto pasado por el usuario. Cada clave del objeto se trata como un nombre de clase y, si el valor asociado con la clave es verdadero, esa clase se agrega al elemento. En renderizaciones subsiguientes, se eliminan todas las clases establecidas previamente que sean falsas o que ya no estén en el objeto.

```jsx
class MyElement extends LitElement {
  static properties = {
    enabled: {type: Boolean},
  };

  constructor() {
    super();
    this.enabled = false;
  }

  render() {
    const classes = { enabled: this.enabled, hidden: false };
    return html`<div class=${classMap(classes)}>Classy text</div>`;
  }
}
customElements.define('my-element', MyElement);
```

El `classMap` debe ser la única expresión en el atributo de clase, pero se puede combinar con valores estáticos:

```jsx
html`<div class="my-widget ${classMap(dynamicClasses)}">Static and dynamic</div>`;
```


## styleMap

Establece una lista de propiedades de estilo para un elemento basado en un objeto.

| key | value |
| --- | --- |
| Import | import {styleMap} from 'lit/directives/style-map.js'; |
| Signature | styleMap(styleInfo: {[name: string]: string | undefined | null}) |
| Usable location | style attribute expression (must be the only expression in the style attribute) |

La directiva `styleMap` utiliza la API `element.style` para agregar y eliminar estilos en línea de manera eficiente a un elemento en función de un objeto pasado por el usuario. Cada clave en el objeto se trata como un nombre de propiedad de estilo, el valor se trata como el valor de esa propiedad. En las renderizaciones posteriores, se eliminan todas las propiedades de estilo establecidas anteriormente que sean  `undefined` o son `null` (se establecen en `null`).

```jsx
class MyElement extends LitElement {
  static properties = {
    enabled: {type: Boolean},
  };

  constructor() {
    super();
    this.enabled = false;
  }

  render() {
    const styles = { backgroundColor: this.enabled ? 'blue' : 'gray', color: 'white' };
    return html`<p style=${styleMap(styles)}>Hello style!</p>`;
  }
}
customElements.define('my-element', MyElement);
```

Para las propiedades CSS que contienen guiones, puede usar el equivalente en mayúsculas y minúsculas o poner el nombre de la propiedad entre comillas. Por ejemplo, puede escribir la propiedad CSS font-family como fontFamily o 'font-family':

```jsx
{ fontFamily: 'roboto' }
{ 'font-family': 'roboto' }
```

Consulte las propiedades personalizadas de CSS, como `--custom-color`, colocando el nombre completo de la propiedad entre comillas:

```jsx
{ '--custom-color': 'steelblue' }
```

El `styleMap` debe ser la única expresión en el atributo de estilo, pero se puede combinar con valores estáticos:

```jsx
html`<p style="color: white; ${styleMap(moreStyles)}">More styles!</p>`;
```

# Loops and conditionals

## when

Representa una de dos templates en función de una condición.

| key | value |
| --- | --- |
| Import | import {when} from 'lit/directives/when.js'; |
| Signature | when<T, F>(
  condition: boolean,
  trueCase: () => T,
  falseCase?: () => F
) |
| Usable location | Any |

Cuando la condición es `true`, devuelve el resultado de llamar a `trueCase()`, de lo contrario, devuelve el resultado de llamar a `falseCase()` si se define `falseCase`.

Esta es una envoltura de conveniencia alrededor de una expresión ternaria que hace que sea un poco más agradable escribir un condicional en línea sin un else.

```jsx
class MyElement extends LitElement {
  render() {
    return html`
      ${when(this.user, () => html`User: ${this.user.username}`, () => html`Sign In...`)}
    `;
  }
}
```

## choose

Choose y evalúa una función de plantilla de una lista de casos en función de hacer coincidir el `value` dado con un caso.

| key | value |
| --- | --- |
| Import | import {choose} from 'lit/directives/choose.js'; |
| Signature | choose<T, V>(
  value: T,
  cases: Array<[T, () => V]>,
  defaultCase?: () => V
) |
| Usable location | Any |

Los casos están estructurados como `[caseValue, func]`. `value` coincide con `caseValue` por estricta igualdad. Se selecciona el primer partido. Los valores de caso pueden ser de cualquier tipo, incluidos primitivos, objetos y símbolos.

Esto es similar a una declaración de cambio, pero como una expresión y sin fallas.

```jsx
class MyElement extends LitElement {
  render() {
    return html`
      ${choose(this.section, [
        ['home', () => html`<h1>Home</h1>`],
        ['about', () => html`<h1>About</h1>`]
      ],
      () => html`<h1>Error</h1>`)}
    `;
  }
}
```

## map

Devuelve un iterable que contiene el resultado de llamar a `f(valor)` en cada valor de los `items`.

| key | value |
| --- | --- |
| Import | import {map} from 'lit/directives/map.js'; |
| Signature | map<T>(
  items: Iterable<T> | undefined,
  f: (value: T, index: number) => unknown
) |
| Usable location | Any |

`map()` es un contenedor simple alrededor de un bucle for/of que hace que trabajar con iterables en expresiones sea un poco más fácil. `map()` siempre actualiza cualquier DOM creado en su lugar; no hace ninguna diferencia ni movimiento de DOM. Si necesita que vea **repetir**. `map()` es más pequeño y más rápido que `repeat()`, por lo que si no necesita diferencias y estabilidad DOM, prefiera `map()`.

```jsx
class MyElement extends LitElement {
  render() {
    return html`
      <ul>
        ${map(items, (i) => html`<li>${i}</li>`)}
      </ul>
    `;
  }
}
```

## repeat

Representa valores de un iterable en el DOM, con claves opcionales para permitir la diferenciación de datos y la estabilidad del DOM.

| key | value |
| --- | --- |
| Import | import {repeat} from 'lit/directives/repeat.js'; |
| Signature | repeat(items: Iterable<T>, keyfn: KeyFn<T>, template: ItemTemplate<T>)

repeat(items: Iterable<T>, template: ItemTemplate<T>)

type KeyFn<T> = (item: T, index: number) => unknown;

type ItemTemplate<T> = (item: T, index: number) => unknown; |
| Usable location | Child expression |

Repite una serie de valores (generalmente `TemplateResults`) generados a partir de un iterable y actualiza esos elementos de manera eficiente cuando cambia el iterable. Cuando se proporciona `keyFn`, la asociación de clave a DOM se mantiene entre las actualizaciones al mover el DOM generado cuando sea necesario y, en general, es la forma más eficiente de usar `repeat`, ya que realiza un trabajo innecesario mínimo para las inserciones y eliminaciones.

Si no está usando una función clave, debería considerar usar `map()`.

```jsx
class MyElement extends LitElement {
  static properties = {
    items: {},
  };

  constructor() {
    super();
    this.items = [];
  }

  render() {
    return html`
      <ul>
        ${repeat(this.items, (item) => item.id, (item, index) => html`
          <li>${index}: ${item.name}</li>`)}
      </ul>
    `;
  }
}
customElements.define('my-element', MyElement);
```

Si no se proporciona `keyFn`, la repetición funcionará de manera similar a un mapa simple de elementos a valores, y DOM se reutilizará contra elementos potencialmente diferentes.

Consulte Cuándo usar el `map` o `repeat` para ver una discusión sobre cuándo usar la `repeat` y cuándo usar el control de flujo de JavaScript estándar.

## join

Devuelve un iterable que contiene los valores de los `items` intercalados con el valor del `joiner`.

| key | value |
| --- | --- |
| Import          | import {join} from 'lit/directives/join.js'; |
| Signature       | join<I, J>( items: Iterable<I> | undefined, joiner: J ): Iterable<I | J>; |
|                 | join<I, J>( items: Iterable<I> | undefined, joiner: (index: number) => J ): Iterable<I | J>; |
| Usable location | Any |

```jsx
class MyElement extends LitElement {

  render() {
    return html`
      ${join(
        map(menuItems, (i) => html`<a href=${i.href}>${i.label}</a>`),
        html`<span class="separator">|</span>`
      )}
    `;
  }
}
```

## range

Devuelve un iterable de enteros de `start` a `end` (exclusivo) incrementando por `step`.

| key | value |
| --- | --- |
| Import | import {range} from 'lit/directives/range.js'; |
| Signature | range(end: number): Iterable<number>;

range(
  start: number,
  end: number,
  step?: number
): Iterable<number>; |
| Usable location | Any |

```jsx
class MyElement extends LitElement {

  render() {
    return html`
      ${map(range(8), (i) => html`${i + 1}`)}
    `;
  }
}
```

## ifDefined

Establece un atributo si el valor está definido y elimina el atributo si no está definido.

| key | value |
| --- | --- |
| Import | import {ifDefined} from 'lit/directives/if-defined.js'; |
| Signature | ifDefined(value: unknown) |
| Usable location | Attribute expression |

Para AttributeParts, establece el atributo si el valor está definido y elimina el atributo si el valor no está definido (`undefined` o `null`). Para otros tipos de piezas, esta directiva no funciona.

Cuando existe más de una expresión en un solo valor de atributo, el atributo se eliminará si alguna expresión usa `ifDefined` y se evalúa como `undefinde`/`null`. Esto es especialmente útil para configurar atributos de URL, cuando el atributo no debe configurarse si las partes requeridas de la URL no están definidas, para evitar errores 404.

```jsx
class MyElement extends LitElement {
  static properties = {
    filename: {},
    size: {},
  };

  constructor() {
    super();
    this.filename = undefined;
    this.size = undefined;
  }

  render() {
    // src attribute not rendered if either size or filename are undefined
    return html`<img src="/images/${ifDefined(this.size)}/${ifDefined(this.filename)}">`;
  }
}
customElements.define('my-element', MyEleent);
```

# Caching and change detection

## cache

Los cachés representan el DOM al cambiar las plantillas en lugar de descartar el DOM. Puede utilizar esta directiva para optimizar el rendimiento de la representación al cambiar con frecuencia entre plantillas grandes.

| key | value |
| --- | --- |
| Import | import {cache} from 'lit/directives/cache.js'; |
| Signature | cache(value: TemplateResult|unknown) |
| Usable location | Child expression |

Cuando el valor pasado a la `cache` cambia entre uno o más `TemplateResults`, los nodos DOM representados para una plantilla determinada se almacenan en caché cuando no están en uso. Cuando la plantilla cambia, la directiva almacena en caché los nodos DOM actuales antes de cambiar al nuevo valor y los restaura desde el caché cuando se vuelve a cambiar a un valor renderizado anteriormente, en lugar de crear los nodos DOM de nuevo.

```jsx
const detailView = (data) => html`<div>...</div>`;
const summaryView = (data) => html`<div>...</div>`;

class MyElement extends LitElement {
  static properties = {
    data: {},
  };

  constructor() {
    super();
    this.data = {showDetails: true, /*...*/ };
  }

  render() {
    return html`${cache(this.data.showDetails
      ? detailView(this.data)
      : summaryView(this.data)
    )}`;
  }
}
customElements.define('my-element', MyElement);
```

Cuando Lit vuelve a renderizar una plantilla, solo actualiza las partes modificadas: no crea ni elimina más DOM del necesario. Pero cuando cambias de una plantilla a otra, Lit elimina el antiguo DOM y genera un nuevo árbol DOM.

La directiva de `cache` almacena en caché el DOM generado para una expresión dada y una plantilla de entrada. En el ejemplo anterior, almacena en caché el DOM para las plantillas de `summaryView` y `detailView` . Cuando cambia de una vista a otra, Lit intercambia la versión almacenada en caché de la nueva vista y la actualiza con los datos más recientes. Esto puede mejorar el rendimiento de la representación cuando estas vistas se cambian con frecuencia.

## keyed

Asocia un valor representable con una clave única. Cuando la clave cambia, el DOM anterior se elimina y se elimina antes de representar el siguiente valor, incluso si el valor, como una plantilla, es el mismo.

| key | value |
| --- | --- |
| Import | import {keyed} from 'lit/directives/keyed.js'; |
| Signature | keyed(key: unknown, value: unknown) |
| Usable location | Any expression |

`keyed` es útil cuando está procesando elementos con estado y necesita asegurarse de que todo el estado del elemento se borre cuando cambien algunos datos críticos. Básicamente, opta por no participar en la estrategia de reutilización DOM predeterminada de Lit.

`keyed` también es útil en algunos escenarios de animación si necesita forzar un nuevo elemento para animaciones de "entrar" o "salir".

```jsx
class MyElement extends LitElement {
  static properties = {
    userId: {},
  };

  constructor() {
    super();
    this.userId = '';
  }

  render() {
    return html`
      <div>
        ${keyed(this.userId, html`<user-card .userId=${this.userId}></user-card>`)}
      </div>`;
  }
}
customElements.define('my-element', MyElement);
```

## guard

Solo vuelve a evaluar la plantilla cuando cambia una de sus dependencias, para optimizar el rendimiento de la representación y evitar el trabajo innecesario.

| key | value |
| --- | --- |
| Import | import {guard} from 'lit/directives/guard.js'; |
| Signature | guard(dependencies: unknown[], valueFn: () => unknown) |
| Usable location | Any expression |

Representa el valor devuelto por valueFn y solo vuelve a evaluar valueFn cuando una de las dependencias cambia de identidad.

Dónde:

- `dependencias` es una matriz de valores para monitorear los cambios.
- `valueFn` es una función que devuelve un valor representable.

`guard` es útil con patrones de datos inmutables, al evitar un trabajo costoso hasta que se actualicen los datos.

```jsx
class MyElement extends LitElement {
  static properties = {
    value: {},
  };

  constructor() {
    super();
    this.value = '';
  }

  render() {
    return html`
      <div>
        ${guard([this.value], () => calculateSHA(this.value))}
      </div>`;
  }
}
customElements.define('my-element', MyElement);
```

En este caso, la costosa función de `calculateSHA` solo se ejecuta cuando cambia la propiedad del `value`.

## live

Establece un atributo o propiedad si difiere del valor DOM en vivo en lugar del último valor representado.

| key | value |
| --- | --- |
| Import | import {live} from 'lit/directives/live.js'; |
| Signature | live(value: unknown) |
| Usable location | Attribute or property expression |

Al determinar si actualizar el valor, verifica el valor de la expresión con el valor DOM en vivo, en lugar del comportamiento predeterminado de Lit de verificar con el último valor establecido.

Esto es útil para los casos en los que el valor DOM puede cambiar desde fuera de Lit. Por ejemplo, al usar una expresión para establecer la propiedad de `valor` de un elemento `<input>`, el texto de un elemento de contenido editable o un elemento personalizado que cambia sus propias propiedades o atributos.

En estos casos, si el valor DOM cambia, pero el valor establecido a través de la expresión Lit no lo ha hecho, Lit no sabrá actualizar el valor DOM y lo dejará solo. Si esto no es lo que desea, si desea sobrescribir el valor DOM con el valor vinculado sin importar qué, use la directiva `live()`.

```jsx
class MyElement extends LitElement {
  static properties = {
    data: {},
  };

  constructor() {
    super();
    this.data = {value: 'test'};
  }

  render() {
    return html`<input .value=${live(this.data.value)}>`;
  }
}
customElements.define('my-element', MyElement);
```

`live()` realiza una verificación de igualdad estricta con el valor DOM en vivo, y si el nuevo valor es igual al valor en vivo, no hace nada. Esto significa que `live()` no debe usarse cuando la expresión provocará una conversión de tipo. Si usa `live()` con una expresión de atributo, asegúrese de que solo se pasen cadenas o la expresión se actualizará en cada representación.

# Rendering special values

## templateContent

Muestra el contenido de un elemento `<template>`.

| key | value |
| --- | --- |
| Import | import {templateContent} from 'lit/directives/template-content.js'; |
| Signature | templateContent(templateElement: HTMLTemplateElement) |
| Usable location | Child expression |

Las plantillas Lit están codificadas en Javascript, por lo que pueden incorporar expresiones Javascript que las hacen dinámicas. Si tiene una `<template>` HTML estática que necesita incluir en su plantilla de Lit, puede usar la directiva `templateContent` para clonar el contenido de la plantilla e incluirlo en su plantilla de Lit. Siempre que la referencia del elemento de la plantilla no cambie entre renderizaciones, las renderizaciones subsiguientes no funcionarán.

> ⚠️ Tenga en cuenta que el contenido de la plantilla debe estar controlado por el desarrollador y no debe crearse con una cadena que no sea de confianza. Los ejemplos de contenido que no es de confianza incluyen parámetros de cadena de consulta y valores de las entradas del usuario. Las plantillas que no son de confianza representadas con esta directiva podrían generar vulnerabilidades de secuencias de comandos entre sitios (XSS).
> 

```jsx
const templateEl = document.querySelector('template#myContent');

class MyElement extends LitElement {

  render() {
    return  html`
      Here's some content from a template element:
      ${templateContent(templateEl)}`;
  }
}
customElements.define('my-element', MyElement);
```

## unsafeHTML

Representa una cadena como HTML en lugar de texto.

| key | value |
| --- | --- |
| Import | import {unsafeHTML} from 'lit/directives/unsafe-html.js'; |
| Signature | unsafeHTML(value: string | typeof nothing | typeof noChange) |
| Usable location | Child expression |

Una característica clave de la sintaxis de plantillas de Lit es que solo las cadenas que se originan en los literales de plantilla se analizan como HTML. Debido a que los literales de plantilla solo se pueden crear en archivos de secuencias de comandos confiables, esto actúa como una protección natural contra los ataques XSS que inyectan HTML no confiable. Sin embargo, puede haber casos en los que el HTML que no se origina en archivos de secuencias de comandos deba representarse en una plantilla de Lit, por ejemplo, contenido HTML de confianza extraído de una base de datos. La directiva `unsafeHTML` analizará una cadena como HTML y la representará en una plantilla Lit.

> ⚠️ Tenga en cuenta que la cadena que se pasa a `unsafeHTML` debe estar controlada por el desarrollador y no incluir contenido que no sea de confianza. Los ejemplos de contenido que no es de confianza incluyen parámetros de cadena de consulta y valores de las entradas del usuario. El contenido que no es de confianza presentado con esta directiva podría generar vulnerabilidades de secuencias de comandos entre sitios (XSS).
> 

```jsx
const markup = '<h3>Some HTML to render.</h3>';

class MyElement extends LitElement {

  render() {
    return html`
      Look out, potentially unsafe HTML ahead:
      ${unsafeHTML(markup)}
    `;
  }
}
customElements.define('my-element', MyElement);
```

## unsafeSVG

Representa una cadena como SVG en lugar de texto.

| key | value |
| --- | --- |
| Import | import {unsafeSVG} from 'lit/directives/unsafe-svg.js'; |
| Signature | unsafeSVG(value: string | typeof nothing | typeof noChange) |
| Usable location | Child expression |

Al igual que con `unsafeHTML`, puede haber casos en los que el contenido SVG que no se origina en archivos de secuencias de comandos deba representarse en una plantilla de Lit, por ejemplo, contenido SVG de confianza extraído de una base de datos. La directiva unsafeSVG analizará una cadena como SVG y la representará en una plantilla Lit.

> ⚠️ Tenga en cuenta que la cadena que se pasa a `unsafeSVG` debe estar controlada por el desarrollador y no debe incluir contenido que no sea de confianza. Los ejemplos de contenido que no es de confianza incluyen parámetros de cadena de consulta y valores de las entradas del usuario. El contenido que no es de confianza presentado con esta directiva podría generar vulnerabilidades de secuencias de comandos entre sitios (XSS).
> 

```jsx
const svg = '<circle cx="50" cy="50" r="40" fill="red" />';

class MyElement extends LitElement {

  render() {
    return html`
      Look out, potentially unsafe SVG ahead:
      <svg width="40" height="40" viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg" version="1.1">
        ${unsafeSVG(svg)}
      </svg> `;
  }
}
customElements.define('my-element', MyElement);
```

# Referencing rendered DOM

## ref

Recupera una referencia a un elemento representado en el DOM.

| key | value |
| --- | --- |
| Import | import {ref} from 'lit/directives/ref.js'; |
| Signature | ref(refOrCallback: RefOrCallback) |
| Usable location | Element expression |

Aunque la mayor parte de la manipulación del DOM en Lit se puede lograr de manera declarativa usando plantillas, las situaciones avanzadas pueden requerir obtener una referencia a un elemento representado en la plantilla y manipularlo de manera imperativa. Los ejemplos comunes de cuándo esto puede ser útil incluyen enfocar un control de formulario o llamar a una biblioteca de manipulación DOM imperativa en un elemento contenedor.

Cuando se coloca en un elemento de la plantilla, la directiva `ref` recuperará una referencia a ese elemento una vez representado. La referencia del elemento se puede recuperar de una de dos maneras: pasando un objeto `Ref` o pasando una devolución de llamada.

Un objeto `Ref` actúa como un contenedor para una referencia al elemento y se puede crear utilizando el método auxiliar `createRef` que se encuentra en el módulo `ref`. Después de la renderización, la propiedad de valor de `Ref` se establecerá en el elemento, donde se puede acceder en el ciclo de vida posterior a la renderización como `updated`.

```jsx
class MyElement extends LitElement {

  inputRef = createRef();

  render() {
    // Passing ref directive a Ref object that will hold the element in .value
    return html`<input ${ref(this.inputRef)}>`;
  }

  firstUpdated() {
    const input = this.inputRef.value!;
    input.focus();
  }
}
customElements.define('my-element', MyElement);
```

Una devolución de llamada ref también se puede pasar a la directiva `ref`. La devolución de llamada se llamará cada vez que cambie el elemento al que se hace referencia. Si una devolución de llamada de referencia se representa en una posición de elemento diferente o se elimina en una representación posterior, primero se llamará con `undefined`, seguida de otra llamada con el nuevo elemento al que se representó (si corresponde). Tenga en cuenta que en un `LitElement`, la devolución de llamada se llamará vinculada al elemento host automáticamente.

```jsx
class MyElement extends LitElement {

  render() {
    // Passing ref directive a change callback
    return html`<input ${ref(this.inputChanged)}>`;
  }

  inputChanged(input) {
    input?.focus();
  }
}
customElements.define('my-element', MyElement);
```

# Asynchronous rendering

## until

Representa contenido de marcador de posición hasta que se resuelven una o más promesas.

| key | value |
| --- | --- |
| Import | import {until} from 'lit/directives/until.js'; |
| Signature | until(...values: unknown[]) |
| Usable location | Any expression |

Toma una serie de valores, incluyendo Promesas. Los valores se representan en orden de prioridad, con el primer argumento que tiene la prioridad más alta y el último argumento que tiene la prioridad más baja. Si un valor es una Promesa, se representará un valor de menor prioridad hasta que se resuelva.

La prioridad de los valores se puede usar para crear contenido de marcador de posición para datos asíncronos. Por ejemplo, una promesa con contenido pendiente puede ser el primer argumento (prioridad más alta) y una plantilla de indicador de carga sin promesa puede usarse como segundo argumento (prioridad más baja). El indicador de carga se representa de inmediato y el contenido principal se representará cuando se resuelva la Promesa.

```jsx
class MyElement extends LitElement {
  static properties = {
    content: {state: true},
  };

  constructor() {
    super();
    this.content = fetch('./content.txt').then(r => r.text());
  }

  render() {
    return html`${until(this.content, html`<span>Loading...</span>`)}`;
  }
}
customElements.define('my-element', MyElement);
```

## asyncAppend

Agrega valores de `AsyncIterable` al DOM a medida que se generan.

| key | value |
| --- | --- |
| Import | import {asyncAppend} from 'lit/directives/async-append.js'; |
| Signature | asyncAppend(iterable: AsyncIterable) |
| Usable location | Child expression |

`asyncAppend` hace que los valores de un async sean iterables, agregando cada nuevo valor después del anterior. Tenga en cuenta que los generadores asíncronos también implementan el protocolo iterable asíncrono y, por lo tanto, pueden ser consumidos por `asyncAppend`.

```jsx
async function *tossCoins(count) {
  for (let i=0; i<count; i++) {
    yield Math.random() > 0.5 ? 'Heads' : 'Tails';
    await new Promise((r) => setTimeout(r, 1000));
  }
}

class MyElement extends LitElement {
  static properties = {
    tosses: {state: true},
  };

  constructor() {
    super();
    this.tosses = tossCoins(10);
  }

  render() {
    return html`
      <ul>${asyncAppend(this.tosses, (v) => html`<li>${v}</li>`)}</ul>`;
  }
}
customElements.define('my-element', MyElement);
```

## asyncReplace

Representa el valor más reciente de un `AsyncIterable` en el DOM a medida que se produce.

| key | value |
| --- | --- |
| import | import {asyncReplace} from 'lit/directives/async-replace.js'; |
| Signature | asyncReplace(iterable: AsyncIterable) |
| Usable location | Child expression |

Similar a `asyncAppend`, `asyncReplace` hace que los valores de un async sean iterables, reemplazando el valor anterior con cada valor nuevo.

```jsx
async function *countDown(count) {
  while (count > 0) {
    yield count--;
    await new Promise((r) => setTimeout(r, 1000));
  }
}

class MyElement extends LitElement {
  static properties = {
    timer: {state: true},
  };

  constructor() {
    super();
    this.timer = countDown(10);
  }

  render() {
    return html`Timer: <span>${asyncReplace(this.timer)}</span>.`;
  }
}
customElements.define('my-element', MyElement);
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
