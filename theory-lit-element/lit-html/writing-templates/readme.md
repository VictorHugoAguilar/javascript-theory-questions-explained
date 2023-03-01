# Writing templates

`lit-html` es una biblioteca de plantillas que proporciona una representación y actualización rápidas y eficientes de HTML. Le permite expresar la interfaz de usuario web en función de los datos.

Esta sección introduce las características y conceptos principales en `lit-html`.

# Render static HTML

Lo más simple de hacer en `lit-html` es representar un poco de HTML estático.

```jsx
import { html, render } from "lit-html";

// Declare a template
const myTemplate = html`<div>Hello World</div>`;

// Render the template
render(myTemplate, document.body);
```

La plantilla`lit-html` es una plantilla etiquetada literal. La plantilla en sí parece una cadena de JavaScript regular, pero encerrada en backticks `(`)`en lugar de citas. El navegador pasa la cadena a la función de etiqueta HTML de`lit-html`.

La función de etiqueta HTML devuelve un `lit-html`, un objeto liviano que representa la plantilla que se representará.

La función de `render` en realidad crea nodos DOM y los agrega a un árbol DOM. En este caso, el DOM representado reemplaza el contenido de la etiqueta del cuerpo del documento.

# Render dinamico contenido de texto

No puedes llegar muy lejos con una plantilla estática. `lit-html` le permite crear enlaces usando `${expresión}` marcadores de posición en la plantilla literal:

```jsx
const aTemplate = html`<h1>${title}</h1>`;
```

Para que su plantilla sea dinámica, puede crear una función de plantilla. Llame a la función de plantilla cada vez que cambie sus datos.

```jsx
import { html, render } from "lit-html";

// Define a template function
const myTemplate = (name) => html`<div>Hello ${name}</div>`;

// Render the template with some data
render(myTemplate("world"), document.body);

// ... Later on ...
// Render the template with different data
render(myTemplate("lit-html"), document.body);
```

Cuando llama a la función de plantilla, `lit-html` captura los valores de expresión de corriente. La función de plantilla no crea ningún nodo DOM, por lo que es rápido y barato.

La función de plantilla devuelve un `TemplaterSult` que es una función de los datos de entrada. Este es uno de los principios principales detrás del uso de`lit-html`: **creando UI en función del estado**.

Cuando llamas a Render, `lit-html` **solo actualiza las partes de la plantilla que han cambiado desde el último render.** Esto hace que las actualizaciones de `lit-html` sean muy rápidas.

# Usando expresiones

El ejemplo anterior muestra la interpolación de un valor de texto simple, pero el enlace puede incluir cualquier tipo de expresión de JavaScript:

```jsx
const myTemplate = (subtotal, tax) => html`<div>Total: ${subtotal + tax}</div>`;
const myTemplate2 = (name) => html`<div>${formatName(name.given, name.family, name.title)}</div>`;
```

# Bindeo a atributos

Además de usar expresiones en el contenido de texto de un nodo, también puede vincularlas al atributo y los valores de propiedad de un nodo.

Por defecto, una expresión en el valor de un atributo crea un enlace de atributo:

```jsx
// set the class attribute
const myTemplate = (data) => html`<div class=${data.cssClass}>Stylish text.</div>`;
```

Dado que los valores de los atributos son siempre cadenas, la expresión debe devolver un valor que se puede convertir en una cadena.

Utilizar el `?` prefijo para una vinculación de atributos booleanos. El atributo se agrega si la expresión se evalúa a un valor de verdad, eliminado si se evalúa a un valor de falsificación:

```jsx
const myTemplate2 = (data) => html`<div ?disabled=${!data.active}>Stylish text.</div>`;
```

# Bindeo a propiedades

También puede unirse a las propiedades de JavaScript de un nodo utilizando el `.` prefijo y el nombre de la propiedad:

```jsx
const myTemplate3 = (data) => html`<input .value=${data.value}></input>`;
```

Puede usar enlaces de propiedades para pasar datos complejos en el árbol a subcomponentes. Por ejemplo, si tiene un componente `my-list` con una propiedad `ListItems`, puede pasarlo una variedad de objetos:

```jsx
const myTemplate4 = (data) => html`<my-list .listItems=${data.items}></my-list>`;
```

Tenga en cuenta que el nombre de la propiedad en este ejemplo, `listitems`, es un caso mixto. Aunque los atributos HTML son insensibles al caso, `lit-html` conserva el caso cuando procesa la plantilla.

# Añadir event listeners

Las plantillas también pueden incluir oyentes de eventos declarativos. Un oyente de eventos parece un atributo vinculante, pero con el prefijo `@` seguido de un nombre de evento:

```jsx
const myTemplate = () => html`<button @click=${clickHandler}>Click Me!</button>`;
```

Esto es equivalente a llamar a `addEventListener('clic', ClickHandler)` en el elemento del botón.

El oyente de eventos puede ser una función simple o un objeto con un método `HandleEvent`:

```jsx
const clickHandler = {
  // handleEvent method is required.
  handleEvent(e) {
    console.log("clicked!");
  },
  // event listener objects can also define zero or more of the event
  // listener options: capture, passive, and once.
  capture: true,
};
```

> ℹ️ Objetos del oyente de eventos. Cuando especifica un oyente que usa un objeto de oyente de eventos, el objeto del oyente en sí se establece como el contexto del evento (valor `this`).

# Anidar y componenter templates

También puede componer plantillas para crear plantillas más complejas. Cuando un enlace en el contenido de texto de una plantilla devuelve un `TemplaterSult`, el `TemplaterSult` se interpola en su lugar.

```jsx
const myHeader = html`<h1>Header</h1>`;
const myPage = html`
  ${myHeader}
  <div>Here's my main page.</div>
`;
```

Puede usar cualquier expresión que devuelva una `TemplaterSult`, como otra función de plantilla:

```jsx
// some complex view
const myListView = (items) =>
  html`<ul>
    ...
  </ul>`;

const myPage = (data) => html` ${myHeader} ${myListView(data.items)} `;
```

La composición de plantillas abre una serie de posibilidades, incluidas plantillas condicionales y repetidas.

## Condicional templates

`lit-html`no tiene construcciones de flujo de control incorporadas. En su lugar, usa expresiones y declaraciones de JavaScript normales.

### Condicionales con operadores ternarios

Las expresiones ternarias son una excelente manera de agregar condicionales en línea:

```jsx
html` ${user.isloggedIn ? html`Welcome ${user.name}` : html`Please log in`} `;
```

### Condicionales con declaraciones if

Puede expresar la lógica condicional con declaraciones IF fuera de una plantilla para calcular los valores para usar dentro de la plantilla:

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

## Template de repetición

Puede usar construcciones de JavaScript estándar para crear plantillas de repetición.

`lit-html` también proporciona algunas funciones especiales, llamadas directivas, para su uso en plantillas. Puede usar la directiva repetida para construir ciertos tipos de listas dinámicas de manera más eficiente.

### Repetir plantillas con Array.map

Para representar listas, puede usar `Array.map` para transformar una lista de datos en una lista de plantillas:

```jsx
html`
  <ul>
    ${items.map((item) => html`<li>${item}</li>`)}
  </ul>
`;
```

Tenga en cuenta que esta expresión devuelve una matriz de objetos `TemplaterSult`. `lit-html` hará una matriz o iterable de subtemplataciones y otros valores.

### Repetir templates con declaraciones de bucle

También puede construir una variedad de plantillas y pasarla a una unión de plantilla.

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

### Repetir plantillas con la directiva repetida

En la mayoría de los casos, el uso de bucles o `Array.map` es una forma eficiente de construir plantillas de repetición. Sin embargo, si desea reordenar una lista grande o mutarla agregando y eliminando entradas individuales, este enfoque puede implicar recrear una gran cantidad de nodos DOM.

La directiva `repeat` puede ayudar aquí. Las directivas son funciones especiales que proporcionan control adicional sobre la representación.`lit-html` viene con algunas directivas incorporadas como `repeat`.

La directiva repetida realiza actualizaciones eficientes de listas basadas en claves proporcionadas por el usuario:

`repeat(items, KeyFunction, itemTemplate)`

Dónde:

- `items` es una matriz o iterable.
- `KeyFunction` es una función que toma un solo elemento como argumento y devuelve una clave única garantizada para ese elemento.
- `itemTemplate` es una función de plantilla que toma el elemento y su índice actual como argumentos, y devuelve un TemplaterSult.

Por ejemplo:

```jsx
import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";

const employeeList = (employees) => html`
  <ul>
    ${repeat(
      employees,
      (employee) => employee.id,
      (employee, index) => html` <li>${index}: ${employee.familyName}, ${employee.givenName}</li> `
    )}
  </ul>
`;
```

Si vuelve a sesgar la matriz de empleados, la directiva repetida reorden los nodos DOM existentes.

Para comparar esto con el manejo predeterminado de `lit-html` para listas, considere revertir una gran lista de nombres:

- Para una lista creada usando `Array.map`, `lit-html` mantiene los nodos DOM para los elementos de la lista, pero reasigna los valores.
- Para una lista creada usando `repeat`, la directiva `repeat` reorden los nodos DOM existentes, por lo que los nodos que representan el primer elemento de lista se mueven a la última posición.

La repetición es más eficiente depende de su caso de uso: si actualizar los nodos DOM es más costoso que moverlos, use la directiva repetida. De lo contrario, use declaraciones `Array.map` o de bucle.

## Renderizando nada

A veces, es posible que desee dejar nada en absoluto. Los valores `undefined`, `null` y la cadena vacía `('')` en un texto que vincula, todos representan un nodo de texto vacío. En la mayoría de los casos, eso es exactamente lo que quieres:

```jsx
import {html} from 'lit-html';
${user.isAdmin
      ? html`<button>DELETE</button>`
      : ''
  }
```

En algunos casos, no desea dejar nada en absoluto. En estos casos, puede usar el valor `nothing` proporcionado por `lit-html`.

```jsx
import {html, nothing} from 'lit-html';
${user.isAdmin
      ? html`<button>DELETE</button>`
      : nothing
  }
```

En este caso, cuando user.isadmin es falso, no se representa ningún nodo de texto.

### Nada y el contenido de alojamiento de la ranura

Un caso de uso específico donde un nodo de texto vacío causa problemas es cuando está utilizando un elemento `<slot>` dentro de una raíz de sombra.

Este caso de uso es muy específico para Shadow DOM, y probablemente no lo encuentre a menos que esté utilizando `lit-html` como parte del litelamento u otra clase base de componentes web.

Imagine que tiene un elemento personalizado, `example-element`, que tiene una ranura en su Sombra Dom:

```jsx
html`<slot>Sorry, no content available. I am just fallback content</slot>`;
```

La ranura define el contenido respaldo para cuando no hay contenido definido para ponerse en la ranura.

Entonces, extendiendo el ejemplo anterior:

```jsx
import { nothing, html } from "lit-html";

html`
  <example-element>${user.isAdmin ? html`<button>DELETE</button>` : nothing}</example-element>
`;
```

Si el usuario inicia sesión, se representa el botón Eliminar. Si el usuario no se inicia, nada se representa dentro del elemento de ejemplo. Esto significa que la ranura está vacía y su contenido respaldo "Lo siento, no hay contenido disponible. Solo soy contenido respirado".

Reemplazar `nothing` en este ejemplo con la cadena vacía hace que un nodo de texto vacío se presente dentro del elemento de ejemplo, suprimiendo el contenido respaldo.

**Whitpace crea nodos de texto**. Para que el ejemplo funcione, el texto vinculante dentro de `<sample-Esement>` debe ser el contenido completo de `<scampion-element>`. Cualquier espacio en blanco fuera de los delimitadores de encuadernación agrega nodos de texto estáticos a la plantilla, suprimiendo el contenido de retroceso. Sin embargo, el espacio en blanco dentro de los delimitadores vinculantes está bien.

Los dos ejemplos siguientes muestran un elemento con espacio en blanco adicional que rodea a los delimitadores vinculantes.

```jsx
// Whitespace around the binding means the fallback content
// doesn't render
html` <example-element> ${nothing} </example-element> `;
// Line breaks count as whitespace, too
html` <example-element> ${nothing} </example-element> `;
```

# **Caching template results: the cache directive**

En la mayoría de los casos, los condicionales de JavaScript son todo lo que necesita para plantillas condicionales. Sin embargo, si está cambiando entre plantillas grandes y complicadas, es posible que desee ahorrar el costo de recrear DOM en cada interruptor.

En este caso, puede usar la Directiva `Cache`. Las directivas son funciones especiales que proporcionan control adicional sobre la representación. La Directiva `Cache` almacena DOM para plantillas que no se están presentando actualmente.

```jsx
import { html } from "lit-html";
import { cache } from "lit-html/directives/cache.js";

const detailView = (data) => html`<div>...</div>`;
const summaryView = (data) => html`<div>...</div>`;

html`${cache(data.showDetails ? detailView(data) : summaryView(data))}`;
```

Cuando `lit-html`vuelve a representar una plantilla, solo actualiza las porciones modificadas: no crea ni elimina más DOM de lo que debe. Pero cuando cambia de una plantilla a otra, `lit-html` necesita eliminar el DOM antiguo y representar un nuevo árbol DOM.

La Directiva Cache almacena el DOM generado para una plantilla de enlace y entrada dada. En el ejemplo anterior, caché el DOM para los template `summaryView` y `detailView`. Cuando cambia de una vista a otra, `lit-html` solo necesita intercambiar la versión en caché de la nueva vista y actualizarla con los últimos datos.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
