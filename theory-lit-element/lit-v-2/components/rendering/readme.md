# Rendering

# Introducción

Agregue una plantilla a su componente para definir lo que debe representar. Las plantillas pueden incluir expresiones, que son marcadores de posición para contenido dinámico.

Para definir una plantilla para un componente Lit, agregue un método `render()`:

```jsx
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
  render() {
    return html`<p>Hello from my template.</p>`;
  }
}
customElements.define('my-element', MyElement);
```

Escriba su plantilla en HTML dentro de un literal de plantilla etiquetada de JavaScript utilizando la función de etiqueta html de Lit.

Las plantillas iluminadas pueden incluir expresiones de JavaScript. Puede usar expresiones para establecer contenido de texto, atributos, propiedades y detectores de eventos. El método `render()` también puede incluir cualquier JavaScript; por ejemplo, puede crear variables locales para usar en expresiones.

# Renderable values

Por lo general, el método `render()` del componente devuelve un solo objeto `TemplateResult` (el mismo tipo devuelto por la función de etiqueta `html`). Sin embargo, puede devolver cualquier cosa que Lit pueda representar como elemento secundario de un elemento HTML:

- Valores primitivos como string, number o booleano.
- Objetos `TemplateResult` creados por la función `html`.
- Nodos DOM.
- El sentinela valor `nothing` and `noChange`.
- Matrices o iterables de cualquiera de los tipos admitidos.

Esto es casi idéntico al conjunto de valores que se pueden representar en una expresión secundaria Lit. La única diferencia es que una expresión secundaria puede representar un `SVGTemplateResult`, devuelto por la función svg. Este tipo de resultado de plantilla solo se puede representar como descendiente de un elemento `<svg>`.

# Escribiendo un buen método render()

Para aprovechar al máximo el modelo de representación funcional de Lit, su método `render()` debe seguir estas pautas:

- Evite cambiar el estado del componente.
- Evita producir efectos secundarios.
- Use solo las propiedades del componente como entrada.
- Devuelve el mismo resultado cuando se le dan los mismos valores de propiedad.

Seguir estas pautas mantiene la plantilla determinista y facilita el razonamiento sobre el código.

En la mayoría de los casos, debe evitar realizar actualizaciones de DOM fuera de `render()`. En su lugar, exprese la plantilla del componente como una función de su estado y capture su estado en propiedades.

Por ejemplo, si su componente necesita actualizar su interfaz de usuario cuando recibe un evento, haga que el detector de eventos establezca una propiedad reactiva que se use en `render()`, en lugar de manipular el DOM directamente.

# Composing templates

Puede componer plantillas Lit a partir de otras plantillas. El siguiente ejemplo crea una plantilla para un componente llamado `<mi-página>` a partir de plantillas más pequeñas para el encabezado, el pie de página y el contenido principal de la página:

```jsx
import {LitElement, html} from 'lit';

class MyPage extends LitElement {
  static properties = {
    article: {attribute: false},
  };

  constructor() {
    super();
    this.article = {
      title: 'My Nifty Article',
      text: 'Some witty text.',
    };
  }

  headerTemplate() {
    return html`<header>${this.article.title}</header>`;
  }

  articleTemplate() {
    return html`<article>${this.article.text}</article>`;
  }

  footerTemplate() {
    return html`<footer>Your footer here.</footer>`;
  }

  render() {
    return html`
      ${this.headerTemplate()}
      ${this.articleTemplate()}
      ${this.footerTemplate()}
    `;
  }
}
customElements.define('my-page', MyPage);
```

En este ejemplo, las plantillas individuales se definen como métodos de instancia, por lo que una subclase podría extender este componente y anular una o más plantillas.

También puede componer plantillas importando otros elementos y usándolos en su plantilla:

*my-page.js*

```jsx
import {LitElement, html} from 'lit';

import './my-header.js';
import './my-article.js';
import './my-footer.js';

class MyPage extends LitElement {
  render() {
    return html`
      <my-header></my-header>
      <my-article></my-article>
      <my-footer></my-footer>
    `;
  }
}
customElements.define('my-page', MyPage);
```

*my-header.js*

```jsx
import {LitElement, html} from 'lit';

class MyHeader extends LitElement {
  render() {
    return html`
      <header>header</header>
    `;
  }
}
customElements.define('my-header', MyHeader);
```

*my-article.js*

```jsx
import {LitElement, html} from 'lit';

class MyArticle extends LitElement {
  render() {
    return html`
      <article>article</article>
    `;
  }
}
customElements.define('my-article', MyArticle);
```

*my-footer.js*

```jsx
import {LitElement, html} from 'lit';

class MyFooter extends LitElement {
  render() {
    return html`
      <footer>footer</footer>
    `;
  }
}
customElements.define('my-footer', MyFooter);
```

*index.html*

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="./my-page.js" type="module"></script>
  <title>lit-element code sample</title>
</head>
  <body>
    <my-page></my-page>
  </body>
</html>
```

# Cuando los templates se renderizan

Un componente de Lit representa su plantilla inicialmente cuando se agrega al DOM en una página. Después del renderizado inicial, cualquier cambio en las propiedades reactivas del componente activa un ciclo de actualización, volviendo a renderizar el componente.

Actualizaciones por lotes iluminados para maximizar el rendimiento y la eficiencia. La configuración de varias propiedades a la vez desencadena solo una actualización, realizada de forma asincrónica en el momento de la microtarea.

Durante una actualización, solo se vuelven a representar las partes del DOM que cambian. Aunque las plantillas de Lit parecen una interpolación de cadenas, Lit analiza y crea HTML estático una vez, y luego solo actualiza los valores modificados en las expresiones después de eso, lo que hace que las actualizaciones sean muy eficientes.

# DOM encapsulation

Lit usa shadow DOM para encapsular el DOM que representa un componente. Shadow DOM permite que un elemento cree su propio árbol DOM aislado que está separado del árbol del documento principal. Es una característica central de las especificaciones de componentes web que permite la interoperabilidad, la encapsulación de estilo y otros beneficios.

Para obtener más información sobre shadow DOM, consulte Shadow DOM v1: Componentes web autónomos en Web Fundamentals.

# Referencias

- Shadown DOM
- Templates overview
- Template expressions


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
