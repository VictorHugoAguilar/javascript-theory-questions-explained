# buscar-spam

Para que la búsqueda no distinga entre mayúsculas y minúsculas, llevemos el string a minúsculas y luego busquemos:

````js
function checkSpam(str) {
  let lowerStr = str.toLowerCase();

  return lowerStr.includes('viagra') || lowerStr.includes('xxx');
}

alert( checkSpam('compra ViAgRA ahora') );
alert( checkSpam('xxxxx gratis') );
alert( checkSpam("coneja inocente") );
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/string/readme.md#buscar-spam)
