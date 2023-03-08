# Overview

# Introducción

Los templates de lit se escriben usando literales de plantilla de JavaScript etiquetados con la etiqueta `html`. El contenido del literal es en su mayoría simple, declarativo, HTML:

```jsx
html`<h1>Hello ${name}</h1>`
```

La sintaxis de los templates puede parecer que solo está haciendo una interpolación de cadenas. Pero con los literales de plantilla etiquetados, el navegador pasa a la función de etiqueta una matriz de cadenas (las partes estáticas de la plantilla) y una matriz de expresiones (las partes dinámicas). Lit usa esto para crear una representación eficiente de su plantilla, por lo que puede volver a representar solo las partes de la plantilla que han cambiado.

Las plantillas Lit son extremadamente expresivas y le permiten representar contenido dinámico en una variedad de formas:

- **Expresiones**: las plantillas pueden incluir valores dinámicos llamados expresiones que se pueden usar para representar atributos, texto, propiedades, controladores de eventos e incluso otras plantillas.
- **Condicionales**: las expresiones pueden representar contenido condicional mediante el control de flujo de JavaScript estándar.
- **Listas**: renderice listas transformando datos en matrices de plantillas utilizando técnicas de matriz y bucles de JavaScript estándar.
- **Directivas** **integradas**: las directivas son funciones que pueden ampliar la funcionalidad de creación de plantillas de Lit. La biblioteca incluye un conjunto de directivas integradas para ayudar con una variedad de necesidades de representación.
- **Customs directives (Directivas personalizadas)**: también puede escribir sus propias directivas para personalizar la representación de Lit según sea necesario.

# Standalone templating (plantillas independientes)

También puede usar la biblioteca de plantillas de Lit para crear plantillas independientes, fuera de un componente de Lit.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
