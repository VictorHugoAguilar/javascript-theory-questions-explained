# muestra-una-nota-cercana-al-elemento

En esta tarea sólo necesitamos calcular exactamente las coordenadas. Mira el código para más detalles.

Ten en cuenta: los elementos deben estar en el documento para leer offsetHeight y otras propiedades. Un elemento oculto (display:none) o fuera del documento no tiene medidas.

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="index.css">
</head>

<body>

  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit sint atque dolorum fuga ad incidunt voluptatum error fugiat animi amet! Odio temporibus nulla id unde quaerat dignissimos enim nisi rem provident molestias sit tempore omnis recusandae
    esse sequi officia sapiente.</p>

  <blockquote>
    Maestra: Por qué llegas tarde?
    Alumno: Alguien perdió un billete de cien dólares.
    Maestra: Que bueno. Lo estábas ayudando a buscarlo?
    Alumno: No. Estaba parado encima del billete.
  </blockquote>

  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit sint atque dolorum fuga ad incidunt voluptatum error fugiat animi amet! Odio temporibus nulla id unde quaerat dignissimos enim nisi rem provident molestias sit tempore omnis recusandae
   esse sequi officia sapiente.</p>


  <script>
    /**
     * Posiciona elem en relación a  anchor como se indica en position.
     *
     * @param {Node} anchor    Elemento ancla para posicionamiento
     * @param {string} position Cualquiera de los siguientes: top/right/bottom
     * @param {Node} elem       Elemento para position
     *
     * Ambos elementos: elem y anchor deben estar en el documento
     */
    function positionAt(anchor, position, elem) {

      let anchorCoords = anchor.getBoundingClientRect();

      switch (position) {
        case "top":
          elem.style.left = anchorCoords.left + "px";
          elem.style.top = anchorCoords.top - elem.offsetHeight + "px";
          break;

        case "right":
          elem.style.left = anchorCoords.left + anchor.offsetWidth + "px";
          elem.style.top = anchorCoords.top + "px";
          break;

        case "bottom":
          elem.style.left = anchorCoords.left + "px";
          elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
          break;
      }

    }

    /**
     * Muestra una nota con el html proporcionado en el lugar indicado por position
     * relativa al elemento anchor.
     */
    function showNote(anchor, position, html) {

      let note = document.createElement('div');
      note.className = "note";
      note.innerHTML = html;
      document.body.append(note);

      positionAt(anchor, position, note);
    }

    // ¡Testéalo!
    let blockquote = document.querySelector('blockquote');

    showNote(blockquote, "top", "nota encima");
    showNote(blockquote, "right", "nota a la derecha");
    showNote(blockquote, "bottom", "nota debajo");
  </script>


</body>
</html>
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/coordinates/readme.md#muestra-una-nota-cercana-al-elemento)
