## Establecer y disminuir un contador

La solución usa count en la variable local, pero los métodos de suma se escriben directamente en el counter. Comparten el mismo entorno léxico externo y también pueden acceder al count actual.

````js
function makeCounter() {
  let count = 0;

  function counter() {
    return count++;
  }

  counter.set = value => count = value;

  counter.decrease = () => count--;

  return counter;
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/06_function-object/readme.md)
