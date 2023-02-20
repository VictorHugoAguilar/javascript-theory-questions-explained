# calculadora-eval

Usemos eval para calcular la expresión matemática:

````js
let expr = prompt("Escribe una expresión matemática:", '2*3+2');

alert( eval(expr) );
````

Aunque el usuario puede ingresar cualquier texto o código.

Para hacer las cosas seguras, y limitarlo a aritmética solamente, podemos verificar expr usando una expresión regular que solo pueda contener dígitos y operadores.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/js-misc/eval/readme.md#calculadora-eval)
