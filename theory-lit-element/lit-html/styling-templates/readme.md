# Styling templates

# Introducción

`lit-html` se centra en una cosa: hacer html. La forma en que aplica estilos al HTML `lit-html` crea depende de cómo lo esté utilizando, por ejemplo, si está utilizando `lit-html` dentro de un sistema de componentes como LitElement, puede seguir los patrones utilizados por ese sistema de componentes.

En general, la forma en que diseñe HTML dependerá de si está utilizando Shadow Dom:

- Si no usa Shadow DOM, puede diseñar HTML usando hojas de estilo global.
- Si está usando Shadow Dom (por ejemplo, en litelemento), entonces puede agregar hojas de estilo dentro de la raíz de la sombra.

Para ayudar con el estilo dinámico, `lit-html` proporciona dos directivas para manipular los atributos de `class` y `style` de un elemento:

- `ClassMap` establece clases en un elemento basado en las propiedades de un objeto.
- Stylemap establece los estilos en un elemento basado en un mapa de propiedades y valores de estilo.
- `Stylemap` establece los estilos en un elemento basado en un mapa de propiedades y valores de estilo.

# Configuración de clases con classmap

Al igual que `Stylemap`, la directiva `ClassMap` le permite establecer un grupo de clases basado en un objeto.

```jsx
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";

const itemTemplate = (item) => {
  const classes = { selected: item.selected };
  return html`<div class="menu-item ${classMap(classes)}">Classy text</div>`;
};
```

# Estilos en línea con styleMap

Puede usar la directiva `Stylemap` para establecer estilos en línea en un elemento en la plantilla.

```jsx
import {html} from 'lit-html';
import {styleMap} from 'lit-html/directives/style-map.js';

...

const myTemplate = () => {
  styles = {
    color: myTextColor,
    backgroundColor: highlight ? myHighlightColor : myBackgroundColor,
  };

  return html`
    <div style=${styleMap(styles)}>
      Hi there!
    </div>
  `;
};
```

# Renderizando en shadow DOM

Al renderizar una raíz de sombra, generalmente desea agregar una hoja de estilo dentro de la raíz de la sombra a la plantilla, para que pueda diseñar el contenido de la raíz de la sombra.

```jsx
html`
  <style>
    :host {
      ...;
    }
    .test {
      ...;
    }
  </style>
  <div class="test">...</div>
`;
```

Este patrón puede parecer ineficiente, ya que la misma hoja de estilo se reproduce en cada instancia de un elemento. Sin embargo, el navegador puede deduplicar múltiples instancias de la misma hoja de estilo, por lo que el costo de analizar la hoja de estilo solo se paga una vez.

Una nueva característica disponible en algunos navegadores son los objetos de hojas de estilo construibles. Este estándar propuesto permite que múltiples raíces de la sombra compartan explícitamente hojas de estilo. LitElement utiliza esta función en su propiedad static Styles.

## Bindear en style sheets

Bindear a los valores en la hoja de estilo es un antipatrón, porque derrota las optimizaciones de la hoja de estilo del navegador. Tampoco es compatible con el polyfill Shadycss.

```jsx
// DON'T DO THIS
html`
  <style>
    :host {
      background-color: ${themeColor};
    }
  </style>
`;
```

Alternativas al uso de enlaces en una hoja de estilo:

- Use CSS custom properties para pasar valores en el árbol.
- Use bindeos en la `class` y los atributos de `styles` para controlar el estilo de los elementos infantiles.

Vea los estilos en línea con syleMap y clases de configuración con classmap para ejemplos de enlace al `estilo` y los atributos de `clase`.

## Polyfilled shadow DOM: ShadyDOM and ShadyCSS

Si está utilizando Shadow DOM, probablemente necesite usar polyfills para admitir navegadores más antiguos que no implementan SHOWM DOM de forma nativa. Shadydom y Shadycss son polyfills, o cuñas, que emulan el aislamiento y el alcance del estilo de la sombra.

El módulo de renderizado Shady `lit-html` proporciona la integración necesaria con la Shady CSS Shim. Si está escribiendo su propia clase base de elementos personalizados que usa `lit-html` y Shadow Dom, deberá usar Shady-Render y también dar algunos pasos por su cuenta.

El ReadMe ShadyCSS proporciona algunas instrucciones para usar CSS sombreado. Al usarlo con `lit-html`:

- Importar `render` y `TemplaterResult` de la Biblioteca de `shady-render`.
- No necesita llamar a `shadycss.preTemplate`. En su lugar, pase el nombre del alcance como una opción Render. Para elementos personalizados, use el nombre del elemento como nombre de alcance. Por ejemplo:

```jsx
import { render, TemplateResult } from "lit-html/lib/shady-render";

class MyShadyBaseClass extends HTMLElement {
  // ...

  _update() {
    render(this.myTemplate(), this.shadowRoot, {
      scopeName: this.tagName.toLowerCase(),
    });
  }
}
```

Donde t`his.myTemplate` es un método que devuelve un `TemplaterResult`.

- Debe llamar a `ShadyCSS.styleElement` cuando el elemento está conectado al DOM, y en el caso de cualquier cambio dinámico que pueda afectar los valores de las propiedades personalizadas.

Por ejemplo, considere un conjunto de reglas como esta:

```jsx
my-element { --theme-color: blue; }
main my-element { --theme-color: red; }
```

Si agrega una instancia de `my-element` a un documento, o lo mueve, puede aplicarse un valor diferente de `-theme-color`. En los navegadores con soporte de propiedad personalizada nativa, estos cambios se llevarán a cabo automáticamente, pero en los navegadores que dependen de la propiedad de propiedad personalizada incluida con ShadyCSS, deberá llamar a `StyleElement`.

```jsx
connectedCallback() {
  super.connectedCallback();
  if (window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
  }
}
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
