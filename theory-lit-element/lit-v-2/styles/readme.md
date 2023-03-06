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

