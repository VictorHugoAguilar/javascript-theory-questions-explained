## Segundo enlace

Respuesta: John.

````js
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Pete"} );

f(); // John
````

El objeto exótico bound function devuelto por `f.bind(...)` recuerda el contexto (y los argumentos si se proporcionan) solo en el momento de la creación.

Una función no se puede volver a vincular.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/advanced-functions/10_bind)
