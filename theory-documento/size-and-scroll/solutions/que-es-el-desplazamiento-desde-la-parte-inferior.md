# que-es-el-desplazamiento-desde-la-parte-inferior

La solución es:

````js
let scrollBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight;
````
En otras palabras: (altura total) menos (parte superior desplazada) menos (parte visible) – esa es exactamente la parte inferior desplazada.

#que-es-el-desplazamiento-desde-la-parte-inferior
