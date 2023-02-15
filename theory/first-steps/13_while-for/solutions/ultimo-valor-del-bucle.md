## Último valor del bucle

La respuesta: 1.

````js
let i = 3;

while (i) {
  alert( i-- );
}
````

Cada iteración del bucle disminuye i en 1. La comprobación while(i) detiene el bucle cuando i = 0.

Por consiguiente, los pasos del bucle forman la siguiente secuencia (“bucle desenrollado”).

````js
let i = 3;

alert(i--); // muestra 3, disminuye i a 2

alert(i--) // muestra 2, disminuye i a 1

alert(i--) // muestra 1, disminuye i a 0

// listo, while(i) comprueba y detiene el bucle
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/13_while-for/readme.md#ultimo-valor-del-bucle)
