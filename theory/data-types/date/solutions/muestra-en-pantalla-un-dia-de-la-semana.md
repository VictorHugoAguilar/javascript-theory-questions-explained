# muestra-en-pantalla-un-dia-de-la-semana

El método date.getDay() devuelve el número del día de la semana, empezando por el domingo.

Hagamos un array de días de la semana, así podemos obtener el nombre del día a través de su número correspondiente.

````js
function getWeekDay(date) {
  let days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  return days[date.getDay()];
}

let date = new Date(2014, 0, 3); // 3 Jan 2014
alert( getWeekDay(date) ); // FR
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/date/readme.md#muestra-en-pantalla-un-dia-de-la-semana)
