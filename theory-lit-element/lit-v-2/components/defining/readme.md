# Defining a component

# Introducción

Defina un componente Lit creando una clase que extienda LitElement y registrando su clase con el navegador:

```jsx
@customElement("simple-greeting")
export class SimpleGreeting extends LitElement {
  /* ... */
}
```

El decorador `@customElement` es una forma abreviada de llamar a customElements.define, que registra una clase de elemento personalizado con el navegador y la asocia con un nombre de elemento (en este caso, saludo simple).

Si está usando JavaScript, o si no está usando decoradores, puede llamar a `define()` directamente:

```jsx
export class SimpleGreeting extends LitElement {
  /* ... */
}
customElements.define("simple-greeting", SimpleGreeting);
```

# A Lit component is an HTML element

Cuando define un componente Lit, está definiendo un elemento HTML personalizado. Entonces puede usar el nuevo elemento como usaría cualquier elemento integrado:

```jsx
<simple-greeting name="Markup"></simple-greeting>
```

```jsx
const greeting = document.createElement("simple-greeting");
```

La clase base `LitElement` es una subclase de `HTMLElement`, por lo que un componente Lit hereda todas las propiedades y métodos estándar de `HTMLElement`.

Específicamente, `LitElement` hereda de `ReactiveElement`, que implementa propiedades reactivas y, a su vez, hereda de `HTMLElement`.

![image](https://user-images.githubusercontent.com/37599330/222720526-2061953d-400f-4980-84be-4426e574d3ff.png)

# Providing good TypeScript typings

TypeScript inferirá la clase de un elemento HTML devuelto por ciertas API DOM en función del nombre de la etiqueta. Por ejemplo, `document.createElement('img')` devuelve una instancia de `HTMLImageElement` con una propiedad `src: string`.

Los elementos personalizados pueden obtener este mismo tratamiento si se agregan a `HTMLElementTagNameMap` de la siguiente manera:

```jsx
@customElement('my-element')
export class MyElement extends LitElement {
  @property({type: Number})
  aNumber: number = 5;
  /* ... */
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

Al hacer esto, el siguiente código verifica correctamente el tipo:

```jsx
const myElement = document.createElement("my-element");
myElement.aNumber = 10;
```

Recomendamos agregar una entrada `HTMLElementTagNameMap` para todos los elementos creados en TypeScript y asegurarse de publicar sus tipos de .d.ts en su paquete npm.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
