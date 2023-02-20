# agregar-un-boton-de-cierre

Para agregar el botón podemos usar cualquiera de las opciones position:absolute (y hacer el panel position:relative) o float:right. El float:right tiene la ventaja de que el botón no se encima con el texto, pero position:absolute da más libertad. Entonces la elección es tuya.

Luego, para cada panel, el código puede ser así:

````js
pane.insertAdjacentHTML("afterbegin", '<button class="remove-button">[x]</button>');
````

Luego el `<button>` se convierte en pane.firstChild, por lo que podemos agregarle un controlador como este:

````js
pane.firstChild.onclick = () => pane.remove();
````

## Solución completa

````html
<!DOCTYPE HTML>
<html>

<head>
  <link rel="stylesheet" href="messages.css">
  <meta charset="utf-8">
</head>

<body>

  <div>
    <div class="pane">
      <h3>Horse</h3>
      <p>The horse is one of two extant subspecies of Equus ferus. It is an odd-toed ungulate mammal belonging to the taxonomic family Equidae. The horse has evolved over the past 45 to 55 million years from a small multi-toed creature, Eohippus, into the large, single-toed animal of today.</p>
    </div>
    <div class="pane">
      <h3>Donkey</h3>
      <p>The donkey or ass (Equus africanus asinus) is a domesticated member of the horse family, Equidae. The wild ancestor of the donkey is the African wild ass, E. africanus. The donkey has been used as a working animal for at least 5000 years.</p>
    </div>
    <div class="pane">
      <h3>Cat</h3>
      <p>The domestic cat (Latin: Felis catus) is a small, typically furry, carnivorous mammal. They are often called house cats when kept as indoor pets or simply cats when there is no need to distinguish them from other felids and felines. Cats are often valued by humans for companionship and for their ability to hunt vermin.
      </p>
    </div>
  </div>


  <script>
    let panes = document.querySelectorAll('.pane');

    for(let pane of panes) {
      pane.insertAdjacentHTML("afterbegin", '<button class="remove-button">[x]</button>');
      // button debe convertirse en el primer child de pane
      pane.firstChild.onclick = () => pane.remove();
    }
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/readme.md#agregar-un-boton-de-cierre)
