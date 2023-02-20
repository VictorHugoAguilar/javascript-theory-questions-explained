# crear-un-menu-deslizante

## HTML/CSS

Primero hay que crear el HTML y CSS.

Un menú es un componente gráfico independiente en la página, por lo que es mejor colocarlo en un solo elemento del DOM.

Una lista de elementos del menú se puede diseñar como una lista ul/li.

Aquí está la estructura de ejemplo:

````html
<div class="menu">
  <span class="title">Sweeties (click me)!</span>
  <ul>
    <li>Cake</li>
    <li>Donut</li>
    <li>Honey</li>
  </ul>
</div>
````

Usamos `<span>` para el título, porque `<div>` tiene un display:block implícito en él, y va a ocupar 100% del ancho horizontal.

Así:

````html
<div style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</div>
````

Entonces si establecemos onclick en él, detectará los clics a la derecha del texto.

Como `<span>` tiene un display: inline implícito, ocupa exactamente el lugar suficiente para que quepa todo el texto:

````html
<span style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</span>
````

## Alternar el menú

Alternar el menú debería cambiar la flecha y mostrar/ocultar la lista del menú.

Todos estos cambios son perfectamente controlados con CSS. En JavaScript debemos etiquetar el estado actual del menú agregando/eliminando la clase .open.

Sin él, el menú se cerrará:

````css
.menu ul {
  margin: 0;
  list-style: none;
  padding-left: 20px;
  display: none;
}

.menu .title::before {
  content: '▶ ';
  font-size: 80%;
  color: green;
}
````

…Y con .open la flecha cambia y aparece la lista:

````css
.menu.open .title::before {
  content: '▼ ';
}

.menu.open ul {
  display: block;
}
````

## Ejemplo completo

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <style>
    .menu ul {
      margin: 0;
      list-style: none;
      padding-left: 20px;
      display: none;
    }

    .menu .title {
      font-size: 18px;
      cursor: pointer;
    }

    .menu .title::before {
      content: '▶ ';
      font-size: 80%;
      color: green;
    }

    .menu.open .title::before {
      content: '▼ ';
    }

    .menu.open ul {
      display: block;
    }
  </style>
</head>

<body>

  <div id="sweeties" class="menu">
    <span class="title">Sweeties (click me)!</span>
    <ul>
      <li>Cake</li>
      <li>Donut</li>
      <li>Honey</li>
    </ul>

  </div>

  <script>
    let menuElem = document.getElementById('sweeties');
    let titleElem = menuElem.querySelector('.title');

    titleElem.onclick = function() {
      menuElem.classList.toggle('open');
    };
  </script>

</body>
</html>
````


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/readme.md#crear-un-menu-deslizante)
