# Templates

# Introducción

Agregue una plantilla a su componente para definir DOM interno para implementar su componente.

Para encapsular el DOM con plantilla, LitElement usa shadow DOM. Shadow DOM proporciona tres beneficios:

- Alcance DOM. Las API de DOM como `document.querySelector` no encontrarán elementos en el DOM oculto del componente, por lo que es más difícil que los scripts globales rompan accidentalmente su componente.
- Alcance del estilo. Puede escribir estilos encapsulados para su shadow DOM que no afecten al resto del árbol DOM.
- Composición. El DOM oculto del componente (administrado por el componente) está separado de los elementos secundarios del componente. Puede elegir cómo se representan los niños en su DOM con plantilla. Los usuarios de componentes pueden agregar y eliminar elementos secundarios utilizando las API de DOM estándar sin romper accidentalmente nada en su DOM oculto.

Donde el shadow DOM nativo no está disponible, LitElement usa el polyfill Shady CSS.

# Definir y renderizar una plantilla

Para definir una plantilla para un componente LitElement, escriba una función de `render` para su clase de elemento:

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`<p>template content</p>`;
  }
}
```

- Escriba su plantilla en HTML dentro de un literal de plantilla de JavaScript encerrando el HTML sin procesar entre tildes **`(``)`**.
- Etiquete su literal de plantilla con la función de etiqueta `html`.
- El método de `render` del componente puede devolver cualquier cosa que lit-html pueda renderizar. Por lo general, devuelve un solo objeto `TemplateResult` (el mismo tipo devuelto por la función de etiqueta `html`).

### Ejemplo:

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {

  // Implement `render` to define a template for your element.
  render(){
    /**
     * Return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function.
     */
    return html`
      <div>
        <p>A paragraph</p>
      </div>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## Diseñe una plantilla eficaz

LitElement representa y vuelve a representar de forma asincrónica, actualizándose en respuesta a los cambios de propiedad por lotes (consulte Ciclo de vida de actualización de elementos para obtener más información).

Durante una actualización, solo se vuelven a representar las partes del DOM que cambian. Para obtener los beneficios de rendimiento de este modelo, debe diseñar la plantilla de su elemento como una función pura de sus propiedades.

Para hacer esto, asegúrese de que la función `render`:

- No cambia el estado del elemento.
- No tiene efectos secundarios.
- Solo depende de las propiedades del elemento.
- Devuelve el mismo resultado cuando se le dan los mismos valores de propiedad.

Además, evite realizar actualizaciones de DOM fuera del `renderizado`. En su lugar, exprese la plantilla del elemento como una función de su estado y capture su estado en propiedades.

El siguiente código utiliza una manipulación DOM ineficiente:

*dom-manip.js*

```jsx
// Anti-pattern. Avoid!

constructor() {
  super();
  this.addEventListener('stuff-loaded', (e) => {
    this.shadowRoot.getElementById('message').innerHTML=e.detail;
  });
  this.loadStuff();
}
render() {
  return html`
    <p id="message">Loading</p>
  `;
}
```

Podemos mejorar la plantilla declarando el mensaje como una propiedad y vinculando la propiedad a la plantilla. Declarar una propiedad le dice a su componente que vuelva a representar su plantilla cuando cambie la propiedad.

*update-properties.js*

```jsx
static get properties() {
  return {
    message: {type: String}
  }
}

constructor() {
  super();
  this.message = 'Loading';
  this.addEventListener('stuff-loaded', (e) => { this.message = e.detail } );
  this.loadStuff();
}
render() {
  return html`
    <p>${this.message}</p>
  `;
}
```

## Usar propiedades, bucles y condicionales en una plantilla

Enlace permanente a "Usar propiedades, bucles y condicionales en una plantilla"
Al definir la plantilla de su elemento, puede vincular las propiedades del elemento a la plantilla; la plantilla se vuelve a representar cada vez que cambian las propiedades.

### **Propiedades**

Para agregar un valor de propiedad a una plantilla, insértelo con `${this.propName}`:

```jsx
static get properties() {
  return {
    myProp: {type: String}
  };
}
...
render() {
  return html`<p>${this.myProp}</p>`;
}
```

### **Bucle**

Iterar sobre una matriz:

```jsx
html`<ul>
  ${this.myArray.map(i => html`<li>${i}</li>`)}
</ul>`;
```

> ℹ️ Repetir directiva. En la mayoría de los casos, `Array.map` es la forma más eficaz de crear una plantilla repetitiva. En algunos casos, es posible que desee considerar la directiva de `repeat` de lit-html. En particular, si los elementos repetidos tienen estado o son muy costosos de regenerar.
> 

### **********Condicionales**********

Renderizado basado en una condición booleana:

```jsx
html`
  ${this.myBool?
    html`<p>Render some HTML if myBool is true</p>`:
    html`<p>Render some other HTML if myBool is false</p>`}
`;
```

### ****************Ejemplo:****************

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      myString: { type: String },
      myArray: { type: Array },
      myBool: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.myString = 'Hello World';
    this.myArray = ['an','array','of','test','data'];
    this.myBool = true;
  }
  render() {
    return html`
      <p>${this.myString}</p>
      <ul>
        ${this.myArray.map(i => html`<li>${i}</li>`)}
      </ul>
      ${this.myBool?
        html`<p>Render some HTML if myBool is true</p>`:
        html`<p>Render some other HTML if myBool is false</p>`}
    `;
  }
}

customElements.define('my-element', MyElement);
```

## Enlazar propiedades a elementos con plantilla

Puede insertar expresiones JavaScript como marcadores de posición para contenido de texto HTML, atributos, atributos booleanos, propiedades y controladores de eventos.

- Contenido del texto: `<p>${...}</p>`
- Atributo: `<p id="${...}"></p>`
- Atributo booleano: `?disabled="${...}"`
- Propiedad: `.value="${...}"`
- Controlador de eventos: `@event="${...}"`

Las expresiones de JavaScript pueden incluir las propiedades de su elemento. LitElement observa y reacciona a los cambios de propiedad, por lo que sus plantillas se actualizan automáticamente.

Los enlaces de datos son siempre unidireccionales (de padre a hijo). Para compartir datos de un elemento secundario con su elemento principal, active un evento y capture los datos relevantes en la propiedad de `detail`.

### ******************************Bindeo a contenido texto******************************

Bindeo `prop1` a contenido de texto

```jsx
html`<div>${this.prop1}</div>`
```

### **Bindeo a atributo**

Bindeo `prop2` a un atributo

```jsx
html`<div id="${this.prop2}"></div>`
```

Los valores de atributo son siempre cadenas, por lo que un enlace de atributo debe devolver un valor que se pueda convertir en una cadena.

### **********************************************************Bindeo a un atributo booleano**********************************************************

Bindeo `prop3` a un atributo booleano

```jsx
html`<input type="text" ?disabled="${this.prop3}">`
```

Los atributos booleanos se agregan si la expresión se evalúa como un valor verdadero y se eliminan si se evalúa como un valor falso.

### **Bindeo a una propiedad**

Bindeo `prop4` a una propiedad

```jsx
html`<input type="checkbox" .value="${this.prop4}"/>`
```

### **************************************************************Bindeo a un manejador de evento**************************************************************

Bindeo `clickHandler` a un evento de `click`

```jsx
html`<button @click="${this.clickHandler}">pie?</button>`
```

El contexto de evento predeterminado para las expresiones `@event` es `this`, por lo que no es necesario vincular la función del controlador.

### Ejemplo:

*my-element.js*

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: {type: String},
      prop2: {type: String},
      prop3: {type: Boolean},
      prop4: {type: String}
    };
  }
  constructor() {
    super();
    this.prop1 = 'text binding';
    this.prop2 = 'mydiv';
    this.prop3 = true;
    this.prop4 = 'pie';
  }
  render() {
    return html`
      <!-- text binding -->
      <div>${this.prop1}</div>

      <!-- attribute binding -->
      <div id="${this.prop2}">attribute binding</div>

      <!-- boolean attribute binding -->
      <div>
        boolean attribute binding
        <input type="text" ?disabled="${this.prop3}"/>
      </div>

      <!-- property binding -->
      <div>
        property binding
        <input type="text" .value="${this.prop4}"/>
      </div>

      <!-- event handler binding -->
      <div>event handler binding
        <button @click="${this.clickHandler}">click</button>
      </div>
    `;
  }
  clickHandler(e) {
    console.log(e.target);
  }
}

customElements.define('my-element', MyElement);
```

## Renderiza un hijo con un elemento slot

Tu componente podría aceptar un hijo (como un elemento `<ul>` puede contener ****`<li>` hijos)

```jsx
<my-element>
  <p>A child</p>
</my-element>
```

De forma predeterminada, si un elemtno tiene un árbol de sombras, sus elementos secundarios no se representan en absoluto.

Para representar elemento secundarios, su plantilla deb incluir uno o más elementos ****`<slot>` ****que actúan como marcadores de posición para los nodos secundarios.

### ******************************************Usar un elemento slot******************************************

Para renderizar los elementos secundarios de un elemento, cree un `<slot>` ****para ellos en la plantilla del elemento. Por ejemplo:

```jsx
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

Los niños ahora renderizarán en el `<slot>`

```jsx
<my-element>
  <p>Render me</p>
</my-element>
```

Los hijos no se mueven en el árbol DOM, pero se representan como si fueran hijos del `<slot>`.

De manera arbitraria, muchos niños pueden llenar un solo espacio:

```jsx
<my-element>
  <p>Render me</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

### ********************Usando nombres slots********************

Para asignar un hijo a un espacio específico, asegúrese de que el atributo de ****`slot` del hijo coincida con el atributo de `nombre` del slot:

```jsx
render(){
  return html`
    <div>
      <slot name="one"></slot>
    </div>
  `;
}
```

*index.html*

```jsx
<my-element>
  <p slot="one">Include me in slot "one".</p>
</my-element>
```

- Los `slots` con nombre solo aceptan hijos con un atributo de slot coincidente

Por ejemplo, `<slot name=”one”></slot>` solo acepta hijos con el atributo `slot=”one”`

- Los hijos con un atributo slot solo se debería renderizar en un slot con una concidencia en el atributo name

Por ejemplo, `<p slot=”one”>….</p>` solo se colocorá en `<slot name=”one></slot>` 

### Ejemplo

*my-element.js*

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render(){
    return html`
      <div>
        <slot name="one"></slot>
        <slot name="two"></slot>
      </div>
    `;
  }
}
customElements.define('my-element', MyElement);
```

*index.html*

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
  <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>

  <script type="module" src="./my-element.js"></script>
  <title>lit-element code sample</title>
</head>
<body>
    <!-- Assign child to a specific slot -->

    <my-element>
      <p slot="two">Include me in slot "two".</p>
    </my-element>

    <!--
      Named slots only accept children with a matching `slot` attribute.

      Children with a `slot` attribute can only go into a slot with a matching name.
    -->

    <my-element>
      <p slot="one">Include me in slot "one".</p>
      <p slot="nope">This one will not render at all.</p>
      <p>No default slot, so this one won't render either.</p>
    </my-element>
</body>
</html>
```

### ******************Use `name`, no `id` para seleccionar el slots**

¡Tenga en cuenta que el atributo id de un slot no tiene ningún efecto!

*my-element.js*

```jsx
render(){
  return html`
    <div>
      <slot id="one"></slot>
    </div>
  `;
}
```

*index.html*

```jsx
<my-element>
  <p slot="one">nope.</p>
  <p>ohai..</p>
</my-element>
```

# Componer una plantilla a partir de otras plantillas

Puede componer plantillas de LitElement a partir de otras plantillas de LitElement. En el siguiente ejemplo, creamos una plantilla para un elemento llamado `<mi-página>` ****a partir de plantillas más pequeñas para el encabezado, el pie de página y el contenido principal de la página:

```jsx
function headerTemplate(title) {
    return html`<header>${title}</header>`;
  }
  function articleTemplate(text) {
    return html`<article>${text}</article>`;
  }
  function footerTemplate() {
    return html`<footer>Your footer here.</footer>`;
  }

class MyPage extends LitElement {
  ...
  render() {
    return html`
      ${headerTemplate(this.article.title)}
      ${articleTemplate(this.article.text)}
      ${footerTemplate()}
    `;
  }
}
```

También puede componer plantillas importando otros elementos y usándolos en su plantilla:

```jsx
import './my-header.js';
import './my-article.js';
import './my-footer.js';

class MyPage extends LitElement {
  render() {
    return html`
      <my-header></my-header>
      <my-article></my-article>
      <my-footer></my-footer>
    `;
  }
}
```

# Especificar la raíz de renderizado

El nodo en el que se representará la plantilla de su componente se denomina render root.

De forma predeterminada, LitElement crea un `shadowRoot` abierto y renderiza dentro de él, produciendo la siguiente estructura DOM:

```jsx
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

Para personalizar render root de un componente, implemente ****`createRenderRoot` ****y devuelva el nodo en el que desea que se represente la plantilla.

Por ejemplo, para representar la plantilla en el árbol DOM principal como elementos secundarios de su elemento:

```jsx
<my-element>
  <p>child 1</p>
  <p>child 2</p>
```

Implementando `createRenderRoot` y retorna this

```jsx
class LightDom extends LitElement {
  render() {
    return html`
      <p>This template renders without shadow DOM.</p>
    `;
  }
  createRenderRoot() {
  /**
   * Render template without shadow DOM. Note that shadow DOM features like
   * encapsulated CSS and slots are unavailable.
   */
    return this;
  }
}
```

# Sintaxis template cheat sheet

### ************Render************

```jsx
render() { return html`<p>template</p>`; }
```

### ****************************Properties, loops, conditionals****************************

```jsx
// Property
html`<p>${this.myProp}</p>`;

// Loop
html`${this.myArray.map(i => html`<li>${i}</li>`)}`;

// Conditional
html`${this.myBool?html`<p>foo</p>`:html`<p>bar</p>`}`;
```

### ************************Data binding************************

```jsx
// Attribute
html`<p id="${...}">`;

// Boolean attribute
html`<input type="text" ?disabled="${...}">`;

// Property
html`<input .value="${...}">`;

// Event handler
html`<button @click="${this.doStuff}"></button>`;
```

### **********************Composition**********************

```jsx
// From multiple templates on same class

render() {
  return html`
    ${this.headerTemplate}
    <article>article</article>
  `;
}
get headerTemplate() {
  return html`<header>header</header>`;
}
```

```jsx
// By importing elements
import './my-header.js';

class MyPage extends LitElement{
  render() {
    return html`
      <my-header></my-header>
      <article>article</article>
    `;
  }
}
```

### ********Slot********

```jsx
render() { return html`<slot name="thing"></slot>`; }
```

```jsx
<my-element>
  <p slot="thing">stuff</p>
</my-element>
```

# Usando otras caracteristicas de lit-html

Dado que litelement utiliza la función de etiqueta HTML Lit-HTML para definir plantillas, puede aprovechar toda la función de lit-HTML establecida para escribir sus plantillas. Esto incluye directivas lit-html, funciones especiales que personalizan la forma en que Lit-HTML hace que sea vinculante.

Para importar funciones directamente de Lit-HTML, su proyecto debe agregar Lit-HTML como una dependencia directa. Recomendamos utilizar el rango de versión práctico más amplio para LIT-HTML, para minimizar la posibilidad de que NPM instale dos versiones diferentes de Lit-HTML:

```jsx
npm i lit-element@^2.0.0
npm i lit-html@^1.0.0
```

## ****Import and use a lit-html directive****

```jsx
import { LitElement, html } from 'lit-element';
import { until } from 'lit-html/directives/until.js';

const content = fetch('./content.txt').then(r => r.text());

html`${until(content, html`<span>Loading...</span>`)}`
```

# Accediendo a nodos en el shadow DOM

El resultado del método `render()` generalmente se representa en shadow DOM, por lo que los nodos no son hijos directos del componente. Use t`his.shadowRoot.querySelector()` o `this.shadowRoot.querySelectorAll()` para buscar nodos en el DOM oculto.

Puede consultar el DOM con plantilla después de su renderizado inicial (por ejemplo, en `firstUpdated`), o usar un patrón captador, como este:

```jsx
get _closeButton() {
  return this.shadowRoot.querySelector('#close-button');
}
```

LitElement proporciona un conjunto de decoradores que proporcionan una forma abreviada de definir captadores como este.

## @query, @queryAll, and @queryAsync decoratos

Los decoradores `@query`, `@queryAll` y `@queryAsync` proporcionan una manera conveniente de acceder a los nodos en la raíz oculta del componente.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores. Consulte Uso de decoradores para obtener más detalles.
> 

El decorador `@query` modifica una propiedad de clase, convirtiéndola en un captador que devuelve un nodo desde la raíz de representación. El segundo argumento opcional es un indicador de caché que, cuando es verdadero, realiza la consulta DOM solo una vez y almacena en caché el resultado. Esto se puede usar como una optimización del rendimiento en los casos en que no se espera que cambie el nodo que se consulta.

```jsx
import {LitElement, html} from 'lit-element';
import {query} from 'lit-element/lib/decorators.js';

class MyElement extends LitElement {
  @query('#first')
  _first;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```

Este decorador equivale a

```jsx
get first() {
  return this.renderRoot.querySelector('#first');
}
```

> ℹ️ `shadowRoot` y `renderRoot`. La propiedad renderRoot identifica el contenedor en el que se representa la plantilla. Por defecto, este es el shadowRoot del componente. Los decoradores usan `renderRoot`, por lo que deberían funcionar correctamente incluso si anulas createRenderRoot como se describe en Especificar la raíz de renderizado.
> 

El decorador `@queryAll` es idéntico a query excepto que devuelve todos los nodos coincidentes, en lugar de un solo nodo. Es el equivalente a llamar a `querySelectorAll`.

```jsx
import {LitElement, html} from 'lit-element';
import {queryAll} from 'lit-element/lib/decorators.js';

class MyElement extends LitElement {
  @queryAll('div')
  _divs;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```

Aquí, **divs** devolvería ambos elementos `<div>` en la plantilla. Para TypeScript, la escritura de una propiedad `@queryAll` es `NodeListOf<HTMLElement>`. Si sabe exactamente qué tipo de nodos recuperará, la escritura puede ser más específica:

```jsx
@queryAll('button')
_buttons!: NodeListOf<HTMLButtonElement>
```

El signo de exclamación (!) después de los botones es el operador de aserción no nulo de TypeScript. Le dice al compilador que trate los botones como si estuvieran siempre definidos, nunca nulos o indefinidos.

Finalmente, `@queryAsync` funciona como `@query`, excepto que en lugar de devolver un nodo directamente, devuelve una Promesa que se resuelve en ese nodo. El código puede usar esto en lugar de esperar la promesa updateComplete.

Esto es útil, por ejemplo, si el nodo devuelto por `@queryAsync` puede cambiar como resultado de otro cambio de propiedad.

# Accediendo a slotted hijos

Para acceder a los elementos secundarios asignados a las ranuras(slot) en su shadow root, puede usar el método estándar `slot.assignedNodes` y el evento `slotchange`.

Por ejemplo, puede crear un getter para acceder a los nodos asignados para una ranura en particular:

```jsx
get _slottedChildren() {
  const slot = this.shadowRoot.querySelector('slot');
  const childNodes = slot.assignedNodes({flatten: true});
  return Array.prototype.filter.call(childNodes, (node) => node.nodeType == Node.ELEMENT_NODE);
}
```

También puede usar el evento `slotchange` para tomar medidas cuando cambien los nodos asignados. El siguiente ejemplo extrae el contenido de texto de todos los niños ranurados.

```jsx
handleSlotchange(e) {
  const childNodes = e.target.assignedNodes({flatten: true});
  // ... do something with childNodes ...
  this.allText = Array.prototype.map.call(childNodes, (node) => {
    return node.textContent ? node.textContent : ''
  }).join('');
}

render() {
  return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
}
```

## @queryAssignedNodes decorator

El decorador `@queryAssignedNodes` convierte una propiedad de clase en un captador que devuelve todos los nodos asignados para un espacio determinado en el árbol de sombra del componente. El segundo argumento booleano opcional cuando es verdadero aplana los nodos asignados, lo que significa que los nodos asignados que son elementos de ranura se reemplazan con sus nodos asignados. El tercer argumento opcional es un selector css que filtra los resultados a los elementos coincidentes.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores. Consulte Uso de decoradores para obtener más detalles.
> 

```jsx
// First argument is the slot name
// Second argument is `true` to flatten the assigned nodes.
@queryAssignedNodes('header', true)
_headerNodes;

// If the first argument is absent or an empty string, list nodes for the default slot.
@queryAssignedNodes()
_defaultSlotNodes;
```

El primer ejemplo anterior es equivalente al siguiente código:

```jsx
get headerNodes() {
  const slot = this.shadowRoot.querySelector('slot[name=header]');
  return slot.assignedNodes({flatten: true});
}
```

Para TypeScript, la escritura de una propiedad `queryAssignedNodes` es `NodeListOf<HTMLElement>`.

---

[Lit](https://www.notion.so/Lit-13144b9059a343a78a06bf01f232b449)
