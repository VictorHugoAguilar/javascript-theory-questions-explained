# Components Overview

# Introducción

Un componente Lit es una pieza reutilizable de la interfaz de usuario. Puede pensar en un componente Lit como un contenedor que tiene algún estado y que muestra una interfaz de usuario basada en su estado. También puede reaccionar a la entrada del usuario, desencadenar eventos, cualquier cosa que esperaría que hiciera un componente de la interfaz de usuario. Y un componente Lit es un elemento HTML, por lo que tiene todas las API de elementos estándar.

La creación de un componente Lit implica una serie de conceptos:

- Definición de un componente. Un componente Lit se implementa como un elemento personalizado, registrado con el navegador.
- Renderizado. Un componente tiene un método de representación que se llama para representar el contenido del componente. En el método de renderizado, define una plantilla para el componente.
- Propiedades reactivas. Las propiedades mantienen el estado del componente. Cambiar una o más de las propiedades reactivas de los componentes activa un ciclo de actualización, volviendo a renderizar el componente.
- Style. Un componente puede definir estilos encapsulados para controlar su propia apariencia.
- Lifecycle. Lit define un conjunto de devoluciones de llamada que puede anular para conectarse al ciclo de vida del componente, por ejemplo, para ejecutar código cuando el elemento se agrega a una página o cada vez que se actualiza el componente.

Aquí hay un componente de muestra:

```jsx
import {LitElement, css, html} from 'lit';

export class SimpleGreeting extends LitElement {
  static properties = {
    name: {},
  };
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: blue;
    }
  `;

  constructor() {
    super();
    // Declare reactive properties
    this.name = 'World';
  }

  // Render the UI as a function of component state
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
customElements.define('simple-greeting', SimpleGreeting);
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
