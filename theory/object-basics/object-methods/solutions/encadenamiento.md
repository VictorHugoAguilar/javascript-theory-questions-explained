# Encadenamiento

La solución es devolver el objeto mismo desde cada llamado.

````js
let ladder = {
  step: 0,
  up() {
    this.step++;
    return this;
  },
  down() {
    this.step--;
    return this;
  },
  showStep() {
    alert( this.step );
    return this;
  }
};

ladder.up().up().down().showStep().down().showStep(); // shows 1 then 0
````

También podemos escribir una simple llamada por línea. Para cadenas largas es más legible:

````js
ladder
  .up()
  .up()
  .down()
  .showStep() // 1
  .down()
  .showStep(); // 0
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/object-methods/readme.md#encadenamiento)
