# almacenar-fechas-de-lectura

Para almacenar una fecha, podemos usar WeakMap:

````js
let messages = [
  {text: "Hello", from: "John"},
  {text: "How goes?", from: "John"},
  {text: "See you soon", from: "Alice"}
];

let readMap = new WeakMap();

readMap.set(messages[0], new Date(2017, 1, 1));
// // Objeto Date que estudiaremos más tarde
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/weakmap-weakset/readme.md##almacenar-fechas-de-lectura)
