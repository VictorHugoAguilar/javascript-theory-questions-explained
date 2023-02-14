## Funcion enlazada como metodo

Respuesta: `null`.

````js
function f() {
  alert( this ); // null
}

let user = {
  g: f.bind(null)
};

user.g();
````

El contexto de una función enlazada es fijo. Simplemente no hay forma de cambiarlo más.

Entonces, incluso mientras ejecutamos `user.g()`, la función original se llama con `this = null`.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/advanced-functions/10_bind)
