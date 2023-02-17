# agregue-el-decorado-defer-a-las-funciones

````js
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// revísalo
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // muestra 3 después de 1 seg
````

Tenga en cuenta: utilizamos this en f.apply para que nuestro decorado funcione para los métodos de objetos.

Entonces, si la función contenedora es llamada como método de objeto, this se pasa al método original f.

````js
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

let user = {
  name: "John",
  sayHi() {
    alert(this.name);
  }
}

user.sayHi = user.sayHi.defer(1000);

user.sayHi();
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/readme.md#agregue-el-decorado-defer-a-las-funciones)
