# llamado-async-desde-un-non-async

Este es el caso cuando saber cómo trabaja por dentro es útil.

Simplemente trata el llamado async como una promesa y añádele .then:

````js
async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // muestra 10 después de 1 segundo
  wait().then(result => alert(result));
}

f();
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/async-await/readme.md#llamado-async-desde-un-non-async)
