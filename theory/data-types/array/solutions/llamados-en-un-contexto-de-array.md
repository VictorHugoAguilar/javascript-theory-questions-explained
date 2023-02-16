# llamados-en-un-contexto-de-array

El llamado a arr[2]() es sintácticamente el buen y viejo obj[method](), en el rol de obj tenemos arr, y en el rol de method tenemos 2.

Entonces tenemos una llamada a función arr[2] como un método de objeto. Naturalmente, recibe this referenciando el objeto arr y su salida es el array:

````js
let arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // a,b,function(){...}
````

El array tiene 3 valores: Inicialmente tenía 2 y se agregó la función.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array/readme.md#llamados-en-un-contexto-de-array)
