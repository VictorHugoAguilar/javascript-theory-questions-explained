# contar-los-descendientes

Hagamos un ciclo sobre `<li>`:

````js
for (let li of document.querySelectorAll('li')) {
  ...
}
````

En el ciclo, necesitamos introducir el texto dentro de cada li.

Podemos leer el texto del primer nodo hijo de li, que es el nodo de texto:

````js
for (let li of document.querySelectorAll('li')) {
  let title = li.firstChild.data;

  // el título es el texto en <li> antes de cualquier otro nodo
}
````


````html
<!DOCTYPE HTML>
<html>
<body>

  <ul>
    <li>Animales
      <ul>
        <li>Mamíferos
          <ul>
            <li>Vacas</li>
            <li>Burros</li>
            <li>Perros</li>
            <li>Tigres</li>
          </ul>
        </li>
        <li>Otros
          <ul>
            <li>Serpientes</li>
            <li>Aves</li>
            <li>Lagartos</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>Peces
      <ul>
        <li>Acuario
          <ul>
            <li>Guppy</li>
            <li>Angelote</li>
          </ul>
        </li>
        <li>Mar
          <ul>
            <li>Trucha de mar</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>

  <script>
    for (let li of document.querySelectorAll('li')) {
      // obtener el título del nodo de texto
      let title = li.firstChild.data;

      title = title.trim(); // eliminar los espacios adicionales de los extremos

      // obtener el recuento de descendientes
      let count = li.getElementsByTagName('li').length;

      alert(title + ': ' + count);
    }
  </script>

</body>
</html>
````

Entonces podemos obtener el número de descendientes como li.getElementsByTagName('li').length.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/basic-dom-node-properties/readme.md#contar-los-descendientes)
