# 📖 Referencias de objetos y copia

Una de las diferencias fundamentales entre objetos y primitivos es que los objetos son almacenados y copiados “por referencia”, en cambio los primitivos: strings, number, boolean, etc.; son asignados y copiados “como un valor completo”.

Esto es fácil de entender si miramos un poco “bajo cubierta” de lo que pasa cuando copiamos por valor.

Empecemos por un primitivo como string.

Aquí ponemos una copia de `message` en `phrase`:

````js
let message = "Hello!";
let phrase = message;
````

Como resultado tenemos dos variables independientes, cada una almacenando la cadena "Hello!".

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/object-copy/img/image_01.png?raw=true)

Bastante obvio, ¿verdad?

Los objetos no son así.

**Una variable no almacena el objeto mismo sino su “dirección en memoria”, en otras palabras “una referencia” a él.**

Veamos un ejemplo de tal variable:

````js
let user = {
  name: "John"
};
````

Y así es como se almacena en la memoria:

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/object-copy/img/image_02.png?raw=true)

El objeto es almacenado en algún lugar de la memoria (a la derecha de la imagen), mientras que la variable `user` (a la izquierda) tiene una “referencia” a él.

Podemos pensar de una variable objeto, como `user`, como una hoja de papel con la dirección del objeto escrita en ella.

Cuando ejecutamos acciones con el objeto, por ejemplo tomar una propiedad user.name, el motor JavaScript busca aquella dirección y ejecuta la operación en el objeto mismo.

Ahora, por qué esto es importante.

**Cuando una variable de objeto es copiada, se copia solo la referencia. El objeto no es duplicado.**

Por ejemplo:

````js
let user = { name: "John" };

let admin = user; // copia la referencia
````

Ahora tenemos dos variables, cada una con una referencia al mismo objeto:

![image_03](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/object-copy/img/image_03.png?raw=true)

Como puedes ver, aún hay un objeto, ahora con dos variables haciendo referencia a él.

Podemos usar cualquiera de las variables para acceder al objeto y modificar su contenido:

````js
let user = { name: 'John' };

let admin = user;

admin.name = 'Pete'; // cambiado por la referencia "admin"

alert(user.name); // 'Pete', los cambios se ven desde la referencia "user"
````

Es como si tuviéramos un gabinete con dos llaves y usáramos una de ellas (admin) para acceder a él y hacer cambios. Si más tarde usamos la llave (user), estaríamos abriendo el mismo gabinete y accediendo al contenido cambiado.

## Comparación por referencia

Dos objetos son iguales solamente si ellos son el mismo objeto.

Por ejemplo, aquí `a` y `b` tienen referencias al mismo objeto, por lo tanto son iguales:

````js
let a = {};
let b = a; // copia la referencia

alert( a == b ); // true, verdadero. Ambas variables hacen referencia al mismo objeto
alert( a === b ); // true
````

Y aquí dos objetos independientes no son iguales, aunque se vean iguales (ambos están vacíos):

````js
let a = {};
let b = {}; // dos objetos independientes

alert( a == b ); // false
````

Para comparaciones como `obj1 > obj2`, o comparaciones contra un primitivo `obj == 5`, los objetos son convertidos a primitivos. Estudiaremos cómo funciona la conversión de objetos pronto, pero a decir verdad tales comparaciones ocurren raramente y suelen ser errores de código.

### ℹ️ Los objetos
Un efecto importante de almacenar objetos como referencias es que un objeto declarado como const puede ser modificado.

Por ejemplo:

````js
const user = {
  name: "John"
};

user.name = "Pete"; // (*)

alert(user.name); // Pete
````

Puede parecer que la línea (*) causaría un error, pero no lo hace. El valor de user es constante, este valor debe siempre hacer referencia al mismo objeto, pero las propiedades de dicho objeto pueden cambiar.

En otras palabras: const user da un error solamente si tratamos de establecer user=... como un todo.

Dicho esto, si realmente necesitamos hacer constantes las propiedades del objeto, también es posible, pero usando métodos totalmente diferentes. Los mencionaremos en el capítulo Indicadores y descriptores de propiedad.

## Clonación y mezcla, Object.assign

Entonces copiar una variable de objeto crea una referencia adicional al mismo objeto.

Pero ¿y si necesitamos duplicar un objeto?

Podemos crear un nuevo objeto y replicar la estructura del existente iterando a través de sus propiedades y copiándolas en el nivel primitivo.

Como esto:

````js
let user = {
  name: "John",
  age: 30
};

let clone = {}; // el nuevo objeto vacío

// copiemos todas las propiedades de user en él
for (let key in user) {
  clone[key] = user[key];
}

// ahora clone es un objeto totalmente independiente con el mismo contenido
clone.name = "Pete"; // cambiamos datos en él

alert( user.name ); // John aún está en el objeto original
````

También podemos usar el método Object.assign.

La sintaxis es:

````js
Object.assign(dest, ...sources)
````

* El primer argumento dest es el objeto destinatario.
* Los argumentos que siguen son una lista de objetos fuentes.

Esto copia las propiedades de todos los objetos fuentes dentro del destino dest y lo devuelve como resultado

Por ejemplo, tenemos el objeto user, agreguemos un par de permisos:

````js
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

// copia todas las propiedades desde permissions1 y permissions2 en user
Object.assign(user, permissions1, permissions2);

// ahora es user = { name: "John", canView: true, canEdit: true }
alert(user.name); // John
alert(user.canView); // true
alert(user.canEdit); // true
````

Si la propiedad por copiar ya existe, se sobrescribe:

````js
let user = { name: "John" };

Object.assign(user, { name: "Pete" });

alert(user.name); // ahora user = { name: "Pete" }
````

También podemos usar Object.assign para hacer una clonación simple:

````js
let user = {
  name: "John",
  age: 30
};

let clone = Object.assign({}, user);

alert(clone.name); // John
alert(clone.age); // 30
````

Aquí, copia todas las propiedades de user en un objeto vacío y lo devuelve.

También hay otras formas de clonar un objeto, por ejemplo usando la sintaxis spread clone = {...user}, cubierto más adelante en el tutorial.

## Clonación anidada

Hasta ahora supusimos que todas las propiedades de user eran primitivas. Pero las propiedades pueden ser referencias a otros objetos.

Como esto:

````js
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( user.sizes.height ); // 182
````

Ahora no es suficiente copiar clone.sizes = user.sizes, porque user.sizes es un objeto y será copiado por referencia. Entonces clone y user compartirán las mismas tallas (.sizes):

````js
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = Object.assign({}, user);

alert( user.sizes === clone.sizes ); // true, el mimo objeto

// user y clone comparten sizes
user.sizes.width = 60;       // cambia la propiedad en un lugar
alert(clone.sizes.width); // 60, obtiene el resultado desde el otro
````

Para corregir esto, debemos hacer que user y clone sean objetos completamente separados, debemos usar un bucle que examine cada valor de user[key] y, si es un objeto, que replique su estructura también. Esto es conocido como “clonación profunda” o “clonación estructurada”. Existe un método structuredClone que implementa tal clonación profunda.

## structuredClone

La llamada a `structuredClone(object)` clona el object con todas sus propiedadas anidadas.

Podemos usarlo en nuestro ejemplo:

````js
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = structuredClone(user);

alert( user.sizes === clone.sizes ); // false, objetos diferentes

// ahora user y clone están totalmente separados
user.sizes.width = 60;    // cambia una propiedad de un lugar
alert(clone.sizes.width); // 50, no están relacionados
````

El método `structuredClone` puede clonar la mayoría de los tipos de datos, como objetos, arrays, valores primitivos.

También soporta referencias circulares, cuando una propiedad de objeto referencia el objeto mismo (directamente o por una cadena de referencias).

Por ejemplo:

````js
let user = {};
// hagamos una referencia circular
// user.me referencia user a sí mismo
user.me = user;

let clone = structuredClone(user);
alert(clone.me === clone); // true
````

Como puedes ver, clone.me hace referencia a clone, no a user! Así que la referencia circular fue clonada correctamente también.

Pero hay casos en que structuredClone falla.

Por ejemplo, cuando un objeto tienen una propiedad “function”:

````js
// error
structuredClone({
  f: function() {}
});
````

Las propiedades de función no están soportadas.

Para manejar estos casos complejos podemos necesitar una combinación de métodos de clonación, escribir código personalizado o, para no reinventar la rueda, tomar una implementación existente, por ejemplo _.cloneDeep(obj) de la librería JavaScript lodash.

## Resumen

Los objetos son asignados y copiados por referencia. En otras palabras, una variable almacena no el valor del objeto sino una referencia (la dirección en la memoria) del valor. Entonces, copiar tal variable o pasarla como argumento de función copia la referencia, no el objeto.

Todas la operaciones a través de referencias copiadas (como agregar y borrar propiedades) son efectuadas en el mismo y único objeto .

Para hacer una “verdadera copia” (un clon), podemos usar Object.assign para la denominada “clonación superficial” (los objetos anidados son copiados por referencia), o la función de “clonación profunda” structuredClone o usar una implementación personalizada como **_.cloneDeep(obj)**.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
