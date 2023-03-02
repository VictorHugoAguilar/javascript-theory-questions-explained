# Template syntax reference

# Introducción

Las plantillas `lit-html` se escriben usando literales de plantilla de JavaScript etiquetados con la etiqueta html. 
El contenido del literal es en su mayoría simple, declarativo, HTML:

```jsx
html`<h1>Hello World</h1>`
```

Los **bindeos o expresiones** se indican con la sintaxis estándar de JavaScript para los literales de plantilla:

```jsx
html`<h1>Hello ${name}</h1>`
```

# Estructura de los template

Las plantillas `lit-html` deben ser HTML bien formado, y los enlaces solo pueden ocurrir en ciertos lugares. 
Las plantillas son analizadas por el analizador HTML integrado del navegador antes de interpolar cualquier valor.

**⚠️ Sin advertencias**. La mayoría de los casos de plantillas mal formadas no son detectables por `lit-html`, por lo que no verá ninguna advertencia, solo plantillas que no se comportan como esperaba, así que tenga mucho cuidado para estructurar las plantillas correctamente.

Siga estas reglas para plantillas bien formadas:

- Las plantillas deben ser HTML bien formado cuando todas las expresiones se reemplazan por valores vacíos.
- Los bindeos solo pueden ocurrir en posiciones de valor de atributo y contenido de texto.

```jsx
<!-- attribute value -->
<div label="${label}"></div>

<!-- text content -->
<div>${textContent}</div>
```

- Las expresiones **no pueden** aparecer donde aparecerían nombres de etiquetas o atributos.

```jsx
<!-- ERROR -->
<${tagName}></${tagName}>

<!-- ERROR -->
<div ${attrName}=true></div>
```

- Las plantillas pueden tener varios elementos y texto de nivel superior.
- Las plantillas **no deben contener** elementos no cerrados; el analizador HTML los cerrará.

```jsx
// HTML parser closes this div after "Some text"
const template1 = html`<div class="broken-div">Some text`;
// When joined, "more text" does not end up in .broken-div
const template2 = html`${template1} more text. </div>`;
```

# Bindeando types

Las expresiones pueden aparecer en el contenido del texto o en posiciones de valores de atributos.

Hay algunos tipos de enlaces:

- Texto:

```jsx
html`<h1>Hello ${name}</h1>`
```

Los enlaces de texto pueden ocurrir en cualquier parte del contenido de texto de un elemento.

- Attribute:

```jsx
html`<div id=${id}></div>`
```

- Boolean Attribute:

```jsx
html`<input type="checkbox" ?checked=${checked}>`
```

- Property:

```jsx
html`<input .value=${value}>`
```

- Event Listener:

```jsx
html`<button @click=${(e) => console.log('clicked')}>Click Me</button>`
```

## Event listeners

Los event listenner pueden ser funciones u objetos con un método `handleEvent`. Los detectores se pasan como argumentos de detector y de opciones para `addEventListener`/`removeEventListener`, de modo que el detector pueda llevar opciones de detector de eventos como `capture`, `passive` y `once`.

```jsx
const listener = {
  handleEvent(e) {
    console.log('clicked');
  },
  capture: true,
};

html`<button @click=${listener}>Click Me</button>`
```

# Supported Data Types

Cada tipo de enlace admite diferentes tipos de valores:

- Bindeo de texto: Muchos tipos, consulte Tipos de datos admitidos para enlaces de texto.
- Bindeo de atributos: todos los valores se convierten en cadenas.
- Bindeo de atributos booleanos: todos los valores evaluados para veracidad.
- Bindeo de propiedad: cualquier tipo de valor.
- Bindeo del controlador de eventos: solo funciones u objetos del controlador de eventos.

## Tipos de datos admitidos para enlaces de texto

Los bindeo de contenido de texto aceptan una amplia gama de tipos de valores:

- valores primitivos.
- Objetos TemplateResult.
- nodos DOM.
- Matrices o iterables.

### Valores primitivos: cadena, número, booleano, nulo, indefinido

Los valores primitivos se convierten en cadenas cuando se interpolan en contenido de texto o valores de atributo. Se verifica la igualdad con el valor anterior para que el DOM no se actualice si el valor no ha cambiado.

### TemplateResult

Las plantillas se pueden anidar pasando un `TemplateResult` como valor de una expresión:

```jsx
const header = html`<h1>Header</h1>`;

const page = html`
  ${header}
  <p>This is some text</p>
`;
```

### Node

Cualquier nodo DOM se puede pasar a una expresión de posición de texto. El nodo se adjunta al árbol DOM en ese punto y, por lo tanto, se elimina de cualquier padre actual:

```jsx
const div = document.createElement('div');
const page = html`
  ${div}
  <p>This is some text</p>
`;
```

### Arrays and Iterables

También se admiten matrices e iterables de tipos admitidos. Pueden ser valores mixtos de diferentes tipos admitidos.

```jsx
const items = [1, 2, 3];
const list = () => html`items = ${items.map((i) => `item: ${i}`)}`;
```

```jsx
const items = {
  a: 1,
  b: 23,
  c: 456,
};
const list = () => html`items = ${Object.entries(items)}`;
```

# Flujo de control con JavaScript

`lit-html` no tiene construcciones de flujo de control integradas. En su lugar, utiliza expresiones y declaraciones de JavaScript normales.

## **Ifs con ternary operators**

Las expresiones ternarias son una excelente manera de agregar condicionales en línea:

```jsx
html`
  ${user.isloggedIn
      ? html`Welcome ${user.name}`
      : html`Please log in`
  }
`;
```

## Ifs con sentencias if

Puede expresar lógica condicional con declaraciones if fuera de una plantilla para calcular valores para usar dentro de la plantilla:

```jsx
getUserMessage() {
  if (user.isloggedIn) {
    return html`Welcome ${user.name}`;
  } else {
    return html`Please log in`;
  }
}

html`
  ${getUserMessage()}
`
```

## Loops with Array.map

Para representar listas, Array.map se puede usar para transformar una lista de datos en una lista de plantillas:

```jsx
html`
  <ul>
    ${items.map((i) => html`<li>${i}</li>`)}
  </ul>
`;
```

## Looping statements

```jsx
const itemTemplates = [];
for (const i of items) {
  itemTemplates.push(html`<li>${i}</li>`);
}

html`
  <ul>
    ${itemTemplates}
  </ul>
`;
```

# Built-in directives

Las directivas son funciones que pueden extender `lit-html` al personalizar la forma en que se representa un enlace.

`lit-html` incluye algunas directivas integradas.

- `asyncAppend` and `asyncReplace`
- `cache`
- `classMap`
- `ifDefined`
- `guard`
- `live`
- `repeat`
- `styleMap`
- `templateContent`
- `unsafeHTML`
- `unsafeSVG`
- `until`

## asyncAppend and asyncReplace

```jsx
asyncAppend(asyncIterable)
asyncReplace(asyncIterable)
```

### Location: text bindings

Los iteradores asíncronos de JavaScript proporcionan una interfaz genérica para el acceso secuencial asíncrono a los datos. Al igual que un iterador, un consumidor solicita el siguiente elemento de datos con una llamada a `next()`, pero con los iteradores asíncronos `next()` devuelve una `Promesa`, lo que permite que el iterador proporcione el elemento cuando esté listo.

`lit-html` ofrece dos directivas para consumir iteradores asíncronos:

- `asyncAppend` hace que los valores de un async sean iterables, agregando cada nuevo valor después del anterior.
- `asyncReplace` hace que los valores de un async sean iterables, reemplazando el valor anterior con el nuevo valor.

Ejemplo:

```jsx
import {asyncReplace} from 'lit-html/directives/async-replace.js';

const wait = (t) => new Promise((resolve) => setTimeout(resolve, t));
/**
 * Returns an async iterable that yields increasing integers.
 */
async function* countUp() {
  let i = 0;
  while (true) {
    yield i++;
    await wait(1000);
  }
}

render(html`
  Count: <span>${asyncReplace(countUp())}</span>.
`, document.body);
```

En un futuro cercano, `ReadableStreams` será iterable asíncrono, lo que permitirá transmitir `fetch()` directamente en una plantilla:

```jsx
import {asyncAppend} from 'lit-html/directives/async-append.js';

// Endpoint that returns a billion digits of PI, streamed.
const url =
    'https://cors-anywhere.herokuapp.com/http://stuff.mit.edu/afs/sipb/contrib/pi/pi-billion.txt';

const streamingResponse = (async () => {
  const response = await fetch(url);
  return response.body.getReader();
})();
render(html`π is: ${asyncAppend(streamingResponse)}`, document.body);
```

## cache

```jsx
cache(conditionalTemplate)
```

### Location: text bindings

Almacena en caché los nodos DOM renderizados para plantillas cuando no están en uso. El argumento `conditionalTemplate` es una expresión que puede devolver una de varias plantillas. `cache` representa el valor actual de `conditionalTemplate`. Cuando la plantilla cambia, la directiva almacena en caché los nodos DOM actuales antes de cambiar al nuevo valor.

Ejemplo:

```jsx
import {cache} from 'lit-html/directives/cache.js';

const detailView = (data) => html`<div>...</div>`;
const summaryView = (data) => html`<div>...</div>`;

html`${cache(data.showDetails
  ? detailView(data)
  : summaryView(data)
)}`
```

Cuando `lit-html` vuelve a renderizar una plantilla, solo actualiza las partes modificadas: no crea ni elimina más DOM del necesario. Pero cuando cambia de una plantilla a otra, `lit-html` necesita eliminar el DOM anterior y generar un nuevo árbol DOM.

La directiva de `caché` almacena en caché el DOM generado para un enlace y una plantilla de entrada determinados. En el ejemplo anterior, almacenaría en caché el DOM para las plantillas de `summaryView` y `detailView`. Cuando cambia de una vista a otra, `lit-html` solo necesita intercambiar la versión en caché de la nueva vista y actualizarla con los datos más recientes.

## classMap

```jsx
class=${classMap(classObj)}
```

### Location: attribute bindings (must be the only binding in the `class` attribute)

Establece una lista de clases basadas en un objeto. Cada clave del objeto se trata como un nombre de clase y, si el valor asociado con la clave es verdadero, esa clase se agrega al elemento.

```jsx
import {classMap} from 'lit-html/directives/class-map.js';

let classes = { highlight: true, enabled: true, hidden: false };

html`<div class=${classMap(classes)}>Classy text</div>`;
// renders as <div class="highlight enabled">Classy text</div>
```

El `classMap` debe ser el único enlace en el atributo de clase, pero se puede combinar con valores estáticos:

```jsx
html`<div class="my-widget ${classMap(dynamicClasses)}">Static and dynamic</div>`;
```

## ifDefined

```jsx
ifDefined(value)
```

### Location: attribute bindings

Para AttributeParts, establece el atributo si el valor está definido y elimina el atributo si el valor no está definido.

Para otros tipos de piezas, esta directiva no funciona.

Ejemplo:

```jsx
import {ifDefined} from 'lit-html/directives/if-defined';

const myTemplate = () => html`
  <img src="/images/${ifDefined(image.filename)}">
`;
```

## guard

```jsx
guard(dependencies, valueFn)
```

### Location: any

Representa el valor devuelto por `valueFn`. Solo vuelve a evaluar `valueFn` cuando una de las dependencias cambia de identidad.

Dónde:

- `dependencias` es una matriz de valores para monitorear los cambios. (Para compatibilidad con versiones anteriores, las `dependencias` pueden ser un valor único que no sea de matriz).
- `valueFn` es una función que devuelve un valor representable.

`guard` es útil con patrones de datos inmutables, al evitar un trabajo costoso hasta que se actualicen los datos.

Ejemplo:

```jsx
import {guard} from 'lit-html/directives/guard';

const template = html`
  <div>
    ${guard([immutableItems], () => immutableItems.map(item => html`${item}`))}
  </div>
`;
```

En este caso, la matriz `immutableItems` se asigna solo cuando cambia la referencia de la matriz.

## live

```jsx
attr=${live(value)}
```

### Location: attribute or property bindings

Comprueba el valor de vinculación con el valor DOM en vivo, en lugar del valor vinculado anteriormente, al determinar si actualizar el valor.

Esto es útil para los casos en los que el valor DOM puede cambiar desde fuera de `lit-html`. Por ejemplo, cuando se vincula a la propiedad de valor de un elemento `<input>`, al texto de un elemento de contenido editable o a un elemento personalizado que cambia sus propias propiedades o atributos.

En estos casos, si el valor DOM cambia, pero el valor establecido a través de enlaces `lit-html` no lo ha hecho, `lit-html` no sabrá actualizar el valor DOM y lo dejará solo. Si esto no es lo que desea, si desea sobrescribir el valor DOM con el valor vinculado sin importar qué, use la directiva live().

Ejemplo:

```jsx
html`<input .value=${live(x)}>`
```

`live()` realiza una verificación de igualdad estricta con el valor DOM en vivo, y si el nuevo valor es igual al valor en vivo, no hace nada. Esto significa que `live()` no debe usarse cuando el enlace provocará una conversión de tipo. Si usa `live()` con un enlace de atributo, asegúrese de que solo se pasen cadenas, o el enlace actualizará cada representación.

## repeat

```jsx
repeat(items, keyfn, template)
repeat(items, template)
```

### Location: text bindings

Repite una serie de valores (generalmente `TemplateResults`) generados a partir de un iterable y actualiza esos elementos de manera eficiente cuando cambia el iterable. Cuando se proporciona keyFn, la asociación de clave a DOM se mantiene entre actualizaciones moviendo DOM cuando sea necesario y, en general, es la forma más eficiente de usar la `repeat`, ya que realiza un trabajo innecesario mínimo para inserciones y eliminaciones.

Ejemplo:

```jsx
import {repeat} from 'lit-html/directives/repeat';

const myTemplate = () => html`
  <ul>
    ${repeat(items, (i) => i.id, (i, index) => html`
      <li>${index}: ${i.name}</li>`)}
  </ul>
`;
```

Si no se proporciona `keyFn`, `repeat` funcionará de manera similar a un mapa simple de elementos a valores, y DOM se reutilizará contra elementos potencialmente diferentes.

## styleMap

```jsx
style=${styleMap(styles)}
```

### Location: attribute bindings (must be the only binding in the `style` attribute)

La directiva `styleMap` establece estilos en un elemento basado en un objeto, donde cada clave en el objeto se trata como una propiedad de estilo y el valor se trata como el valor de esa propiedad. Por ejemplo:

```jsx
import {styleMap} from 'lit-html/directives/style-map.js';

let styles = { backgroundColor: 'blue', color: 'white' };
html`<p style=${styleMap(styles)}>Hello style!</p>`;
```

Para las propiedades CSS que contienen guiones, puede usar el equivalente en mayúsculas y minúsculas o poner el nombre de la propiedad entre comillas. Por ejemplo, puede escribir la propiedad CSS font-family como `fontFamily` o '`font-family`':

```jsx
{ fontFamily: 'roboto' }
{ 'font-family': 'roboto' }
```

El `styleMap` debe ser el único enlace en el atributo de estilo, pero se puede combinar con valores estáticos:

```jsx
html`<p style="color: white; ${styleMap(moreStyles)}">More styles!</p>`;
```

## templateContent

```jsx
templateContent(templateElement)
```

### Location: text bindings

Muestra el contenido de un elemento `<template>` como HTML.

Tenga en cuenta que el contenido de la plantilla debe ser controlado por el desarrollador y no por el usuario. Las plantillas controladas por el usuario representadas con esta directiva podrían generar vulnerabilidades XSS.

Ejemplo:

```jsx
import {templateContent} from 'lit-html/directives/template-content';

const templateEl = document.querySelector('template#myContent');

const template = html`
  Here's some content from a template element:

  ${templateContent(templateEl)}`;
```

## unsafeHTML

```jsx
unsafeHTML(html)
```

### Location: text bindings

Representa el argumento como HTML, en lugar de texto.

Tenga en cuenta que esto no es seguro de usar con cualquier entrada proporcionada por el usuario que no se haya desinfectado o escapado, ya que puede generar vulnerabilidades de secuencias de comandos entre sitios.

Ejemplo:

```jsx
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

const markup = '<div>Some HTML to render.</div>';
const template = html`
  Look out, potentially unsafe HTML ahead:
  ${unsafeHTML(markup)}
`;
```

## unsafeSVG

```jsx
unsafeSVG(svg)
```

### Location: text bindings

Representa el argumento como SVG, en lugar de texto.

Tenga en cuenta que esto no es seguro de usar con cualquier entrada proporcionada por el usuario que no se haya desinfectado o escapado, ya que puede generar vulnerabilidades de secuencias de comandos entre sitios.

Ejemplo:

```jsx
import {unsafeSVG} from 'lit-html/directives/unsafe-svg';

const svg = '<circle cx="50" cy="50" r="40" fill="red" />'

const template = html`
  Look out, potentially unsafe SVG ahead:
  <svg width="40" height="40" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${unsafeSVG(svg)}
  </svg> `;
```

## until

```jsx
until(...values)
```

### Location: any

Renderiza el contenido del placeholder hasta que el contenido final está disponible.

Toma una serie de valores, incluyendo Promesas. Los valores se representan en orden de prioridad, con el primer argumento que tiene la prioridad más alta y el último argumento que tiene la prioridad más baja. Si un valor es una Promesa, se representará un valor de menor prioridad hasta que se resuelva.

La prioridad de los valores se puede usar para crear contenido de marcador de posición para datos asíncronos. Por ejemplo, una promesa con contenido pendiente puede ser el primer argumento (prioridad más alta) y una plantilla de indicador de carga sin promesa puede usarse como segundo argumento (prioridad más baja). El indicador de carga se representa de inmediato y el contenido principal se representará cuando se resuelva la Promesa.

Ejemplo:

```jsx
import {until} from 'lit-html/directives/until.js';

const content = fetch('./content.txt').then(r => r.text());

html`${until(content, html`<span>Loading...</span>`)}`
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
