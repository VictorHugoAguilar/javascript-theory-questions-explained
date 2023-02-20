# obten-en-atributo

````html
<!DOCTYPE html>
<html>
<body>

  <div data-widget-name="menu">Elige el género</div>

  <script>
    // obteniéndolo
    let elem = document.querySelector('[data-widget-name]');

    // leyendo el valor
    alert(elem.dataset.widgetName);
    // o
    alert(elem.getAttribute('data-widget-name'));
  </script>
</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/dom-attributes-and-properties/readme.md#obten-en-atributo)
