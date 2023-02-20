# que-hay-en-nodetype

Aquí hay una trampa.

En el momento de la ejecución de `<script>`, el último nodo DOM es exactamente `<script>`, porque el navegador aún no procesó el resto de la página.

Entonces el resultado es 1 (nodo de elemento).

````html
<html>

<body>
  <script>
    alert(document.body.lastChild.nodeType);
  </script>
</body>

</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/basic-dom-node-properties/readme.md#que-hay-en-nodetype)
