# Conditionals

# Introducción

Dado que Lit aprovecha las expresiones normales de Javascript, puede usar construcciones de flujo de control de Javascript estándar como operadores condicionales, llamadas a funciones y declaraciones `if` o `switch` para representar contenido condicional.

Los condicionales de JavaScript también le permiten combinar expresiones de plantillas anidadas e incluso puede almacenar los resultados de las plantillas en variables para usarlas en otros lugares.

# Conditionals with the conditional (ternary) operator

Las expresiones ternarias con el operador condicional, `?`, son una excelente manera de agregar condicionales en línea:

```jsx
render() {
  return this.userName
    ? html`Welcome ${this.userName}`
    : html`Please log in <button>Login</button>`;
}
```

# Conditionals with if statements

Puede expresar lógica condicional con declaraciones if fuera de una plantilla para calcular valores para usar dentro de la plantilla:

```jsx
render() {
  let message;
  if (this.userName) {
    message = html`Welcome ${this.userName}`;
  } else {
    message = html`Please log in <button>Login</button>`;
  }
  return html`<p class="message">${message}</p>`;
}
```

Alternativamente, puede factorizar la lógica en una función separada para simplificar su plantilla:

```jsx
getUserMessage() {
  if (this.userName) {
    return html`Welcome ${this.userName}`;
  } else {
    return html`Please log in <button>Login</button>`;
  }
}
render() {
  return html`<p>${this.getUserMessage()}</p>`;
}
```

# Caching template results: the cache directive

En la mayoría de los casos, los condicionales de JavaScript son todo lo que necesita para las plantillas condicionales. Sin embargo, si está cambiando entre plantillas grandes y complicadas, es posible que desee ahorrar el costo de recrear DOM en cada cambio.

En este caso, puede usar la directiva de `cache`. La directiva de caché almacena en caché DOM para las plantillas que no se están procesando actualmente.

```jsx
render() {
  return html`${cache(this.userName ?
    html`Welcome ${this.userName}`:
    html`Please log in <button>Login</button>`)
  }`;
}
```

# Conditionally rendering nothing

A veces, es posible que desee representar nada en una rama de un operador condicional. Esto es comúnmente necesario para las expresiones secundarias y, a veces, también se necesita en las expresiones de atributos.

Para las expresiones secundarias, los valores `undefined`, `null`, la cadena vacía (`''`) y el valor centinela de nada de Lit no representan nodos. 

Este ejemplo muestra un valor si existe y, de lo contrario, no muestra nada:

```jsx
render() {
  return html`<user-name>${this.userName ?? nothing}</user-name>`;
}
```

Para las expresiones de atributo, el valor centinela de `nothing` de Lit elimina el atributo.  

Este ejemplo representa condicionalmente el atributo `aria-label`:

```jsx
html`<button aria-label="${this.ariaLabel || nothing}"></button>`
```


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
