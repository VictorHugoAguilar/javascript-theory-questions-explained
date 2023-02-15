## Muestra numeros primos

Hay muchos algoritmos para esta tarea.

Usemos un bucle anidado.

````js
Por cada i en el intervalo {
  comprobar si i tiene un divisor en 1..i
  si tiene => el valor no es un primo
  si no => el valor es un primo, mostrarlo
}
````

El código usando una etiqueta:

````js
let n = 10;

nextPrime:
for (let i = 2; i <= n; i++) { // por cada i...

  for (let j = 2; j < i; j++) { // buscar un divisor..
    if (i % j == 0) continue nextPrime; // no es primo, ir al próximo i
  }

  alert( i ); // primo
}
````

Hay mucho lugar para la mejora. Por ejemplo, podríamos buscar por divisores desde `2` hasta la raíz cuadrada de `i. Pero de todas formas, si queremos ser realmente eficientes para intervalos grandes, necesitamos cambiar el enfoque y confiar en matemáticas avanzadas y algoritmos complejos como Criba cuadrática, Criba general del cuerpo de números etc.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/13_while-for/readme.md#muestra-numeros-primos)
