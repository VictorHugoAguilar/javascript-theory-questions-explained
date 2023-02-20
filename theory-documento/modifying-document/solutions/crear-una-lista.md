# crear-una-lista

Observa el uso de textContent para asignar el contenido de `<li>`.

````html
<!DOCTYPE HTML>
<html>
<body>
  <h1>Crear un lista</h1>

  <script>
    let ul = document.createElement('ul');
    document.body.append(ul);

    while (true) {
      let data = prompt("Ingresa el texto para el ítem de la lista", "");

      if (!data) {
        break;
      }

      let li = document.createElement('li');
      li.textContent = data;
      ul.append(li);
    }
  </script>

</body>
</html>



---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/modifying-document/readme.md#crear-una-lista)
