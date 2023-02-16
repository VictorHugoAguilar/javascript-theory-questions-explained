# copia-y-ordena-un-array

Podemos usar slice() para crear una copia y realizar el ordenamiento en ella:

````js
function copySorted(arr) {
  return arr.slice().sort();
}

let arr = ["HTML", "JavaScript", "CSS"];

let sorted = copySorted(arr);

alert( sorted );
alert( arr );
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#copia-y-ordena-un-array)
