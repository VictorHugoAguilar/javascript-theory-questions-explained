# 📖 Promise API

Hay 6 métodos estáticos en la clase Promise. Veremos sus casos de uso aquí.

## Promise.all

Digamos que queremos que muchas promesas se ejecuten en paralelo y esperar hasta que todas ellas estén listas.

Por ejemplo, descargar varias URLs en paralelo y procesar su contenido en cuanto todas ellas finalicen.

Para ello es Promise.all.

La sintaxis es:

````js
let promise = Promise.all(iterable);
````

Promise.all toma un iterable (usualmente un array de promesas) y devuelve una nueva promesa.

Esta nueva promesa es resuelta en cuanto todas las promesas listadas se resuelven, y el array de aquellos resultados se vuelve su resultado.

Por ejemplo, el Promise.all debajo se resuelve después de 3 segundos, y su resultado es un array [1, 2, 3]:

````js
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 1,2,3 cuando las promesas están listas: cada promesa constituye un miembro del array
````

Ten en cuenta que el orden de los miembros del array es el mismo que el de las promesas que los originan. Aunque la primera promesa es la que toma más tiempo en resolverse, es aún la primera en el array de resultados.

Un truco común es mapear un array de datos de trabajo dentro de un array de promesas, y entonces envolverlos dentro de un Promise.all.

Por ejemplo, si tenemos un array de URLs, podemos usar fetch en todos ellos así:

````js
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// "mapear" cada url a la promesa de su fetch
let requests = urls.map(url => fetch(url));

// Promise.all espera hasta que todas la tareas estén resueltas
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
````

Un mayor ejemplo con fetch: la búsqueda de información de usuario para un array de usuarios de GitHub por sus nombres (o podríamos buscar un array de bienes por sus “id”, la lógica es idéntica):

````js
let names = ['iliakan', 'remy', 'jeresig'];

let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

Promise.all(requests)
  .then(responses => {
    // todas las respuestas son resueltas satisfactoriamente
    for(let response of responses) {
      alert(`${response.url}: ${response.status}`); // muestra 200 por cada url
    }

    return responses;
  })
  // mapea el array de resultados dentro de un array de response.json() para leer sus contenidos
  .then(responses => Promise.all(responses.map(r => r.json())))
  // todas las respuestas JSON son analizadas: "users" es el array de ellas
  .then(users => users.forEach(user => alert(user.name)));
````

**Si cualquiera de las promesas es rechazada, la promesa devuelta por Promise.all inmediatamente rechaza: “reject” con ese error.**

Por ejemplo:

````js
Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).catch(alert); // Error: Whoops!
````

Aquí la segunda promesa se rechaza en dos segundos. Esto lleva a un rechazo inmediato de Promise.all, entonces .catch se ejecuta: el error del rechazo se vuelve la salida del Promise.all entero.

### ⚠️ En caso de error, las demás promesas son ignoradas
Si una promesa se rechaza, Promise.all se rechaza inmediatamente, olvidando completamente las otras de la lista. Aquellos resultados son ignorados.

Por ejemplo: si hay múltiples llamados fetch, como en el ejemplo arriba, y uno falla, los demás aún continuarán en ejecución, pero Promise.all no las observará más. Ellas probablemente respondan, pero sus resultados serán ignorados.

### ℹ️ Promise.all no hace nada para cancelarlas, no existe un concepto de “cancelación” en las promesas. En otro capítulo veremos AbortController, que puede ayudar con ello pero no es parte de la API de las promesas.

Promise.all(iterable) permite valores “comunes” que no sean promesas en iterable
Normalmente, Promise.all(...) acepta un iterable (array en la mayoría de los casos) de promesas. Pero si alguno de esos objetos no es una promesa, es pasado al array resultante “tal como está”.

Por ejemplo, aquí los resultados son [1, 2, 3]:

````js
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000)
  }),
  2,
  3
]).then(alert); // 1, 2, 3
````

Entonces podemos pasar valores listos a Promise.all donde sea conveniente.

## Promise.allSettled

### ⚠️ Una adición reciente
Esta es una adición reciente al lenguaje. Los navegadores antiguos pueden necesitar polyfills.
Promise.all rechaza como un todo si cualquiera de sus promesas es rechazada. Esto es bueno para los casos de “todo o nada”, cuando necesitamos que todos los resultados sean exitosos para proceder:

````js
Promise.all([
  fetch('/template.html'),
  fetch('/style.css'),
  fetch('/data.json')
]).then(render); // el método render necesita los resultados de todos los fetch
````

`Promise.allSettled` solo espera que todas las promesas se resuelvan sin importar sus resultados. El array resultante tiene:

* `{status:"fulfilled", value:result}` para respuestas exitosas,
* `{status:"rejected", reason:error}` para errores.

Por ejemplo, quisiéramos hacer “fetch” de la información de múltiples usuarios. Incluso si uno falla, aún estaremos interesados en los otros.

Usemos `Promise.allSettled`:

````js
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://no-such-url'
];

Promise.allSettled(urls.map(url => fetch(url)))
  .then(results => { // (*)
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        alert(`${urls[num]}: ${result.value.status}`);
      }
      if (result.status == "rejected") {
        alert(`${urls[num]}: ${result.reason}`);
      }
    });
  });
````

El results de la línea (*) de arriba será:

````js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error object...}
]
````

Entonces para cada promesa obtendremos su estado y value/error.

## Polyfill

Si el browser no soporta Promise.allSettled, es fácil implementarlo:

````js
if (!Promise.allSettled) {
  const rejectHandler = reason => ({ status: 'rejected', reason });

  const resolveHandler = value => ({ status: 'fulfilled', value });

  Promise.allSettled = function (promises) {
    const convertedPromises = promises.map(p => Promise.resolve(p).then(resolveHandler, rejectHandler));
    return Promise.all(convertedPromises);
  };
}
````

En este código, promises.map toma los valores de entrada, los transforma en promesas (por si no lo eran) con p => Promise.resolve(p), entonces agrega un manejador .then a cada una.

Este manejador (“handler”) transforma un resultado exitoso value en {status:'fulfilled', value}, y un error reason en {status:'rejected', reason}. Ese es exactamente el formato de Promise.allSettled.

Ahora podemos usar Promise.allSettled para obtener el resultado de todas las promesas dadas incluso si algunas son rechazadas.

## Promise.race

Similar a Promise.all, pero espera solamente por la primera respuesta y obtiene su resultado (o error).

Su sintaxis es:

````js
let promise = Promise.race(iterable);
````

Por ejemplo, aquí el resultado será 1:

````js
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
````

La primera promesa fue la más rápida, por lo que se vuelve resultado. En cuanto una promesa responde, “gana la carrera”, y todos los resultados o errores posteriores son ignorados.

## Promise.any

Es similar a Promise.race, pero espera solamente por la primera promesa cumplida y obtiene su resultado. Si todas la promesas fueron rechazadas, entonces la promesa que devuelve es rechazada con AggregateError, un error especial que almacena los errores de todas las promesas en su propiedad errors.

La sintaxis es:

````js
let promise = Promise.any(iterable);
````

Por ejemplo, aquí el resultado será 1:

````js
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
````

La primera promesa fue la más rápida, pero fue rechazada entonces devuelve el resultado de la segunda. Una vez que la primera promesa cumplida “gana la carrera”, los demás resultados serán ignorados.

Aquí hay un ejemplo donde todas la promesas fallan:

````js
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ouch!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Error!")), 2000))
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors[0]); // Error: Ouch!
  console.log(error.errors[1]); // Error: Error!
});
````

Como puedes ver, los objetos de error de las promesas que fallaron están disponibles en la propiedad errors del objeto AggregateError.

## Promise.resolve/reject

Los métodos Promise.resolve y Promise.reject son raramente necesitados en código moderno porque la sintaxis async/await (que veremos luego) las hace algo obsoletas.

Las tratamos aquí para completar la cobertura y por aquellos casos que por algún motivo no puedan usar async/await.

## Promise.resolve

Promise.resolve(value) crea una promesa resuelta con el resultado value.

Tal como:

````js
let promise = new Promise(resolve => resolve(value));
````

El método es usado por compatibilidad, cuando se espera que una función devuelva una promesa.

Por ejemplo, la función loadCached abajo busca una URL y recuerda (en caché) su contenido. Futuros llamados con la misma URL devolverá el contenido de caché, pero usa Promise.resolve para hacer una promesa de él y así el valor devuelto es siempre una promesa:

````js
let cache = new Map();

function loadCached(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url)); // (*)
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache.set(url,text);
      return text;
    });
}
````

Podemos escribir loadCached(url).then(…) porque se garantiza que la función devuelve una promesa. Siempre podremos usar .then después de loadCached. Ese es el propósito de Promise.resolve en la línea (*).

## Promise.reject

Promise.reject(error) crea una promesa rechazada con error.

Tal como:

````js
let promise = new Promise((resolve, reject) => reject(error));
````

En la práctica este método casi nunca es usado.

## Resumen

Existen 6 métodos estáticos de la clase Promise:

1.  Promise.all(promises) – espera que todas las promesas se resuelvan y devuelve un array de sus resultados. Si cualquiera es rechazada se vuelve el error de Promise.all y los demás resultados son ignorados.
2.  Promise.allSettled(promises) (método recientemente añadido) – espera que toda las promesas respondan y devuelve sus resultados como un array de objetos con:
status: "fulfilled" o "rejected"
value (si fulfilled) o reason (si rejected).
3.  Promise.race(promises) – espera a la primera promesa que responda y aquel resultado o error se vuelve su resultado o error.
4.  Promise.any(promises) (método recientemente añadido) – espera por la primera promesa que se cumpla y devuelve su resultado. Si todas las promesas son rechazadas, AggregateError se vuelve el error de Promise.any.
5.  Promise.resolve(value) – crea una promesa resuelta con el “value” dado.
6.  Promise.reject(error) – crea una promesa rechazada con el “error” dado.

Promise.all es probablemente el más común en la práctica.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/async/readme.md)
