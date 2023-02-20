# error-en-settimeout

La respuesta es: no, no lo hará:

````js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);
````

Como vimos en el capítulo, hay un "try..catch implícito" en el código de la función. Así se manejan todos los errores síncronos.

Pero aquí el error no se genera mientras el ejecutor está corriendo, sino más tarde. Entonces la promesa no puede manejarlo.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/promise-error-handling/readme.md#error-en-settimeout)
