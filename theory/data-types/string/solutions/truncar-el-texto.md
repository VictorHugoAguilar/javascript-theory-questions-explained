# truncar-el-texto

La longitud máxima debe ser ‘maxlength’, por lo que debemos acortarla un poco para dar espacio a los puntos suspensivos.

Tener en cuenta que en realidad hay un único carácter unicode para puntos suspensivos. Eso no son tres puntos.

````js
function truncate(str, maxlength) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/string/readme.md#truncar-el-texto)
