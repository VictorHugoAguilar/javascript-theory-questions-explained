## El resultado de OR and OR

La respuesta: 3.

````js
alert( null || 2 && 3 || 4 );
````

La precedencia de AND `&&` es mayor que la de `||`, así que se ejecuta primero.

El resultado de 2 && 3 = 3, por lo que la expresión se convierte en:

````js
null || 3 || 4
````

Ahora el resultado será el primer valor verdadero: 3.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/11_logical-operators/readme.md#el-resultado-de-or-and-or)
