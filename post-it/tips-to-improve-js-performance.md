# Tips para mejorar la performance de JS

# Introducción

Como desarrollador web, sabe que cada línea de código que escribe puede tener un impacto en el rendimiento de su aplicación. Y cuando se trata de JavaScript, una de las áreas más críticas en las que centrarse es la gestión de la memoria.

Piénselo, cada vez que un usuario interactúa con su sitio web, está creando nuevos objetos, variables y funciones. Y si no tiene cuidado, esos objetos pueden acumularse, obstruyendo la memoria del navegador y ralentizando toda la experiencia del usuario. Es como un embotellamiento en la autopista de la información: un cuello de botella frustrante que puede alejar a los usuarios.

Pero no tiene por qué ser así. Con el conocimiento y las técnicas adecuadas, puede tomar el control de su memoria JavaScript y asegurarse de que sus aplicaciones se ejecuten sin problemas y de manera eficiente. En este artículo, exploraremos los entresijos de la administración de memoria de JavaScript, incluidas las causas comunes de las fugas de memoria y las estrategias para evitarlas. Ya sea que sea un desarrollador js profesional o nuevo, se irá con una comprensión más profunda de cómo escribir código que sea simple, eficaz y rápido.

# Comprensión de la gestión de memoria de JavaScript

## ****Garbage collector****

El motor de **JavaScript** utiliza un g****arbage collector**** (recolector de basura) para liberar memoria que ya no está en uso. El trabajo del recolector de elementos no utilizados es identificar y eliminar los objetos que su aplicación ya no utiliza. Lo hace monitoreando constantemente los objetos y las variables en su código, y haciendo un seguimiento de cuáles todavía están siendo referenciados. Una vez que un objeto ya no se usa, el recolector de elementos no utilizados lo marca para su eliminación y libera la memoria que estaba usando.

El recolector de basura utiliza una técnica llamada **"marcar y barrer"** para administrar la memoria. Comienza marcando todos los objetos que aún están en uso, luego "barre" el montón y elimina los objetos que no están marcados. Este proceso se realiza periódicamente, y también cuando el montón se está quedando sin memoria, para garantizar que el uso de la memoria de la aplicación sea siempre lo más eficiente posible.

## ****Stack vs Heap****

Cuando se trata de memoria en JavaScript, hay dos jugadores principales: **stack** (la pila) y el **heap** (montón).

El **stack** (pila) se utiliza para almacenar datos que solo se necesitan durante la ejecución de una función. Es rápido y eficiente, pero también tiene una capacidad limitada. Cuando se llama a una función, el motor de JavaScript empuja las variables y los parámetros de la función al **stack** (pila), y cuando la función regresa, los vuelve a sacar. El **stack** (pila) se utiliza para un acceso rápido y una gestión rápida de la memoria.

Por otro lado, el **heap (**montón) se usa para almacenar datos que se necesitan durante toda la vida útil de la aplicación. Es un poco más lento y menos organizado que la pila, pero tiene una capacidad mucho mayor. El **heap** (montón) se utiliza para almacenar objetos, matrices y otras estructuras de datos complejas a las que se debe acceder varias veces.

# Causas comunes de fugas de memoria

Es muy consciente de que las fugas de memoria pueden ser un enemigo astuto que se cuela en su aplicación y causa problemas de rendimiento. Al comprender las causas comunes de las fugas de memoria, puede armarse con el conocimiento que necesita para vencerlas.

## Referencias circulares

Una de las causas más comunes de pérdidas de memoria son las referencias circulares. Estos ***ocurren cuando dos o más objetos se referencian entre sí***, creando un ciclo que el recolector de basura no puede romper. Esto puede hacer que los objetos se mantengan en la memoria mucho tiempo después de que ya no se necesiten. Aquí está el ejemplo:

```jsx
let object1 = {};
let object2 = {};

// create a circular reference between object1 and object2
object1.next = object2;
object2.prev = object1;

// do something with object1 and object2
// ...

// set object1 and object2 to null to break the circular reference
object1 = null;
object2 = null;
```

En este ejemplo, estamos creando dos objetos, `object1` y `object2`, y creando una referencia circular entre ellos al agregarles las propiedades `next` y `prev`. Luego establecemos `object1` y `object2` en nulo para romper la referencia circular, pero dado que el recolector de basura no puede romper la referencia circular, los objetos se mantendrán en la memoria mucho tiempo después de que ya no se necesiten, lo que provocará una pérdida de memoria.

Para evitar este tipo de fuga de memoria, podemos usar una técnica llamada "**administración manual de memoria**" usando la palabra clave `delete` de JavaScript para eliminar las propiedades que crean la referencia circular.

```jsx
delete object1.next;
delete object2.prev;
```

Otra forma de evitar este tipo de pérdida de memoria es usar `WeakMap` y `WeakSet`, que le permiten crear referencias débiles a objetos y variables.

## Event Listeners

Otra causa común de fugas de memoria son los **event listeners**. Cuando **adjunta** un **event listeners** a un elemento, crea una *referencia* a la función de lo *listeners* que puede evitar que el recolector de elementos no utilizados libere la memoria utilizada por el elemento. Esto puede provocar pérdidas de memoria si la función de escucha no se elimina cuando el elemento ya no es necesario. Ver el ejemplo:

```jsx
let button = document.getElementById("my-button");

// attach an event listener to the button
button.addEventListener("click", function() {
  console.log("Button was clicked!");
});

// do something with the button
// ...

// remove the button from the DOM
button.parentNode.removeChild(button);
```

En este ejemplo, adjuntamos un detector de eventos a un elemento de botón y luego eliminamos el botón del DOM. Aunque el elemento del botón ya no está en el documento, el detector de eventos todavía está adjunto, lo que crea una referencia a la función de detector que evita que el recolector de elementos no utilizados libere la memoria utilizada por el elemento. Esto puede provocar una fuga de memoria si la función de escucha no se elimina cuando el elemento ya no es necesario.

Para evitar este tipo de pérdida de memoria, es importante eliminar el detector de eventos cuando el elemento ya no sea necesario:

Otra forma es usar el método `EventTarget.removeAllListeners()` que elimina todos los detectores de eventos que se agregaron a un objetivo de evento específico.

```jsx
button.removeAllListeners();
```

## Global variables

Una tercera causa común de fugas de memoria son las variables globales. Cuando crea una **variable global**, se puede acceder a ella desde cualquier parte de su código, lo que puede dificultar determinar cuándo ya no es necesaria. Esto puede hacer que la variable se mantenga en la memoria mucho tiempo después de que ya no se necesite. Aquí hay un ejemplo:

```jsx
// create a global variable
let myData = {
  largeArray: new Array(1000000).fill("some data"),
  id: 1
};

// do something with myData
// ...

// set myData to null to break the reference
myData = null;
```

En este ejemplo, estamos creando una variable global `myData` y almacenando una gran variedad de datos en ella. Luego establecemos `myData` en `null` para romper la referencia, pero dado que la variable es global, todavía se puede acceder a ella desde cualquier parte de su código y es difícil determinar cuándo ya no es necesaria, esto puede hacer que la variable se mantenga en la memoria por mucho tiempo. después de que ya no es necesario, lo que provoca una pérdida de memoria.

Para evitar este tipo de pérdida de memoria, puede utilizar la técnica de `"function scoping"`. Implica crear una función y declarar variables dentro de esa función, de modo que solo sean accesibles dentro del alcance de la función. De esta manera, cuando ya no se necesita la función, las variables se recolectan automáticamente.

```jsx
function myFunction() {
  let myData = {
    largeArray: new Array(1000000).fill("some data"),
    id: 1
  };

  // do something with myData
  // ...
}
myFunction();
```

Otra forma es usar `let` y `const` de JavaScript en lugar de `var`, lo que le permite crear variables de ámbito de bloque. Las variables declaradas con `let` y `const` solo son accesibles dentro del bloque en el que están definidas y se recolectarán automáticamente como basura cuando salgan del alcance.

```jsx
{
  let myData = {
    largeArray: new Array(1000000).fill("some data"),
    id: 1
  };

  // do something with myData
  // ...
}
```

# Mejores prácticas para la gestión manual de la memoria

JavaScript proporciona herramientas y técnicas de administración de memoria que pueden ayudarlo a mantener bajo control el uso de memoria de su aplicación.

## Uso de referencias débiles (weak)

Una de las herramientas de administración de memoria más poderosas en JavaScript es `WeakMap` y `WeakSet`. Estas son estructuras de datos especiales que le *permiten crear referencias débiles a objetos y variables*. Las referencias débiles se diferencian de las referencias normales en que no impiden que el recolector de basura libere la memoria utilizada por los objetos. Esto los convierte en una gran herramienta para evitar pérdidas de memoria causadas por referencias circulares. Aquí hay un ejemplo:

```jsx
let object1 = {};
let object2 = {};

// create a WeakMap
let weakMap = new WeakMap();

// create a circular reference by adding object1 to the WeakMap
// and then adding the WeakMap to object1
weakMap.set(object1, "some data");
object1.weakMap = weakMap;

// create a WeakSet and add object2 to it
let weakSet = new WeakSet();
weakSet.add(object2);

// in this case, the garbage collector will be able to free up the memory
// used by object1 and object2, since the references to them are weak
```

En este ejemplo, estamos creando dos objetos, `object1` y `object2`, y creando referencias circulares entre ellos al agregarlos a `WeakMap` y `WeakSet` respectivamente. Debido a que las referencias a estos objetos son débiles, el recolector de elementos no utilizados podrá liberar la memoria utilizada por ellos, aunque todavía se haga referencia a ellos. Esto puede ayudar a evitar pérdidas de memoria causadas por referencias circulares.

## Usando Gabage Collector API

Otra técnica de administración de memoria es utilizar la API del recolector de basura, que le permite activar manualmente la recolección de basura y obtener información sobre el estado actual del montón. Esto puede ser útil para depurar pérdidas de memoria y problemas de rendimiento. Aquí hay un ejemplo:

```jsx
let object1 = {};
let object2 = {};

// create a circular reference between object1 and object2
object1.next = object2;
object2.prev = object1;

// manually trigger garbage collection
gc();
```

En este ejemplo, estamos creando dos objetos, `object1` y `object2`, y creando una referencia circular entre ellos al agregarles las propiedades next y prev. Luego usamos la función `gc()` para activar manualmente la recolección de elementos no utilizados, lo que liberará la memoria utilizada por los objetos, aunque todavía se les haga referencia.

Es importante tener en cuenta que la función `gc()` no es compatible con todos los motores de JavaScript y su comportamiento también puede variar según el motor. También es importante tener en cuenta que la activación manual de la recolección de basura puede tener un impacto en el rendimiento, por lo que se recomienda usarla con moderación y solo cuando sea necesario.

Además de la función `gc()`, JavaScript también proporciona la función `global.gc()` y `global.gc()` para algunos de los motores de JavaScript, y también `performance.gc()` para algunos motores de navegador, que se pueden usar para verificar el estado actual del montón y medir el rendimiento del proceso de recolección de elementos no utilizados.

## Usar instantáneas de heap y generadores de perfiles

JavaScript también proporciona **instantáneas de heap** y generadores de **perfiles**, que pueden ayudarlo a comprender cómo su aplicación usa la memoria. Las **instantáneas de heap** le permiten tomar una instantánea del estado actual del **heap** y analizarlo para ver qué objetos están utilizando la mayor cantidad de memoria.

Aquí hay un ejemplo de cómo puede usar las instantáneas del montón para identificar pérdidas de memoria en su aplicación:

```jsx
// Start a heap snapshot
let snapshot1 = performance.heapSnapshot();

// Do some actions that might cause memory leaks
for (let i = 0; i < 100000; i++) {
  myArray.push({
    largeData: new Array(1000000).fill("some data"), 
    id: i
  });
}

// Take another heap snapshot
let snapshot2 = performance.heapSnapshot();

// Compare the two snapshots to see which objects were created
let diff = snapshot2.compare(snapshot1);

// Analyze the diff to see which objects are using the most memory
diff.forEach(function(item) {
  if (item.size > 1000000) {
    console.log(item.name);
  }
});
```

En este ejemplo, estamos tomando dos instantáneas del montón antes y después de ejecutar un ciclo que inserta datos de gran tamaño en una matriz, luego comparamos las dos instantáneas para identificar los objetos que se crearon durante el ciclo. Luego podemos analizar la diferencia para ver qué objetos están usando la mayor cantidad de memoria, esto puede ayudarnos a identificar las fugas de memoria causadas por la gran cantidad de datos.

Los generadores de **perfiles** le permiten realizar un seguimiento del rendimiento de su aplicación e identificar áreas donde el uso de la memoria es alto:

```jsx
let profiler = new Profiler();

profiler.start();

// do some actions that might cause memory leaks
for (let i = 0; i < 100000; i++) {
  myArray.push({
    largeData: new Array(1000000).fill("some data"), 
    id: i
  });
}

profiler.stop();

let report = profiler.report();

// analyze the report to identify areas where memory usage is high
for (let func of report) {
  if (func.memory > 1000000) {
    console.log(func.name);
  }
}
```

En este ejemplo, estamos utilizando el generador de perfiles de JavaScript para iniciar y detener el seguimiento del rendimiento de nuestra aplicación. El informe mostrará información sobre las funciones que se llamaron y el uso de memoria para cada una.

Los **generadores de perfiles** y las **instantáneas del heap** no son compatibles con todos los motores y navegadores de JavaScript, por lo que es importante verificar la compatibilidad antes de usarlos en su aplicación.

# Conclusión

Hemos cubierto los conceptos básicos de la administración de memoria de JavaScript, incluido el proceso de recolección de basura, los diferentes tipos de memoria y las herramientas y técnicas de administración de memoria disponibles en JavaScript. También discutimos las causas comunes de las fugas de memoria y brindamos ejemplos de cómo evitarlas.

Al tomarse el tiempo para comprender e implementar estas mejores prácticas de administración de memoria, podrá crear aplicaciones que eliminen la posibilidad de fugas de memoria.
