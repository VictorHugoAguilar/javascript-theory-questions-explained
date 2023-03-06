# Working with Shadow DOM

# Introducción

Los componentes iluminados usan shadow DOM para encapsular su DOM. Shadow DOM proporciona una forma de agregar un árbol DOM aislado y encapsulado separado a un elemento. La encapsulación DOM es la clave para desbloquear la interoperabilidad con cualquier otro código, incluidos otros componentes web o componentes de Lit, que funcione en la página.

Shadow DOM proporciona tres beneficios:

- Alcance DOM. Las API de DOM como document.querySelector no encontrarán elementos en el DOM oculto del componente, por lo que es más difícil que los scripts globales rompan accidentalmente su componente.
- Style scoping (alcance del estilo). Puede escribir estilos encapsulados para su shadow DOM que no afecten al resto del árbol DOM.
- Composición. La raíz oculta del componente, que contiene su DOM interno, está separada de los elementos secundarios del componente. Puede elegir cómo se representan los elementos secundarios en el DOM interno de su componente.

Para obtener más información sobre shadow DOM:

- [Shadow DOM v1](https://web.dev/shadowdom-v1/): componentes web autónomos sobre fundamentos web.
- Usando shadow [DOM en MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

<aside>
ℹ️ Navegadores más antiguos. En navegadores más antiguos en los que el Shadow DOM nativo no está disponible, se pueden usar los polyfills de componentes web. Tenga en cuenta que el módulo de soporte de polyfill de Lit debe cargarse junto con los polyfills de los componentes web. Consulte Requisitos para navegadores heredados para obtener más información.

</aside>

# Accessing nodes in the shadow DOM

Lit renderiza los componentes a su renderRoot, que es una raíz oculta por defecto. Para encontrar elementos internos, puede usar las API de consulta DOM, como this.renderRoot.querySelector().

RenderRoot siempre debe ser una raíz oculta o un elemento, que comparten API como .querySelectorAll() y .children.

Puede consultar el DOM interno después de la representación inicial del componente (por ejemplo, en firstUpdated) o usar un patrón captador:

```jsx
firstUpdated() {
  this.staticNode = this.renderRoot.querySelector('#static-node');
}

get _closeButton() {
  return this.renderRoot.querySelector('#close-button');
}
```

LitElement proporciona un conjunto de decoradores que proporcionan una forma abreviada de definir captadores como este.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
