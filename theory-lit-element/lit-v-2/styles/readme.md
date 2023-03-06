# Styles

# Introducción

El template delcomponente se representa en su shadow root (raíz oculta). Los estilos que agrega a su componente se limitan automáticamente a la shadow root (raíz oculta) y solo afectan a los elementos de la shadow root (raíz oculta) del componente.

Shadow DOM proporciona una fuerte encapsulación para el estilo. Si Lit no usara Shadow DOM, tendría que tener mucho cuidado de no diseñar accidentalmente elementos fuera de su componente, ya sean ancestros o hijos de su componente. Esto podría implicar escribir nombres de clase largos y engorrosos. Al usar Shadow DOM, Lit garantiza que cualquier selector que escriba solo se aplique a los elementos en la raíz de sombra de su componente Lit.

## Adding styles to your component

Los estilos de ámbito se definen en el campo de clase de `styles` static mediante la función `CSS` literal de plantilla etiquetada. Definir estilos de esta manera da como resultado el rendimiento más óptimo:

```jsx
import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static styles = css`
    p {
      color: green;
    }
  `;
  render() {
    return html`<p>I am green!</p>`;
  }
}
customElements.define('my-element', MyElement);
```

Los estilos que agrega a su componente tienen un alcance usando shadow DOM.

El valor del campo de clase de `style` estáticos puede ser:

- Un único literal de plantilla etiquetada.

```jsx
static styles = css`...`;
```

- Una matriz de literales de plantilla etiquetados.

```jsx
static styles = [ css`...`, css`...`];
```

El campo de clase de estilos estáticos es casi siempre la mejor manera de agregar estilos a su componente, pero hay algunos casos de uso que no puede manejar de esta manera, por ejemplo, personalizar estilos por instancia.

### Uso de expresiones en estilos estáticos

Los estilos estáticos se aplican a todas las instancias de un componente. Cualquier expresión en CSS se evalúa una vez y luego se reutiliza para todas las instancias.

Para la personalización de estilo basada en árbol o por instancia, use las propiedades personalizadas de CSS para permitir que los elementos tengan un tema.

Para evitar que los componentes de Lit evalúen código potencialmente malicioso, la etiqueta `css` solo permite expresiones anidadas que son en sí mismas cadenas o números etiquetados con `css`.

```jsx
const mainColor = css`red`;
...
static styles = css`
  div { color: ${mainColor} }
`;
```

Esta restricción existe para proteger las aplicaciones de las vulnerabilidades de seguridad mediante las cuales se pueden inyectar estilos maliciosos, o incluso códigos maliciosos, desde fuentes no confiables, como parámetros de URL o valores de bases de datos.

Si debe usar una expresión en un literal `css` que no es en sí mismo un literal `css`, y está seguro de que la expresión proviene de una fuente totalmente confiable, como una constante definida en su propio código, entonces puede envolver la expresión con `unsafeCSS` función:

```jsx
const mainColor = 'red';
...
static styles = css`
  div { color: ${unsafeCSS(mainColor)} }
`;
```

> ℹ️ **Solo use la etiqueta** `**unsafeCSS**` **con entrada confiable**. Inyectar CSS sin desinfectar es un riesgo de seguridad. Por ejemplo, el CSS malicioso puede "llamar a casa" agregando una URL de imagen que apunta a un servidor de terceros.
> 

### Heredar estilos de una superclase

Usando una matriz de literales de plantilla etiquetados, un componente puede heredar los estilos de una superclase y agregar sus propios estilos:

*my-element.js*

```jsx
import {css} from 'lit';
import {SuperElement} from './super-element.js';

export class MyElement extends SuperElement {
  static styles = [
    SuperElement.styles,
    css`div {
      color: red;
    }`,
  ];
}
customElements.define('my-element', MyElement);
```

*super-element.js*

```jsx
import {LitElement, html, css} from 'lit';

export class SuperElement extends LitElement {
  static styles = css`
    div {
      border: 1px solid gray;
      padding: 8px;
    }
  `;
  render() {
    return html`
      <div>Content</div>
    `;
  }
}
customElements.define('super-element', SuperElement);
```

*index.html*

```jsx
<script type="module" src="./my-element.js"></script>

<my-element></my-element>
```

También puede usar `super.styles` para hacer referencia a la propiedad de estilos de la superclase en JavaScript. Si usa TypeScript, le recomendamos que evite los `super.styles`, ya que el compilador no siempre los convierte correctamente. Hacer referencia explícita a la superclase, como se muestra en el ejemplo, evita este problema.

Al escribir componentes destinados a ser subclasificados en TypeScript, el campo de `estilos estáticos` debe escribirse explícitamente como `CSSResultGroup` para permitir flexibilidad a los usuarios para anular `estilos` con una matriz:

```jsx
// Prevent typescript from narrowing the type of `styles` to `CSSResult`
// so that subclassers can assign e.g. `[SuperElement.styles, css`...`]`;
static styles: CSSResultGroup = css`...`;
```

### Sharing styles

Puede compartir estilos entre componentes creando un módulo que exporte estilos etiquetados:

```jsx
export const buttonStyles = css`
  .blue-button {
    color: white;
    background-color: blue;
  }
  .blue-button:disabled {
    background-color: grey;
  }`;
```

Luego, su elemento puede importar los estilos y agregarlos a su campo de clase de `estilos` estáticos:

```jsx
import { buttonStyles } from './button-styles.js';

class MyElement extends LitElement {
  static styles = [
    buttonStyles,
    css`
      :host { display: block;
        border: 1px solid black;
      }`
  ];
}
```

### Using unicode escapes in styles

La secuencia de escape Unicode de CSS es una barra invertida seguida de cuatro o seis dígitos hexadecimales: por ejemplo, `\2022` para un carácter de viñeta. Esto es similar al formato de las secuencias de escape octal en desuso de JavaScript, por lo que usar estas secuencias en un literal de plantilla etiquetada `css` provoca un error.

Hay dos soluciones para agregar un escape Unicode a sus estilos:

- Agregue una segunda barra invertida (por ejemplo, `\\2022`).
- Use la secuencia de escape de JavaScript, comenzando con \u (por ejemplo, `\u2022`).

```jsx
static styles = css`
  div::before {
    content: '\u2022';
  }
```

## Shadow DOM styling overview

Esta sección ofrece una breve descripción general del estilo shadow DOM.

Los estilos que agregue a un componente pueden afectar:

- El árbol de la sombra (la plantilla renderizada de su componente).
- El componente en sí.
- Los hijos del componente.

### Styling the shadow tree

Las plantillas iluminadas se representan en un árbol de sombras de forma predeterminada. Los estilos en el ámbito del árbol de sombras de un elemento no afectan al documento principal ni a otros árboles de sombras. De manera similar, con la excepción de las propiedades CSS heredadas, los estilos de nivel de documento no afectan el contenido de un árbol de sombra.

Cuando usa selectores de CSS estándar, solo coinciden con elementos en el árbol de sombra de su componente. Esto significa que a menudo puede usar selectores muy simples, ya que no tiene que preocuparse de que diseñen accidentalmente otras partes de la página; por ejemplo: `input`, `*` o `#my-element`.

### Styling the component itself

Puede diseñar el componente en sí usando selectores de `:host` especiales. (El elemento que posee o "aloja" un árbol de sombra se denomina elemento anfitrión).

Para crear estilos predeterminados para el elemento host, use la pseudoclase `:host` CSS y la función pseudoclase CSS `:host()`.

- `:host` selecciona el elemento host.
- `:host(selector)` selecciona el elemento anfitrión, pero solo si el elemento anfitrión coincide con el selector.

```jsx
import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: lightgray;
      padding: 8px;
    }
    :host(.blue) {
      background-color: aliceblue;
      color: darkgreen;
    }
  `;
  render() {
    return html`Hello World`;
  }
}
customElements.define('my-element', MyElement);
```

Tenga en cuenta que el elemento host también puede verse afectado por estilos fuera del árbol de sombra, por lo que debe considerar los estilos que establece en las reglas `:host` y `:host()` como estilos predeterminados que el usuario puede anular. Por ejemplo:

```jsx
my-element {
  display: inline-block;
}
```

### Styling the component's children

Su componente puede aceptar hijos (como un elemento `<ul>` puede tener hijos `<li>`). Para renderizar elementos secundarios, su plantilla debe incluir uno o más elementos `<slot>`, como se describe en Renderizar elementos secundarios con el elemento slot.

El elemento `<slot>` actúa como marcador de posición en un árbol de sombra donde se muestran los elementos secundarios del elemento host.

Utilice el pseudoelemento CSS `::slotted()` para seleccionar elementos secundarios que se incluyen en su plantilla a través de `<slot>`.

- `::*slotted*(*)` coincide con todos los elementos ranurados.*
- *`::slotted(p)` coincide con párrafos con ranuras.*
- *`p ::slotted(*)` coincide con elementos con ranura donde `<slot>` es un descendiente de un elemento de párrafo.

```jsx
import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static styles = css`
    ::slotted(*) { font-family: Roboto; }
    ::slotted(p) { color: blue; }
    div ::slotted(*) { color: red; }
  `;
  render() {
    return html`
      <slot></slot>
      <div><slot name="hi"></slot></div>
    `;
  }
}
customElements.define('my-element', MyElement);
```

Tenga en cuenta que **solo los elementos secundarios directamente slotted** pueden styled con `::*slotted*()`.

```jsx
<my-element>
  <div>Stylable with ::slotted()</div>
</my-element>

<my-element>
  <div><p>Not stylable with ::slotted()</p></div>
</my-element>
```

Además, se puede diseñar a los niños desde fuera del árbol de sombras, por lo que debe considerar sus estilos `::slotted()` como estilos predeterminados que se pueden anular.

```jsx
my-element > div {
  /* Outside style targetting a slotted child can override ::slotted() styles */
}
```

> ℹ️ **Limitaciones en el polyfill ShadyCSS en torno al contenido slotted**. Consulte las limitaciones de ShadyCSS para obtener detalles sobre cómo usar la sintaxis `::slotted()` de una manera compatible con polyfill.
> 

## Defining scoped styles in the template

Recomendamos utilizar el campo de clase de `estilos` estáticos para un rendimiento óptimo. Sin embargo, a veces es posible que desee definir estilos en la plantilla Lit. Hay dos formas de agregar estilos con ámbito en la plantilla:

- Agrega estilos usando un elemento `<style>`.
- Agregue estilos usando una hoja de estilo externa (no recomendado).

Cada una de estas técnicas tiene su propio conjunto de ventajas y desventajas.

### En un elemento de estilo

Normalmente, los estilos se colocan en el campo de clase de `estilos` estáticos; sin embargo, los `estilos` estáticos del elemento se evalúan una vez por clase. A veces, es posible que deba personalizar los estilos por instancia. Para ello, recomendamos utilizar las propiedades CSS para crear elementos temáticos. Alternativamente, también puede incluir elementos `<style>` en una plantilla Lit. Estos se actualizan por instancia.

```jsx
render() {
  return html`
    <style>
      /* updated per instance */
    </style>
    <div>template content</div>
  `;
}
```

> ℹ️ **Limitaciones en el polyfill de ShadyCSS en torno al estilo de cada instancia**. El estilo por instancia no es compatible con el polyfill ShadyCSS. Consulte las limitaciones de ShadyCSS para obtener más información.
> 

### Expresiones y elementos de estilo.

El uso de expresiones dentro de elementos de estilo tiene algunas limitaciones importantes y problemas de rendimiento.

```jsx
render() {
  return html`
    <style>
      :host {
        /* Warning: this approach has limitations & performance issues! */
        color: ${myColor}
      }
    </style>
    <div>template content</div>
  `;
}
```

> ℹ️ **Limitaciones en el polyfill de ShadyCSS alrededor de las expresiones**. Las expresiones en los elementos `<style>` no se actualizarán por instancia en ShadyCSS, debido a las limitaciones del polyfill de ShadyCSS. Además, los nodos `<style>` no se pueden pasar como valores de expresión cuando se usa el polyfill ShadyCSS. Consulte las limitaciones de ShadyCSS para obtener más información.
> 

Evaluar una expresión dentro de un elemento `<style>` es extremadamente ineficiente. Cuando cambia cualquier texto dentro de un elemento `<style>`, el navegador debe volver a analizar todo el elemento `<style>`, lo que resulta en un trabajo innecesario.

Para mitigar este costo, separe los estilos que requieren una evaluación por instancia de los que no.

```jsx
static styles = css`/* ... */`;
  render() {
    const redStyle = html`<style> :host { color: red; } </style>`;
    return html`${this.red ? redStyle : ''}`
```

### Import an external stylesheet (not recommended)

Si bien puede incluir una hoja de estilo externa en su plantilla con un `<enlace>`, no recomendamos este enfoque. En su lugar, los estilos deben colocarse en el campo de clase de `estilos` estáticos.

> ℹ️ **Advertencias sobre hojas de estilo externas**.
> 
> - El polyfill ShadyCSS no admite hojas de estilo externas.
> - Los estilos externos pueden causar un destello de contenido sin estilo (FOUC) mientras se cargan.
> - La URL en el atributo `href` es relativa al documento principal. Esto está bien si está creando una aplicación y las URL de sus activos son bien conocidas, pero evite usar hojas de estilo externas cuando cree un elemento reutilizable.

## Dynamic classes and styles

Una forma de hacer que los estilos sean dinámicos es agregar expresiones a la `clase` o atributos de `estilo` en su plantilla.

Lit ofrece dos directivas, `classMap` y `styleMap`, para aplicar convenientemente clases y estilos en plantillas HTML.

Para obtener más información sobre estas y otras directivas, consulte la documentación sobre directivas integradas.

Para usar `styleMap` y/o `classMap`:

1. Importar `classMap` y/o `styleMap`:

```jsx
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
```

1. Use `classMap` y/o `styleMap` en su plantilla de elemento:

```jsx
import {LitElement, html, css} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

export class MyElement extends LitElement {
  static properties = {
    classes: {},
    styles: {},
  };
  static styles = css`
    .someclass { border: 1px solid red; padding: 4px; }
    .anotherclass { background-color: navy; }
  `;

  constructor() {
    super();
    this.classes = {someclass: true, anotherclass: true};
    this.styles = {color: 'lightgreen', fontFamily: 'Roboto'};
  }
  render() {
    return html`
      <div class=${classMap(this.classes)} style=${styleMap(this.styles)}>
        Some content
      </div>
    `;
  }
}
customElements.define('my-element', MyElement);
```

## Theming

Al usar la herencia CSS y las variables CSS y las propiedades personalizadas juntas, es fácil crear elementos temáticos. Al aplicar selectores css para personalizar las propiedades personalizadas de CSS, la aplicación de temas basada en árboles y por instancia es sencilla. Aquí hay un ejemplo:

```jsx
import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static styles = css`
    :host {
      color: var(--my-element-text-color, black);
      background: var(--my-element-background-color, white);
      font-family: var(--my-element-font-family, Roboto);
      display: block;
      padding: 8px;
      margin: 8px;
    }
  `;
  render() {
    return html`<div>Hello World</div>`;
  }
}
customElements.define('my-element', MyElement);
```

### CSS inheritance

La herencia de CSS permite que los elementos principales y host propaguen ciertas propiedades de CSS a sus descendientes.

No todas las propiedades CSS heredan. Las propiedades CSS heredadas incluyen:

- `color`
- `font-family` y otras propiedades de `font-*`
- Todas las propiedades personalizadas de CSS (`--*`)

Puede usar la herencia CSS para establecer estilos en un elemento antepasado que heredan sus descendientes:

```jsx
<style>
html {
  color: green;
}
</style>
<my-element>
  #shadow-root
    Will be green
</my-element>
```

### CSS custom properties

Todas las propiedades personalizadas de CSS (`--custom-property-name`) se heredan. Puede usar esto para hacer que los estilos de su componente sean configurables desde afuera.

El siguiente componente establece su color de fondo en una variable CSS. La variable CSS usa el valor de `--my-background` si ha sido configurado por un selector que coincide con un ancestro en el árbol DOM y, de lo contrario, el valor predeterminado es `yellow`:

```jsx
class MyElement extends LitElement {
  static styles = css`
    :host {
      background-color: var(--my-background, yellow);
    }
  `;
  render() {
    return html`<p>Hello world</p>`;
  }
}
```

Los usuarios de este componente pueden establecer el valor de `--my-background`, utilizando la etiqueta `my-element` como selector de CSS:

```jsx
<style>
  my-element {
    --my-background: rgb(67, 156, 144);
  }
</style>
<my-element></my-element>
```

`--my-background` es configurable por instancia de `my-element`:

```jsx
<style>
  my-element {
    --my-background: rgb(67, 156, 144);
  }
  my-element.stuff {
    --my-background: #111111;
  }
</style>
<my-element></my-element>
<my-element class="stuff"></my-element>
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
