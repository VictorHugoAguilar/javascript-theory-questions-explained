## Función min(a, b)

Una solución usando if:

````js
function min(a, b) {
  if (a < b) {
    return a;
  } else {
    return b;
  }
}
````

Una solución con un operador de signo de interrogación '?':

````js
function min(a, b) {
  return a < b ? a : b;
}
````

> P.D: En el caso de una igualdad a == b No importa qué devuelva.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/15_function-basics/readme.md#funcion-min-a-b)
