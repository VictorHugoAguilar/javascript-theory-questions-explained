# suma-las-propiedades

````js
function sumSalaries(salaries) {

  let sum = 0;
  for (let salary of Object.values(salaries)) {
    sum += salary;
  }

  return sum; // 650
}

let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};

alert( sumSalaries(salaries) ); // 650
````

Otra opción, también podemos obtener la suma utilizando Object.values y reduce:

````js
// reduce recorre el array de salarios,
// sumándolos
// y devuelve el resultado
function sumSalaries(salaries) {
  return Object.values(salaries).reduce((a, b) => a + b, 0) // 650
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/keys-values-entries/readme.md#suma-las-propiedades)
