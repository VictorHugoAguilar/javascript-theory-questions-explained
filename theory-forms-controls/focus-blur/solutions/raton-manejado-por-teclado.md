# raton-manejado-por-teclado

Podemos usar mouse.onclick para manejar el clic y hacer el ratón “movible” con position:fixed, y luego mouse.onkeydown para manejar las flechas del teclado.

La única trampa es que keydown solo se dispara en elementos con foco. Así que necesitamos agregar tabindex al elemento. Como un requisito es no cambiar el HTML, podemos usar la propiedad mouse.tabIndex para eso.

P.S. También podemos reemplazar mouse.onclick con mouse.onfocus.

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <style>
    #mouse {
      display: inline-block;
      cursor: pointer;
      margin: 0;
    }

    #mouse:focus {
      outline: 1px dashed black;
    }
  </style>
</head>

<body>

  <p>Clica en el ratón y muévelo con las flechas del teclado.</p>

  <pre id="mouse">
 _   _
(q\_/p)
 /. .\
=\_t_/=   __
 /   \   (
((   ))   )
/\) (/\  /
\  Y  /-'
 nn^nn
</pre>


  <script>
    mouse.tabIndex = 0;

    mouse.onclick = function() {
      this.style.left = this.getBoundingClientRect().left + 'px';
      this.style.top = this.getBoundingClientRect().top + 'px';

      this.style.position = 'fixed';
    };


    mouse.onkeydown = function(e) {
      switch (e.key) {
        case 'ArrowLeft':
          this.style.left = parseInt(this.style.left) - this.offsetWidth + 'px';
          return false;
        case 'ArrowUp':
          this.style.top = parseInt(this.style.top) - this.offsetHeight + 'px';
          return false;
        case 'ArrowRight':
          this.style.left = parseInt(this.style.left) + this.offsetWidth + 'px';
          return false;
        case 'ArrowDown':
          this.style.top = parseInt(this.style.top) + this.offsetHeight + 'px';
          return false;
      }
    };
  </script>

</body>
</html>
````



---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/focus-blur/readme.md#raton-manejado-por-teclado)
