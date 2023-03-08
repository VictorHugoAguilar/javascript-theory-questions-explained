# Expressions

# Introducción

Las plantillas iluminadas pueden incluir valores dinámicos llamados expresiones. Una expresión puede ser cualquier expresión de JavaScript. La expresión se evalúa cuando se evalúa la plantilla y el resultado de la expresión se incluye cuando se representa la plantilla. En un componente Lit, esto significa cada vez que se llama al método render.

Las expresiones solo se pueden colocar en ubicaciones específicas de la plantilla, y la forma en que se interpreta una expresión depende de dónde aparece. Las expresiones dentro de la propia etiqueta del elemento afectan al elemento. Expresiones dentro del contenido del elemento, donde van los nodos secundarios, representan nodos secundarios o texto.

Los valores válidos para las expresiones difieren según el lugar donde aparece la expresión. Generalmente, todas las expresiones aceptan valores primitivos como cadenas y números, y algunas expresiones admiten tipos de valores adicionales. Además, todas las expresiones pueden aceptar directivas, que son funciones especiales que personalizan la forma en que se procesa y representa una expresión. Consulte Directivas personalizadas para obtener más información.

Aquí hay una referencia rápida seguida de información más detallada sobre cada tipo de expresión.

| Type | Example |
| --- | --- |
| Child nodes | `html' <h1>Hello ${name}</h1> <ul> ${listItems} </ul>'` |
| Attributes | `html'<div class=${highlightClass}></div>'` |
| Boolean Attributes | `html'<div ?hidden=${!show}></div>'` |
| Properties | `html'<input .value=${value}>'` |
| Event listeners | `html'<button @click=${this._clickHandler}>Go</button>'` |
| Element directives | `html'<input ${ref(inputRef)}>'` |

Este ejemplo básico muestra una variedad de diferentes tipos de expresiones.

```jsx
/* playground-fold */
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
  static properties = {
    greeting: {},
    todos: {type: Array},
    show: {type: Boolean},
  };

  constructor() {
    super();
    this.greeting = `Hiya, let's get some stuff done...`;
    this.todos = ['sleep!', 'eat', 'work', 'exercise'];
    this.show = false;
  }
  /* playground-fold-end */

  render() {
    return html`
      <p>
        ${this.greeting}
        <button @click=${() => (this.show = !this.show)}>Todos</button>
      </p>
      ${
        this.show
          ? html`
          <ul>${this.todos.map((i) => html`<li>${i}</li>`)}</ul>
        `
          : ''
      }`;
  } /* playground-fold */
}
customElements.define('my-element', MyElement);
```

# Child expressions

Una expresión que se produce entre las etiquetas de inicio y finalización de un elemento puede agregar nodos secundarios al elemento. Por ejemplo:

```jsx
html`<p>Hello, ${name}</p>`
```

o:

```jsx
html`<main>${bodyText}</main>`
```

Las expresiones en la posición secundaria pueden tomar muchos tipos de valores:

- A los valores **primitivos** les gustan las cadenas, los números y los booleanos.
- Objetos `TemplateResult` creados con la función html (o la función svg, si la expresión está dentro de un elemento `<svg>`).
- nodos DOM.
- El centinela no valora nada ni ningún Cambio.
- Matrices o iterables de cualquiera de los tipos admitidos.

## valores primitivos

Lit puede representar casi todos los valores primitivos y los convierte en cadenas cuando se interpolan en contenido de texto.

Los valores numéricos como `5` representarán la cadena `'5'`. Los bigints se tratan de manera similar.

Un valor booleano true se traducirá en `'true'` y false se traducirá en `'false'`, pero representar un valor booleano como este es poco común. En su lugar, los booleanos se utilizan normalmente en condicionales para representar otros valores apropiados.  

La cadena vacía `''`, `null` y `undefined` reciben un tratamiento especial y **no generan nada**. 

Los valores de símbolo no se pueden convertir en cadenas y arrojar cuando se colocan en expresiones secundarias.

## Valores centinela

Lit proporciona un par de valores centinela especiales que se pueden usar en expresiones secundarias.

El valor centinela `noChange` no cambia el valor existente de la expresión. Por lo general, se usa en directivas personalizadas. Consulte Señalización sin cambios para obtener más información.

El centinela `nothing` no rinde nada. 

## Templates (Plantillas)

Dado que una expresión en la posición secundaria puede devolver un `TemplateResult`, puede anidar y componer plantillas:

```jsx
const nav = html`<nav>...</nav>`;
const page = html`
  ${nav}
  <main>...</main>
`;
```

Esto significa que puede usar JavaScript simple para crear plantillas condicionales, plantillas repetitivas y más.

```jsx
html`
  ${this.user.isloggedIn
      ? html`Welcome ${this.user.name}`
      : html`Please log in`
  }
`;
```

## DOM nodes

Cualquier nodo DOM se puede pasar a una expresión secundaria. Por lo general, los nodos DOM deben representarse especificando una plantilla usando `html`, pero un nodo DOM puede representarse directamente de esta manera cuando sea necesario. El nodo se adjunta al árbol DOM en ese punto y, por lo tanto, se elimina de cualquier padre actual:

```jsx
const div = document.createElement('div');
const page = html`
  ${div}
  <p>This is some text</p>
`;
```

## Matrices o iterables de cualquiera de los tipos admitidos

Una expresión también puede devolver una matriz o iterable de cualquiera de los tipos admitidos, en cualquier combinación. Puede usar esta función junto con JavaScript estándar, como el método de mapa de matriz, para crear plantillas y listas repetitivas.

## Removing child content

Los valores `null`, `undefined`, la cadena vacía `''` y el valor centinela de nada de Lit eliminan cualquier contenido renderizado previamente y no renderizan ningún nodo.

La configuración o eliminación de contenido secundario a menudo se realiza en función de una condición. Consulte Representación condicional de nada para obtener más información.

Representar ningún nodo puede ser importante cuando una expresión es un elemento secundario de un elemento con Shadow DOM que incluye un `slot` con contenido alternativo. No representar ningún nodo garantiza que se represente el contenido alternativo.

# Attribute expressions

Además de usar expresiones para agregar nodos secundarios, también puede usarlas para establecer los atributos y las propiedades de los elementos.

De forma predeterminada, una expresión en el valor de un atributo establece el atributo:

```jsx
html`<div class=${this.textClass}>Stylish text.</div>`;
```

Dado que los valores de los atributos son siempre cadenas, la expresión debe devolver un valor que se pueda convertir en una cadena.

Si la expresión constituye todo el valor del atributo, puede omitir las comillas. Si la expresión constituye solo una parte del valor del atributo, debe citar el valor completo:

```jsx
html`<img src="/images/${this.image}">`;
```

Tenga en cuenta que algunos valores primitivos se manejan especialmente en los atributos. Los valores booleanos se convierten en cadenas, por lo que, por ejemplo, `false` se convierte en `'false'`. Tanto `undefined` como `null` representan un atributo como una cadena vacía.

## Boolean attributes

Para establecer un atributo booleano, utilice el `?` prefijo con el nombre del atributo. El atributo se agrega si la expresión se evalúa como un valor true, se elimina si se evalúa como un valor false:

```jsx
html`<div ?hidden=${!this.showAdditional}>This text may be hidden.</div>`;
```

## Removing an attribute

A veces, desea establecer un atributo solo bajo ciertas condiciones y, de lo contrario, eliminar el atributo. Para los "atributos booleanos" comunes, como `disabled` y `hidden`, donde desea establecer el atributo en una cadena vacía para obtener un valor `true` y eliminarlo de lo contrario, use un atributo booleano. A veces, sin embargo, es posible que necesite una condición diferente para agregar o quitar un atributo.

Por ejemplo, considere:

```jsx
html`<img src="/images/${this.imagePath}/${this.imageFile}">`;
```

Si `this.imagePath` o `this.imageFile` no está definido, el atributo `src` no debe establecerse o se producirá una solicitud de red no válida.

El valor centinela de `nothing` de Lit aborda esto eliminando el atributo cuando cualquier expresión en el valor del atributo se evalúa como `nothing`.

```jsx
html`<img src="/images/${this.imagePath ?? nothing}/${this.imageFile ?? nothing}">`;
```

En este ejemplo, se deben definir las propiedades `this.imagePath` y `this.imageFile` para que se establezca el atributo src. El `??` El operador coalescente nulo devuelve el valor de la derecha si el valor de la izquierda es `null` o `undefined`.

Lit también proporciona una directiva **ifDefined** que es azúcar por `value ?? nothing`.

```jsx
html`<img src="/images/${ifDefined(this.imagePath)}/${ifDefined(this.imageFile)}">`;
```

También es posible que desee eliminar el atributo si el valor no es true para que los valores de cadena `false` o vacía `''` eliminen el atributo. Por ejemplo, considere un elemento que tiene un valor predeterminado para `this.ariaLabel` de cadena vacía `''`:

```jsx
html`<button aria-label="${this.ariaLabel || nothing}"></button>`
```

En este ejemplo, el atributo `aria-label` se representa solo si `this.ariaLabel` no es una cadena vacía.

La configuración o eliminación de un atributo a menudo se realiza en función de una condición

# Property expressions (Expresiones de propiedad)

Propiedad Puede establecer una propiedad de JavaScript en un elemento utilizando el `.` prefijo y el nombre de la propiedad:

```jsx
html`<input .value=${this.itemCount}>`;
```

Puede usar esta sintaxis para pasar datos complejos por el árbol a los subcomponentes. Por ejemplo, si tiene un componente `my-list` con una propiedad `listItems`, podría pasarle una matriz de objetos:

```jsx
html`<my-list .listItems=${this.items}></my-list>`;
```

Tenga en cuenta que el nombre de la propiedad en este ejemplo, `listItems`, es una combinación de mayúsculas y minúsculas. Aunque los atributos HTML no distinguen entre mayúsculas y minúsculas, Lit conserva las mayúsculas y minúsculas para los nombres de propiedad cuando procesa la plantilla.

# Event listener expressions (expresiones de escucha de eventos)

Las plantillas también pueden incluir detectores de eventos declarativos. Utilice el prefijo `@` seguido del nombre del evento. La expresión debe evaluarse como un detector de eventos.

```jsx
html`<button @click=${this.clickHandler}>Click Me!</button>`;
```

Esto es similar a llamar a `addEventListener('click', this.clickHandler)` en el elemento del botón.

El detector de eventos puede ser una función simple o un objeto con un método `handleEvent`, lo mismo que el argumento detector del método estándar `addEventListener`.

En un componente Lit, el detector de eventos se vincula automáticamente al componente, por lo que puede usar `this` valor dentro del controlador para hacer referencia a la instancia del componente.

```jsx
clickHandler() {
  this.clickCount++;
}
```

# Element expressions (expresiones de elementos)

También puede agregar una expresión que acceda a una instancia de elemento, en lugar de una sola propiedad o atributo en un elemento:

```jsx
html`<div ${myDirective()}></div>`
```

Las expresiones de elementos solo funcionan con directivas. Se ignora cualquier otro tipo de valor en una expresión de elemento.

Una directiva incorporada que se puede usar en una expresión de elemento es la directiva `ref`. Proporciona una referencia al elemento renderizado.

```jsx
html`<button ${ref(this.myRef)}`;
```

# Well-formed HTML

Las plantillas iluminadas deben ser HTML bien formado. Las plantillas son analizadas por el analizador HTML integrado del navegador antes de interpolar cualquier valor. Siga estas reglas para plantillas bien formadas:

- Las plantillas deben ser HTML bien formado cuando todas las expresiones se reemplazan por valores vacíos.
- Las plantillas pueden tener varios elementos y texto de nivel superior.
- Las plantillas no deben contener elementos no cerrados; el analizador HTML los cerrará.
    
    ```jsx
    // HTML parser closes this div after "Some text"
    const template1 = html`<div class="broken-div">Some text`;
    // When joined, "more text" does not end up in .broken-div
    const template2 = html`${template1} more text. </div>`;
    ```
    

> ℹ️ Debido a que el analizador integrado del navegador es muy indulgente, la mayoría de los casos de plantillas con formato incorrecto no se detectan en tiempo de ejecución, por lo que no verá advertencias, solo plantillas que no se comportan como esperaba. Recomendamos usar herramientas de linting y complementos IDE para encontrar problemas en sus plantillas durante el desarrollo.
> 

# Valid expression locations

Las expresiones **solo pueden ocurrir** donde puede colocar valores de atributo y elementos secundarios en HTML.

```jsx
<!-- attribute values -->
<div label=${label}></div>
<button ?disabled=${isDisabled}>Click me!</button>
<input .value=${currentValue}>
<button @click=${this.handleClick()}>

<!-- child content -->
<div>${textContent}</div>
```

Las expresiones de elementos pueden aparecer dentro de la etiqueta de apertura después del nombre de la etiqueta:

```jsx
<div ${ref(elementReference)}></div>
```

## ****Invalid locations****

Por lo general, las expresiones no deben aparecer en las siguientes ubicaciones:

- Donde aparecerían los nombres de etiquetas o atributos. Lit no admite valores que cambien dinámicamente en esta posición y generará un error en el modo de desarrollo.
    
    ```jsx
    <!-- ERROR -->
    <${tagName}></${tagName}>
    
    <!-- ERROR -->
    <div ${attrName}=true></div>
    ```
    
- Dentro del contenido del elemento `<template>` (se permiten expresiones de atributo en el propio elemento de la plantilla). Lit no recurre al contenido de la plantilla para actualizar dinámicamente las expresiones y generará un error en el modo de desarrollo.
    
    ```jsx
    <!-- ERROR -->
    <template>${content}</template>
    
    <!-- OK -->
    <template id="${attrValue}">static content ok</template>
    ```
    
- Dentro del contenido del elemento `<textarea>` (se permiten expresiones de atributo en el propio elemento textarea). Tenga en cuenta que Lit puede representar contenido en un área de texto, sin embargo, editar el área de texto romperá las referencias al DOM que Lit usa para actualizar dinámicamente, y Lit advertirá en el modo de desarrollo. En su lugar, enlace a la propiedad `.value` de textarea.
    
    ```jsx
    <!-- BEWARE -->
    <textarea>${content}</textarea>
    
    <!-- OK -->
    <textarea .value=${content}></textarea>
    
    <!-- OK -->
    <textarea id="${attrValue}">static content ok</textarea>
    ```
    
- Del mismo modo, dentro de los elementos con el atributo `contenteditable`. En su lugar, enlace a la propiedad `.innerText` del elemento.
    
    ```jsx
    <!-- BEWARE -->
    <div contenteditable>${content}</div>
    
    <!-- OK -->
    <div contenteditable .innerText=${content}></div>
    
    <!-- OK -->
    <div contenteditable id="${attrValue}">static content ok</div>
    ```
    
- Dentro de comentarios HTML. Lit no actualizará las expresiones en los comentarios y, en cambio, las expresiones se representarán con una cadena de token de Lit. Sin embargo, esto no interrumpirá las expresiones posteriores, por lo que es seguro comentar bloques de HTML durante el desarrollo que pueden contener expresiones.
    
    ```jsx
    <!-- will not update: ${value} -->
    ```
    
- Dentro de los elementos `<style>` cuando se usa el polyfill ShadyCSS.

Tenga en cuenta que las expresiones en todos los casos no válidos anteriores son válidas cuando se usan expresiones estáticas, aunque estas no deben usarse para actualizaciones sensibles al rendimiento debido a las ineficiencias involucradas (consulte a continuación).

# Static expressions

Las expresiones estáticas devuelven valores especiales que se interpolan en la plantilla antes de que Lit la procese como HTML. Debido a que se convierten en parte del HTML estático de la plantilla, se pueden colocar en cualquier parte de la plantilla, incluso donde normalmente no se permitirían las expresiones, como en los nombres de etiquetas y atributos.

Para usar expresiones estáticas, debe importar una versión especial de las etiquetas de plantilla `html` o `svg` del módulo `static-html` de Lit:

```jsx
import {html, literal} from 'lit/static-html.js';
```

El módulo `static-html` contiene funciones de etiquetas html y svg que admiten expresiones estáticas y deben usarse en lugar de las versiones estándar provistas en el módulo iluminado. Utilice la función de etiqueta literal para crear expresiones estáticas.

Puede usar expresiones estáticas para opciones de configuración que es poco probable que cambien o para personalizar partes de la plantilla que no puede usar con expresiones normales; consulte la sección sobre Ubicaciones de expresiones válidas para obtener más detalles. Por ejemplo, un componente `my-button` podría generar una etiqueta `<button>`, pero una subclase podría generar una etiqueta `<a>` en su lugar. Este es un buen lugar para usar una expresión estática porque la configuración no cambia con frecuencia y la personalización de una etiqueta HTML no se puede hacer con una expresión normal.

```jsx
import {LitElement} from 'lit';
import {html, literal} from 'lit/static-html.js';

class MyButton extends LitElement {
  static properties = {
    caption: {},
    active: {type: Boolean},
  };

  tag = literal`button`;
  activeAttribute = literal`active`;

  constructor() {
    super();
    this.caption = 'Hello static';
    this.active = false;
  }

  render() {
    return html`
      <${this.tag} ${this.activeAttribute}?=${this.active}>
        <p>${this.caption}</p>
      </${this.tag}>`;
  }
}
customElements.define('my-button', MyButton);
```

```jsx
class MyAnchor extends MyButton {
  tag = literal`a`;
}
customElements.define('my-anchor', MyAnchor);
```

> ⚠️ Cambiar el valor de las expresiones estáticas es costoso. Las expresiones que usan valores literales no deben cambiar con frecuencia, ya que hacen que se vuelva a analizar una nueva plantilla y cada variación se mantiene en la memoria.
> 

En el ejemplo anterior, si la plantilla se vuelve a renderizar y `this.caption` o `this.active` cambian, Lit actualiza la plantilla de manera eficiente, solo cambiando las expresiones afectadas. Sin embargo, si cambia `this.tag` o `this.activeAttribute`, dado que son valores estáticos etiquetados con `literal`, se crea una plantilla completamente nueva; la actualización es ineficiente ya que el DOM se vuelve a renderizar por completo. Además, cambiar los valores `literales` que se pasan a las expresiones aumenta el uso de la memoria, ya que cada plantilla única se almacena en la memoria caché para mejorar el rendimiento de la nueva representación.

Por estas razones, es una buena idea mantener al mínimo los cambios en las expresiones que usan `literales` y evitar usar propiedades reactivas para cambiar los valores `literales`, ya que las propiedades reactivas están destinadas a cambiar.

## Estructura de la plantilla

Después de que se hayan interpolado los valores estáticos, la plantilla debe estar bien formada como las plantillas de Lit normales; de lo contrario, es posible que las expresiones dinámicas de la plantilla no funcionen correctamente. Consulte la sección HTML bien formado para obtener más información.

## Estática no literal

En casos excepcionales, es posible que deba interpolar HTML estático en una plantilla que no está definida en su secuencia de comandos y, por lo tanto, no se puede etiquetar con la función `literal`. Para estos casos, la función `unsafeStatic()` se puede usar para crear HTML estático basado en cadenas de fuentes que no son secuencias de comandos.

```jsx
import {html, unsafeStatic} from 'lit/static-html.js';
```

> ⚠️ Solo para contenido de confianza. Tenga en cuenta el uso de unsafe en `unsafeStatic()`. La cadena que se pasa a `unsafeStatic()` debe estar controlada por el desarrollador y no incluir contenido que no sea de confianza, ya que se analizará directamente como HTML sin desinfección. Los ejemplos de contenido que no es de confianza incluyen parámetros de cadena de consulta y valores de las entradas del usuario. El contenido que no es de confianza presentado con esta directiva podría generar vulnerabilidades de secuencias de comandos entre sitios (XSS).
> 

```jsx
class MyButton extends LitElement {
  static properties = {
    caption: {},
    active: {type: Boolean},
  };

  constructor() {
    super();
    this.caption = 'Hello static';
    this.active = false;
  }

  render() {
    // These strings MUST be trusted, otherwise this is an XSS vulnerability
    const tag = getTagName();
    const activeAttribute = getActiveAttribute();
    return html`
      <${unsafeStatic(tag)} ${unsafeStatic(activeAttribute)}?=${this.active}>
        <p>${this.caption}</p>
      </${unsafeStatic(tag)}>`;
  }
}
customElements.define('my-button', MyButton);
```

Tenga en cuenta que el comportamiento de usar `unsafeStatic` conlleva las mismas advertencias que el `literal`: debido a que cambiar los valores hace que una nueva plantilla se analice y se almacene en la memoria caché, no deberían cambiar con frecuencia.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
