# cual-es-el-ultimo-dia-del-mes

Creemos una fecha utilizando el mes próximo, pero pasando 0 como número de día:

````js
function getLastDayOfMonth(year, month) {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
}

alert( getLastDayOfMonth(2012, 0) ); // 31
alert( getLastDayOfMonth(2012, 1) ); // 29
alert( getLastDayOfMonth(2013, 1) ); // 28
````

Normalmente, las fechas comienzan a partir del 1, sin embargo podemos pasar como argumento cualquier número, ya que se corregirá automáticamente. De esta manera, si pasamos el número 0 como día, se interpreta como “el día anterior al primer día del mes”, o en otras palabras: “el último día del mes anterior”.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/date/readme.md#cual-es-el-ultimo-dia-del-mes)
