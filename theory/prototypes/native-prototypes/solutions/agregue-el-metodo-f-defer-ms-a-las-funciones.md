# agregue-el-metodo-f-defer-ms-a-las-funciones

````js
Function.prototype.defer = function(ms) {
  setTimeout(this, ms);
};

function f() {
  alert("Hola!");
}

f.defer(1000); // muestra "Hola!" después de 1 seg
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/readme.md#agregue-el-metodo-f-defer-ms-a-las-funciones)
