# carrusel

La cinta de imágenes se puede representar como una lista ul/li de imágenes `<img>`.

Normalmente dicha cinta es ancha, pero colocamos un tamaño fijo `<div>` alrededor para “cortarla”, de modo que solo una parte de la cinta sea visible:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/event_introduction-browser-events_image_09.png?raw=true)  

Para que la lista se muestre horizontalmente debemos aplicar las propiedades CSS correctas para `<li>`, como display: inline-block.

Para `<img>` también deberíamos ajustar display, ya que es inline por default. Hay espacio adicional reservado debajo de los “letter tails”, por lo que podemos usar display:block para eliminarlo.

Para hacer el desplazamiento, podemos cambiar `<ul>`. Hay muchas formas de hacerlo, por ejemplo, cambiando margin-left o (para mejor rendimiento) usando transform: `translateX()`:

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/event_introduction-browser-events_image_10.png?raw=true)

El `<div>` exterior tiene un ancho fijo, por lo que se cortan las imágenes “extra”.

Todo el carrusel es un “componente gráfico” autónomo en la página, por lo que será mejor que lo envuelva en un solo elemento `<div class="carousel">` y le apliquemos estilo.

## Ejemplo completo

````html
<!DOCTYPE html>

<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <div id="carousel" class="carousel">
    <button class="arrow prev">⇦</button>
    <div class="gallery">
      <ul>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/1.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/2.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/3.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/4.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/5.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/6.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/7.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/8.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/9.png?raw=true"></li>
        <li><img src="https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/img/10.png?raw=true"></li>
      </ul>
    </div>
    <button class="arrow next">⇨</button>
  </div>

  <script>
     /* etiqueta las imágenes pra poder rastrearlas, solo por conveniencia */
    let i = 1;
    for(let li of carousel.querySelectorAll('li')) {
      li.style.position = 'relative';
      li.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i}</span>`);
      i++;
    }

    /* configuración */
    let width = 130; // ancho de las imágenes
    let count = 3; // conteo de las imágenes visibles

    let list = carousel.querySelector('ul');
    let listElems = carousel.querySelectorAll('li');

    let position = 0; // posición del desplazamiento del carrete

    carousel.querySelector('.prev').onclick = function() {
      // desplazamiento izquierdo
      position += width * count;
      // no podemos mover demasiado a la izquierda, se acaban las imágenes
      position = Math.min(position, 0)
      list.style.marginLeft = position + 'px';
    };

    carousel.querySelector('.next').onclick = function() {
      // desplazamiento derecho
      position -= width * count;
      // solo se puede desplazar el carrete de imágenes (longitud total de la cinta - conteo visibles)
      position = Math.max(position, -width * (listElems.length - count));
      list.style.marginLeft = position + 'px';
    };
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/introduction-browser-events/readme.md#carrusel)
