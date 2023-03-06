# Styles

# Introducción

La plantilla de su componente se representa en su raíz oculta. Los estilos que agrega a su componente se limitan automáticamente a la raíz oculta y solo afectan a los elementos de la raíz oculta del componente.

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

