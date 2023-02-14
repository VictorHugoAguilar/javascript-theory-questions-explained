# Decoradores y redirecciones, call/apply

JavaScript ofrece una flexibilidad excepcional cuando se trata de funciones. Se pueden pasar, usar como objetos, y ahora veremos cómo redirigir las llamadas entre ellas y decorarlas.

## Caché transparente

Digamos que tenemos una función `slow(x)`, que es pesada para la CPU, pero cuyos resultados son “estables”: es decir que con la misma x siempre devuelve el mismo resultado.

Si la función se llama con frecuencia, es posible que queramos almacenar en caché (recordar) los resultados obtenidos para evitar perder tiempo en calcularlos de nuevo.

Pero en lugar de agregar esta funcionalidad en slow(), crearemos una función contenedora (en inglés “wrapper”, envoltorio) que agregue almacenamiento en caché. Como veremos, hacer esto tiene sus beneficios.

Aquí está el código, seguido por su explicación:

````js
function slow(x) {
  // puede haber un trabajo pesado de CPU aquí
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) {  // si hay tal propiedad en caché
      return cache.get(x); // lee el resultado
    }

    let result = func(x);  // de lo contrario llame a func

    cache.set(x, result);  // y almacenamos en caché (recordamos) el resultado
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1) es cacheado y se devuelve el resultado
alert( "Again: " + slow(1) ); // el resultado slow(1) es devuelto desde caché

alert( slow(2) ); // slow(2) es cacheado y devuelve el resultado
alert( "Again: " + slow(2) ); // el resultado slow(2) es devuelto desde caché
````

En el código anterior, `cachingDecorator` es un decorador: una función especial que toma otra función y altera su comportamiento.

La idea es que podemos llamar a `cachingDecorator` para cualquier función, y devolver el contenedor de almacenamiento en caché. Eso es genial, porque podemos tener muchas funciones que podrían usar dicha función, y todo lo que tenemos que hacer es aplicarles ‘cachingDecorator’.

Al separar el caché del código de la función principal, también permite mantener el código principal más simple.

El resultado de cachingDecorator(func) es un contenedor: function(x) que envuelve la llamada de func(x) en la lógica de almacenamiento en caché:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/09_call-apply-decorators/img/image_01.png?raw=true)

Desde un código externo, la función slow envuelta sigue haciendo lo mismo. Simplemente se agregó un aspecto de almacenamiento en caché a su comportamiento.

Para resumir, hay varios beneficios de usar un cachingDecorator separado en lugar de alterar el código de slow en sí mismo:

* El cachingDecorator es reutilizable. Podemos aplicarlo a otra función.
* La lógica de almacenamiento en caché es independiente, no aumentó la complejidad de slow en sí misma (si hubiera alguna).
* Podemos combinar múltiples decoradores si es necesario.

## Usando “func.call” para el contexto

El decorador de caché mencionado anteriormente no es adecuado para trabajar con métodos de objetos.

Por ejemplo, en el siguiente código, `worker.slow()` deja de funcionar después de la decoración:

````js
// // haremos el trabajo en caché de .slow
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // una aterradora tarea muy pesada para la CPU
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// el mismo código de antes
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func(x); // (**)
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // el método original funciona

worker.slow = cachingDecorator(worker.slow); // ahora hazlo en caché

alert( worker.slow(2) ); // Whoops! Error: Cannot read property 'someMethod' of undefined
````

El error ocurre en la línea (*) que intenta acceder a this.someMethod y falla. ¿Puedes ver por qué?

La razón es que el contenedor llama a la función original como func(x) en la línea (**). Y, cuando se llama así, la función obtiene this = undefined.

Observaríamos un síntoma similar si intentáramos ejecutar:

````js
let func = worker.slow;
func(2);
````

Entonces, el contenedor pasa la llamada al método original, pero sin el contexto this. De ahí el error.

Vamos a solucionar esto:

Hay un método de función especial incorporado func.call(context, …args) que permite llamar a una función que establece explícitamente this.

La sintaxis es:

````js
func.call(context, arg1, arg2, ...)
````

Ejecuta `func` proporcionando el primer argumento como this, y el siguiente como los argumentos.

En pocas palabras, estas dos llamadas hacen casi lo mismo:

````js
func(1, 2, 3);
func.call(obj, 1, 2, 3)
````

Ambos llaman func con argumentos 1, 2 y 3. La única diferencia es que func.call también establece this en obj.

Como ejemplo, en el siguiente código llamamos a sayHi en el contexto de diferentes objetos: sayHi.call(user) ejecuta sayHi estableciendo this = user, y la siguiente línea establece this = admin:

````js
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// use call para pasar diferentes objetos como "this"
sayHi.call( user ); // John
sayHi.call( admin ); // Admin
````

Y aquí usamos call para llamar a say con el contexto y la frase dados:

````js
function say(phrase) {
  alert(this.name + ': ' + phrase);
}

let user = { name: "John" };

// user se convierte en this, y "Hello" se convierte en el primer argumento
say.call( user, "Hello" ); // John: Hello
````

En nuestro caso, podemos usar call en el contenedor para pasar el contexto a la función original:

````js
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func.call(this, x); // "this" se pasa correctamente ahora
    cache.set(x, result);
    return result;
  };
}

worker.slow = cachingDecorator(worker.slow); // ahora hazlo en caché

alert( worker.slow(2) ); // funciona
alert( worker.slow(2) ); // funciona, no llama al original (en caché)
````

Ahora todo está bien.

Para aclararlo todo, veamos más profundamente cómo se transmite this:

1. Después del decorador worker.slow, ahora el contenedor es function(x) { ... }.
2. Entonces, cuando worker.slow(2) se ejecuta, el contenedor toma 2 como un argumento y a this=worker (objeto antes del punto).
3. Dentro del contenedor, suponiendo que el resultado aún no se haya almacenado en caché, func.call(this, x) pasa el this actual (=worker) y el argumento actual (=2) al método original.

## Veamos los multi-argumentos

Ahora hagamos que cachingDecorator sea aún más universal. Hasta ahora solo funcionaba con funciones de un sólo argumento.

Ahora, ¿cómo almacenar en caché el método multi-argumento worker.slow?

````js
let worker = {
  slow(min, max) {
    return min + max; // una aterradora tarea muy pesada para la CPU
  }
};

// debería recordar llamadas del mismo argumento
worker.slow = cachingDecorator(worker.slow);
````

Anteriormente, para un solo argumento x podríamos simplemente usar cache.set(x, result) para guardar el resultado y cache.get(x) para recuperarlo. Pero ahora necesitamos recordar el resultado para una combinación de argumentos (min, max). El Map nativo toma solo un valor como clave.

Hay muchas posibles soluciones:

1. Implemente una nueva estructura de datos similar a un mapa (o use una de un tercero) que sea más versátil y permita múltiples propiedades.
2. Use mapas anidados: cache.set(min) será un Map que almacena el par (max, result). Así podemos obtener result como cache.get(min).get(max).
3. Una dos valores en uno. En nuestro caso particular, podemos usar un string "min,max" como la propiedad de Map. Por flexibilidad, podemos permitir proporcionar un función hashing para el decorador, que sabe hacer un valor de muchos.

Para muchas aplicaciones prácticas, la tercera variante es lo suficientemente buena, por lo que nos mantendremos en esa opción.

También necesitamos pasar no solo x sino todos los argumentos en func.call. Recordemos que en una función(), con el uso de arguments podemos obtener un pseudo-array de sus argumentos, así que func.call(this, x) debería reemplazarse por func.call(this, ...arguments).

Aquí un mejorado y más potente cachingDecorator:

````js
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.call(this, ...arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // funciona
alert( "Again " + worker.slow(3, 5) ); // lo mismo (cacheado)
````

Ahora funciona con cualquier número de argumentos (aunque la función hash también necesitaría ser ajustada para permitir cualquier número de argumentos. Una forma interesante de manejar esto se tratará a continuación).

Hay dos cambios:

* En la línea (*) llama a hash para crear una sola propiedad de arguments. Aquí usamos una simple función de “unión” que convierte los argumentos (3, 5) en la propiedad "3,5". Los casos más complejos pueden requerir otras funciones hash.
* Entonces (**) usa func.call(this, ...arguments) para pasar tanto el contexto como todos los argumentos que obtuvo el contenedor (no solo el primero) a la función original.

## func.apply

En vez de func.call(this, ...arguments), podríamos usar func.apply(this, arguments).

La sintaxis del método incorporado func.apply es:

````js
func.apply(context, args)
````

Ejecuta la configuración func this = context y usa un objeto tipo array args como lista de argumentos.

La única diferencia de sintaxis entre call y apply es que call espera una lista de argumentos, mientras que apply lleva consigo un objeto tipo matriz.

Entonces estas dos llamadas son casi equivalentes:

````js
func.call(context, ...args);
func.apply(context, args);
````

Estas hacen la misma llamada de func con el contexto y argumento dados.

Solo hay una sutil diferencia con respect○ a args:

* La sintaxis con el operador “spread” ... – en call permite pasar una lista iterable args.
* La opción apply – acepta solamente args que sean símil-array.

Para los objetos que son iterables y símil-array, como un array real, podemos usar cualquiera de ellos, pero apply probablemente será más rápido porque la mayoría de los motores de JavaScript lo optimizan mejor internamente.

Pasar todos los argumentos junto con el contexto a otra función se llama redirección de llamadas.

Esta es la forma más simple:

````js
let wrapper = function() {
  return func.apply(this, arguments);
};
````

Cuando un código externo llama a tal contenedor wrapper, no se puede distinguir de la llamada de la función original func .

## Préstamo de método

Ahora hagamos una pequeña mejora en la función de hash:

function hash(args) {
  return args[0] + ',' + args[1];
}
A partir de ahora, funciona solo en dos argumentos. Sería mejor si pudiera adherir (glue) cualquier número de args.

La solución natural sería usar el método arr.join:

````js
function hash(args) {
  return args.join();
}
````

… desafortunadamente, eso no funcionará. Esto es debido a que estamos llamando a hash (arguments), y el objeto arguments es iterable y símil-array (no es un array real).

Por lo tanto, llamar a join en él fallará, como podemos ver a continuación:

````js
function hash() {
  alert( arguments.join() ); // Error: arguments.join is not a function
}

hash(1, 2);
````

Aún así, hay una manera fácil de usar la unión (join) de arrays:

````js
function hash() {
  alert( [].join.call(arguments) ); // 1,2
}

hash(1, 2);
````

El truco se llama préstamo de método (method borrowing).

Tomamos (prestado) el método join de un array regular ([].join) y usamos [].join.call para ejecutarlo en el contexto de arguments.

¿Por qué funciona?

Esto se debe a que el algoritmo interno del método nativo arr.join (glue) es muy simple.

Tomado de la especificación casi “tal cual”:

1. Hacer que glue sea el primer argumento o, si no hay argumentos, entonces una coma ",".
2. Hacer que result sea una cadena vacía.
3. Adosar this[0] a result.
4. Adherir glue y this[1].
5. Adherir glue y this[2].
6. …hacerlo hasta que la cantidad this.length de elementos estén adheridos.
7. Devolver result.

Entonces, técnicamente toma a this y le une this[0], this[1]… etc. Está escrito intencionalmente de una manera que permite cualquier tipo de array this (no es una coincidencia, muchos métodos siguen esta práctica). Es por eso que también funciona con this = arguments

## Decoradores y propiedades de funciones

Por lo general, es seguro reemplazar una función o un método con un decorador, excepto por una pequeña cosa. Si la función original tenía propiedades (como func.calledCount o cualquier otra) entonces la función decoradora no las proporcionará. Porque es una envoltura. Por lo tanto, se debe tener cuidado al usarlo.

En el ejemplo anterior, si la función slow tuviera propiedades, cachingDecorator(slow) sería un contenedor sin dichas propiedades.

Algunos decoradores pueden proporcionar sus propias propiedades. P.ej. un decorador puede contar cuántas veces se invocó una función y cuánto tiempo tardó, y exponer esta información por medio de propiedades del contenedor.

Existe una forma de crear decoradores que mantienen el acceso a las propiedades de la función, pero esto requiere el uso de un objeto especial Proxy para ajustar una función. Lo discutiremos más adelante en el artículo Proxy y Reflect.

## Resumen

El decorador es un contenedor alrededor de una función que altera su comportamiento. El trabajo principal todavía lo realiza la función.

Los decoradores se pueden ver como “características” o “aspectos” que se pueden agregar a una función. Podemos agregar uno o agregar muchos. ¡Y todo esto sin cambiar su código!

Para implementar cachingDecorator, hemos estudiado los siguientes métodos:

* func.call(context, arg1, arg2…) – llama a func con el contexto y argumentos dados.
* func.apply(context, args) – llama a func, pasando context como this, y un símil-array args como lista de argumentos.

La redirección de llamadas genérica generalmente se realiza con apply:

````js
let wrapper = function() {
  return original.apply(this, arguments);
};
````

También vimos un ejemplo de préstamo de método cuando tomamos un método de un objeto y lo “llamamos” (call) en el contexto de otro objeto. Es bastante común tomar métodos de array y aplicarlos al símil-array arguments. La alternativa es utilizar el objeto de parámetros rest, que es un array real.

Hay muchos decoradores a tu alrededor. Verifica qué tan bien los entendiste resolviendo las tareas de este capítulo.

## ✅ Tareas

## Decorador espía

Cree un decorador spy(func) que devuelva un contenedor el cual guarde todas las llamadas a la función en su propiedad calls

Cada llamada se guarda como un array de argumentos.

Por ejemplo

````js
function work(a, b) {
  alert( a + b ); // work es una función o método arbitrario
}

work = spy(work);

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}
````

> P.D Ese decorador a veces es útil para pruebas unitarias. Su forma avanzada es sinon.spy en la librería Sinon.JS.

[solución]()

## Decorador de retraso

Cree un decorador `delay(f, ms)` que retrase cada llamada de f en ms milisegundos.

Por ejemplo

````js
function f(x) {
  alert(x);
}

// crear contenedores
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test"); // mostrar "test" después de 1000ms
f1500("test"); // mostrar "test" después de 1500ms
````

En otras palabras, `delay(f, ms)` devuelve una variante "Retrasada por ms" def.

En el código anterior, f es una función de un solo argumento, pero en esta solución debe pasar todos los argumentos y el contexto this.

[solución]()

## Decorador debounce

El resultado del decorador debounce(f, ms) es un contenedor que suspende las llamadas a f hasta que haya ms milisegundos de inactividad (sin llamadas, “período de enfriamiento”), luego invoca f una vez con los últimos argumentos.

En otras palabras, debounce es como una secretaria que acepta “llamadas telefónicas” y espera hasta que haya ms milisegundos de silencio. Y solo entonces transfiere la información de la última llamada al “jefe” (llama a la “f” real).

Por ejemplo, teníamos una función f y la reemplazamos con f = debounce(f, 1000).

Entonces, si la función contenedora se llama a 0ms, 200ms y 500ms, y luego no hay llamadas, entonces la ‘f’ real solo se llamará una vez, a 1500ms. Es decir: después del período de enfriamiento de 1000 ms desde la última llamada.

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/09_call-apply-decorators/img/image_02.png?raw=true)

… Y obtendrá los argumentos de la última llamada, y se ignoran las otras llamadas.

Aquí está el código para ello (usa el decorador debounce del Lodash library:

````js
let f = _.debounce(alert, 1000);

f("a");
setTimeout( () => f("b"), 200);
setTimeout( () => f("c"), 500);
// la función debounce espera 1000 ms después de la última llamada y luego ejecuta: alert ("c")
````

Ahora un ejemplo práctico. Digamos que el usuario escribe algo y nos gustaría enviar una solicitud al servidor cuando finalice la entrada.

No tiene sentido enviar la solicitud para cada carácter escrito. En su lugar, nos gustaría esperar y luego procesar todo el resultado.

En un navegador web, podemos configurar un controlador de eventos, una función que se llama en cada cambio de un campo de entrada. Normalmente, se llama a un controlador de eventos con mucha frecuencia, por cada tecla escrita. Pero si le pasamos debounce por 1000ms, entonces solo se llamará una vez, después de 1000ms después de la última entrada.

En este ejemplo en vivo, el controlador coloca el resultado en un cuadro a continuación, pruébelo:

![image_03](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/09_call-apply-decorators/img/image_03.png?raw=true)

¿Lo ve? La segunda entrada llama a la función debounce, por lo que su contenido se procesa después de 1000 ms desde la última entrada.

Entonces, debounce es una excelente manera de procesar una secuencia de eventos: ya sea una secuencia de pulsaciones de teclas, movimientos del mouse u otra cosa.

Espera el tiempo dado después de la última llamada y luego ejecuta su función, que puede procesar el resultado.

La tarea es implementar el decorador debounce.

Sugerencia: son solo algunas líneas si lo piensas :)

[solución]()

## Decorador throttle

Crea un decorador “limitador” o “throttling” throttle(f, ms) que devuelve un contenedor.

Cuando se llama varias veces, pasa la llamada a f como máximo una vez por ms milisegundos.

Comparado con el decorador debounce, el comportamiento es completamente diferente:

* debounce ejecuta la función una vez después del período de enfriamiento. Es bueno para procesar el resultado final.
* throttle la ejecuta una y no más veces por el tiempo de ms dado. Es bueno para actualizaciones regulares que no deberían ser muy frecuentes.

En otras palabras, “throttle” es como una secretaria que acepta llamadas telefónicas, pero molesta al jefe (llama a la “f” real) no más de una vez por ms milisegundos.

Revisemos una aplicación de la vida real para comprender mejor ese requisito y ver de dónde proviene.

**Por ejemplo, queremos registrar los movimientos del mouse.**

En un navegador, podemos configurar una función para que se ejecute en cada movimiento del mouse y obtener la ubicación del puntero a medida que se mueve. Durante un uso activo del mouse, esta función generalmente se ejecuta con mucha frecuencia, puede ser algo así como 100 veces por segundo (cada 10 ms). Nos gustaría actualizar cierta información en la página web cuando se mueve el puntero.

… Pero la función de actualización update() es demasiado pesada para hacerlo en cada micro-movimiento. Tampoco tiene sentido actualizar más de una vez cada 100 ms.

Entonces lo envolveremos en el decorador: para ejecutar en cada movimiento del mouse, usamos throttle(update, 100) en lugar del update() original. Se llamará al decorador con frecuencia, pero este reenviará la llamada a update() como máximo una vez cada 100 ms.

Visualmente, se verá así:

1. Para el primer movimiento del mouse, la variante decorada pasa inmediatamente la llamada a update. Esto es importante, el usuario ve nuestra reacción a su movimiento de inmediato.
2. Luego, a medida que el mouse avanza, hasta 100ms no sucede nada. La variante decorada ignora las llamadas.
3. Al final de 100ms – ocurre un update más con las últimas coordenadas.
4. Entonces, finalmente, el mouse se detiene en alguna parte. La variante decorada espera hasta que expiren 100ms y luego ejecuta update con las últimas coordenadas. Entonces, y esto es muy importante, se procesan las coordenadas finales del mouse.

Un código de ejemplo:

````js
function f(a) {
  console.log(a);
}

// f1000 pasa llamadas a f como máximo una vez cada 1000 ms
let f1000 = throttle(f, 1000);

f1000(1); // muestra 1
f1000(2); // (throttling, 1000ms aún no)
f1000(3); // (throttling, 1000ms aún no)

// tiempo de espera de 1000 ms ...
// ...devuelve 3, el valor intermedio 2 fue ignorado
````

> P.D. Los argumentos y el contexto `this` pasado a `f1000` deben pasarse a la `f` original.

[solucion]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/readme.md)
