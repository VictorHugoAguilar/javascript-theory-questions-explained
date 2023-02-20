# accediendo-a-array-1

````js
let array = [1, 2, 3];

array = new Proxy(array, {
  get(target, prop, receiver) {
    if (prop < 0) {
      // incluso aunque la accedamos como arr[1]
      // prop es un string, así que necesitamos convertirla a number
      prop = +prop + target.length;
    }
    return Reflect.get(target, prop, receiver);
  }
});


alert(array[-1]); // 3
alert(array[-2]); // 2
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/js-misc/proxy/readme.md#accediendo-a-array-1)
