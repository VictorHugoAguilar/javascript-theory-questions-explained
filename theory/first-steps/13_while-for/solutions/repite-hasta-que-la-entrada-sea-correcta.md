## Repite hasta que la entrada sea correcta

````js
let num;

do {
  num = prompt("Ingresa un número mayor a 100", 0);
} while (num <= 100 && num);
````

El bucle `do..while` se repite mientras ambas condiciones sean verdaderas:

1. La condición `num <= 100` – eso es, el valor ingresado aún no es mayor que `100`.
2. La condición && num es falsa cuando `num` es `null` o una cadena de texto vacía. Entonces el bucle `while` se detiene.

PD. Si num es null entonces `num <= 100` es true, así que sin la segunda condición el bucle no se detendría si el usuario hace click en CANCELAR. Ambas comprobaciones son requeridas.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/13_while-for/readme.md#repite-hasta-que-la-entrada-sea-correcta)
