# limpiar-el-elemento

Primero veamos cómo no hacerlo:

````html
function clear(elem) {
  for (let i=0; i < elem.childNodes.length; i++) {
      elem.childNodes[i].remove();
  }
}
````

Eso no funciona, porque la llamada a remove() desplaza la colección elem.childNodes, entonces los elementos comienzan desde el índice 0 cada vez. Pero i se incrementa y algunos elementos serán saltados.

El bucle `for..of` también hace lo mismo.

Una variante correcta puede ser:

````html
function clear(elem) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}
````

Y también una manera más simple de hacer lo mismo:

````html
function clear(elem) {
  elem.innerHTML = '';
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/modifying-document/readme.md#limpiar-el-elemento)
