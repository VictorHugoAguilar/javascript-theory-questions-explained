# Función como objeto, NFE

Como ya sabemos, una función en JavaScript es un valor.

Cada valor en JavaScript tiene un tipo. ¿Qué tipo es una función?

En JavaScript, las funciones son objetos.

Una buena manera de imaginar funciones es como “objetos de acción” invocables. No solo podemos llamarlos, sino también tratarlos como objetos: agregar/eliminar propiedades, pasar por referencia, etc.

## La propiedad “name”

Las funciones como objeto contienen algunas propiedades utilizables.

Por ejemplo, el nombre de una función es accesible mediante la propiedad “name”:

````js
function sayHi() {
  alert("Hi");
}

alert(sayHi.name); // sayHi
````

Lo que es divertido, es que la lógica de asignación de nombres es inteligente. También da el nombre correcto a una función, incluso si se creó sin uno:

````js
let sayHi = function() {
  alert("Hi");
};

alert(sayHi.name); // sayHi (¡hay un nombre!)
````

También funciona si la asignación se realiza mediante un valor predeterminado:

````js
function f(sayHi = function() {}) {
  alert(sayHi.name); // sayHi (¡funciona!)
}

f();
````

En la especificación, esta característica se denomina “nombre contextual”. Si la función no proporciona una, entonces en una asignación se deduce del contexto.

Los métodos de objeto también tienen nombres:

````js
let user = {

  sayHi() {
    // ...
  },

  sayBye: function() {
    // ...
  }

}

alert(user.sayHi.name); // sayHi
alert(user.sayBye.name); // sayBye
````

Sin embargo, no hay magia. Hay casos en que no hay forma de encontrar el nombre correcto. En ese caso, la propiedad “name” está vacía, como aquí:

````js
// función creada dentro de un array
let arr = [function() {}];

alert( arr[0].name ); // <empty string>
// el motor no tiene forma de establecer el nombre correcto, por lo que no asigna ninguno
````

En la práctica, sin embargo, la mayoría de las funciones tienen un nombre.

## La propiedad “length”

Hay una nueva propiedad “length” incorporada que devuelve el número de parámetros de una función, por ejemplo:

````js
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
````

Aquí podemos ver que los parámetros rest no se cuentan.

La propiedad `length` a veces se usa para introspección en funciones que operan en otras funciones.

Por ejemplo, en el siguiente código, la función ask , acepta una question y un número arbitrario de funciones controladoras o handler para llamar.

Una vez que un usuario proporciona su respuesta, la función llama a los controladores. Podemos pasar dos tipos de controladores:

* Una función de cero argumentos, que solo se llama cuando el usuario da una respuesta positiva.
* Una función con argumentos, que se llama en cualquier caso y devuelve una respuesta.

Para llamar a handler de la manera correcta, examinamos la propiedad handler.length.

La idea es que tenemos una sintaxis de controlador simple y sin argumentos para casos positivos (la variante más frecuente), pero también podemos admitir controladores universales:

````js
function ask(question, ...handlers) {
  let isYes = confirm(question);

  for(let handler of handlers) {
    if (handler.length == 0) {
      if (isYes) handler();
    } else {
      handler(isYes);
    }
  }

}

// para una respuesta positiva, se llaman ambos controladores
// para respuesta negativa, solo el segundo
ask("Question?", () => alert('You said yes'), result => alert(result));
````

Este es un caso particular llamado polimorfismo – tratar los argumentos de manera diferente según su tipo o, en nuestro caso, según la ‘longitud’. La idea tiene un uso en las bibliotecas de JavaScript.

## Propiedades personalizadas

También podemos agregar nuestras propias propiedades.

Aquí agregamos la propiedad counter para registrar el recuento total de llamadas:

````js
function sayHi() {
  alert("Hi");

  //vamos a contar las veces que se ejecuta
  sayHi.counter++;
}
sayHi.counter = 0; // valor inicial

sayHi(); // Hi
sayHi(); // Hi

alert( `Called ${sayHi.counter} times` ); //  Llamamos 2 veces
````

### ⚠️ Una propiedad no es una variable

Una propiedad asignada a una función como `sayHi.counter = 0` no define una variable local counter dentro de ella. En otras palabras, una propiedad counter y una variable let counter son dos cosas no relacionadas.

Podemos tratar una función como un objeto, almacenar propiedades en ella, pero eso no tiene ningún efecto en su ejecución. Las variables no son propiedades de la función y viceversa. Estos solo son dos mundos paralelos.

Las propiedades de la función a veces pueden reemplazar las clausuras o closures. Por ejemplo, podemos reescribir el ejemplo de la función de contador del capítulo Ámbito de Variable y el concepto "closure" para usar una propiedad de función:

````js
function makeCounter() {
  // en vez de:
  // let count = 0

  function counter() {
    return counter.count++;
  };

  counter.count = 0;

  return counter;
}

let counter = makeCounter();
alert( counter() ); // 0
alert( counter() ); // 1
````

`count` ahora se almacena en la función directamente, no en su entorno léxico externo.

¿Es mejor o peor que usar una clausura (closure)?

La principal diferencia es que si el valor de count vive en una variable externa, entonces el código externo no puede acceder a él. Solo las funciones anidadas pueden modificarlo. Y si está vinculado a una función, entonces tal cosa es posible:

````js
function makeCounter() {

  function counter() {
    return counter.count++;
  };

  counter.count = 0;

  return counter;
}

let counter = makeCounter();

counter.count = 10;
alert( counter() ); // 10
````

Por lo tanto, la elección de la implementación depende de nuestros objetivos.

## Expresión de Función con Nombre

*Named Function Expression, o NFE*, es un término para Expresiones de funciones que tienen un nombre.

Por ejemplo, tomemos una expresión de función ordinaria:

````js
let sayHi = function(who) {
  alert(`Hello, ${who}`);
};
````

Y agrégale un nombre:

````js
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};
````

¿Logramos algo aquí? ¿Cuál es el propósito de ese nombre adicional de "func"?

Primero, tengamos en cuenta que todavía tenemos una Expresión de Función. Agregar el nombre "func" después de function no lo convirtió en una Declaración de Función, porque todavía se crea como parte de una expresión de asignación.

Agregar ese nombre tampoco rompió nada.

La función todavía está disponible como sayHi():

````js
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
````

Hay dos cosas especiales sobre el nombre func, que le hacen útil:

1. Permite que la función se haga referencia internamente.
2. No es visible fuera de la función…

Por ejemplo, la función sayHi a continuación se vuelve a llamar a sí misma con "Guest" si no se proporciona who:

````js
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // usa func para volver a llamarse a sí misma
  }
};

sayHi(); // Hello, Guest

// Pero esto no funcionará.
func(); // Error, func no está definido (no visible fuera de la función)
````

¿Por qué usamos `func`? ¿Quizás solo usa sayHi para la llamada anidada?

En realidad, en la mayoría de los casos podemos:

````js
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest");
  }
};
````

El problema con ese código es que sayHi puede cambiar en el código externo. Si la función se asigna a otra variable, el código comenzará a dar errores:

````js
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest"); // Error: sayHi no es una función
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Error, ¡la llamada sayHi anidada ya no funciona!
````

Eso sucede porque la función toma sayHi de su entorno léxico externo. No hay sayHi local, por lo que se utiliza la variable externa. Y en el momento de la llamada, ese sayHi externo es nulo.

El nombre opcional que podemos poner en la Expresión de función está destinado a resolver exactamente este tipo de problemas.

Usémoslo para arreglar nuestro código:

````js
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // Ahora todo va bien
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (la llamada anidada funciona)
````

Ahora funciona, porque el nombre "func" es una función local. No se toma desde el exterior (y no es visible allí). La especificación garantiza que siempre hará referencia a la función actual.

El código externo todavía tiene su variable sayHi o welcome. Y func es el “nombre de función interna” con el que la función puede llamarse a sí misma de manera confiable.

### ℹ️ No existe tal cosa para la Declaración de funciones

La característica “nombre interno” descrita aquí solo está disponible para Expresiones de funciones, no para Declaraciones de funciones. Para las declaraciones de funciones, no hay sintaxis para agregar un nombre “interno”.

A veces necesitamos un nombre interno confiable, este es un motivo para reescribir una Declaración de función en una Expresión de función con nombre.

## Resumen

Las funciones son objetos.

Aquí cubrimos sus propiedades:

* `name` – El nombre de la función. Por lo general, se toma de la definición de la función, pero si no hay ninguno, JavaScript intenta adivinarlo por el contexto (por ejemplo, una asignación).
* `length` – El número de argumentos en la definición de la función. Los parámetros rest no se cuentan.

Si la función se declara como una Expresión de función (no en el flujo de código principal), y lleva el nombre, se llama Expresión de Función con Nombre (Named Function Expression). El nombre se puede usar dentro para hacer referencia a sí mismo, para llamadas recursivas o similares.

Además, las funciones pueden tener propiedades adicionales. Muchas bibliotecas de JavaScript conocidas hacen un gran uso de esta función.

Crean una función “principal” y le asignan muchas otras funciones “auxiliares”. Por ejemplo, la biblioteca jQuery crea una función llamada $. La biblioteca lodash crea una función _, y luego agrega _.clone, _.keyBy y otras propiedades (mira los docs cuando quieras aprender más sobre ello). En realidad, lo hacen para disminuir su contaminación del espacio global, de modo que una sola biblioteca proporciona solo una variable global. Eso reduce la posibilidad de conflictos de nombres.

Por lo tanto, una función puede hacer un trabajo útil por sí misma y también puede tener muchas otras funcionalidades en las propiedades.

## ✅ Tareas

## Establecer y disminuir un contador

Modifique el código de makeCounter() para que el contador también pueda disminuir y establecer el número:

* `counter()` debe devolver el siguiente número (como antes).
* `counter.set(value)` debe establecer el contador a `value`.
* `counter.decrease()` debe disminuir el contador en 1.

Consulte el código en el entorno de pruebas para ver el ejemplo de uso completo.

> P.D. Puedes usar un “closure” o la propiedad de función para mantener el recuento actual. O escribe ambas variantes.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/06_function-object/solutions/establecer-y-disminuir-un-contador.md)

## Suma con una cantidad arbitraria de paréntesis

Escriba la función sum que funcionaría así:

````js
sum(1)(2) == 3; // 1 + 2
sum(1)(2)(3) == 6; // 1 + 2 + 3
sum(5)(-1)(2) == 6
sum(6)(-1)(-2)(-3) == 0
sum(0)(1)(2)(3)(4)(5) == 15
````

> P.D. Sugerencia: es posible que deba configurar una conversión personalizada “objeto a primitiva” en su función.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/06_function-object/solutions/suma-con-una-cantidad-arbitraria-de-parentesis.md)

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/readme.md)
