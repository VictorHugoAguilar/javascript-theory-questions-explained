# que-es-el-ancho-de-la-barra-de-desplazamiento

Para obtener el ancho de la barra de desplazamiento, podemos crear un elemento con el scroll, pero sin bordes ni rellenos.

Entonces la diferencia entre su ancho completo offsetWidth y el ancho del area interior clientWidth será exactamente la barra de desplazamiento:

````html
// crea un div con el scroll
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// debe ponerlo en el documento, de lo contrario los tamaños serán 0
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();

alert(scrollWidth);
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/size-and-scroll/readme.md#que-es-el-ancho-de-la-barra-de-desplazamiento)
