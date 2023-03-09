# Built-in directives

# Introducción

Las directivas son funciones que pueden extender Lit al personalizar la forma en que se representa una expresión. Lit incluye una serie de directivas integradas para ayudar con una variedad de necesidades de representación:

| Directive | Summary |
| --- | --- |
| Styling |  |
| classMap | Asigna una lista de clases a un elemento en función de un objeto. |
| styleMap | Establece una lista de propiedades de estilo para un elemento basado en un objeto. |
| Loops and Conditionals |  |
| when | Representa una de dos plantillas en función de una condición. |
| choose | Representa una de muchas plantillas en función de un valor clave. |
| map | Transforma un iterable con una función. |
| repeat | Representa valores de un iterable en el DOM, con claves opcionales para permitir la diferenciación de datos y la estabilidad del DOM. |
| join | Intercalar valores de un iterable con un valor de unión. |
| range | Crea un iterable de números en una secuencia, útil para iterar un número específico de veces. |
| ifDefined | Establece un atributo si el valor está definido y elimina el atributo si no está definido. |
| Caching and change detection |  |
| cache | Los cachés representan el DOM al cambiar las plantillas en lugar de descartar el DOM. |
| keyed | Asocia un valor renderizable con una clave única, lo que obliga al DOM a volver a renderizar si la clave cambia. |
| guard | Solo vuelve a evaluar la plantilla cuando cambia una de sus dependencias. |
| live | Establece un atributo o propiedad si difiere del valor DOM en vivo en lugar del último valor representado. |
| Referencing rendered DOM |  |
| ref | Obtiene una referencia a un elemento representado en la plantilla. |
| Rendering special values |  |
| templateContent | Representa el contenido de un elemento `<template>` . |
| unsafeHTML | Representa una cadena como HTML en lugar de texto. |
| unsafeSVG | Representa una cadena como SVG en lugar de texto. |
| Asynchronous rendering |  |
| until | Representa contenido de marcador de posición hasta que se resuelven una o más promesas. |
| asyncAppend | Agrega valores de un 'AsyncIterable' en el DOM a medida que se obtienen. |
| asyncReplace | Representa el valor más reciente de un 'AsyncIterable' en el DOM a medida que se obtiene. |


> ℹ️ Empaca solo lo que usas. Estas se llaman directivas "incorporadas" porque son parte del paquete Lit. Pero cada directiva es un módulo separado, por lo que su aplicación solo incluye las directivas que importa.
>

# Styling

## classMap

Establece una lista de clases para un elemento basado en un objeto.

| clave | valor |
| --- | --- |
| Import | import {classMap} from 'lit/directives/class-map.js'; |
| Signature | classMap(classInfo: {[name: string]: string | boolean | number}) |
| Usable location | class attribute expression (must be the only expression in the class attribute) |

La directiva `classMap` usa la API `element.classList` para agregar y quitar clases de manera eficiente a un elemento en función de un objeto pasado por el usuario. Cada clave del objeto se trata como un nombre de clase y, si el valor asociado con la clave es verdadero, esa clase se agrega al elemento. En renderizaciones subsiguientes, se eliminan todas las clases establecidas previamente que sean falsas o que ya no estén en el objeto.

```jsx
class MyElement extends LitElement {
  static properties = {
    enabled: {type: Boolean},
  };

  constructor() {
    super();
    this.enabled = false;
  }

  render() {
    const classes = { enabled: this.enabled, hidden: false };
    return html`<div class=${classMap(classes)}>Classy text</div>`;
  }
}
customElements.define('my-element', MyElement);
```

El `classMap` debe ser la única expresión en el atributo de clase, pero se puede combinar con valores estáticos:

```jsx
html`<div class="my-widget ${classMap(dynamicClasses)}">Static and dynamic</div>`;
```
