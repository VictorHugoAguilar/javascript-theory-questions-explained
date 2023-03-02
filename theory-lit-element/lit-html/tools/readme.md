# Tools

# Introducción

`lit-html` está disponible en el registro npm. Si ya usa npm para administrar dependencias, puede usar lit-html como cualquier otra biblioteca de JavaScript que instale desde npm. Esta sección describe algunas herramientas o complementos adicionales que quizás desee agregar a su flujo de trabajo para facilitar el trabajo con `lit-html`.

`lit-html` se entrega como un conjunto de módulos de JavaScript. Si aún no usa módulos de JavaScript en su proyecto, es posible que deba agregar un par de pasos a su flujo de trabajo de desarrollo y compilación.

# Setup

La forma más sencilla de agregar `lit-html` a un proyecto es instalarlo desde el registro `npm`.

1. Si está iniciando un proyecto nuevo, ejecute el siguiente comando en su área de proyecto para configurar npm:

```jsx
npm init
```

Responda a las indicaciones para configurar su proyecto. Puede presionar regresar para aceptar los valores predeterminados.

1. Instale `lit-html`.

```jsx
npm i lit-html
```

1. Si está trabajando en un proyecto con muchas dependencias front-end, es posible que desee utilizar el comando npm dedupe para intentar reducir los módulos duplicados:

```jsx
npm deduplicación
```

# Develpolment

Durante la fase de desarrollo, es posible que desee las siguientes herramientas:

- Complementos IDE, para pelusa y resaltado de código.
- Complementos Linter, para verificar plantillas `lit-html`.
- Un servidor de desarrollo, para obtener una vista previa del código sin un paso de compilación.

## IDE plugins

Hay una serie de complementos IDE que pueden ser útiles al desarrollar con `lit-html`. En particular, recomendamos usar un resaltador de código que funcione con plantillas de estilo `lit-html`. Además, recomendamos usar un linter como ESLint que admita JavaScript moderno.

Los siguientes complementos de VS Code y TypeScript verifican las plantillas `lit-html` en busca de errores:

- [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
- [TypeScript plugin (works with Sublime and Atom)](https://github.com/runem/lit-analyzer/tree/master/packages/ts-lit-plugin)

More plugins

El repositorio awesome-lit-html enumera otros complementos IDE.

## Linting

Se recomienda ESLint para limpiar el código `lit-html`. Se puede agregar el siguiente complemento ESLint para verificar algunos problemas comunes en las plantillas `lit-html`:

- [https://github.com/43081j/eslint-plugin-lit](https://github.com/43081j/eslint-plugin-lit)

Otra alternativa es usar la CLI de lit-analyzer junto con ESLint para detectar problemas en sus plantillas de `lit-html`:

- [https://github.com/runem/lit-analyzer/tree/master/packages/lit-analyzer](https://github.com/runem/lit-analyzer/tree/master/packages/lit-analyzer)

lit-analyzer usa el mismo backend que los complementos de VS Code y TypeScript que se enumeran en los complementos de IDE.

## Dev server

`lit-html` está empaquetado como módulos de JavaScript. Muchos desarrolladores prefieren importar módulos usando especificadores de módulos básicos:

```jsx
import { html, render } from "lit-html";
```

Para ejecutarse en el navegador, el identificador simple ('lit-html') debe transformarse en una ruta o URL que el navegador pueda cargar (como '/node_modules/lit-html/lit-html.js'). El servidor de desarrollo ES es un servidor de desarrollo de código abierto que maneja esta y otras transformaciones.

También puede usar el servidor de desarrollo CLI de Polymer, si ya lo tiene instalado. Para nuevos proyectos, recomendamos el servidor de desarrollo ES.

Si ya tiene un servidor de desarrollo que se integra con su proceso de compilación, puede usarlo en su lugar.

### ES Dev Server

El servidor de desarrollo ES permite un proceso de desarrollo sin compilación. Maneja la reescritura de especificadores de módulos desnudos en rutas o URL válidas, según lo requiera el navegador. Para IE11, el servidor de desarrollo ES también transforma los módulos de JavaScript para usar el cargador de módulos SystemJS compatible con versiones anteriores.

Instale el servidor de desarrollo ES:

```jsx
npm i -D es-dev-server
```

Agregue un comando a su archivo package.json:

```jsx
"scripts": {
  "start": "es-dev-server --app-index index.html --node-resolve --watch --open"
}
```

Ejecute el servidor de desarrollo:

```jsx
npm run start
```

Para obtener instrucciones completas de instalación y uso, consulte el sitio web de open-wc.

# Testing

`lit-html` no tiene muchos requisitos de prueba especiales. Si ya tiene una configuración de prueba, debería funcionar bien siempre que admita trabajar con módulos de JavaScript (y especificadores de módulos de estilo de nodo, si los usa).

Web Component Tester (WCT) es un entorno de prueba de extremo a extremo que admite especificadores de módulos de estilo de nodo. funciona con el marco de prueba de Mocha y (opcionalmente) la biblioteca de aserciones de Chai. Hay dos formas de agregar WCT a su proyecto:

- [web-component-tester](https://www.npmjs.com/package/web-component-tester). La instalación del paquete WCT completo le brinda Mocha y Chai, así como algunos otros complementos.
- [wct-mocha](https://www.npmjs.com/package/wct-mocha). Solo la biblioteca del lado del cliente de WCT. Deberá instalar su propia versión de Mocha y cualquier otro complemento que desee.

Alternativamente, también puede usar el corredor de prueba Karma. Las recomendaciones de Open Web Components incluyen una configuración de Karma que resuelve las dependencias de los módulos al agruparlos con el paquete web antes de ejecutar las pruebas.

# Build

Las herramientas de compilación toman su código y lo preparan para la producción. Entre las cosas que puede necesitar herramientas de compilación para hacer:

- Agrupe los módulos para mejorar el rendimiento al reducir la cantidad de archivos que deben transferirse.
- Minimice JavaScript, HTML y CSS.
- Transforme el código para navegadores heredados: compile el código ES6 en ES5 y transforme los módulos de JavaScript en otros formatos.
- Agregue los polyfills requeridos (se puede hacer manualmente).

Muchas herramientas de compilación pueden hacer esto por usted. Actualmente recomendamos Rollup y proporcionamos un proyecto de muestra usando Rollup.

Si está utilizando otra herramienta o creando su propia configuración de resumen, consulte la sección sobre Consideraciones de compilación.

Para obtener más detalles sobre los pasos de compilación, consulte la guía LitElement Build for production. `lit-html` tiene los mismos requisitos que LitElement, excepto que `lit-html` requiere solo el polyfill de plantilla, no los polyfill completos de componentes web.

## Construye tu proyecto con Rollup

Rollup funciona bien con `lit-html`. El repositorio lit-html-build es un proyecto de ejemplo simple que usa `lit-html` con una compilación acumulada.

Para obtener más información sobre los pasos de compilación, consulte la guía LitElement Build for production.

open-wc también tiene recursos de compilación de resumen.

## Construye tu proyecto con webpack

webpack es una poderosa herramienta de compilación con un gran ecosistema de complementos.

Vea que la configuración del paquete web predeterminado de open-wc proporciona un excelente punto de partida para crear proyectos que usan lit-html. Consulte la página de su paquete web para obtener instrucciones sobre cómo comenzar.

## Construir consideraciones

Si está creando su propia configuración para webpack, Rollup u otra herramienta, aquí hay algunos factores a considerar:

- Compilación de ES6 a ES5.
- Transformar módulos de JavaScript a otros formatos para navegadores heredados.
- minificación de la plantilla `lit-html`.
- Polifills.

Para obtener más detalles sobre estas consideraciones, consulte la guía LitElement Build para producción. `lit-html` tiene los mismos requisitos que LitElement, excepto que `lit-html` requiere solo el polyfill de plantilla, no los polyfill completos de componentes web.

## Compilación y transformación de módulos

Para admitir navegadores heredados, sus herramientas de compilación deben compilar las funciones de ES6 en ES5. En general, ES6 es más rápido que el equivalente de ES5, así que intente servir ES6 a los navegadores que lo admitan.

Sus herramientas de compilación deben aceptar módulos de JavaScript (también llamados módulos ES) y transformarlos a otro formato de módulo, como SystemJS, si es necesario. Si usa especificadores de módulos de estilo de nodo, su compilación también deberá transformarlos en especificadores de módulos listos para el navegador.

Si está trabajando en TypeScript, el compilador de TypeScript, tsc, puede generar resultados diferentes para diferentes navegadores. Sin embargo, existen problemas conocidos con la salida compilada para navegadores más antiguos. Recomendamos configurar TypeScript para generar JavaScript moderno (objetivo ES2017 y módulos ES) y usar Babel para compilar la salida para navegadores más antiguos.

Por ejemplo, si tiene un archivo `tsconfig.json`, incluiría las siguientes opciones para generar JavaScript moderno:

```jsx
{
  "compilerOptions": {
    "target": "es2017",
    "module": "es2015",
    ...
```

## Template minification

Como parte del proceso de creación, probablemente querrá minimizar las plantillas HTML. La mayoría de los minificadores de HTML no admiten HTML dentro de los literales de plantilla, como los que usa `lit-html`, por lo que deberá usar un complemento de compilación que admita la minimización de plantillas de `lit-html`. Minimizar las plantillas `lit-html` puede mejorar el rendimiento al reducir la cantidad de nodos en una plantilla.

- Babel plugin. Para construir cadenas que usan Babel para la compilación. La configuración predeterminada del paquete web open-wc usa este complemento.
- Rollup plugin. Si está creando su propia configuración de resumen.

La minificación de plantillas es una optimización bastante pequeña en comparación con otras optimizaciones comunes como la minificación, agrupación y compresión de JavaScript.

## Template polyfill

Para ejecutar en Internet Explorer 11, que no admite el elemento `<template>`, necesitará un polyfill. Puede usar el polyfill de plantilla incluido con los polyfills de Web Components.

Instale la plantilla polyfill:

```jsx
npm i @webcomponents/template
```

Usando el template polyfills:

```jsx
<script src="./node_modules/@webcomponents/template/template.min.js"></script>
```

Nota: al transpilar para IE11, los polyfills de Babel deben agruparse por separado del código de la aplicación y cargarse antes que el polyfill de la plantilla. Esto se demuestra en el archivo index-prod.html en el proyecto de ejemplo de resumen.

---

[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
