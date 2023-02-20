# 📖 Introducción: callbacks

### ⚠️ Usamos métodos de navegador en estos ejemplos
Para demostrar el uso de callbacks, promesas y otros conceptos abstractos, utilizaremos algunos métodos de navegador: específicamente, carga de scripts y simples manipulaciones de documentos.

Si no estás familiarizado con estos métodos, y los ejemplos son confusos, puedes leer algunos capítulos de esta sección del tutorial.

Sin embargo, intentaremos aclarar las cosas de todos modos. No habrá nada en cuanto al navegador realmente complejo.

Muchas funciones son proporcionadas por el entorno de host de Javascript que permiten programar acciones asíncronas. En otras palabras, acciones que iniciamos ahora, pero que terminan más tarde.

Por ejemplo, una de esas funciones es la función setTimeout.

Hay otros ejemplos del mundo real de acciones asincrónicas, p. ej.: la carga de scripts y módulos (a cubrirse en capítulos posteriores).

Echa un vistazo a la función loadScript(src), que carga un código script src dado:

````js
function loadScript(src) {
  // crea una etiqueta <script> y la agrega a la página
  // esto hace que el script dado: src comience a cargarse y ejecutarse cuando se complete
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
````

Esto inserta en el documento una etiqueta nueva, creada dinámicamente, <script src =" ... "> con el código src dado. El navegador comienza a cargarlo automáticamente y lo ejecuta cuando la carga se completa.

Esta función la podemos usar así:

````js
// cargar y ejecutar el script en la ruta dada
loadScript('/my/script.js');
````

El script se ejecuta “asincrónicamente”, ya que comienza a cargarse ahora, pero se ejecuta más tarde, cuando la función ya ha finalizado.

El código debajo de loadScript (...), no espera que finalice la carga del script.

````js
loadScript('/my/script.js');
// el código debajo de loadScript
// no espera a que finalice la carga del script
// ...
````

Digamos que necesitamos usar el nuevo script tan pronto como se cargue. Declara nuevas funciones, y queremos ejecutarlas.

Si hacemos eso inmediatamente después de llamar a loadScript (...), no funcionará:

````js
loadScript('/my/script.js'); // el script tiene a "function newFunction() {…}"

newFunction(); // no hay dicha función!
````

Naturalmente, el navegador probablemente no tuvo tiempo de cargar el script. Hasta el momento, la función loadScript no proporciona una forma de rastrear la finalización de la carga. El script se carga y finalmente se ejecuta, eso es todo. Pero nos gustaría saber cuándo sucede, para usar las funciones y variables nuevas de dicho script.

Agreguemos una función callback como segundo argumento para loadScript que debería ejecutarse cuando se carga el script:

````js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(script);

  document.head.append(script);
}
````

El evento onload, que se describe en el artículo Carga de recursos: onload y onerror, básicamente ejecuta una función después de que el script es cargado y ejecutado.

Ahora, si queremos llamar las nuevas funciones desde el script, deberíamos escribirlo en la callback:

````js
loadScript('/my/script.js', function() {
  // la callback se ejecuta luego que se carga el script
  newFunction(); // ahora funciona
  ...
});
````

Esa es la idea: el segundo argumento es una función (generalmente anónima) que se ejecuta cuando se completa la acción.

Aquí un ejemplo ejecutable con un script real:

````js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`Genial, el script ${script.src} está cargado`);
  alert( _ ); // _ es una función declarada en el script cargado
});
````

Eso se llama programación asincrónica “basado en callback”. Una función que hace algo de forma asincrónica debería aceptar un argumento de callback donde ponemos la función por ejecutar después de que se complete.

Aquí lo hicimos en loadScript, pero por supuesto es un enfoque general.

## Callback en una callback

¿Cómo podemos cargar dos scripts secuencialmente: el primero y después el segundo al cargarse el primero?

La solución natural sería poner la segunda llamada loadScript dentro de la callback, así:

````js
loadScript('/my/script.js', function(script) {

  alert(`Genial, el ${script.src} está cargado, carguemos uno más`);

  loadScript('/my/script2.js', function(script) {
    alert(`Genial, el segundo script está cargado`);
  });

});
````

Una vez que se completa el loadScript externo, la callback inicia el interno.

¿Qué pasa si queremos un script más …?

````js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

    loadScript('/my/script3.js', function(script) {
      // ...continua después que se han cargado todos los scripts
    });

  });

});
````

Entonces, cada nueva acción está dentro de una callback. Eso está bien para algunas acciones, pero no es bueno para todas, así que pronto veremos otras variantes.

## Manejo de errores

En los ejemplos anteriores no consideramos los errores. ¿Qué pasa si falla la carga del script? Nuestra callback debería poder reaccionar ante eso.

Aquí una versión mejorada de loadScript que rastrea los errores de carga:

````js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Error de carga de script con ${src}`));

  document.head.append(script);
}
````

Para una carga exitosa llama a callback(null, script) y de lo contrario a callback(error).

El uso:

````js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // maneja el error
  } else {
    // script cargado satisfactoriamente
  }
});
````

Una vez más, la receta que usamos para loadScript es bastante común. Se llama el estilo de “callback error primero”.

La convención es:

1.  El primer argumento de la ‘callback’ está reservado para un error, si ocurre. Entonces se llama a callback(err).
2.  El segundo argumento (y los siguientes si es necesario) son para el resultado exitoso. Entonces se llama a callback(null, result1, result2 ...).

Así usamos una única función de ‘callback’ tanto para informar errores como para transferir resultados.

## Pirámide infernal

A primera vista, es una forma viable de codificación asincrónica. Y de hecho lo es. Para una o quizás dos llamadas anidadas, se ve bien.

Pero para múltiples acciones asincrónicas que van una tras otra, tendremos un código como este:

````js
loadScript('1.js', function(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
            // ...continua después de que se han cargado todos los script (*)
          }
        });

      }
    });
  }
});
````

En el código de arriba:

1.  Cargamos 1.js, entonces si no hay error…
2.  Cargamos 2.js, entonces si no hay error…
3.  Cargamos 3.js, entonces, si no hay ningún error: haga otra cosa (*).

A medida que las llamadas se anidan más, el código se vuelve más profundo y difícil de administrar, especialmente si tenemos un código real en lugar de ‘…’ que puede incluir más bucles, declaraciones condicionales, etc.

A esto se le llama “infierno de callbacks” o “pirámide infernal” (“callback hell”, “pyramid of doom”).

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/callbacks/img/async_callbacks_image_01.png?raw=true)

La “pirámide” de llamadas anidadas crece hacia la derecha con cada acción asincrónica. Pronto se sale de control.

Entonces esta forma de codificación no es tan buena.

Podemos tratar de aliviar el problema haciendo, para cada acción, una función independiente:

````js
loadScript('1.js', step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...continua después de que se han cargado todos los scripts (*)
  }
}
````

¿Lo Ves? Hace lo mismo, y ahora no hay anidamiento profundo porque convertimos cada acción en una función de nivel superior separada.

Funciona, pero el código parece una hoja de cálculo desgarrada. Es difícil de leer, y habrás notado que hay que saltar de un lado a otro mientras lees. Es un inconveniente, especialmente si el lector no está familiarizado con el código y no sabe dónde dirigir la mirada.

Además, las funciones llamadas step* son de un solo uso, son para evitar la “Pirámide de callbacks”. Nadie los reutilizará fuera de la cadena de acción. Así que hay muchos nombres abarrotados aquí.

Nos gustaría tener algo mejor.

Afortunadamente, hay otras formas de evitar tales pirámides. Una de las mejores formas es usando “promesas”, descritas en el próximo capítulo.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/readme.md)
