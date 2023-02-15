## Función pow(x,n )

````js
function pow(x, n) {
  let result = x;

  for (let i = 1; i < n; i++) {
    result *= x;
  }

  return result;
}

let x = prompt("x?", '');
let n = prompt("n?", '');

if (n < 1) {
  alert(`Potencia ${n} no soportada,
    use un entero mayor a 0`);
} else {
  alert( pow(x, n) );
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/15_function-basics/readme.md#funcion-pow-x-n)
