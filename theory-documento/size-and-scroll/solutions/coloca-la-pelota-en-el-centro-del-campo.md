# coloca-la-pelota-en-el-centro-del-campo

La pelota tiene position:absolute. Significa que sus coordenadas left/top se miden desde el elemento posicionado más cercano, es decir #field (porque tiene position:relative).

Las coordenadas inician desde el interior de la esquina superior izquierda del campo:

![image_16](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/size-and-scroll/img/documento_size-and-scroll_image_16.png?raw=true)

El interior del campo ancho/alto es clientWidth/clientHeight. Entonces el centro del campo tiene coordenadas (clientWidth/2, clientHeight/2).

…Pero si configuramos ball.style.left/top a tales valores, entonces no la pelota en su conjunto, sino el borde superior izquierdo de la pelota estaría en el centro:

````js
ball.style.left = Math.round(field.clientWidth / 2) + 'px';
ball.style.top = Math.round(field.clientHeight / 2) + 'px';
````

Así es como se ve:

![image_17](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/size-and-scroll/img/documento_size-and-scroll_image_17.png?raw=true)

Para alinear la pelota al centro con el centro del campo, deberíamos mover la pelota a la mitad de su ancho a la izquierda y a la mitad de su altura hacia arriba:

````js
ball.style.left = Math.round(field.clientWidth / 2 - ball.offsetWidth / 2) + 'px';
ball.style.top = Math.round(field.clientHeight / 2 - ball.offsetHeight / 2) + 'px';
````

Ahora la pelota está finalmente centrada.

### ⚠️ Atención: ¡la trampa!
El código no funcionará seguramente mientras <img> no tenga width/height:

````html
<img src="ball.png" id="ball">
````

Cuando el navegador no conoce el ancho/alto de una imagen (de un atributo o CSS), entonces este asume que es igual a 0 hasta que la imagen termine de cargarse.

Entonces el valor de ball.offsetWidth deberá ser 0 hasta que la imagen cargue. Eso conduce a coordinadas incorrectas en el código anterior.

Después de la primera carga, el navegador usualmente almacena en caché la imagen, y cuando se vuelva a cargar esta tendrá el tamaño inmediatamente. Pero en la primera carga el valor de ball.offsetWidth es 0.

Deberíamos arreglar eso agregando width/height en <img>:

````html
<img src="ball.png" width="40" height="40" id="ball">
````

…O indicar el tamaño en CSS:

````css
#ball {
  width: 40px;
  height: 40px;
}
````


````html
<!DOCTYPE HTML>
<html>

<head>
  <style>
    #field {
      width: 200px;
      border: 10px groove black;
      background-color: #00FF00;
      position: relative;
    }

    #ball {
      position: absolute;
    }
  </style>
</head>

<body>


  <div id="field">
    <img src="https://en.js.cx/clipart/ball.svg" width="40" height="40" id="ball"> . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  </div>


  <script>
    // ball.offsetWidth=0 ¡antes de la carga de la imagen!
    // para corregirlo: establecer el ancho "width"
    ball.style.left = Math.round(field.clientWidth / 2 - ball.offsetWidth / 2) + 'px'
    ball.style.top = Math.round(field.clientHeight / 2 - ball.offsetHeight / 2) + 'px'
  </script>


</body>

</html>
````

#coloca-la-pelota-en-el-centro-del-campo
