# Decorador espia

El contenedor devuelto por `spy(f)` debe almacenar todos los argumentos y luego usar `f.apply` para reenviar la llamada.

````js
function spy(func) {

  function wrapper(...args) {
    // usamos ...args en lugar de arguments para almacenar un array "real" en wrapper.calls
    wrapper.calls.push(args);
    return func.apply(this, args);
  }

  wrapper.calls = [];

  return wrapper;
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/advanced-functions/09_call-apply-decorators)
