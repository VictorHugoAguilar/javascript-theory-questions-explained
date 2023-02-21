
# captura-enlaces-en-el-elemento

Ese es un gran uso para el patrón de delegación de eventos.

En la vida real, en lugar de preguntar, podemos enviar una solicitud de “logging” al servidor que guarda la información sobre dónde se fue el visitante. O podemos cargar el contenido y mostrarlo directamente en la página (si está permitido).

Todo lo que necesitamos es capturar el contents.onclick y usar confirm para preguntar al usuario. Una buena idea sería usar link.getAttribute('href') en lugar de link.href para la URL. Consulte la solución para obtener más detalles.

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <style>
    #contents {
      padding: 5px;
      border: 1px green solid;
    }
  </style>
</head>

<body>

  <fieldset id="contents">
    <legend>#contents</legend>
    <p>
      ¿Que tal si leemos <a href="https://wikipedia.org">Wikipedia</a> o visitamos <a href="https://w3.org"><i>W3.org</i></a> y aprendemos sobre los estándares modernos?
    </p>
  </fieldset>

  <script>
    contents.onclick = function(event) {

      function handleLink(href) {
        let isLeaving = confirm(`¿Irse a ${href}?`);
        if (!isLeaving) return false;
      }

      let target = event.target.closest('a');

      if (target && contents.contains(target)) {
        return handleLink(target.getAttribute('href'));
      }
    };
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/default-browser-action/readme.md#captura-enlaces-en-el-elemento)
