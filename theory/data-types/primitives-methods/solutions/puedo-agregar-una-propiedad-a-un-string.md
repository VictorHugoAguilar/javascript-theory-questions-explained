# Puedo agregar una propiedad a un string

Prueba ejecutándolo:

````js
let str = "Hello";

str.test = 5; // (*)

alert(str.test);
````

Depende de si usas el modo estricto “use strict” o no, el resultado será:

undefined (sin strict mode)
Un error. (strict mode)
¿Por qué? Repasemos lo que ocurre en la línea (*):

Cuando se accede a una propiedad de str, se crea un “wrapper object” (objeto envolvente ).
Con modo estricto, tratar de alterarlo produce error.
Sin modo estricto, la operación es llevada a cabo y el objeto obtiene la propiedad test, pero después de ello el “objeto envolvente” desaparece, entonces en la última linea str queda sin rastros de la propiedad.
Este ejemplo claramente muestra que los tipos primitivos no son objetos.

Ellos no pueden almacenar datos adicionales.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/primitives-methods/readme.md#puedo-agregar-una-propiedad-a-un-string)
