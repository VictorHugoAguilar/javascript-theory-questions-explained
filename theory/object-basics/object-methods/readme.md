#  📖 Métodos del objeto, "this"

Los objetos son creados usualmente para representar entidades del mundo real, como usuarios, órdenes, etc.:

````js
let user = {
  name: "John",
  age: 30
};
````

Y en el mundo real un usuario puede actuar: seleccionar algo del carrito de compras, hacer login, logout, etc.

Las acciones son representadas en JavaScript por funciones en las propiedades.

## Ejemplos de métodos

Para empezar, enseñemos al usuario user a decir hola:

````js
let user = {
  name: "John",
  age: 30
};

user.sayHi = function() {
  alert("¡Hola!");
};

user.sayHi(); // ¡Hola!
````

Aquí simplemente usamos una expresión de función para crear la función y asignarla a la propiedad user.sayHi del objeto.

Entonces la llamamos con user.sayHi(). ¡El usuario ahora puede hablar!

Una función que es la propiedad de un objeto es denominada su método.

Así, aquí tenemos un método sayHi del objeto user.

Por supuesto, podríamos usar una función pre-declarada como un método, parecido a esto:

````js
let user = {
  // ...
};

// primero, declara
function sayHi() {
  alert("¡Hola!");
};

// entonces la agrega como un método
user.sayHi = sayHi;

user.sayHi(); // ¡Hola!
````

### ℹ️ Programación orientada a objetos

Cuando escribimos nuestro código usando objetos que representan entidades, eso es llamado Programación Orientada a Objetos, abreviado: “POO”.

POO (OOP sus siglas en inglés) es una cosa grande, un ciencia interesante en sí misma. ¿Cómo elegir las entidades correctas? ¿Cómo organizar la interacción entre ellas? Eso es arquitectura, y hay muy buenos libros del tópico como “Patrones de diseño: Elementos de software orientado a objetos reutilizable” de E. Gamma, R. Helm, R. Johnson, J. Vissides o “Análisis y Diseño Orientado a Objetos” de G. Booch, y otros.

## Formas abreviadas para los métodos

Existe una sintaxis más corta para los métodos en objetos literales:

````js
// estos objetos hacen lo mismo

user = {
  sayHi: function() {
    alert("Hello");
  }
};

// la forma abreviada se ve mejor, ¿verdad?
user = {
  sayHi() {   // igual que "sayHi: function(){...}"
    alert("Hello");
  }
};
````

Como se demostró, podemos omitir "function" y simplemente escribir sayHi().

A decir verdad, las notaciones no son completamente idénticas. Hay diferencias sutiles relacionadas a la herencia de objetos (por cubrir más adelante) que por ahora no son relevantes. En casi todos los casos la sintaxis abreviada es la preferida.

## “this” en métodos

Es común que un método de objeto necesite acceder a la información almacenada en el objeto para cumplir su tarea.

Por ejemplo, el código dentro de user.sayHi() puede necesitar el nombre del usuario user.

**Para acceder al objeto, un método puede usar la palabra clave this.**

El valor de this es el objeto “antes del punto”, el usado para llamar al método.

Por ejemplo:

````js
let user = {
  name: "John",
  age: 30,

  sayHi() {
    // "this" es el "objeto actual"
    alert(this.name);
  }

};

user.sayHi(); // John
````

Aquí durante la ejecución de user.sayHi(), el valor de this será user.

Técnicamente, también es posible acceder al objeto sin this, haciendo referencia a él por medio de la variable externa:

````js
let user = {
  name: "John",
  age: 30,

  sayHi() {
    alert(user.name); // "user" en vez de "this"
  }

};
````

…Pero tal código no es confiable. Si decidimos copiar user a otra variable, por ejemplo admin = user y sobrescribir user con otra cosa, entonces accederá al objeto incorrecto.

Eso queda demostrado en las siguientes lineas:

````js
let user = {
  name: "John",
  age: 30,

  sayHi() {
    alert( user.name ); // lleva a un error
  }

};


let admin = user;
user = null; // sobrescribimos para hacer las cosas evidentes

admin.sayHi(); // TypeError: No se puede leer la propiedad 'name' de null
````

Si usamos this.name en vez de user.name dentro de alert, entonces el código funciona.

## “this” no es vinculado

En JavaScript, la palabra clave this se comporta de manera distinta a la mayoría de otros lenguajes de programación. Puede ser usado en cualquier función, incluso si no es el método de un objeto.

No hay error de sintaxis en el siguiente ejemplo:

````js
function sayHi() {
  alert( this.name );
}
````

El valor de this es evaluado durante el tiempo de ejecución, dependiendo del contexto.

Por ejemplo, aquí la función es asignada a dos objetos diferentes y tiene diferentes “this” en sus llamados:

````js
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

// usa la misma función en dos objetos
user.f = sayHi;
admin.f = sayHi;

// estos llamados tienen diferente "this"
// "this" dentro de la función es el objeto "antes del punto"
user.f(); // John  (this == user)
admin.f(); // Admin  (this == admin)

admin['f'](); // Admin (punto o corchetes para acceder al método, no importa)
````

La regla es simple: si obj.f() es llamado, entonces this es obj durante el llamado de f. Entonces es tanto user o admin en el ejemplo anterior.

### ℹ️ Llamado sin un objeto: this == undefined
Podemos incluso llamar la función sin un objeto en absoluto:

````js
function sayHi() {
  alert(this);
}

sayHi(); // undefined
````

En este caso this es undefined en el modo estricto. Si tratamos de acceder a this.name, habrá un error.

En modo no estricto el valor de this en tal caso será el objeto global (window en un navegador, llegaremos a ello en el capítulo Objeto Global). Este es un comportamiento histórico que "use strict" corrige.

Usualmente tal llamado es un error de programa. Si hay this dentro de una función, se espera que sea llamada en un contexto de objeto.

### ℹ️ Las consecuencias de un this desvinculado
Si vienes de otro lenguaje de programación, probablemente estés habituado a la idea de un "this vinculado", donde los método definidos en un objeto siempre tienen this referenciando ese objeto.

En JavaScript this es “libre”, su valor es evaluado al momento de su llamado y no depende de dónde fue declarado el método sino de cuál es el objeto “delante del punto”.

El concepto de this evaluado en tiempo de ejecución tiene sus pros y sus contras. Por un lado, una función puede ser reusada por diferentes objetos. Por otro, la mayor flexibilidad crea más posibilidades para equivocaciones.

Nuestra posición no es juzgar si la decisión del diseño de lenguaje es buena o mala. Vamos a entender cómo trabajar con ello, obtener beneficios y evitar problemas.

## Las funciones de flecha no tienen “this”

Las funciones de flecha son especiales: ellas no tienen su “propio” this. Si nosotros hacemos referencia a this desde tales funciones, esta será tomada desde afuera de la función “normal”.

Por ejemplo, aquí arrow() usa this desde fuera del método user.sayHi():

````js
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
````

Esto es una característica especial de las funciones de flecha, útil cuando no queremos realmente un this separado sino tomarlo de un contexto externo. Más adelante en el capítulo Funciones de flecha revisadas las trataremos en profundidad.

## Resumen

* Las funciones que son almacenadas en propiedades de objeto son llamadas “métodos”.
* Los método permiten a los objetos “actuar”, como object.doSomething().
* Los métodos pueden hacer referencia al objeto con this.

El valor de this es definido en tiempo de ejecución.

* Cuando una función es declarada, puede usar this, pero ese this no tiene valor hasta que la función es llamada.
* Una función puede ser copiada entre objetos.
* Cuando una función es llamada en la sintaxis de método: object.method(), el valor de this durante el llamado es object.

Ten en cuenta que las funciones de flecha son especiales: ellas no tienen this. Cuando this es accedido dentro de una función de flecha, su valor es tomado desde el exterior.

# ✅ Tareas

## Usando el this en un objeto literal

Aquí la función makeUser devuelve un objeto.

¿Cuál es el resultado de acceder a su ref? ¿Por qué?

````js
function makeUser() {
  return {
    name: "John",
    ref: this
  };
}

let user = makeUser();

alert( user.ref.name ); // ¿Cuál es el resultado?
````

[solución]()

## Crea una calculadora

Crea un objeto calculator con tres métodos:

* read() pide dos valores y los almacena como propiedades de objeto con nombres a y b.
* sum() devuelve la suma de los valores almacenados.
* mul() multiplica los valores almacenados y devuelve el resultado.

````js
let calculator = {
  // ... tu código ...
};

calculator.read();
alert( calculator.sum() );
alert( calculator.mul() );
````

[solución]()

## Encadenamiento

Hay un objeto ladder que permite subir y bajar:

````js
let ladder = {
  step: 0,
  up() {
    this.step++;
  },
  down() {
    this.step--;
  },
  showStep: function() { // muestra el peldaño actual
    alert( this.step );
  }
};
````

Ahora, si necesitamos hacer varios llamados en secuencia podemos hacer algo como esto:

````js
ladder.up();
ladder.up();
ladder.down();
ladder.showStep(); // 1
ladder.down();
ladder.showStep(); // 0
````

Modifica el código de “arriba” up, “abajo” down y “mostrar peldaño” showStep para hacer los llamados encadenables como esto:

````js
ladder.up().up().down().showStep().down().showStep(); // shows 1 then 0
````

Tal enfoque es ampliamente usado entre las librerías JavaScript.


[solución]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
