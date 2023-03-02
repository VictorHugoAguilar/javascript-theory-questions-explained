# Rendering templates

# Introducción

Una expresión del template `lit-html` no hace que se cree o actualice ningún DOM. Es solo una descripción de DOM, llamada `TemplateResult`.
En realidad para crear o actualizar DOM, debe pasar `TemplateResult` a la función `render(),` junto con un contenedor para renderizar:

```jsx
import { html, render } from "lit-html";

const sayHi = (name) => html`<h1>Hello ${name}</h1>`;
render(sayHi("Amy"), document.body);

// subsequent renders will update the DOM
render(sayHi("Zoe"), document.body);
```

# Opciones de render

El método `render` también toma un argumento de opciones que le permite especificar las siguientes opciones:

- `eventContext`: el valor `this` que se utilizará al invocar detectores de eventos registrados con la sintaxis `@eventName`. Esta opción solo se aplica cuando especifica un detector de eventos como una función simple. Si especifica el detector de eventos utilizando un objeto detector de eventos, el objeto detector se usa como este valor. Consulte Agregar detectores de eventos para obtener más información sobre detectores de eventos.
- `templateFactory`: El `TemplateFactory` a utilizar. Esta es una opción avanzada. Una TemplateFactory crea un elemento de plantilla a partir de un `TemplateResult`, normalmente almacenando en caché las plantillas en función de su contenido estático. Los usuarios no suelen proporcionar su propio `TemplateFactory`, pero las bibliotecas que usan `lit-html` pueden implementar fábricas de plantillas personalizadas para personalizar el manejo de plantillas. El módulo `shady-render` proporciona su propia fábrica de plantillas, que utiliza para preprocesar las plantillas para integrarlas con los polyfills shadow DOM (shadyDOM y shadyCSS).

Por ejemplo, si está creando una clase de componente, puede usar opciones de representación como esta:

```jsx
class MyComponent extends HTMLElement {
  // ...

  _update() {
    // Bind event listeners to the current instance of MyComponent
    render(this._template(), this._renderRoot, { eventContext: this });
  }
}
```

Las opciones de renderizado no deberían cambiar entre llamadas del `render` subsiguientes.

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
