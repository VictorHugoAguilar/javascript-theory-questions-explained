# crea-un-objeto-a-partir-de-un-array

````js
function groupById(array) {
  return array.reduce((obj, value) => {
    obj[value.id] = value;
    return obj;
  }, {})
}


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#crea-un-objeto-a-partir-de-un-array)
