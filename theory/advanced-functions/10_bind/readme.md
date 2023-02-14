# Función bind: vinculación de funciones

Al pasar métodos de objeto como devoluciones de llamada, por ejemplo a `setTimeout`, se genera un problema conocido: la "pérdida de `this`".

En este capítulo veremos las formas de solucionarlo.

## Pérdida de “this”

Ya hemos visto ejemplos de pérdida de `this`. Una vez que se pasa hacia algún lugar un método separado de su objeto, `this` se pierde.

Así es como puede suceder con `setTimeout`:

````js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!
````

Como podemos ver, el resultado no muestra “John” como this.firstName ¡sino undefined!

Esto se debe a que setTimeout tiene la función user.sayHi, separada del objeto. La última línea se puede reescribir como:

````js
let f = user.sayHi;
setTimeout(f, 1000); // user pierde el contexto
````

El método setTimeout en el navegador es un poco especial: establece this = window para la llamada a la función (para Node.js, this se convierte en el objeto temporizador (timer), pero realmente no importa aquí). Entonces, en this.firstName intenta obtener window.firstName, que no existe. En otros casos similares, this simplemente se vuelve undefined.

La tarea es bastante típica: queremos pasar un método de objeto a otro lugar (aquí, al planificador) donde se llamará. ¿Cómo asegurarse de que se llamará en el contexto correcto?

## Solución 1: un contenedor (wrapper en inglés)

La solución más simple es usar una función contenedora que la envuelva:

````js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
````

Ahora funciona, porque recibe a user del entorno léxico externo, y luego llama al método normalmente.

Aquí hacemos lo mismo, pero de otra manera:

````js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
````

Se ve bien, pero aparece una ligera vulnerabilidad en nuestra estructura de código…

¿Qué pasa si antes de que se dispare setTimeout (¡hay un segundo retraso!) user cambia el valor? Entonces, de repente, ¡llamará al objeto equivocado!

````js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hola, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ...el valor de user cambia en 1 segundo
user = {
  sayHi() { alert("¡Otro user en setTimeout!"); }
};

// ¡Otro user en setTimeout!
````

La siguiente solución garantiza que tal cosa no sucederá.

## Solución 2: bind (vincular)

Las funciones proporcionan un método incorporado bind que permite fijar a `this`.

La sintaxis básica es:

````js
// la sintaxis más compleja vendrá un poco más tarde
let boundFunc = func.bind(context);
````

El resultado de `func.bind(context)` es un “objeto exótico”, una función similar a una función regular que se puede llamar como función; esta pasa la llamada de forma transparente a func estableciendo this = context.

En otras palabras, llamar a `boundFunc` es como llamar a func pero con un `this` fijo.

Por ejemplo, aquí funcUser pasa una llamada a `func` con `this = user`:

````js
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}

let funcUser = func.bind(user);
funcUser(); // John
````

Aquí `func.bind(user)` es como una “variante vinculada” de `func`, con `this = user` fijo en ella.

Todos los argumentos se pasan al `func` original “tal cual”, por ejemplo:

````js
let user = {
  firstName: "John"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// vincula this a user
let funcUser = func.bind(user);

funcUser("Hello"); // Hello, John (se pasa el argumento "Hello", y this=user)
````

Ahora intentemos con un método de objeto:

````js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

let sayHi = user.sayHi.bind(user); // (*)

// puede ejecutarlo sin un objeto
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// incluso si el valor del usuario cambia en 1 segundo
// sayHi usa el valor pre-enlazado
user = {
  sayHi() { alert("Another user in setTimeout!"); }
};
````

En la línea `(*)` tomamos el método ` user.sayHi ` y lo vinculamos a user. sayHi es una función “vinculada”. No importa si se llama sola o se pasa en setTimeout, el contexto será el correcto.

Aquí podemos ver que los argumentos se pasan “tal cual”, solo que this se fija mediantebind:

````js
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John! ("Hello" se pasa a say)
say("Bye"); // Bye, John! ("Bye" se pasa a say)
````js

### ℹ️ Convenience method:bindAll
Si un objeto tiene muchos métodos y planeamos pasarlo activamente, podríamos vincularlos a todos en un bucle:

````js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
````

Las bibliotecas de JavaScript también proporcionan funciones para un enlace masivo, ej. _.bindAll(object, methodNames) en lodash.

## Funciones parciales

Hasta ahora solo hemos estado hablando de vincular `this`. Vamos un paso más allá.

Podemos vincular no solo `this`, sino también argumentos. Es algo que no suele hacerse, pero a veces puede ser útil.

Sintaxis completa de `bind`:

````js
let bound = func.bind(context, [arg1], [arg2], ...);
````

Permite vincular el contexto como `this` y los argumentos iniciales de la función.

Por ejemplo, tenemos una función de multiplicación `mul(a, b)`:

````js
function mul(a, b) {
  return a * b;
}
````

Usemos `bind` para crear, en su base, una función `double` para duplicar:

````js
function mul(a, b) {
  return a * b;
}

let double = mul.bind(null, 2);

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
````

La llamada a `mul.bind(null, 2)` crea una nueva función double que pasa las llamadas a `mul`, fijando `null` como contexto y `2` como primer argumento. Los demás argumentos se pasan “tal cual”.

Esto se llama aplicación parcial: creamos una nueva función fijando algunos parámetros a la existente.

Tenga en cuenta que aquí en realidad no usamos `this`. Pero `bind` lo requiere, por lo que debemos poner algo como `null`.

La función `triple` en el siguiente código triplica el valor:

````js
function mul(a, b) {
  return a * b;
}

let triple = mul.bind(null, 3);

alert( triple(3) ); // = mul(3, 3) = 9
alert( triple(4) ); // = mul(3, 4) = 12
alert( triple(5) ); // = mul(3, 5) = 15
````

¿Por qué solemos hacer una función parcial?

El beneficio es que podemos crear una función independiente con un nombre legible `(double,triple)`. Podemos usarla y evitamos proporcionar el primer argumento cada vez, ya que se fija con bind.

En otros casos, la aplicación parcial es útil cuando tenemos una función muy genérica y queremos una variante menos universal para mayor comodidad.

Por ejemplo, tenemos una función `send(from, to, text)`. Luego, dentro de un objeto user podemos querer usar una variante parcial del mismo: sendTo(to, text) que envía desde el usuario actual.

## Parcial sin contexto

¿Qué pasa si queremos fijar algunos argumentos, pero no el contexto this? Por ejemplo, para un método de objeto.

El método `bind` nativo no permite eso. No podemos simplemente omitir el contexto y saltar a los argumentos.

Afortunadamente, se puede implementar fácilmente una función parcial para vincular solo argumentos.

Como esto:

````js
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}

// Uso:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// agregar un método parcial con tiempo fijo
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// Algo como:
// [10:00] John: Hello!
````

El resultado de la llamada `parcial(func [, arg1, arg2 ...])` es un contenedor o “wrapper” (`*`) que llama a `func` con:

* El mismo this (para la llamada a user.sayNow es user)
* Luego le da ...argsBound: argumentos desde la llamada a partial ("10:00")
* Luego le da ...args: argumentos dados desde la envoltura ("Hello")

Muy fácil de hacer con la sintaxis de propagación, ¿verdad?

También hay una implementación preparada _.partial desde la librería lodash.

## Resumen

El método `func.bind(context, ... args)` devuelve una “variante vinculada” de la función func; fijando el contexto `this` y, si se proporcionan, fijando también los primeros argumentos.

Por lo general, aplicamos `bind` para fijar `this` a un método de objeto, de modo que podamos pasarlo en otro lugar. Por ejemplo, en `setTimeout`.

Cuando fijamos algunos argumentos de una función existente, la función resultante (menos universal) se llama aplicación parcial o parcial.

Los parciales son convenientes cuando no queremos repetir el mismo argumento una y otra vez. Al igual que si tenemos una función `send(from, to)`, y from siempre debe ser igual para nuestra tarea, entonces, podemos obtener un parcial y continuar la tarea con él.

## ✅ Tareas

## Función enlazada como método

¿Cuál será el resultado?

````js
function f() {
  alert( this ); // ?
}

let user = {
  g: f.bind(null)
};

user.g();
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/10_bind/solutions/funcion-enlazada-como-metodo.md)

## Segundo enlace

¿Podemos cambiar `this` por un enlace adicional?

¿Cuál será el resultado?

````js
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/10_bind/solutions/segundo-enlace.md)

## Propiedad de función después del enlace

Hay un valor en la propiedad de una función. ¿Cambiará después de `bind`? ¿Por qué sí o por qué no?

````js
function sayHi() {
  alert( this.name );
}
sayHi.test = 5;

let bound = sayHi.bind({
  name: "John"
});

alert( bound.test ); // ¿Cuál será la salida? ¿por qué?
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/10_bind/solutions/propiedad-de-funcion-despues-del-enlace.md)

## Arreglar una función que perdió "this"

La llamada a `askPassword()` en el código a continuación debe verificar la contraseña y luego llamar a `user.loginOk/loginFail` dependiendo de la respuesta.

Pero lleva a un error. ¿Por qué?

Arregle la línea resaltada para que todo comience a funcionar correctamente (no se deben cambiar otras líneas).

````js
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  loginOk() {
    alert(`${this.name} logged in`);
  },

  loginFail() {
    alert(`${this.name} failed to log in`);
  },

};

askPassword(user.loginOk, user.loginFail);
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/10_bind/solutions/arreglar-una-funcion-que-perdio-this.md)

## Aplicación parcial para inicio de sesión

La tarea es una variante un poco más compleja de Arreglar una función que perdió "`this`".

El objeto user fue modificado. Ahora, en lugar de dos funciones `loginOk/loginFail`, tiene una sola función `user.login(true/false)`.

¿Qué deberíamos pasar a `askPassword` en el código a continuación, para que llame a `user.login(true)` como `ok` y `user.login(false)` como `fail`?

````js
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  login(result) {
    alert( this.name + (result ? ' logged in' : ' failed to log in') );
  }
};

askPassword(?, ?); // ?
````

Sus cambios solo deberían modificar el fragmento resaltado.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/10_bind/solutions/aplicacion-parcial-para-inicio-de-sesion.md)


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/readme.md)
