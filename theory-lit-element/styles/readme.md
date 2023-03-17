# Styles

Esta página describe cómo agregar estilos a su componente.

La plantilla de su componente se representa en su árbol DOM de sombra. Los estilos que agrega a su componente se ajustan automáticamente al árbol de sombras, por lo que no se filtran ni afectan a otros elementos.

# Agregue estilos a su componente

Para un rendimiento óptimo, defina estilos con ámbito en una propiedad de `estilos` estáticos.

Defina estilos en un literal de plantilla etiquetado, utilizando la función de etiqueta `css`:

```jsx
import { LitElement, css, html } from "lit-element";

class MyElement extends LitElement {
  static get styles() {
    return css`
      div {
        color: red;
      }
    `;
  }
  render() {
    return html` <div>I'm styled!</div> `;
  }
}
```

Los estilos que agrega a su componente tienen un alcance mediante shadow DOM. Para obtener una descripción general rápida del estilo del DOM de la sombra, consulte Descripción general del estilo del DOM de la sombra.

El valor de la propiedad de `estilos` estáticos puede ser:

- Un único literal de plantilla etiquetada.

```jsx
static get styles() {
  return css`...`;
}
```

- Una matriz de literales de plantilla etiquetados.

```jsx
static get styles() {
  return [ css`...`, css`...`];
}
```

La propiedad de `estilos` estáticos suele ser la mejor manera de agregar estilos a su componente, pero hay algunos casos de uso que no puede manejar de esta manera, por ejemplo, vincular a una hoja de estilo externa. Para conocer formas alternativas de agregar estilos, consulte Definir estilos con ámbito en la plantilla.

## Expresiones en estilos estáticos

Enlace permanente a "Expresiones en estilos estáticos"
Los estilos estáticos se aplican a todas las instancias de un componente. Cualquier expresión en CSS se evalúa una vez y luego se reutiliza para todas las instancias.

Para permitir la personalización de temas o estilos por instancia, use variables CSS y propiedades personalizadas para crear estilos configurables.

Para evitar que los componentes basados en LitElement evalúen código potencialmente malicioso, la etiqueta `css` solo permite expresiones anidadas que son en sí mismas cadenas o números etiquetados con `css`.

```jsx
import { LitElement, html, css } from "lit-element";

const mainColor = css`red`;

class MyElement extends LitElement {
  static get styles() {
    return css`
      div {
        color: ${mainColor};
      }
    `;
  }
  render() {
    return html`<div>Some content in a div</div>`;
  }
}

customElements.define("my-element", MyElement);
```

Esta restricción existe para proteger las aplicaciones de las vulnerabilidades de seguridad mediante las cuales se pueden inyectar estilos maliciosos, o incluso códigos maliciosos, desde fuentes no confiables, como parámetros de URL o valores de bases de datos.

Si debe usar una expresión en un literal `css` que no es en sí mismo un literal `css`, y está seguro de que la expresión proviene de una fuente totalmente confiable, como una constante definida en su propio código, entonces puede envolver la expresión con `unsafeCSS` función:

```jsx
import { LitElement, html, css, unsafeCSS } from "lit-element";

class MyElement extends LitElement {
  static get styles() {
    const mainColor = "red";

    return css`
      div {
        color: ${unsafeCSS(mainColor)};
      }
    `;
  }
  render() {
    return html`<div>Some content in a div</div>`;
  }
}

customElements.define("my-element", MyElement);
```

> ⚠️ Solo use la etiqueta unsafeCSS con entrada confiable. Inyectar CSS sin desinfectar es un riesgo de seguridad. Por ejemplo, el CSS malicioso puede "llamar a casa" agregando una URL de imagen que apunta a un servidor de terceros.

## Herencia de styles

Usando una matriz de literales de plantilla etiquetados, un componente puede heredar los estilos de una superclase LitElement y agregar sus propios estilos:

```jsx
class MyElement extends SuperElement {
  static get styles() {
    return [super.styles, css`...`];
  }
}
```

## Sharing styles

Puede compartir estilos entre componentes creando un módulo que exporte estilos etiquetados:

```jsx
import { css } from "lit-element";

export const buttonStyles = css`
  .blue-button {
    color: white;
    background-color: blue;
  }
  .blue-button:disabled {
    background-color: grey;
  }
`;
```

Luego, su elemento puede importar los estilos y agregarlos a su propiedad de estilos estáticos:

```jsx
import { buttonStyles } from './button-styles.js';

class MyElement extends LitElement {
  static get styles() {
    return [
      buttonStyles,
      css`
        :host { display: block;
          border: 1px solid black;
        }`
    ]
  }
  ...
}
```

También puede importar una hoja de estilo externa agregando un elemento `<link>` a su plantilla, pero esto tiene varias limitaciones. Para obtener más información, consulte Importar una hoja de estilo externa.

# Descripción general del estilo Shadow DOM

Esta sección ofrece una breve descripción general del estilo shadow DOM.

Los estilos que agregue a un componente pueden afectar:

- El árbol de la sombra (la plantilla renderizada de su componente).
- El componente en sí.
- Los hijos del componente.

## Dale estilo al árbol de la sombra

Las plantillas de LitElement se representan en un árbol de sombra de forma predeterminada. Los estilos en el ámbito del árbol de sombras de un elemento no afectan al documento principal ni a otros árboles de sombras. De manera similar, con la excepción de las propiedades CSS heredadas, los estilos de nivel de documento no afectan el contenido de un árbol de sombra.

Cuando usa selectores de CSS estándar, solo coinciden con elementos en el árbol de sombra de su componente.

```jsx
class MyElement extends LitElement {
  static get styles() {
    // Write styles in standard CSS
    return css`
      * {
        color: red;
      }
      p {
        font-family: sans-serif;
      }
      .myclass {
        margin: 100px;
      }
      #main {
        padding: 30px;
      }
      h1 {
        font-size: 4em;
      }
    `;
  }
  render() {
    return html`
      <p>Hello World</p>
      <p class="myclass">Hello World</p>
      <p id="main">Hello World</p>
      <h1>Hello World</h1>
    `;
  }
}
```

## Dale estilo al componente en sí

Puede diseñar el componente en sí usando selectores de `:host` especiales. (El elemento que posee o "aloja" un árbol de sombra se denomina elemento anfitrión).

Para crear estilos predeterminados para el elemento host, use la pseudoclase :host CSS y la función pseudoclase CSS :`host()`.

- `:host` selecciona el elemento host.
- :`host(selector)` selecciona el elemento anfitrión, pero solo si el elemento anfitrión coincide con el selector.

```jsx
static get styles() {
  return css`
    /* Selects the host element */
    :host {
      display: block;
    }

    /* Selects the host element if it is hidden */
    :host([hidden]) {
      display: none;
    }
  `;
}
```

Tenga en cuenta que el elemento host también puede verse afectado por estilos fuera del árbol de sombra, por lo que debe considerar los estilos que establece en las reglas :host y :host() como estilos predeterminados que el usuario puede anular. Por ejemplo:

```jsx
my-element {
  display: inline-block;
}
```

## Aplicar estilo a los elementos secundarios del componente

Su componente puede aceptar hijos (como un elemento `<ul>` puede tener hijos `<li>`). Para renderizar elementos secundarios, su plantilla debe incluir uno o más elementos `<slot>`, como se describe en Renderizar elementos secundarios con el elemento slot.

El elemento `<slot>` actúa como marcador de posición en un árbol de sombra donde se muestran los elementos secundarios del elemento host. Por ejemplo:

```jsx
class MyElement extends LitElement {
  render() {
    return html`<slot></slot>`;
  }
}
```

```jsx
<my-element>
  <p>Slotted content</p>
</my-element>
```

Utilice el pseudoelemento CSS `::slotted()` para seleccionar elementos secundarios que se incluyen en su plantilla a través de <slot>s.

- `::slotted(*)` matches all slotted elements.
- `::slotted(p)` matches slotted paragraphs.
- `p ::slotted(*)` matches slotted elements where the `<slot>` is a descendant of a paragraph element.

```jsx
<p>
  <slot></slot>
</p>
```

```jsx
import { LitElement, html, css } from "lit-element";

class MyElement extends LitElement {
  static get styles() {
    return css`
      ::slotted(*) {
        font-family: Roboto;
      }
      ::slotted(p) {
        color: blue;
      }
      div ::slotted(*) {
        color: red;
      }
    `;
  }
  render() {
    return html`
      <slot></slot>
      <div><slot name="hi"></slot></div>
    `;
  }
}
customElements.define("my-element", MyElement);
```

Tenga en cuenta que solo los elementos secundarios directamente ranurados pueden diseñarse con `:: slotted()`.

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
my-element div {
  // Outside style targetting a slotted child can override ::slotted() styles
}
```

> ⚠️ ¡Cuidado con las limitaciones en el relleno polifónico Shady CSS alrededor del contenido ranurado! Consulte las limitaciones de Shady CSS para obtener detalles sobre cómo usar la sintaxis `::slotted()` de una manera compatible con polyfill.

## Estilos configurables con propiedades personalizadas

Los estilos estáticos se evalúan una vez por clase. Use variables CSS y propiedades personalizadas para crear estilos que se puedan configurar en tiempo de ejecución:

```jsx
static get styles() {
  return css`
    :host { color: var(--themeColor); }
  `;
}
```

```jsx
<style>
  html {
    --themeColor: #123456;
  }
</style>
<my-element></my-element>
```

# Definir estilos de alcance en la plantilla

Recomendamos usar estilos estáticos para un rendimiento óptimo. Sin embargo, a veces es posible que desee definir estilos en la plantilla LitElement. Hay dos formas de agregar estilos con ámbito en la plantilla:

- Agregue estilos utilizando una hoja de estilo externa.
- Agrega estilos usando un elemento `<style>`.

Cada una de estas técnicas tiene su propio conjunto de ventajas y desventajas.

## En un elemento de estilo

Recomendamos usar estilos estáticos para un rendimiento óptimo. Sin embargo, los estilos estáticos se evalúan una vez por clase. A veces, es posible que deba evaluar los estilos por instancia.

Recomendamos usar propiedades CSS para crear estilos personalizables. Sin embargo, también puede incluir elementos `<style>` en una plantilla LitElement. Estos se actualizan por instancia.

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

### Expresiones y elementos de estilo.

La forma más intuitiva de evaluar los estilos por instancia tiene algunas limitaciones importantes y problemas de rendimiento. Consideramos el siguiente ejemplo como un antipatrón:

```jsx
// Anti-pattern!
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

Las expresiones dentro de un elemento `<style>` no se actualizarán por instancia en ShadyCSS, debido a las limitaciones del polyfill de ShadyCSS. Consulte el archivo Léame de ShadyCSS para obtener más información.

Además, evaluar una expresión dentro de un elemento `<style>` es ineficiente. Cuando cambia cualquier texto dentro de un elemento `<style>`, el navegador debe volver a analizar todo el elemento `<style>`, lo que resulta en un trabajo innecesario.

Si necesita evaluar expresiones dentro de un elemento `<style>`, use la siguiente estrategia para evitar crear problemas de rendimiento:

- Separe los estilos que requieren una evaluación por instancia de los que no.
- Evalúe las propiedades CSS por instancia creando una expresión que capture esa propiedad dentro de un bloque `<style>` completo. Inclúyelo en tu plantilla.

### Ejemplo:

```jsx
import { LitElement, html } from "lit-element";

const perClassStyle = html`
  <style>
    :host {
      display: block;
      font-family: Roboto;
      font-size: 14px;
    }
  </style>
`;

const blueText = html`
  <style>
    :host {
      color: blue;
    }
  </style>
`;

const redText = html`
  <style>
    :host {
      color: red;
    }
  </style>
`;

class MyElement extends LitElement {
  constructor() {
    super();
    this.perInstanceStyle = redText;
  }
  render() {
    return html`
      ${perClassStyle} ${this.perInstanceStyle}
      <div>Hello World</div>
    `;
  }
}

customElements.define("my-element", MyElement);
```

## Importar una hoja de estilo externa

Recomendamos colocar sus estilos en una propiedad de estilos estáticos para un rendimiento óptimo. Sin embargo, puede incluir una hoja de estilo externa en su plantilla con un `<enlace>`:

```jsx
import { LitElement, html } from "lit-element";

class MyElement extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="./app-styles.css" />
      <button>a button</button>
      <div>a div</div>
    `;
  }
}

customElements.define("my-element", MyElement);
```

Sin embargo, hay algunas advertencias importantes:

- El polyfill ShadyCSS no admite hojas de estilo externas.
- Los estilos externos pueden causar un destello de contenido sin estilo (FOUC) mientras se cargan.
- La URL en el atributo `href` es relativa al documento principal. Esto está bien si está creando una aplicación y las URL de sus activos son bien conocidas, pero evite usar hojas de estilo externas cuando cree un elemento reutilizable.

# Clases y estilos dinámicos

Una forma de hacer que los estilos sean dinámicos es agregar enlaces a la `class` o atributos de `style` en su plantilla.

La biblioteca lit-html ofrece dos directivas, `classMap` y `styleMap`, para aplicar convenientemente clases y estilos en plantillas HTML.

Para obtener más información sobre estas y otras directivas lit-html, consulte la documentación sobre las directivas integradas lit-html.

Para usar `styleMap` y/o `classMap`:

- Importar `classMap` y/o `styleMap`:

```jsx
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
```

- Use `classMap` y/o `styleMap` en su plantilla de elemento:

```jsx
constructor() {
  super();
  this.classes = { mydiv: true, someclass: true };
  this.styles = { color: 'green', fontFamily: 'Roboto' };
}
render() {
  return html`
    <div class=${classMap(this.classes)} style=${styleMap(this.styles)}>
      Some content
    </div>
  `;
}
```

## classMap sintaxis

`classMap` applies a set of classes to an HTML element:

```jsx
<div class=${classMap({alert:true,info:true})}>Content.</div>
<!-- Equivalent: <div class="alert info">Content.</div> -->
```

## styleMap sintaxis

`styleMap` aplica un conjunto de reglas CSS a un elemento HTML:

```jsx
<button style=${styleMap({
  backgroundColor: 'blue',
  border: '1px solid black'
})}>A button</button>

<!-- Equivalent:
  <button style="
    background-color:blue;
    border: 1px solid black;
  ">A button</button>
-->
```

Para hacer referencia a propiedades con guión, como `font-family`, utilice el equivalente de camelCase (`fontFamily`) o coloque el nombre de la propiedad con guión entre comillas (`'font-family'`).

Para hacer referencia a propiedades CSS personalizadas como `--custom-color`, coloque el nombre completo de la propiedad entre comillas (`'--custom-color'`).

| Inline style or CSS                     | styleMap equivalent                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| background-color: blue;                 | backgroundColor: 'blue'or'background-color': 'blue'                                 |
| font-family: Roboto, Arial, sans-serif; | fontFamily: 'Roboto, Arial, sans-serif'or'font-family': 'Roboto, Arial, sans-serif' |
| --custom-color: #FFFABC;                | '--custom-color': '#FFFABC;'                                                        |
| --otherCustomColor: #FFFABC;            | '--otherCustomColor': '#FFFABC;'                                                    |
| color: var(--customprop, blue);         | color: 'var(--customprop, blue)'                                                    |

### Ejemplo:

Inline style syntax:

```jsx
<div
  style="
  background-color:blue;
  font-family:Roboto;
  --custom-color:#e26dd2;
  --otherCustomColor:#77e26d;"
></div>
```

Equivalent CSS syntax:

```jsx
div {
  background-color: blue;
  font-family: Roboto;
  --custom-color: #e26dd2;
  --otherCustomColor: #77e26d;
}
```

Equivalent `styleMap` syntax:

```jsx
html`
  <div
    style=${styleMap({
      "background-color": "blue",
      fontFamily: "Roboto",
      "--custom-color": "#e26dd2",
      "--otherCustomColor": "#77e26d",
    })}
  ></div>
`;
```

# Theming

- Utilice la herencia de CSS para propagar la información de estilo a los componentes de LitElement y sus plantillas representadas.

```jsx
<style>
  html {
    --themeColor: #123456;
    font-family: Roboto;
  }
</style>

<!-- host inherits `--themeColor` and `font-family` and
     passes these properties to its rendered template -->
<my-element></my-element>
```

- Use variables CSS y propiedades personalizadas para configurar estilos por instancia.

```jsx
<style>
  html {
    --my-element-background-color: /* some color */;
  }
  .stuff {
    --my-element-background-color: /* some other color */;
  }
</style>
<my-element></my-element>
<my-element class="stuff"></my-element>
```

```jsx
// MyElement's static styles
static get styles() {
  return css`
    :host {
      background-color: var(--my-element-background-color);
    }
  `;
}
```

## CSS inheritance

La herencia de CSS permite que los elementos principales y host propaguen ciertas propiedades de CSS a sus descendientes.

No todas las propiedades CSS heredan. Las propiedades CSS heredadas incluyen:

- `color`
- `font-family` and other `font-*` properties
- All CSS custom properties (`-*`)

Puede usar la herencia CSS para establecer estilos en un elemento antepasado que heredan sus descendientes:

```jsx
<style>
html {
  font-family: Roboto;
}
</style>
<div>
  <p>Uses Roboto</p>
</div>
```

De manera similar, los elementos host transmiten propiedades CSS heredables a sus árboles de sombra.

Puede usar el selector de tipo del elemento host para diseñarlo:

```jsx
<style>
  my-element { font-family: Roboto; }
</style>
<my-element></my-element>
```

```jsx
class MyElement extends LitElement {
  render() {
    return html`<p>Uses Roboto</p>`;
  }
}
```

También puede usar la pseudoclase :host CSS para diseñar el host desde dentro de su propia plantilla:

```jsx
static get styles() {
  return css`
    :host {
      font-family: Roboto;
    }
  `;
}
render() {
  return html`
    <p>Uses Roboto</p>
  `;
}
```

> ℹ️ Los selectores de tipo tienen mayor especificidad que :host.
>
> Un selector de tipo de elemento tiene mayor especificidad que el selector de pseudoclase `:host`. Los estilos establecidos para una etiqueta de elemento personalizado anularán los estilos establecidos con `:host` y `:host()`:
>
> ```jsx
> <style>
>   my-element { font-family: Courier; }
> </style>
> <my-element></my-element>
> ```
>
> ```jsx
> class MyElement extends LitElement {
>   static get styles() {
>     return css`
>       :host {
>         font-family: Roboto;
>       }
>     `;
>   }
>   render() {
>     return html`<p>Will use courier</p>`;
>   }
> }
> ```

## Propiedades personalizadas de CSS

Todas las propiedades personalizadas de CSS (`--custom-property-name`) se heredan. Puede usar esto para hacer que los estilos de su componente sean configurables desde afuera.

El siguiente componente establece su color de fondo en una variable CSS. La variable CSS usa el valor de `--my-background` si está disponible y, de lo contrario, el valor predeterminado es `yellow`:

```jsx
class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        background-color: var(--my-background, yellow);
      }
    `;
  }
  render() {
    return html`<p>Hello world</p>`;
  }
}
```

Los usuarios de este componente pueden establecer el valor de `--my-background`, utilizando la etiqueta `my-element` como selector de CSS

```jsx
<style>
  my-element {
    --my-background: rgb(67, 156, 144);
  }
</style>
<my-element></my-element>
```

`—my-background` es configurable por instancia de `my-element`:

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

Si el usuario de un componente tiene un tema de aplicación existente, puede configurar fácilmente las propiedades configurables del host para usar las propiedades del tema:

```jsx
<html>
  <head>
    <title>lit-element code sample</title>
    <script type="module" src="./my-element.js"></script>
    <style>
      html { --themeColor1: rgb(67, 156, 144); }
      my-element {
        --myBackground: var(--themeColor1);
        --myColor: rgb(156, 67, 152);
      }
    </style>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```
  
## Ejemplo simple theme
  
_index.html_
  
```jsx
<html>
  <head>
    <script type="module" src="./my-element.js"></script>
    <title>lit-element code sample</title>
    <style>
      html {
        --theme-primary: green;
        --theme-secondary: aliceblue;
        --theme-warning: red;
        --theme-font-family: Roboto;
      }
      my-element {
        --my-element-text-color: var(--theme-primary);
        --my-element-background-color: var(--theme-secondary);
        --my-element-font-family: var(--theme-font-family);
      }
      .warning {
        --my-element-text-color: var(--theme-warning);
      }
    </style>
  </head>
  <body>
    <my-element></my-element>
    <my-element class="warning"></my-element>
  </body>
</html>
```

_my-element.js_

```jsx
import { LitElement, html, css } from "lit-element";

class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        color: var(--my-element-text-color, black);
        background: var(--my-element-background-color, white);
        font-family: var(--my-element-font-family, Roboto);
      }
      :host([hidden]) {
        display: none;
      }
    `;
  }
  render() {
    return html`<div>Hello World</div>`;
  }
}
customElements.define("my-element", MyElement);
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
