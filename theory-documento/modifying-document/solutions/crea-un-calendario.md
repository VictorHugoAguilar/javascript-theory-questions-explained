# crea-un-calendario

Crearemos la tabla como un string: `"<table>...</table>"`, y entonces lo asignamos a innerHTML.

El algoritmo:

1.  Crea el encabezado de la tabla con `<th>` y los nombres de los días de la semana.
2.  Crea el objeto date d = new Date(year, month-1). Este es el primer día del mes month (tomando en cuenta que los meses en JavaScript comienzan en 0, no 1).
3.  Las primeras celdas hasta el primer día del mes d.getDay() podrían estar vacías. Las completamos con `<td></td>`.
4.  Incrementa el día en d: `d.setDate(d.getDate()+1)`. Si `d.getMonth() no es aún del mes siguiente, agregamos una nueva celda `<td>` al calendario. Si es domingo, agregamos un nueva línea `"</tr><tr>"`.
5.  Si el mes terminó, pero la fila no está completa, le agregamos `<td>`vacíos para hacerlo rectangular.

````html
<!DOCTYPE HTML>
<html>

<head>
  <style>
    table {
      border-collapse: collapse;
    }

    td,
    th {
      border: 1px solid black;
      padding: 3px;
      text-align: center;
    }

    th {
      font-weight: bold;
      background-color: #E6E6E6;
    }
  </style>
</head>

<body>


  <div id="calendar"></div>

  <script>
    function createCalendar(elem, year, month) {

      let mon = month - 1; // los meses en JS son 0..11, no 1..12
      let d = new Date(year, mon);

      let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';

      // espacios en la primera línea
      // desde lunes hasta el primer día del mes
      // * * * 1  2  3  4
      for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>';
      }

      // <td> con el día  (1 - 31)
      while (d.getMonth() == mon) {
        table += '<td>' + d.getDate() + '</td>';

        if (getDay(d) % 7 == 6) { // domingo, último dia de la semana --> nueva línea
          table += '</tr><tr>';
        }

        d.setDate(d.getDate() + 1);
      }

      // espacios después del último día del mes hasta completar la última línea
      // 29 30 31 * * * *
      if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
          table += '<td></td>';
        }
      }

      // cerrar la tabla
      table += '</tr></table>';

      elem.innerHTML = table;
    }

    function getDay(date) { // obtiene el número de día desde 0 (lunes) a 6 (domingo)
      let day = date.getDay();
      if (day == 0) day = 7; // hacer domingo (0) el último día
      return day - 1;
    }

    createCalendar(calendar, 2012, 9);
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/modifying-document/readme.md#crea-un-calendario)
