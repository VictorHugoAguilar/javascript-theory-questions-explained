# que-es-el-desplazamiento-desde-la-parte-inferior

La solución es:

````js
let scrollBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight;
````
En otras palabras: (altura total) menos (parte superior desplazada) menos (parte visible) – esa es exactamente la parte inferior desplazada.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/size-and-scroll/readme.md#que-es-el-desplazamiento-desde-la-parte-inferior)
