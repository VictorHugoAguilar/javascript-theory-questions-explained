# ocultar-con-un-click

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
</head>

<body>

  <input type="button" id="hider" value="Haz click para desaparecer el texto"/>

  <div id="text">Texto</div>

  <script>
    // Aquí no importa cómo escondamos el texto
    // podríamos usar style.display:
    document.getElementById('hider').onclick = function() {
      document.getElementById('text').hidden = true;
    }
  </script>
</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/readme.md#ocultar-con-un-click)
