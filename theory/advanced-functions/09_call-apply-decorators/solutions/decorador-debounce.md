# Decorador debounce

````js
function debounce(func, ms) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}
````

Una llamada a debounce devuelve un contenedor “wrapper”. Cuando se lo llama, planifica la llamada a la función original después de los ms dados y cancela el tiempo de espera anterior.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/advanced-functions/09_call-apply-decorators)
