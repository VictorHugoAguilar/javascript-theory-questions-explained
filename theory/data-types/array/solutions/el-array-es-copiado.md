# el-array-es-copiado

El resultado es 4:

````js
let fruits = ["Apples", "Pear", "Orange"];

let shoppingCart = fruits;

shoppingCart.push("Banana");

alert( fruits.length ); // 4
````

Esto es porque los arrays son objetos. Entonces ambos, shoppingCart y fruits son referencias al mismo array.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array/readme.md#el-array-es-copiado)
