# 📖 Prototipos nativos

La propiedad "prototype" es ampliamente utilizada por el núcleo de JavaScript mismo. Todas las funciones de constructor integradas lo usan.

Primero veremos los detalles, y luego cómo usarlo para agregar nuevas capacidades a los objetos integrados.

## Object.prototype

Digamos que tenemos un objeto vacío y lo mostramos:

````js
let obj = {};
alert( obj ); // "[object Object]" ?
````

¿Dónde está el código que genera la cadena "[objetc Objetc]"? Ese es un método integrado toString, pero ¿dónde está? ¡El obj está vacío!

…Pero la notación corta obj = {} es la misma que obj = new Object(), donde Object es una función de constructor de objeto integrado, con su propio prototype que hace referencia a un objeto enorme con toString y otros métodos

Esto es lo que está pasando:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/img/image_01.png?raw=true)

Cuando se llama a new Object() (o se crea un objeto literal {...}), el [[Prototype]] se establece en Object.prototype de acuerdo con la regla que discutimos en el capitulo anterior:

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/img/image_02.png?raw=true)

Entonces, cuando se llama a obj.toString(), el método se toma de Object.prototype.

Lo podemos comprobar así:

````js
let obj = {};

alert(obj.__proto__ === Object.prototype); // true

alert(obj.toString === obj.__proto__.toString); //true
alert(obj.toString === Object.prototype.toString); //true
````

Tenga en cuenta que no hay más [[Prototype]] en la cadena sobre Object.prototype:

````js
alert(Object.prototype.__proto__); // null
````

## Otros prototipos integrados
Otros objetos integrados como Array, Date , Function y otros también mantienen métodos en prototipos.

Por ejemplo, cuando creamos una matriz [1, 2, 3], el constructor predeterminado new Array() se usa internamente. Entonces Array.prototype se convierte en su prototipo y proporciona sus métodos. Eso es muy eficiente en memoria.

Por especificación, todos los prototipos integrados tienen Object.prototype en la parte superior. Es por eso que algunos dicen “todo hereda de los objetos”.

Aquí está la imagen general de 3 objetos integrados (3 para que quepan):

![image_03](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/img/image_03.png?raw=true)

Verifiquemos los prototipos manualmente:

````js
let arr = [1, 2, 3];

// se hereda de Array.prototype?
alert( arr.__proto__ === Array.prototype ); // verdadero

// y despues desde Object.prototype?
alert( arr.__proto__.__proto__ === Object.prototype ); // verdadero

// Y null en la parte superior.
alert( arr.__proto__.__proto__.__proto__ ); // null
````

Algunos métodos en prototipos pueden superponerse; por ejemplo, Array.prototype tiene su propio toString que enumera elementos delimitados por comas:

````js
let arr = [1, 2, 3]
alert(arr); // 1,2,3 <-- el resultado de Array.prototype.toString
````

Como hemos visto antes, Object.prototype también tiene toString, pero Array.prototype está más cerca de la cadena, por lo que se utiliza la variante de array.

![image_04](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/img/image_04.png?raw=true)

Las herramientas en el navegador, como la consola de desarrollador de Chrome, también muestran herencia (es posible que deba utilizarse console.dir para los objetos integrados):

![image_05](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/native-prototypes/img/image_05.png?raw=true)


Otros objetos integrados también funcionan de la misma manera. Incluso las funciones: son objetos de un constructor Function integrado, y sus métodos (call/apply y otros) se toman de Function.prototype. Las funciones también tienen su propio toString.

````js
function f() {}

alert(f.__proto__ == Function.prototype); // verdadero
alert(f.__proto__.__proto__ == Object.prototype); // verdadero, hereda de objetos
````

## Primitivos
Lo más intrincado sucede con cadenas, números y booleanos.

Como recordamos, no son objetos. Pero si tratamos de acceder a sus propiedades, se crean los objetos contenedores temporales utilizando los constructores integrados String, Number y Boolean, estos proporcionan los métodos y luego desaparecen.

Estos objetos se crean de manera invisible para nosotros y la mayoría de los motores los optimizan, pero la especificación lo describe exactamente de esta manera. Los métodos de estos objetos también residen en prototipos, disponibles como String.prototype, Number.prototype y Boolean.prototype.

### ⚠️ Los valores null y undefined no tienen objetos contenedores
Los valores especiales null y undefined se distinguen. No tienen objetos contenedores, por lo que los métodos y propiedades no están disponibles para ellos. Y tampoco tienen los prototipos correspondientes.

## Cambiando prototipos nativos

Los prototipos nativos pueden ser modificados. Por ejemplo, si agregamos un método a String.prototype, estará disponible para todas las cadenas:

````js
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!
````

Durante el proceso de desarrollo, podemos tener ideas para nuevos métodos integrados que nos gustaría tener, y podemos sentir la tentación de agregarlos a los prototipos nativos. Pero eso es generalmente una mala idea.

### ⚠️ Importante:
Los prototipos son globales, por lo que es fácil generar un conflicto. Si dos bibliotecas agregan un método String.prototype.show, entonces una de ellas sobrescribirá el método de la otra.

Por lo tanto, en general, modificar un prototipo nativo se considera una mala idea.

**En la programación moderna, solo hay un caso en el que se aprueba la modificación de prototipos nativos: haciendo un polyfill.**

Cuando un método existe en la especificación de JavaScript, pero aún no está soportado por un motor de JavaScript en particular, podemos hacer “polyfill” (polirrelleno); esto es, crear un método sustituto.

Luego podemos implementarlo manualmente y completar el prototipo integrado con él.

Por ejemplo:

````js
if (!String.prototype.repeat) { // si no hay tal método
  // agregarlo al prototipo

  String.prototype.repeat = function(n) {
    // repite la cadena n veces

    // en realidad, el código debería ser un poco más complejo que eso
    // (el algoritmo completo está en la especificación)
    // pero incluso un polyfill (polirelleno) imperfecto a menudo se considera lo suficientemente bueno
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa
````

## Préstamo de prototipos
En el capítulo Decoradores y redirecciones, call/apply hablamos sobre el préstamo de método .

Es cuando tomamos un método de un objeto y lo copiamos en otro.

A menudo se toman prestados algunos métodos de prototipos nativos.

Por ejemplo, si estamos haciendo un objeto tipo array, es posible que queramos copiar algunos métodos de ‘Array’.

P. ej…

````js
let obj = {
  0: "Hola",
  1: "mundo!",
  length: 2,
};

obj.join = Array.prototype.join;

alert( obj.join(',') ); // Hola,mundo!
````

Funciona porque el algoritmo interno del método integrado join solo se preocupa por los índices correctos y la propiedad length. No comprueba si el objeto es realmente un arreglo. Muchos métodos integrados son así.

Otra posibilidad es heredar estableciendo obj.__proto__ en Array.prototype, de modo que todos los métodos Array estén disponibles automáticamente en obj.

Pero eso es imposible si obj ya hereda de otro objeto. Recuerde, solo podemos heredar de un objeto a la vez.

Los métodos de préstamo son flexibles, permiten mezclar funcionalidades de diferentes objetos si es necesario.

## Resumen

* Todos los objetos integrados siguen el mismo patrón:
  - Los métodos se almacenan en el prototipo (Array.prototype, Object.prototype, Date.prototype, etc.)
  - El objeto en sí solo almacena los datos (elementos de arreglo, propiedades de objeto, la fecha)
* Los primitivos también almacenan métodos en prototipos de objetos contenedores: Number.prototype, String.prototype y Boolean.prototype. Solo undefined y null no tienen objetos contenedores.
* Los prototipos integrados se pueden modificar o completar con nuevos métodos. Pero no se recomienda cambiarlos. El único caso permitido es probablemente cuando agregamos un nuevo estándar que aún no es soportado por el motor de JavaScript.

# ✅ Tareas

## Agregue el metodo f defer ms a las funciones

Agregue al prototipo de todas las funciones el método defer(ms), que ejecuta la función después de ms milisegundos.

Después de hacerlo, dicho código debería funcionar:

````js
function f() {
  alert("Hola!");
}

f.defer(1000); // muestra "Hola!" después de 1 segundo
````

[solución]()

## Agregue el decorado defer a las funciones

Agregue el método defer(ms) al prototipo de todas las funciones, que devuelve un contenedor, retrasando la llamada en ms milisegundos.

Aquí hay un ejemplo de cómo debería funcionar:

````js
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // muestra 3 después de 1 segundo
````

Tenga en cuenta que los argumentos deben pasarse a la función original.

[solución]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/readme.md)
