## Corregir la adicion

La razón es que la captura devuelve la entrada del usuario como una cadena.

Entonces las variables tienen valores "1" y "2" respectivamente.

````js
let a = "1"; // prompt("¿Primer número?", 1);
let b = "2"; // prompt("¿Segundo número?", 2);

alert(a + b); // 12
````

Lo que debemos hacer es convertir las cadenas de texto a números antes de +. Por ejemplo, utilizando Number() o anteponiendo +.

Por ejemplo, justo antes de prompt:

````js
let a = +prompt("¿Primer número?", 1);
let b = +prompt("¿Segundo número?", 2);

alert(a + b); // 3
````

O en el alert:

````js
let a = prompt("¿Primer número?", 1);
let b = prompt("¿Segundo número?", 2);

alert(+a + +b); // 3
````

Usar ambos unario y binario + en el último ejemplo, se ve raro, ¿no?

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/08_operators)
