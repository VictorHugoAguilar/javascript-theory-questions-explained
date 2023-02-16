# filtrar-rango-en-el-lugar

````js
function filterRangeInPlace(arr, a, b) {

  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];

    // remueve aquellos elementos que se encuentran fuera del intervalo
    if (val < a || val > b) {
      arr.splice(i, 1);
      i--;
    }
  }

}

let arr = [5, 3, 8, 1];

filterRangeInPlace(arr, 1, 4); // remueve los números excepto aquellos entre 1 y 4

alert( arr ); // [3, 1]
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#filtrar-rango-en-el-lugar)
