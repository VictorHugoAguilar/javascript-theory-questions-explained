# etiqueta-en-comentario

*La respuesta: BODY*.

````js
<script>
  let body = document.body;

  body.innerHTML = "<!--" + body.tagName + "-->";

  alert( body.firstChild.data ); // BODY
</script>
````

¿Qué está pasando paso a paso?

El contenido de <body> se reemplaza con el comentario. El comentario es `<!--BODY-->`, porque body.tagName == "BODY". Como recordamos, tagName siempre está en mayúsculas en HTML.
El comentario es ahora el único nodo hijo, así que lo obtenemos en body.firstChild.
La propiedad data del comentario es su contenido (dentro de `<!--...-->`): "BODY".

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/basic-dom-node-properties/readme.md#etiqueta-en-comentario)
