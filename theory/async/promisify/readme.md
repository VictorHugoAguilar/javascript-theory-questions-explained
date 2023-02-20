# 📖 Promisificación

*“Promisificación”* es una simple transformación. Es la conversión de una función que acepta un callback a una función que devuelve una promesa.

A menudo estas transformaciones son necesarias en la vida real ya que muchas funciones y librerías están basadas en callbacks, pero las promesas son más convenientes así que tiene sentido promisificarlas.

Veamos un ejemplo.

Aquí tenemos loadScript(src, callback) del artículo Introducción: callbacks.

````js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Error de carga de script ${src}`));

  document.head.append(script);
}

// uso:
// loadScript('path/script.js', (err, script) => {...})
````

La función carga un script con el src dado, y llama a callback(err) en caso de error o callback(null, script) en caso de carga exitosa. Esto está ampliamente acordado en el uso de callbacks, lo hemos visto antes.

Vamos a promisificarla.

Haremos una función nueva loadScriptPromise(src) que va a hacer lo mismo (carga el script), pero devuelve una promesa en vez de usar callbacks.

Es decir: pasamos solamente src (sin callback) y obtenemos una promesa de vuelta, que resuelve con script cuando la carga fue exitosa y rechaza con error en caso contrario.

Aquí está:

````js
let loadScriptPromise = function(src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err);
      else resolve(script);
    });
  });
};

// uso:
// loadScriptPromise('path/script.js').then(...)
````

Como podemos ver, la nueva función es un “wrapper” (una función contenedora) que envuelve la función loadScript original. La llama proveyendo su propio callback y la traduce a una promesa resolve/reject.

Ahora loadScriptPromise se adapta bien a un código basado en promesas. Si nos gustan más las promesas que los callbacks (y pronto veremos más motivos para ello), la usaremos en su lugar.

En la práctica podemos necesitar promisificar más de una función, así que tiene sentido usar un ayudante.

Lo llamamos promisify(f): esta acepta la función a promisificar f y devuelve una función contenedora (wrapper).

````js
function promisify(f) {
  return function (...args) { // devuelve una función contenedora (*)
    return new Promise((resolve, reject) => {
      function callback(err, result) { // nuestro callback personalizado para f (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // adjunta nuestro callback personalizado al final de los argumentos

      f.call(this, ...args); // llama a la función original
    });
  };
}

// uso:
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
````

El código puede verse complicado, pero es esencialmente lo mismo que escribimos arriba al promisificar la función loadScript.

Una llamada a promisify(f) devuelve una función contenedora que envuelve a f (*). Este contenedor devuelve una promesa y redirige el llamado a la f original, siguiendo el resultado en el callback personalizado (**).

Aquí promisify asume que la función original espera un callback con dos argumentos (err, result). Eso es lo que usualmente encontramos. Entonces nuestro callback personalizado está exactamente en el formato correcto, y promisify funciona muy bien para tal caso.

¿Y si la f original espera un callback con más argumentos callback(err, res1, res2)?

Podemos mejorar el ayudante. Hagamos una versión de promisify más avanzada.

* Cuando la llamamos como promisify(f), debe funcionar igual que en la versión previa.
* Cuando la llamamos como promisify(f, true), debe devolver una promesa que resuelve con el array de resultados del callback. Esto es para callbacks con muchos argumentos.

````js
// promisify(f, true) para conseguir array de resultados
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) { // Nuestro callback personalizado para f
        if (err) {
          reject(err);
        } else {
          // Devolver todos los resultados del callback si "manyArgs" es especificado
          resolve(manyArgs ? results : results[0]);
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
}

// Uso:
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
````

Como puedes ver es esencialmente lo mismo de antes, pero resolve es llamado con solo uno o con todos los argumentos dependiendo del valor de manyArgs.

Para formatos más exóticos de callback, como aquellos sin err en absoluto: callback(result), podemos promisificarlos manualmente sin usar el ayudante.

También hay módulos con funciones de promisificación un poco más flexibles, ej. es6-promisify. En Node.js, hay una función integrada util.promisify para ello.

### ℹ️ Por favor tome nota:
La promisificación es un excelente recurso, especialmente cuando se usa async/await (que cubriremos en el artículo Async/await), pero no un reemplazo total de los callbacks.

Recuerda, una promesa puede tener sólo un resultado, pero un callback puede ser técnicamente llamado muchas veces.

Así que la promisificación está solo pensada para funciones que llaman al callback una vez. Las llamadas adicionales serán ignoradas.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/readme.md)
