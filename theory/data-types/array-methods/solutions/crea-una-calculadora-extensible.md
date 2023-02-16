# crea-una-calculadora-extensible

* Por favor ten en cuenta cómo son almacenados los métodos. Simplemente son agregados a la propiedad this.methods.
* Todos los test y conversiones son hechas con el método calculate. En el futuro puede ser extendido para soportar expresiones más complejas.

````js
function Calculator() {

  this.methods = {
    "-": (a, b) => a - b,
    "+": (a, b) => a + b
  };

  this.calculate = function(str) {

    let split = str.split(' '),
      a = +split[0],
      op = split[1],
      b = +split[2];

    if (!this.methods[op] || isNaN(a) || isNaN(b)) {
      return NaN;
    }

    return this.methods[op](a, b);
  };

  this.addMethod = function(name, func) {
    this.methods[name] = func;
  };
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#crea-una-calculadora-extensible)
