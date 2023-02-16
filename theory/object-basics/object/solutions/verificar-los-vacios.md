## Verificar los vacios

Solo crea un bucle sobre el objeto y, si hay al menos una propiedad, devuelve false inmediatamente.

````js
function isEmpty(obj) {
  for (let key in obj) {
    //  Si el bucle ha comenzado quiere decir que sí hay al menos una propiedad
    return false;
  }
  return true;
}
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/object/readme.md#verificar-los-vacios)
