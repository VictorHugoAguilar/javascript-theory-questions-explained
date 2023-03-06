# Working with Shadow DOM

# Introducción

Los componentes iluminados usan shadow DOM para encapsular su DOM. Shadow DOM proporciona una forma de agregar un árbol DOM aislado y encapsulado separado a un elemento. La encapsulación DOM es la clave para desbloquear la interoperabilidad con cualquier otro código, ***incluidos otros componentes web o componentes de Lit***, que funcione en la página.

Shadow DOM proporciona tres beneficios:

- **Alcance DOM**. Las API de DOM como `document.querySelector` no encontrarán elementos en el DOM oculto del componente, por lo que es más difícil que los scripts globales rompan accidentalmente su componente.
- **Style scoping** (alcance del estilo). Puede escribir estilos encapsulados para su shadow DOM que no afecten al resto del árbol DOM.
- **Composición**. El shadown root del componente, que contiene su DOM interno, está separada de los elementos secundarios del componente. Puede elegir cómo se representan los elementos secundarios en el DOM interno de su componente.

Para obtener más información sobre shadow DOM:

- [Shadow DOM v1](https://web.dev/shadowdom-v1/): componentes web autónomos sobre fundamentos web.
- Usando shadow [DOM en MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

> `ℹ️`Navegadores más antiguos. En navegadores más antiguos en los que el Shadow DOM nativo no está disponible, se pueden usar los polyfills de componentes web. Tenga en cuenta que el módulo de soporte de polyfill de Lit debe cargarse junto con los polyfills de los componentes web. Consulte Requisitos para navegadores heredados para obtener más información.
> 

# Accessing nodes in the shadow DOM

Lit renderiza los componentes a su `renderRoot`, que es una raíz oculta por defecto. Para encontrar elementos internos, puede usar las API de consulta DOM, como `this.renderRoot.querySelector()`.

`RenderRoot` siempre debe ser una raíz oculta o un elemento, que comparten API como `.querySelectorAll()` y `.children`.

Puede consultar el DOM interno después de la representación inicial del componente (por ejemplo, en `firstUpdated`) o usar un patrón captador:

```jsx
firstUpdated() {
  this.staticNode = this.renderRoot.querySelector('#static-node');
}

get _closeButton() {
  return this.renderRoot.querySelector('#close-button');
}
```

LitElement proporciona un conjunto de decoradores que proporcionan una forma abreviada de definir captadores como este.

## @query, @queryAll, and @queryAsync decorators

Los decoradores `@query`, `@queryAll` y `@queryAsync` proporcionan una manera conveniente de acceder a los nodos en el DOM del componente interno.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores.
> 

### @query

Modifica una propiedad de clase, convirtiéndola en un captador que devuelve un nodo desde la raíz de representación. El segundo argumento opcional cuando es verdadero realiza la consulta DOM solo una vez y almacena en caché el resultado. Esto se puede usar como una optimización del rendimiento en los casos en que el nodo que se consulta no cambiará.

```jsx
import {LitElement, html} from 'lit';
import {query} from 'lit/decorators/query.js';

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

Este decorador es equivalente a:

```jsx
get _first() {
  return this.renderRoot?.querySelector('#first') ?? null;
}
```

### @queryAll

Idéntico a `query` excepto que devuelve todos los nodos coincidentes, en lugar de un solo nodo. Es el equivalente a llamar a `querySelectorAll`.

```jsx
import {LitElement, html} from 'lit';
import {queryAll} from 'lit/decorators/queryAll.js';

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

Aquí, `_divs` devolvería ambos elementos `<div>` en la plantilla. Para TypeScript, la escritura de una propiedad `@queryAll` es `NodeListOf<HTMLElement>`. Si sabe exactamente qué tipo de nodos recuperará, la escritura puede ser más específica:

```jsx
@queryAll('button')
_buttons!: NodeListOf<HTMLButtonElement>
```

El signo de exclamación (`!`) después de los `buttons` es el operador de aserción no nulo de TypeScript. Le dice al compilador que trate los `buttons` como si estuvieran siempre definidos, nunca `null` o `undefined`.

### @queryAsync

Similar a `@query`, excepto que en lugar de devolver un nodo directamente, devuelve una `Promesa` que se resuelve en ese nodo después de que se completa la representación de cualquier elemento pendiente. El código puede usar esto en lugar de esperar la promesa `updateComplete`.

Esto es útil, por ejemplo, si el nodo devuelto por `@queryAsync` puede cambiar como resultado de otro cambio de propiedad.

# Rendering children with slots

El componente puede aceptar hijos (como un elemento `<ul>` puede tener hijos `<li>`).

```jsx
<my-element>
  <p>A child</p>
</my-element>
```

De forma predeterminada, si un elemento tiene un árbol de sombras, sus elementos secundarios no se representan en absoluto.

Para representar elementos secundarios, su plantilla debe incluir uno o más elementos `<slot>`, que actúan como marcadores de posición para los nodos secundarios.

## Using the slot element

Para renderizar los elementos secundarios de un elemento, cree un `<slot>` para ellos en la plantilla del elemento. Los hijos no se mueven en el árbol DOM, pero se representan como si fueran hijos del `<slot>`. Por ejemplo:

*index.html*

```jsx
<script type="module" src="./my-element.js"></script>

<my-element>
  <p>Render me in a slot</p>
</my-element>

<hr>

<my-element>
  <p>Render me in a slot</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

*my-element.js*

```jsx
import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  render() {
    return html`
      <p>
        <slot></slot>
      </p>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## Using named slots

Para asignar un hijo a un espacio específico, asegúrese de que el atributo de espacio del hijo coincida con el atributo de nombre del espacio:

- **Los slot con nombre solo aceptan niños con un atributo de `slot` coincidente**.
    
    Por ejemplo, `<slot name="one"></slot>` solo acepta hijos con el atributo `slot="one"`.
    
- **Los niños con un atributo de espacio solo se representarán en un espacio con un atributo de `name` coincidente**.
    
    Por ejemplo, `<p slot="one">...</p>` solo se colocará en `<slot name="one"></slot>`.
    

*index.html*

```jsx
<script type="module" src="./my-element.js"></script>

<my-element>
  <p slot="two">Include me in slot "two".</p>
</my-element>

<hr>

<my-element>
  <p slot="one">Include me in slot "one".</p>
  <p slot="nope">This one will not render at all.</p>
  <p>No default slot, so this one won't render either.</p>
</my-element>
```

*my-element.js*

```jsx
import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  render() {
    return html`
      <p>
        <slot name="one"></slot>
        <slot name="two"></slot>
      </p>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## Especificación del contenido alternativo del slot

Puede especificar contenido alternativo para un slot. El contenido alternativo se muestra cuando no se asigna ningún niño al slot.

```jsx
<slot>I am fallback content</slot>
```

> ℹ️ Procesamiento de contenido alternativo. Si se asignan nodos secundarios a una ranura, su contenido alternativo no se procesa. Una ranura predeterminada sin nombre acepta cualquier nodo secundario. No representará el contenido alternativo incluso si los únicos nodos asignados son nodos de texto que contienen espacios en blanco, por ejemplo, `<example-element> </example-element>`. Al usar una expresión Lit como un elemento secundario de un elemento personalizado, asegúrese de usar un valor que no se represente cuando sea apropiado para que se represente cualquier contenido alternativo de la ranura.
> 

# Accessing slotted children

Para acceder a los elementos secundarios asignados a las ranuras en su shadow root, puede usar los métodos estándar `slot.assignedNodes` o `slot.assignedElements` con el evento `slotchange`.

Por ejemplo, puede crear un getter para acceder a los elementos asignados para un `slot` en particular:

```jsx
get _slottedChildren() {
  const slot = this.shadowRoot.querySelector('slot');
  return slot.assignedElements({flatten: true});
}
```

También puede usar el evento `slotchange` para tomar medidas cuando cambien los nodos asignados. El siguiente ejemplo extrae el contenido de texto de todos los niños `slot`.

```jsx
handleSlotchange(e) {
  const childNodes = e.target.assignedNodes({flatten: true});
  // ... do something with childNodes ...
  this.allText = childNodes.map((node) => {
    return node.textContent ? node.textContent : ''
  }).join('');
}

render() {
  return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
}
```

## @queryAssignedElements and @queryAssignedNodes decorators

`@queryAssignedElements` y `@queryAssignedNodes` convierten una propiedad de clase en un getter que devuelve el resultado de llamar a slot.assignedElements o slot.assignedNodes respectivamente en una ranura dada en el árbol de sombra del componente. Utilícelos para consultar los elementos o nodos asignados a un espacio determinado.

Ambos aceptan un objeto opcional con las siguientes propiedades:

| Property | Description |
| --- | --- |
| flatten | Booleano que especifica si aplanar los nodos asignados reemplazando cualquier hijo <slot> elementos con sus nodos asignados. |
| slot | Nombre del slot que especifica la slot a consultar. Deje sin definir para seleccionar la slot predeterminada. |
| selector (queryAssignedElements only) | Si se especifica, solo devuelve elementos asignados que coincidan con este selector de CSS. |

Decidir qué decorador usar depende de si desea consultar los nodos de texto asignados a la ranura o solo los nodos de elementos. Esta decisión es específica para su caso de uso.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o TypeScript para usar decoradores. Consulte Uso de decoradores para obtener más detalles.
> 

```jsx
@queryAssignedElements({slot: 'list', selector: '.item'})
_listItems!: Array<HTMLElement>;

@queryAssignedNodes({slot: 'header', flatten: true})
_headerNodes!: Array<Node>;
```

Los ejemplos anteriores son equivalentes al siguiente código:

```jsx
get _listItems() {
  const slot = this.shadowRoot.querySelector('slot[name=list]');
  return slot.assignedElements().filter((node) => node.matches('.item'));
}

get _headerNodes() {
  const slot = this.shadowRoot.querySelector('slot[name=header]');
  return slot.assignedNodes({flatten: true});
}
```

# Customizing the render root

Cada componente de Lit tiene un **render root**: un nodo DOM que sirve como contenedor para su DOM interno.

De forma predeterminada, LitElement crea un `shadowRoot` abierto y renderiza dentro de él, produciendo la siguiente estructura DOM:

```jsx
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

Hay dos formas de personalizar la raíz de representación utilizada por LitElement:

- Configuración de `shadowRootOptions`.
- Implementando el método `createRenderRoot`.

## Setting shadowRootOptions

La forma más sencilla de personalizar la raíz de procesamiento es establecer la propiedad estática `shadowRootOptions`. La implementación predeterminada de createRenderRoot pasa `shadowRootOptions` como el argumento de opciones para `attachShadow` al crear el **shadown root** del componente. Se puede configurar para personalizar cualquier opción permitida en el diccionario ShadowRootInit, por ejemplo, `modo` y `delegatesFocus`.

```jsx
class DelegatesFocus extends LitElement {
  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};
}
```

## Implementing createRenderRoot

La implementación predeterminada de `createRenderRoot` crea una raíz de sombra abierta y le agrega cualquier estilo establecido en el campo de clase de `estilos estáticos`. Para obtener más información sobre estilos, consulte Estilos.

Para personalizar la raíz de representación de un componente, implemente `createRenderRoot` y devuelva el nodo en el que desea que se represente la plantilla.

Por ejemplo, para representar la plantilla en el árbol DOM principal como elementos secundarios de su elemento, implemente `createRenderRoot` y devuelva `this`.

> ℹ️ **Rendering into children**. Por lo general, no se recomienda renderizar en DOM secundarios y no en sombras. Su elemento no tendrá acceso al DOM ni al ámbito de estilo, y no podrá componer elementos en su DOM interno.
> 

*default-root.js*

```jsx
import {LitElement, html} from 'lit';

export class DefaultRoot extends LitElement {
  render() {
    return html`
      <p>By default template renders into shadow DOM.</p>
    `;
  }
}
customElements.define('default-root', DefaultRoot);
```

*light-dom.js*

```jsx
import {LitElement, html} from 'lit';

export class LightDom extends LitElement {
  render() {
    return html`
      <p>Custom rendering without shadow DOM (note, styling leaks in).</p>
    `;
  }
  createRenderRoot() {
    return this;
  }
}
customElements.define('light-dom', LightDom);
```

*index.html*

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="./default-root.js"></script>
    <script type="module" src="./light-dom.js"></script>
    <title>lit-element code sample</title>
    <style>
      p {
        border: 1px dotted black;
      }
    </style>
  </head>
  <body>
    <default-root></default-root>
    <light-dom></light-dom>
  </body>
</html>
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
