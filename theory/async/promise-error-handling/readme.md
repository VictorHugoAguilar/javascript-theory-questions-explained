# 📖 Manejo de errores con promesas

Las promesas encadenadas son excelentes manejando los errores. Cuando una promesa es rechazada, el control salta al manejador de rechazos más cercano. Esto es muy conveniente en la práctica.

Por ejemplo, en el código de abajo, la URL a la cual se le hace fetch es incorrecta (no existe el sitio) y al ser rechazada.catch maneja el error:

````js
fetch('https://no-such-server.blabla') // Promesa rechazada
  .then(response => response.json())
  .catch(err => alert(err)) // TypeError: failed to fetch (El texto puede variar, dependiendo del error)
````

Como puedes ver, el .catch no tiene que escribirse inmediatamente después de la promesa. Este puede aparecer después de uno o quizás varios .then.

O, puede ocurrir, que todo en el sitio se encuentre bien, pero la respuesta no es un JSON válido. La forma más fácil de detectar todos los errores es agregando .catch al final de la cadena de promesas:

````js
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
  .catch(error => alert(error.message));
````

Lo normal es que tal .catch no se dispare en absoluto. Pero si alguna de las promesas anteriores es rechazada (por un error de red, un JSON inválido or cualquier otra razón), entonces el error es capturado.

## try…catch implícito

El código de un ejecutor de promesas y de manejadores de promesas tiene embebido un " try..catch invisible". Si ocurre una excepción, esta es atrapada y es tratada como un rechazo.

Por ejemplo, este código:

````js
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
}).catch(alert); // Error: Whoops!
````

…Hace exactamente lo mismo que este:

````js
new Promise((resolve, reject) => {
  reject(new Error("Whoops!"));
}).catch(alert); // Error: Whoops!
````

El "try..catch invisible" embebido en el ejecutor detecta automáticamente el error y lo convierte en una promesa rechazada.

Esto sucede no solo en la función ejecutora, sino también en sus manejadores. Si hacemos throw dentro de una llamada a .then, esto devolverá una promesa rechazada, por lo que el control salta al manejador de errores más cercano.

Por ejemplo:

````js
new Promise((resolve, reject) => {
  resolve("ok");
}).then((result) => {
  throw new Error("Whoops!"); // rechaza la promesa
}).catch(alert); // Error: Whoops!
````

Esto sucede con todos los errores, no solo los causados por la sentencia de excepción throw. Por ejemplo, un error de programación:

````js
new Promise((resolve, reject) => {
  resolve("ok");
}).then((result) => {
  blabla(); // Función inexistente
}).catch(alert); // ReferenceError: blabla is not defined
````

El .catch del final no solo detecta rechazos explícitos, sino también los errores accidentales en los manejadores anteriores.

## Rethrowing (relanzamiento de errores)

Como ya vimos, el .catch del final es similar a try..catch. Podemos tener tantos manejadores .then como queramos, y luego usar un solo .catch al final para manejar los errores en todos ellos.

En un try..catch normal, podemos analizar el error y quizá volver a lanzarlo si no se puede manejar. Lo mismo podemos hacer con las promesas.

Si hacemos throw dentro de .catch, el control pasa a otro manejador de errores más cercano. Y, si manejamos el error y terminamos de forma correcta, entonces se continúa con el siguiente manejador .then exitoso.

En el ejemplo de abajo, el .catch maneja el error de forma exitosa:

````js
// Ejecución: catch -> then
new Promise((resolve, reject) => {

  throw new Error("Whoops!");

}).catch(function(error) {

  alert("Error manejado, se continuará con la ejecución del código");

}).then(() => alert("El siguiente manejador exitoso se ejecuta"));
````

Aquí el .catch termina de forma correcta. Entonces se ejecuta el siguiente manejador exitoso .then.

En el siguiente ejemplo podemos ver otra situación con .catch. El manejador (*) detecta el error y simplemente no puede manejarlo (en el ejemplo solo sabe que hacer con un URIError), por lo que lo lanza nuevamente:

````js
// Ejecución: catch -> catch
new Promise((resolve, reject) => {

  throw new Error("Whoops!");

}).catch(function(error) { // (*)

  if (error instanceof URIError) {
    // Aquí se manejaría el error
  } else {
    alert("No puedo manejar este error");

    throw error; // Lanza este error u otro error que salte en el siguiente catch.
  }

}).then(function() {
  /* Esto no se ejecuta */
}).catch(error => { // (**)

  alert(`Ocurrió un error desconocido: ${error}`);
  // No se devuelve nada => La ejecución continúa de forma normal

});
````

La ejecución salta del primer .catch (*) al siguiente (**) en la cadena.

## Rechazos no manejados

¿Que sucede cuanto un error no es manejado? Por ejemplo, si olvidamos agregar .catch al final de una cadena de promesas, como aquí:

````js
new Promise(function() {
  noSuchFunction(); // Aquí hay un error (no existe la función)
})
  .then(() => {
    // manejador de una o más promesas exitosas
  }); // sin .catch al final!
````

En caso de que se genere un error, la promesa se rechaza y la ejecución salta al manejador de rechazos más cercano. Pero aquí no hay ninguno. Entonces el error se “atasca”, ya que no hay código para manejarlo.

En la práctica, al igual que con los errores comunes no manejados en el código, esto significa que algo ha salido terriblemente mal.

¿Que sucede cuando ocurre un error regular y no es detectado por try..catch? El script muere con un mensaje en la consola. Algo similar sucede con los rechazos de promesas no manejadas.

En este caso, el motor de JavaScript rastrea el rechazo y lo envía al ámbito global. Puedes ver en consola el error generado si ejecutas el ejemplo anterior.

En el navegador podemos detectar tales errores usando el evento unhandledrejection:

````js
window.addEventListener('unhandledrejection', function(event) {
  // el objeto event tiene dos propiedades especiales:
  alert(event.promise); // [objeto Promesa] - La promesa que fue rechazada
  alert(event.reason); // Error: Whoops! - Motivo por el cual se rechaza la promesa
});

new Promise(function() {
  throw new Error("Whoops!");
}); // No hay un .catch final para manejar el error
````

Este evento es parte del standard HTML.

Si se produce un error, y no hay un .catch, se dispara unhandledrejection, y se obtiene el objeto event el cual contiene información sobre el error, por lo que podemos hacer algo con el error (manejar el error).

Usualmente estos errores no son recuperables, por lo que la mejor salida es informar al usuario sobre el problema y probablemente reportar el incidente al servidor.

En entornos fuera del navegador como Node.js existen otras formas de rastrear errores no manejados.

## Resumen

* `.catch` maneja errores de todo tipo: ya sea una llamada a reject(), o un error que arroja un manejador.
* `.then` también atrapa los errores de la misma manera si se le da el segundo argumento (que es el manejador de error).
* Debemos colocar .catch exactamente en los lugares donde queremos manejar los errores y saber cómo manejarlos. El manejador debe analizar los errores (los errores personalizados ayudan), y relanzar los errores desconocidos (tal vez sean errores de programación).
* Es correcto no usar .catch en absoluto si no hay forma de recuperarse de un error.
* En cualquier caso, deberíamos tener el evento unhandledrejection (para navegadores, o el equivalente en otros entornos) para monitorear errores no manejados e informar al usuario (y probablemente al servidor) para que nuestra aplicación nunca “simplemente muera”.

# ✅ Tareas

## Error en setTimeout

¿Qué crees que pasará? ¿Se disparará el .catch? Explica tu respuesta.

````js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);
````

[solución]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/readme.md)
