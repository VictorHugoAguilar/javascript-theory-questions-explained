# editar-td-al-clicar

1.  Al clicar (onclick) se reemplaza el innerHTML de la celda por un `<textarea>` com los mismos tamaños y sin bordes. Se puede usar JavaScript o CSS para establecer el tamaño correcto.
2.  Establece `textarea.value` a `td.innerHTML`.
3.  Pone el foco en textarea.
4.  Muestra los botones OK/CANCEL` bajo la celda, y maneja los clics en ellos.
  
````html
  <!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
</head>

<body>
  <link rel="stylesheet" href="bagua.css">
  <link rel="stylesheet" href="my.css">


  <p>Clica en una celda de la tabla para editarla. Presiona OK o CANCEL para finalizar.</p>

  <table id="bagua-table">
    <tr>
      <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
    </tr>
    <tr>
      <td class="nw"><strong>Northwest</strong>
        <br>Metal
        <br>Silver
        <br>Elders
      </td>
      <td class="n"><strong>North</strong>
        <br>Water
        <br>Blue
        <br>Change
      </td>
      <td class="ne"><strong>Northeast</strong>
        <br>Earth
        <br>Yellow
        <br>Direction
      </td>
    </tr>
    <tr>
      <td class="w"><strong>West</strong>
        <br>Metal
        <br>Gold
        <br>Youth
      </td>
      <td class="c"><strong>Center</strong>
        <br>All
        <br>Purple
        <br>Harmony
      </td>
      <td class="e"><strong>East</strong>
        <br>Wood
        <br>Blue
        <br>Future
      </td>
    </tr>
    <tr>
      <td class="sw"><strong>Southwest</strong>
        <br>Earth
        <br>Brown
        <br>Tranquility
      </td>
      <td class="s"><strong>South</strong>
        <br>Fire
        <br>Orange
        <br>Fame
      </td>
      <td class="se"><strong>Southeast</strong>
        <br>Wood
        <br>Green
        <br>Romance
      </td>
    </tr>

  </table>


  <script src="script.js"></script>

</body>

</html>
  ````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/focus-blur/readme.md#editar-td-al-clicar)
