# 📖 Comprobación de clase: "instanceof"

El operador instanceof permite verificar si un objeto pertenece a una clase determinada. También tiene en cuenta la herencia.

Tal verificación puede ser necesaria en muchos casos. Aquí lo usaremos para construir una función polimórfica, la que trata los argumentos de manera diferente dependiendo de su tipo.

## El operador instanceof

La sintaxis es:

````js
obj instanceof Class
````

Devuelve true si obj pertenece a la Class o una clase que hereda de ella.

Por ejemplo:

````js
class Rabbit {}
let rabbit = new Rabbit();

// ¿Es un objeto de la clase Rabbit?
alert( rabbit instanceof Rabbit ); // verdadero
También funciona con funciones de constructor:

// en lugar de clase
function Rabbit() {}

alert( new Rabbit() instanceof Rabbit ); // verdadero
````

…Y con clases integradas como Array:

````js
let arr = [1, 2, 3];
alert( arr instanceof Array ); // verdadero
alert( arr instanceof Object ); // verdadero
````

Tenga en cuenta que arr también pertenece a la clase Object. Esto se debe a que Array hereda prototípicamente de Object.

Normalmente, instanceof examina la cadena de prototipos para la verificación. También podemos establecer una lógica personalizada en el método estático Symbol.hasInstance.

El algoritmo de obj instanceof Class funciona más o menos de la siguiente manera:

1. Si hay un método estático Symbol.hasInstance, simplemente llámelo: Class[Symbol.hasInstance](obj). Debería devolver true o false, y hemos terminado. Así es como podemos personalizar el comportamiento de instanceof.

Por ejemplo:

````js
// Instalar instancia de verificación que asume que
// cualquier cosa con propiedad canEat es un animal

class Animal {
  static [Symbol.hasInstance](obj) {
    if (obj.canEat) return true;
  }
}

let obj = { canEat: true };

alert(obj instanceof Animal); // verdadero: Animal[Symbol.hasInstance](obj) es llamada
````

La mayoría de las clases no tienen Symbol.hasInstance. En ese caso, se utiliza la lógica estándar: obj instanceOf Class comprueba si Class.prototype es igual a uno de los prototipos en la cadena de prototipos obj.

En otras palabras, compara uno tras otro:

````js
obj.__proto__ === Class.prototype?
obj.__proto__.__proto__ === Class.prototype?
obj.__proto__.__proto__.__proto__ === Class.prototype?
...
// si alguna respuesta es verdadera, devuelve true
// de lo contrario, si llegamos al final de la cadena, devuelve false
````

En el ejemplo anterior rabbit.__ proto__ === Rabbit.prototype, por lo que da la respuesta de inmediato.

En el caso de una herencia, la coincidencia será en el segundo paso:

````js
class Animal {}
class Rabbit extends Animal {}

let rabbit = new Rabbit();
alert(rabbit instanceof Animal); // verdadero

// rabbit.__proto__ === Animal.prototype (no match)
// rabbit.__proto__.__proto__ === Animal.prototype (iguala!)
````

Aquí está la ilustración de lo que rabbit instanceof Animal compara con Animal.prototype:

![image_01]()

Por cierto, también hay un método objA.isPrototypeOf(objB), que devuelve true si objA está en algún lugar de la cadena de prototipos para objB. Por lo tanto, la prueba de obj instanceof Class se puede reformular como Class.prototype.isPrototypeOf(obj).

Es divertido, ¡pero el constructor Class en sí mismo no participa en el chequeo! Solo importa la cadena de prototipos y Class.prototype.

Eso puede llevar a consecuencias interesantes cuando se cambia una propiedad prototype después de crear el objeto.

Como aquí:

````js
function Rabbit() {}
let rabbit = new Rabbit();

// cambió el prototipo
Rabbit.prototype = {};

// ...ya no es un conejo!
alert( rabbit instanceof Rabbit ); // falso
````

## Bonificación: Object.prototype.toString para el tipo

Ya sabemos que los objetos simples se convierten en cadenas como [objetc Objetc]:

````js
let obj = {};

alert(obj); // [object Object]
alert(obj.toString()); // lo mismo
````

Esa es su implementación de toString. Pero hay una característica oculta que hace que toString sea mucho más poderoso que eso. Podemos usarlo como un typeof extendido y una alternativa para instanceof.

¿Suena extraño? En efecto. Vamos a desmitificar.

Por esta especificación, el toString incorporado puede extraerse del objeto y ejecutarse en el contexto de cualquier otro valor. Y su resultado depende de ese valor.

* Para un número, será [object Number]
* Para un booleano, será [objetc Boolean]
* Para null: [objetc Null]
* Para undefined: [objetc Undefined]
* Para matrices: [Object Array]
* … etc (personalizable).

Demostremos:

````js
// copie el método toString en una variable a conveniencia
let objectToString = Object.prototype.toString;

// ¿que tipo es este?
let arr = [];

alert( objectToString.call(arr) ); // [object Array]
````

Aquí usamos call como se describe en el capítulo Decoradores y redirecciones, call/apply para ejecutar la función objectToString en el contexto this=arr.

Internamente, el algoritmo toString examina this y devuelve el resultado correspondiente. Más ejemplos:

````js
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
````

## Symbol.toStringTag

El comportamiento del objeto toString se puede personalizar utilizando una propiedad de objeto especial Symbol.toStringTag.

Por ejemplo:

````js
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
````

Para la mayoría de los objetos específicos del entorno, existe dicha propiedad. Aquí hay algunos ejemplos específicos del navegador:

````js
// toStringTag para el objeto y clase específicos del entorno:
alert( window[Symbol.toStringTag]); // ventana
alert( XMLHttpRequest.prototype[Symbol.toStringTag] ); // XMLHttpRequest

alert( {}.toString.call(window) ); // [object Window]
alert( {}.toString.call(new XMLHttpRequest()) ); // [object XMLHttpRequest]
````

Como puedes ver, el resultado es exactamente Symbol.toStringTag (si existe), envuelto en [object ...].

Al final tenemos “typeof con esteroides” que no solo funciona para tipos de datos primitivos, sino también para objetos incorporados e incluso puede personalizarse.

Podemos usar {}.toString.call en lugar de instanceof para los objetos incorporados cuando deseamos obtener el tipo como una cadena en lugar de solo verificar.

## Resumen

Resumamos los métodos de verificación de tipos que conocemos:

|             | trabaja para                                                        | retorna    |
|-------------|---------------------------------------------------------------------|------------|
| typeof      |	primitivos                                                          |	cadena     |
| {}.toString | primitivos, objetos incorporados, objetos con Symbol.toStringTag    |	cadena     |
| instanceof  |	objetos	                                                            | true/false |

Como podemos ver, {}.toString es técnicamente un typeof “más avanzado”.

Y el operador instanceof realmente brilla cuando estamos trabajando con una jerarquía de clases y queremos verificar si la clase tiene en cuenta la herencia.

# ✅ Tareas

## Extrano instanceof

En el siguiente código, ¿por qué instanceof devuelve true? Podemos ver fácilmente que a no es creado por B().

````js
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

alert( a instanceof B ); // verdadero
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/classes/instanceof/solutions/extrano-instanceof.md)

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/classes/readme.md)
