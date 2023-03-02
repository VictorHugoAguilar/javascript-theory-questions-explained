# Comenzar a utilizarlo

# Instalación

## npm

`lit-html` se distribuye en NPM, en el paquete `lit-html`.

```jsx
npm install lit-html
```

## unpkg.com

Rambien puedes leer `lit-html` directamente desde [unpkg.com](http://unpkg.com/) CDN:

```jsx
import { html, render } from "https://unpkg.com/lit-html?module";
```

## Editores online

Puede probar `lit-html` sin instalar nada usando un editor en línea. A continuación se presentan enlaces a un proyecto de inicio simple de `lit-html` en algunos editores en línea populares:

- [CodeSandbox](https://codesandbox.io/s/wq2wm73o28)
- [JSBin](https://jsbin.com/nahocaq/1/edit?html,output)
- [StackBlitz](https://stackblitz.com/edit/js-pku9ae?file=index.js)

# Importando

Lit-HTML está escrito y distribuido como módulos JavaScript estándar. Los módulos son cada vez más compatibles en entornos de JavaScript y se han enviado en Chrome, Firefox, Edge, Safari y Opera.

Para usar `lit-html`, importárelo a través de una ruta:

```jsx
<script type="module">
  import {(html, render)} from './node_modules/lit-html/lit-html.js'; ...
</script>
```

La instrucción de `import` de JavaScript solo funciona dentro de los scripts del módulo (`<script type = "módulo">`), que puede ser scripts inline (como se muestra arriba) o scripts externos.

La ruta a usar depende de dónde haya instalado `lit-html`. Los navegadores solo admiten importar otros módulos por ruta, no por nombre del paquete, por lo que sin otras herramientas involucradas, tendrá que usar rutas.

Si usa una herramienta que convierte los nombres de paquetes en rutas, puede importar por nombre del paquete:

```jsx
import { html, render } from "lit-html";
```

Para simplificar, los ejemplos en estos documentos usan nombres de paquetes (también conocidos como especificadores de módulos de estilo nodo).

Consulte las herramientas para obtener información sobre las herramientas de compilación y los servidores de desarrollo que puede usar para convertir los especificadores del módulo de estilo nodo a los especificadores de módulos de estilo navegador.

¿Por qué módulos JavaScript? Para obtener más información sobre por qué se distribuye `lit-html` utilizando módulos JavaScript, consulte los módulos JavaScript.

# Renderizando un template

lit-html tiene dos API principales

- La etiqueta de plantilla `html` utilizada para escribir plantillas.
- La función `render()` utilizada para representar una plantilla a un contenedor DOM.

```jsx
// Import lit-html
import { html, render } from "lit-html";

// Define a template
const myTemplate = (name) => html`<p>Hello ${name}</p>`;

// Render the template to the document
render(myTemplate("World"), document.body);
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
