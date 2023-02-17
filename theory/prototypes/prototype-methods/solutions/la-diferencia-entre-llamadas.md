# la-diferencia-entre-llamadas

La primera llamada tiene `this == rabbit`, las otras tienen `this` igual a `Rabbit.prototype`, porque en realidad es el objeto antes del punto.

Entonces, solo la primera llamada muestra `Rabbit`, las otras muestran `undefined`:

````js
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.sayHi = function() {
  alert( this.name );
}

let rabbit = new Rabbit("Conejo");

rabbit.sayHi();                        // Conejo
Rabbit.prototype.sayHi();              // undefined
Object.getPrototypeOf(rabbit).sayHi(); // undefined
rabbit.__proto__.sayHi();              // undefined
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/prototype-methods/readme.md#la-diferencia-entre-llamadas)
