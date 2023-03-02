# Decorators

# Usando decorators

Los decoradores son expresiones especiales que pueden alterar el comportamiento de las declaraciones de clase, método de clase y campo de clase. Litelement suministra un conjunto de decoradores que reducen la cantidad de código de calderas que necesita escribir al definir un componente.

Por ejemplo, los decoradores `@customelement` y `@property` hacen que una definición de elemento básico sea más compacta:

```jsx
import { LitElement, html, customElement, property } from "lit-element";

@customElement("my-element")
class MyElement extends LitElement {
  // Declare observed properties
  @property()
  adjective = "awesome";

  // Define the element's template
  render() {
    return html`<p>your ${this.adjective} template here</p>`;
  }
}
```

El decorador `@CustomElement` define un elemento personalizado, equivalente a llamar:

```jsx
customElements.define("my-element", MyElement);
```

El decorador `@Property` declara una propiedad reactiva. Las líneas:

```jsx
@property()
 adjective = 'awesome';
```

Son equivalentes a:

```jsx
static get properties() {
  return {
    adjective: {}
  };
}

constructor() {
  this.adjective = 'awesome';
}
```

# Activando decorators

Para usar los decoradores, debe usar un compilador como Babel o el compilador TypeScript.

> ℹ️ La propuesta de los decoradores. Los decoradores son una propuesta de la Etapa 2 para la adición al estándar Ecmascript, lo que significa que no están finalizados ni implementados en los navegadores todavía. Los compiladores como Babel y TypeScript brindan soporte para las características propuestas como los decoradores al compilarlos en JavaScript estándar que puede ejecutar un navegador.

## Para usar decoradores con TypeScript

Para usar los decoradores con TypeScript, habilite la opción del compilador Experimental Decorators.

```jsx
"experimentalDecorators": true,
```

No se requiere habilitar `EMITDecorAtormetadata` y no se recomienda.

## Para usar decoradores con Babel

Si está compilando JavaScript con Babel, puede habilitar los decoradores agregando los siguientes complementos:

- `@babel/plugin-proposal-decorators`.
- `@babel/plugin-proposal-class-properties`

Para habilitar los complementos, agregaría código como este a su configuración de Babel:

```jsx
plugins = [
  "@babel/plugin-proposal-class-properties",
  ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
];
```

# LitElement decorators

Litelement proporciona los siguientes decoradores:

- `@CustomElement`. Defina un elemento personalizado.
- `@eventoptions`. Agregue las opciones de oyentes de eventos para un oyente de eventos declarativos.
- `@Property` y `@InternalProperty`. Definir propiedades.
- `@Query`, `@Queryall` y `@Queryasync`. Cree un Getter de propiedad que devuelva elementos específicos de la raíz de renderizado de su componente.
- `@QueryAssignedNodes`. Cree un Getter de propiedad que devuelva a los niños asignados a una ranura específica.

Todos los decoradores se pueden importar directamente desde el módulo de lit-element.

```jsx
import { eventOptions } from "lit-element";
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
