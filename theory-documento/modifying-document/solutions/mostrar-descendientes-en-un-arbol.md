# mostrar-descendientes-en-un-arbol

Para añadir texto a cada `<li>` podemos alterar el nodo texto data.

````html
<!DOCTYPE HTML>
<html>
<body>

  <ul>
    <li>Animals
      <ul>
        <li>Mammals
          <ul>
            <li>Cows</li>
            <li>Donkeys</li>
            <li>Dogs</li>
            <li>Tigers</li>
          </ul>
        </li>
        <li>Other
          <ul>
            <li>Snakes</li>
            <li>Birds</li>
            <li>Lizards</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>Fishes
      <ul>
        <li>Aquarium
          <ul>
            <li>Guppy</li>
            <li>Angelfish</li>
          </ul>
        </li>
        <li>Sea
          <ul>
            <li>Sea trout</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>

  <script>
    let lis = document.getElementsByTagName('li');

    for (let li of lis) {
      // obtener la cuenta de todo <li> bajo su <li>
      let descendantsCount = li.getElementsByTagName('li').length;
      if (!descendantsCount) continue;

      // sumarlo directamente al nodo texto (añadirlo al texto)
      li.firstChild.data += ' [' + descendantsCount + ']';
    }
  </script>

</body>
</html>
````

#mostrar-descendientes-en-un-arbol
