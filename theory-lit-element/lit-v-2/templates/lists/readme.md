# Lists

# Introducción

Puede utilizar construcciones estándar de JavaScript para crear template repetitivas.

Lit también proporciona una directiva de repetición para construir ciertos tipos de listas dinámicas de manera más eficiente.

# Rendering arrays

Cuando una expresión en la posición secundaria devuelve una matriz o es iterable, Lit representa todos los elementos de la matriz:

```jsx
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
/* playground-fold-end */

static properties = {
  colors: {},
};

constructor() {
  super();
  this.colors = ['red', 'green', 'blue'];
}

render() {
  return html`<p>Colors: ${this.colors}</p>`;
}
/* playground-fold */

}
customElements.define('my-element', MyElement);
```

En la mayoría de los casos, querrá transformar los elementos de la matriz en una forma más útil.

# **Repeating templates with map**

Para representar listas, puede usar el `map` para transformar una lista de datos en una lista de plantillas:

```jsx
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
/* playground-fold-end */

static properties = {
  colors: {},
};

constructor() {
  super();
  this.colors = ['red', 'green', 'blue'];
}

render() {
  return html`
    <ul>
      ${this.colors.map((color) =>
        html`<li style="color: ${color}">${color}</li>`
      )}
    </ul>
  `;
}
/* playground-fold */

}
customElements.define('my-element', MyElement);
```

Tenga en cuenta que esta expresión devuelve una matriz de objetos `TemplateResult`. Lit representará una matriz o iterable de subplantillas y otros valores.

# Repeating templates with looping statements

También puede crear una matriz de plantillas y pasarla a una expresión de plantilla.

```jsx
render() {
  const itemTemplates = [];
  for (const i of this.items) {
    itemTemplates.push(html`<li>${i}</li>`);
  }

  return html`
    <ul>
      ${itemTemplates}
    </ul>
  `;
}
```

# The repeat directive

En la mayoría de los casos, el uso de bucles o `map` es una forma eficiente de crear plantillas repetitivas. Sin embargo, si desea reordenar una lista grande o modificarla agregando y eliminando entradas individuales, este enfoque puede implicar la actualización de una gran cantidad de nodos DOM.

La directiva de `repeat` puede ayudar aquí.

La directiva de `repeat` realiza actualizaciones eficientes de listas basadas en claves proporcionadas por el usuario:

```jsx
repeat(items, keyFunction, itemTemplate)
```

Dónde:

- `items` es una matriz o iterable.
- `keyFunction` es una función que toma un solo elemento como argumento y devuelve una clave única garantizada para ese elemento.
- `itemTemplate` es una función de plantilla que toma el elemento y su índice actual como argumentos y devuelve un `TemplateResult`.

Por ejemplo:

```jsx
/* playground-fold */
import {LitElement, html} from 'lit';
/* playground-fold-end */

import {repeat} from 'lit/directives/repeat.js';
/* playground-fold */

class MyElement extends LitElement {
  static properties = {
    employees: {},
  };

  constructor() {
    super();
    this.employees = [
      {id: 0, givenName: 'Fred', familyName: 'Flintstone'},
      {id: 1, givenName: 'George', familyName: 'Jetson'},
      {id: 2, givenName: 'Barney', familyName: 'Rubble'},
      {id: 3, givenName: 'Cosmo', familyName: 'Spacely'},
    ];
  }

  sort = 1;
  /* playground-fold-end */

  render() {
    return html`
    <ul>
      ${repeat(
        this.employees,
        (employee) => employee.id,
        (employee, index) => html`
        <li>${index}: ${employee.familyName}, ${employee.givenName}</li>
      `
      )}
    </ul>
    <button @click=${this.toggleSort}>Toggle sort</button>
  `;
  }
  /* playground-fold */

  toggleSort() {
    this.sort *= -1;
    this.employees = [
      ...this.employees.sort(
        (a, b) =>
          this.sort *
          (a.familyName.localeCompare(b.familyName) ||
            a.givenName.localeCompare(b.givenName))
      ),
    ];
  }
}
customElements.define('my-element', MyElement);
```

Si reordena la matriz de `employees`, la directiva de repetición reordena los nodos DOM existentes.

Para comparar esto con el manejo predeterminado de Lit para las listas, considere invertir una gran lista de nombres:

- Para una lista creada con `map`, Lit mantiene los nodos DOM para los elementos de la lista, pero reasigna los valores.
- Para una lista creada con `repeat`, la directiva de repetición reordena los nodos DOM existentes, por lo que los nodos que representan el primer elemento de la lista se mueven a la última posición.

## When to use map or repeat (Cuándo usar map o repeat)

Qué repetición es más eficiente depende de su caso de uso:

- Si actualizar los nodos DOM es más costoso que moverlos, use la directiva de `repeat`.
- Si los nodos DOM tienen un estado que no está controlado por una expresión de plantilla, use la directiva de `repeat`.
    
    Por ejemplo, considere esta lista:
    
    ```jsx
    html`${this.users.map((user) =>
      html`
        <div><input type="checkbox"> ${user.name}</div>
      `)
    }`
    ```
    
    La casilla de verificación tiene un estado marcado o no marcado, pero no está controlada por una expresión de plantilla.
    
    Si reordena la lista después de que el usuario haya marcado una o más casillas de verificación, Lit actualizará los nombres asociados con las casillas de verificación, pero no el estado de las casillas de verificación.
    

Si no se aplica ninguna de estas situaciones, use sentencias de `map` o de bucle.



---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
