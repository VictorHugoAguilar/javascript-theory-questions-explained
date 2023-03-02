# Introducción

# ¿Qué es lit-html?

`lit-html` es una biblioteca de plantillas HTML simple, moderna, segura, pequeña y rápida para JavaScript.

`lit-html` le permite escribir plantillas HTML en JavaScript usando literales de plantilla con expresiones de JavaScript integradas. `lit-html` identifica las partes estáticas y dinámicas de sus plantillas para que pueda actualizar de manera eficiente solo las porciones cambiadas.

¿Construir componentes? `lit-html` no está vinculado a ningún modelo de componente, se centra solo en crear y actualizar DOM. Si desea crear componentes, consulte `litElement`, una biblioteca para construir componentes web utilizando plantillas `lit-html`.

# `lit-html` Templates

Las plantillas `lit-html` son literales de plantillas etiquetadas: se parecen a las cadenas JavaScript pero están encerradas en backticks `(``)` en lugar de citas, y etiquetados con la etiqueta `html` de `lit-html`:

```jsx
html`<h1>Hello ${name}</h1>`;
```

Dado que las plantillas `lit-html` casi siempre necesitan fusionarse con los datos de los valores de JavaScript, y poder actualizar DOM cuando cambien esos datos, a menudo se escribirán dentro de las funciones que toman algunos datos y devuelven una plantilla de HTML, para que La función se puede llamar varias veces:

```jsx
let myTemplate = (data) => html` <h1>${data.title}</h1>
  <p>${data.body}</p>`;
```

Lit-html se presenta perezosamente (lazily). Llamar a esta función evaluará la plantilla literal utilizando la etiqueta `html`. `lit-html` y devolverá un `Templateresult`, un registro de la plantilla para representarlo y los datos para renderizarla. Los `Templateresult` son muy baratos de producir y realmente no ocurre un trabajo real hasta que se renderizan al DOM.

# Renderizando

Para renderizar un `TemplaterResult`, llame a la función `render()` con un resultado y un contenedor DOM para que renderice a:

```jsx
const result = myTemplate({ title: "Hello", body: "lit-html is cool" });
render(result, document.body);
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
