# mueve-el-balon-por-el-campo

Primero necesitamos elegir un método para posicionar el balón.

No podemos usar position:fixed para ello, porque al desplazar la página se movería el balón del campo.

Así que deberíamos usar position:absolute y, para que el posicionamiento sea realmente sólido, hacer que field sea posicione a sí mismo.

Entonces el balón se posicionará en relación al campo:

#field {
  width: 200px;
  height: 150px;
  position: relative;
}

#ball {
  position: absolute;
  left: 0; /* relativo al predecesor más cercano (field) */
  top: 0;
  transition: 1s all; /* Animación CSS para que left/top hagan al balón volar  */
}
Lo siguiente es asignar el ball.style.left/top correcto. Ahora contienen coordenadas relativas al campo.

Aquí está la imagen:

![image_12](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/event_introduction-browser-events_image_12.png?raw=true)

Tenemos event.clientX/clientY, las cuales son las coordenadas del click relativas a la ventana.

Para obtener la coordenada left del click relativa al campo necesitamos restar el limite izquierdo del campo y el ancho del borde:

````js
let left = event.clientX - fieldCoords.left - field.clientLeft;
````

Normalmente ball.style.left significa el “borde izquierdo del elemento” (el balón). Por lo que si asignamos ese left, entonces el borde del balón, no el centro, es el que se encontraría debajo del cursor del mouse.

Necesitamos mover la mitad del ancho del balón a la izquierda y la mitad del alto hacia arriba para que quede en el centro.

Por lo que el left final debería ser:

````js
let left = event.clientX - fieldCoords.left - field.clientLeft - ball.offsetWidth/2;
````

La coordenada vertical es calculada usando la misma lógica.

Por favor, nota que el ancho/alto del balón se debe conocer al momento que accedemos a ball.offsetWidth. Se debe especificar en HTML o CSS.

### resulto completo

````html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <style>
    #field {
      width: 200px;
      height: 150px;
      border: 10px solid black;
      background-color: #00FF00;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    #ball {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 40px;
      transition: all 1s;
    }
  </style>
</head>

<body style="height:2000px">

  Haz click en un lugar del campo para mover el balón allí.
  <br>


  <div id="field">
    <img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/ball.svg?raw=true" id="ball"> . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  </div>

  <script>
     field.onclick = function(event) {

      // Coordenadas del campo relativas a la ventana
      let fieldCoords = this.getBoundingClientRect();

      // El balón tiene position:absolute, el campo: position:relative
      // por lo que las coordenadas de la bola son relativas a la esquina superior izquierda interna del campo
      let ballCoords = {
        top: event.clientY - fieldCoords.top - field.clientTop - ball.clientHeight / 2,
        left: event.clientX - fieldCoords.left - field.clientLeft - ball.clientWidth / 2
      };

      // previniendo el cruce del limite superior del campo
      if (ballCoords.top < 0) ballCoords.top = 0;

      // previniendo el cruce del limite izquierdo del campo
      if (ballCoords.left < 0) ballCoords.left = 0;


      // // previniendo el cruce del limite derecho del campo
      if (ballCoords.left + ball.clientWidth > field.clientWidth) {
        ballCoords.left = field.clientWidth - ball.clientWidth;
      }

      // previniendo el cruce del limite inferior del campo
      if (ballCoords.top + ball.clientHeight > field.clientHeight) {
        ballCoords.top = field.clientHeight - ball.clientHeight;
      }

      ball.style.left = ballCoords.left + 'px';
      ball.style.top = ballCoords.top + 'px';
    }
  </script>

</body>
</html>
````

#mueve-el-balon-por-el-campo
