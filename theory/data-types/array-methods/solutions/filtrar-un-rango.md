# filtrar-un-rango

````js
function filterRange(arr, a, b) {
  // agregamos paréntesis en torno a la expresión para mayor legibilidad
  return arr.filter(item => (a <= item && item <= b));
}

let arr = [5, 3, 8, 1];

let filtered = filterRange(arr, 1, 4);

alert( filtered ); // 3,1 (valores dentro del rango)

alert( arr ); // 5,3,8,1 (array original no modificado)
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#filtrar-un-rango)
