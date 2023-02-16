# claves-iterables

Eso es porque map.keys() devuelve un iterable, pero no un array.

Podemos convertirlo en un array usando Array.from:

````js
let map = new Map();

map.set("name", "John");

let keys = Array.from(map.keys());

keys.push("more");

alert(keys); // name, more
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/map-set/readme.md#claves-iterables)
