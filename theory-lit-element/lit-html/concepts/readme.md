# Concepts

# Introdución

`lit-html` utiliza algunas propiedades únicas de los literales de plantilla de JavaScript y los elementos HTML `<template>` para funcionar y lograr un rendimiento rápido. Así que es útil entenderlos primero.

# Literales de template target

Un literal de plantilla de JavaScript es un literal de cadena que puede tener expresiones de JavaScript incrustadas:

```jsx
`My name is ${name}.`;
```

El literal usa acentos graves en lugar de comillas y puede abarcar varias líneas. La parte dentro de `${}` puede ser cualquier expresión de JavaScript.

Un literal de plantilla etiquetada tiene como prefijo una función de etiqueta de plantilla especial:

```jsx
let name = "Monica";
tag`My name is ${name}.`;
```

Las etiquetas `tags` son funciones que toman las cadenas literales de la plantilla y los valores de las expresiones incrustadas y devuelven un nuevo valor. Puede ser cualquier tipo de valor, no solo cadenas. `lit-html` devuelve un objeto que representa la plantilla, llamado TemplateResult.

Las características clave de las etiquetas de plantilla que utiliza `lit-html` para hacer actualizaciones rápidas es que el objeto que contiene las cadenas de literales de la plantilla es exactamente el mismo para cada llamada a la etiqueta para una plantilla en particular.

Esto significa que las cadenas se pueden usar como una clave en un caché para que `lit-html` pueda hacer la preparación de la plantilla solo una vez, la primera vez que representa una plantilla y las actualizaciones omiten ese trabajo.

# HTML template elements

Un elemento `<template>` contiene un fragmento inerte de DOM. Dentro del contenido de la plantilla, el script no se ejecuta, las imágenes no se cargan, los elementos personalizados no se actualizan, etc. El contenido se puede clonar de manera eficiente. Los elementos de plantilla generalmente se usan para decirle al analizador HTML que una sección del documento no debe ser instanciada cuando se analiza, y será administrada por código en un momento posterior; pero los elementos de plantilla también se pueden crear imperativamente con createElement e innerHTML.

`lit-html` crea elementos HTML `<template>` a partir de los literales de plantilla etiquetados y luego los clona para crear un nuevo DOM.

# Template creation

La primera vez que una plantilla particular de `lit-html` se representa en cualquier parte de la aplicación, `lit-html` realiza un trabajo de configuración único para crear la plantilla HTML en segundo plano. Une todas las partes literales con un marcador de posición especial, similar a `"{{}}"`, luego crea una `<plantilla>` y establece su HTML interno en el resultado.

Si comenzamos con una plantilla como esta:

```jsx
let header = (title) => html`<h1>${title}</h1>`;
```

`lit-html` generará el siguiente HTML:

```jsx
<h1>{{}}</h1>
```

Y crea una `<plantilla>` a partir de eso.

Luego, `lit-html` recorre el DOM de la plantilla y extrae los marcadores de posición y registra su ubicación. La plantilla final no contiene los marcadores de posición:

```jsx
<h1></h1>
```

`lit-html` mantiene una tabla auxiliar de dónde estaban las expresiones:

```jsx
[{ type: "node", index: 1 }];
```

# Template rendering

`render()` toma un `TemplateResult` y lo representa en un contenedor DOM. En el renderizado inicial, clona la plantilla, luego la recorre usando las posiciones de marcador de posición recordadas, para crear objetos de parte.

Una `part` es un "agujero" en el DOM donde se pueden inyectar valores. `lit-html` tiene subclases de `Part` para cada tipo de vinculación: NodePart para vinculaciones de contenido de texto, `AttributePart` para vinculaciones de atributos, etc. Los objetos `Part`, el contenedor y la plantilla a partir de la cual se crearon se agrupan en un objeto llamado `TemplateInstance`.

# Thinking functionally

`lit-html` es ideal para usar en un enfoque funcional para describir interfaces de usuario. Si piensa en la interfaz de usuario como una función de datos, comúnmente expresada como UI = f (datos), puede escribir plantillas `lit-html` que reflejen esto exactamente:

```jsx
let ui = (data) => html`...${data}...`;
```

Este tipo de función se puede llamar en cualquier momento que cambien los datos, y es extremadamente barato de llamar. Lo único que hace lit-html en la etiqueta `html` es reenviar los argumentos a las plantillas.

Cuando se procesa el resultado, `lit-html` solo actualiza las expresiones cuyos valores han cambiado desde el procesamiento anterior.

Esto conduce a un modelo que es fácil de escribir y fácil de razonar: siempre intente describir su IU como una función simple de los datos de los que depende, y evite almacenar en caché el estado intermedio o realizar una manipulación manual de DOM. `lit-html` casi siempre será lo suficientemente rápido con la descripción más simple de su interfaz de usuario.

# Javascript modules

¿Por qué `lit-html` se distribuye como módulos de JavaScript, no como UMD/CJS/AMD?

Hasta que llegaron los módulos, los navegadores no tenían una forma estándar de importar código desde el código, por lo que se requerían cargadores o empaquetadores de módulos del usuario. Como no había un estándar, los formatos de la competencia se han multiplicado. A menudo, las bibliotecas publican en varios formatos para ayudar a los usuarios de diferentes herramientas, pero esto causa problemas cuando muchas otras bibliotecas intermedias dependen de una biblioteca común. Si algunas de esas bibliotecas intermedias cargan el formato A, otras cargan el formato B y otras cargan el formato C, entonces se cargan varias copias, lo que provoca una sobrecarga, una ralentización del rendimiento y, a veces, errores difíciles de encontrar.

La única solución verdadera es tener una versión canónica de una biblioteca que importan todas las demás bibliotecas. Dado que el soporte de módulos se está implementando en los navegadores ahora, y los módulos son muy bien compatibles con las herramientas, tiene sentido que ese formato sea módulos.

Actualmente, el navegador solo acepta módulos especificados mediante una ruta completa o relativa (una ruta que comienza con /, ./ o ../). Para facilitar la creación, muchos desarrolladores prefieren importar módulos por nombre (también conocidos como especificadores de módulo de estilo de nodo). Dado que esto no es compatible actualmente con el navegador, deberá usar herramientas que puedan transformar estos especificadores en rutas listas para el navegador. Consulte Herramientas para obtener información sobre servidores de desarrollo y herramientas de compilación que pueden realizar esta transformación por usted:

```jsx
// Node-style module import:
import { html, render } from "lit-html";
```

```jsx
// Browser-ready module import
import { html, render } from "../node_modules/lit-html/lit-html.js";
```

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
