# Javascript Interview Question Explained

## A. Boolean, ¿cuál es el resultado del código?

```jsx
console.log(2 + true)
```

- null
- 0
- 2
- **3**

### Respuesta

> En Js el valor `boolean` es implícitamente cambiado a un número, `true` equivale a `1`, `false` a `0`, por lo tanto 2 + true = 3
> 

## B. Bucles, ¿Qué diferencia hay entre foreach() y map()?

```jsx
const array = [1, 2, 3];

array.forEach(element => {
  console.log(element);
});

// Output:
// 1, 2, 3

const squaredArray = array.map(element => {
  return element * element;
});

console.log(squaredArray);

// Output:
// [1, 4, 9]
```

### Respuesta

> Ambos métodos recorren un Array y ejecutan una función por cada elemento, la diferencia es que map() crea un Array nuevo, y el foreach() no devuelve un array nuevo.
> [Explicación extendida](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/post-it/differences-between-foreach-and-map.md)
> 

## C. Equals object, ¿Cuál es el resultado?

```jsx
var a = {};
var b = {};
console.log(a === b)
```

- true
- **false**
- null
- undefined

### Respuesta

> Aunque los dos aparentemente son iguales, apuntan a referencias diferentes, por lo cual los considera diferentes.
> 
> **NOTA:** Cuando compara dos objetos con `===`, verifica si se refieren al mismo objeto en la memoria, no si tienen las mismas propiedades o valores.
> 

## D. Sumas y restas, ¿Cuál es el valor que devuelve?

```jsx
console.log(2 + '2');
console.log(2 - '2');
```

- 22
- 0

### Respuesta

> El operador `+` es para números y concatenación de strings, por lo que simplemente lo junta.
> 
> El operador `–` es solmanete para los números, por lo que ambos argumentos se convierten a numéricos y hace la resta directamente.
> 

## E. Funciones ¿Qué resultado da?

```jsx
let x = function() {
    return
    {
        message: 'hola'
    }
}

console.log(x());
```

- null
- **undefined**
- “hola”
- {message: “hola”}

### Respuesta

> La función x devuelve `undefined` debido al salto de línea después de la declaración de devolución. La declaración de retorno hace que la función salga y devuelva el valor que le sigue. 
> En este caso, el salto de línea separa la declaración de retorno de su valor de retorno, por lo que devuelve `undefined`. 
> 
> Si desea devolver el objeto {mensaje: 'hola'}, deberá eliminar el salto de línea.
> 

## F.  Bucles for y setTimeout, ¿Qué resultado devuelve el siguiente código?

```jsx
for (var i = 0; i<4; i++){ 
	setTimeout(function(){console.log(i), 0)};
}
```

- 1,2,3,4
- **4,4,4,4**
- null null null null
- 0, 0, 0, 0

### Respuesta

> El código anterior crea un bucle que se ejecuta 4 veces y programa una función `setTimeout` para que se ejecute después de 0 milisegundos. La función `setTimeout` registra el valor de la variable `i` en la consola.
> 
> Sin embargo, debido a que `setTimeout` es una `función asíncrona`, no se ejecuta inmediatamente. En cambio, se agrega a la cola de eventos y solo se ejecutará una vez que la **pila** de llamadas esté vacía. Esto significa que las 4 funciones `setTimeout` se agregarán a la cola de eventos y se ejecutarán después de que se complete el bucle.
> Cuando las funciones `setTimeout` se ejecutan, todas registrarán el mismo valor de i, que será el valor final de i después de que se complete el bucle. Esto se debe a que JavaScript usa el alcance de la función, no el alcance del bloque, por lo que la variable i es compartida por las 4 funciones setTimeout.
> 
> Por lo tanto, la salida de este código será: 
> 
> ````javascript
4 
4 
4 
4
````

Dos posibles soluciones son declarar la variable del for con el scope de la función es decir un `let`

````javascript
for (let i = 0; i<4; i++){ 
	setTimeout(function(){console.log(i), 0)};
}
````

El resultado sería

````javascript
0
1
2
3
````

O bien otra solución es declarla una funcion IIFE (Expresión de función invocada inmediatamente) para crear un nuevo alcance para cada iteración del bucle:

````javascript
for (var i = 0; i < 4; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, 0);
  })(i);
}
````

En este código, pasamos el valor actual de i como argumento a un IIFE, que crea un nuevo alcance y captura ese valor en una nueva variable j. La función setTimeout ahora usa j en lugar de i, lo que significa que cada función setTimeout registra un valor diferente. La salida de este código será:

````javascript
0
1
2
3
````

## G. Bucles for y setTimeout, ¿Qué resultado da el siguiente código?

```jsx
for (var i = 0; i < 4; i++) {
  var button = document.createElement("button");
  button.innerText = `button ${i}`;
  button.addEventListener("click", () => console.log(`button ${i}`));
  document.body.appendChild(button);
}
```

### Respuesta

Respuesta en el console.log(4) pero los botones sí que se pintan correctamente. [button 0] [button 1] [button 2] [button 3], esto es por un Modificando var por let => el click se convierte en 0,1,2,3.

Es decir que cuando ejecute este código y haga clic en cada botón, notará que todos los botones registran el mismo mensaje, "botón 4", en la consola. Esto se debe a que la palabra clave var tiene un ámbito de función en JavaScript, por lo que todas las instancias del cierre creado por el detector de eventos comparten la misma variable i, y su valor se actualiza a 4 cuando se invoca el detector de eventos.

## H. Funciones de cierre, clousers, ¿Qué resultado da el siguiente código?

```jsx
var passed = 3;

var addTo = function (passed) {
    var add = function(inner) {
        return passed + inner;
    }
    return add;
}

var addTwo = new addTo(2);

console.log(addTwo(1));
```

- null
- undefined
- **3**
- 4

### Respuesta

>
>La función `addTo` toma un parámetro ***passed***, que es igual a 2 cuando se crea la instancia de `addTwo`. Dentro de la función `addTo`, se define una función interna llamada `add` que toma un parámetro ***inner***. La función `add` simplemente retorna la **suma** de ***passed*** y ***inner***.
>
>Luego, se crea una nueva instancia de la función `addTo` con el argumento 2 y se asigna a la variable `addTwo`. Esto significa que `addTwo` ahora hace referencia a la función interna `add` que tiene una referencia a ***passed*** con un valor de 2.
>
>Finalmente, se llama a `addTwo(1)`, lo que significa que se llama a la función interna `add` con el argumento 1. La función `add` suma ***passed*** (que es 2, ya que se pasó como argumento al crear la instancia de `addTo`) y ***inner*** (que es 1, ya que se pasó como argumento a `addTwo`). La suma de 2 y 1 es 3, por lo que `addTwo(1)` devuelve 3.
>
>Por lo tanto, el resultado final que se imprimirá en la consola será **3**.
>
> **NOTA**: en caso de no pasar alguno de los dos parámetros el resultado podría ser NaN o undefined pediendo del parámetro pasado.
> 

## I. Asignaciones, ¿Qué resultado da el siguiente código?

```jsx
var a = b = 3;
```

- a = undefined, b = 3;
- **a = 3, b = 3;**
- a = null, b = 3;
- a = 3, b = undefined;

### Respuesta

El código **var** a = b = 3 declara dos variables b y a, y les asigna el valor 3 a ambas.

Sin embargo, la diferencia entre los dos es que b se declara sin la palabra clave var y, por lo tanto, es una variable global a la que se puede acceder desde cualquier parte de su código, mientras que a se declara con la palabra clave var y, por lo tanto, es una variable local a la que solo se puede acceder dentro del ámbito donde fue declarada.

En este código, la palabra clave var se usa solo para la declaración de a, y la asignación b = 3 se trata como una declaración independiente que declara una variable global b si aún no existe, y le asigna el valor 3. Luego, var a = b = 3 declara una variable local a y le asigna el valor de la variable global b (a la que se le acaba de asignar el valor 3).

Así es como se vería el código si declara explícitamente b como una variable global:

```jsx
var b = 3;
var a = b;
```

En este caso, tanto b como a serían declarados y se les asignaría el valor 3, pero b sería una variable global y a sería una variable local.

## J. Styles, ¿Cuál es el color de la palabra texto?

```html
<style>
    h1 span {
      color: red;
    }
    span {
      color: blue;
    }
    .text span {
      color: yellow;
    }
    span .text {
      color: green;
    }
</style>
<body>
	<h1>
		<span>
	    <p>
	      <span class="text">
	        <span>Texto</span>
        </span>
			</p>
		</span>
	</h1>
</body>
```

- verde
- rojo
- **amarillo**
- azul

### Respuesta

Los estilos CSS se aplican a los elementos HTML en función de la especificidad de los selectores. El selector .text span tiene una especificidad mayor que el selector span, por lo que tendrá prioridad y hará que el texto se muestre en amarillo.
El selector span .text no coincide con ningún elemento en el HTML, ya que está buscando una clase .text que sea un hijo directo de un elemento span, pero en este caso, la clase .text es un hermano del elemento span.

## K. ¿Qué diferencias hay entre apply(), call(), bind()?

### Respuesta

Con estos 3 métodos varios objetos pueden compartir un mismo método.
Los tres parecen hacer lo mismo pero hay diferencias, call() y apply() enlazan el método al objeto de forma temporal, lo ejecutan y nos devuelven el resultado, la diferencia es que call() espera valores como argumentos, mientras apply() espera un array de valores.
Por su lado bind() también enlaza el método al objeto, lo ejecuta pero en vez de devolvernos el resultado nos devuelve una función que si la ejecutamos obtenemos el resultado.

En JavaScript, **apply(), call() y bind()** son métodos que le permiten establecer el valor **this** y llamar a una función con un valor y argumentos especificados. Sin embargo, difieren en cómo pasan los argumentos a la función.

Estas son las diferencias entre los tres métodos:

- **apply()**: El método apply() toma dos argumentos: el valor this y una matriz de argumentos para pasar a la función. Le permite llamar a una función y establecer el valor **this**, y pasar los argumentos a la función como una matriz.

```jsx
function add(a, b) {
  return a + b;
}

var object = {};
console.log(add.apply(object, [1, 2])); // outputs 3
```

- **call()**: El método call() es similar a apply(), pero en lugar de tomar una matriz de argumentos, toma los argumentos como valores separados.

```jsx
function add(a, b) {
  return a + b;
}

var object = {};
console.log(add.call(object, 1, 2)); // outputs 3
```

- **bind():** El método bind() crea una nueva función con el valor y los argumentos especificados, y devuelve la nueva función. Luego puede llamar a la nueva función más tarde, y siempre tendrá el valor y los argumentos especificados.

```jsx
function add(a, b) {
  return a + b;
}

var object = {};
var boundAdd = add.bind(object, 1, 2);
console.log(boundAdd()); // outputs 3
```

**En resumen,** apply() y call() le permiten llamar inmediatamente a una función con un valor y argumentos especificados, mientras que bind() crea una nueva función con un valor y argumentos especificados que puede llamar más tarde.

## L. This, ¿Qué es en javascript?

### Respuesta

En javascript this hace referencia al contexto en el cual se esté ejecutando el código actual. 

## M. ¿Qué es el hosting?

### Respuesta

El concepto de *hoisting*  de JavaScript determina que el valor de una variable declarada con *var* **puede subir al principio del *scope* de la función dentro de la que está declarada.** Pueden izarse las funciones declaradas o las variables var pero como undefined.

```jsx
// EN FUNCIONES
console.log(l()); // Hola John!
// SE LLAMA ANTES DE LA DECLARACIÓN DE LA MISMA
function l(){
	console.log('Hola John!');
}

// EN VARIABLES VAR
console.log(nombre); // undefined
var nombre = 'Victor';

// EN VARIABLES LET O CONST
console.log(nombre); // ReferenceError: nombre is not defined
let nombre = 'Victor';
```

## N. ¿Qué resultado da en cada caso?

```jsx
var x='global value';

function foo() {
    console.log(x); //undefined
    var x='local value';
    console.log(x); //local value
}
foo();
console.log(x); //global value

// ---------------
greet(‘Juan’);

const greet = function (nombre){
    console.log(`Hola ${nombre}`);
};

// ----------------------

greet(‘Juan’);

function greet(nombre){
    console.log(`Hola ${nombre}`);
};
```

### Respuesta

- 1º Caso:
    
    Cuando se llama a la función foo(), a pesar que la variable x esta inicializa y asignada, el scope de la función no esta, lo que en el primer caso es **undefined**, luego se asigna el valor de x, y el segundo caso es **local value**, una vez que sale de la función el valor que devuelve es **global value.**
    
- 2º Caso:
    
    El valor es **undefined,** ya que no se iza la función al estar en el ámbito de la variable const. 
    
- 3º Caso:
    
    El valor es **********************Hola Juan,********************** ya que se iza la función.
    

## Ñ. Dado el array siguiente, ¿cómo harías para eliminar los últimos 3 elementos?

```jsx
var nums = [1, 2, 3, 4, 5, 6, 7, 8];
```

### Respuesta

```jsx
var resultado = nums.splice(5, 3);
```

`El método slice()` devuelve una copia de una parte del array dentro de un nuevo array empezando por *inicio* hasta *fin* (*fin* no incluido). El array original no se modificará.

- **Sintaxis**

`arr.slice([inicio [, fin]])`

- **Parámetros**

`inicio`

Índice donde empieza la extracción. El primer elemento corresponde con el índice 0.
Si el índice especificado es negativo, indica un desplazamiento desde el final del array.`slice(-2)` extrae los dos últimos elementos del array
Si `inicio` es omitido el valor por defecto es `0`.
Si `inicio` es mayor a la longitud del array, se devuelve un array vacío.

`fin`

Índice que marca el final de la extracción. `slice` extrae hasta, pero sin incluir el final.
`slice(1,4)` extrae desde el segundo elemento hasta el cuarto (los elementos con índices 1, 2, y 3).
Con un índice negativo, `fin` indica un desplazamiento desde el final de la secuencia. `slice(2,-1)` extrae desde el tercer hasta el penúltimo elemento en la secuencia.
Si `fin` es omitido, slice extrae hasta el final de la secuencia (`arr.length`)`.`
Si `fin` es mayor a la longitud del array, `slice` extrae hasta el final de la secuencia (`arr.length`)`.`

- Retorno

Un nuevo array con los valores extraídos.

## O.  Explica que hace shift()

El método **`shift()`** elimina el **primer** elemento del array y lo retorna. Este método modifica la longitud del array.

### Respuesta

El método `shift` elimina el elemento en el índice cero y desplaza los valores consecutivos hacia abajo, devolviendo el valor eliminado. Si la propiedad `[length](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/length)` es 0, devuelve `[undefined](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/undefined)`.

`shift` es genérico; este método puede utilizarse con [call](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/call) o [apply](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) a objetos simliares a arrays. Los objetos que no tengan una propiedad `length` que refleje el último elemento de una serie consecutiva de propiedades numéricas con índice base cero pueden no comportarse de manera significativa.

## P.  ¿Cómo clonarias un objeto?

```jsx
const fuente = {a: 1, b: 2, c: 3};
```

### Respuesta

```jsx
const copia = Object.assign({}, fuente);
```

## Q. ¿Cómo añadir un elemento a un array sin utilizar push?

```jsx
var a = ['a','b','c','d'];

a[a.length] = 'e';

console.log(a); // ['a','b','c','d', 'e'];
```

## R. Suma string ¿cuál es el valor?

```jsx
console.log(2 + 3 + '7');
```

- **57**
- undefined
- ErrorSyntaxis
- 237

### Respuesta

El operario “+” sirve para números y concatenación de strings, por lo que 2+3 = 5. 5 + ‘7’ = 57.

## S.  ¿Qué resultado da el siguiente código?

```jsx
var a = 3;

(function () {
  console.log(3 * a);
})();

var a = 3;

(function () {
  console.log(3 * a);
})(a);
```

- undefined, 9
- **9, 9**
- ErrorReference
- ErrorSintaxis

### Respuesta

En el primer caso da 9:

```jsx
var a = 3;

(function () {
  console.log(3 * a);
})();
```

Este código declara una variable global a con el valor 3, luego crea una función autoinvocada anónima que multiplica 3 por a y registra el resultado en la consola. La función se invoca inmediatamente, por lo que registra 9 en la consola.

La segunda parte del código también genera 9:

```jsx
var a = 3;

(function () {
  console.log(3 * a);
})(a);
```

Este código es esencialmente el mismo que el de la primera parte, pero la función de autoinvocación anónima se invoca con un argumento. Como la función no usa el argumento, el resultado es el mismo que en el primer ejemplo.

## T. ¿Cómo borramos una propiedad de un objeto?

El operador delete de JavaScript remueve una propiedad de un objeto; si no se mantienen más referencias a la misma propiedad, eventualmente se libera automáticamente.

```jsx
const Employee = {
  firstname: 'John',
  lastname: 'Doe'
};
console.log(Employee.firstname); // Expected output: "John"
delete Employee.firstname;
console.log(Employee.firstname); // Expected output: undefined
```

## U.  ¿Cómo hacer un merge de dos objetos?

```jsx
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);

console.log(returnedTarget); // { a: 1, b: 4, c: 5 }
```

## V. **¿Qué método podemos utilizar para una copia profunda de Objetos?**

```jsx
JSON.parse(JSON.stringify(obj))
```

### Respuesta

Stringify convierte un objeto en JSON string. Parse parsea el string y devuelve un objecto. No copia funciones.

## W. Funciones de los arrays

**push()**: añade un item al final del arrays, **modifica** el array original, devuelve nuevo tamaño del array

```jsx
const animals = ['pigs', 'goats', 'sheep'];

const count = animals.push('cows');
console.log(count);
// Expected output: 4
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows"]

animals.push('chickens', 'cats', 'dogs');
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

**pop():** elimina un item al final del  array, **modifica** el array original

```jsx
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop());
// Expected output: "tomato"

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]

plants.pop();

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage"]
```

**unshift():** añade un item al comienzo del array, **modifica** el array original, devuelve nuevo tamaño

```jsx
const array1 = [1, 2, 3];

console.log(array1.unshift(4, 5));
// Expected output: 5

console.log(array1);
// Expected output: Array [4, 5, 1, 2, 3]
```

**shift():** elimina un item al comienzo del array, **modifica** el array original

```jsx
var miPescado = ['ángel', 'payaso', 'mandarín', 'cirujano'];

console.log('miPescado antes: ' + miPescado);
// "miPescado antes: ángel,payaso,mandarín,cirujano"

var eliminado = miPescado.shift();

console.log('miPescado después: ' + miPescado);
// "miPescado after: payaso,mandarín,cirujano"

console.log('Elemento eliminado: ' + eliminado);
// "Elemento eliminado: ángel"
```

# Preguntas

---

## 1. Clases Js, hosting que resultado da

```tsx
var car = new Vehicle("Honda", "white", "2010", "UK");
console.log(car);

function Vehicle(model, color, year, country) {
  this.model = model;
  this.color = color;
  this.year = year;
  this.country = country;
}
```

- 1: Undefined
- 2: ReferenceError
- 3: null
- **4: {model: "Honda", color: "white", year: "2010", country: "UK"}**

### Respuesta

Las declaraciones de función se izan de forma similar a cualquier variable. Entonces, la ubicación de la declaración de la función Vehicle no hace ninguna diferencia. 

## 2. Funciones, que resultado da

```tsx
function foo() {
  let x = (y = 0);
  x++;
  y++;
  return x;
}
console.log(foo(), typeof x, typeof y);
```

- 1: 1, undefined and undefined
- 2: ReferenceError: X is not defined
- **3: 1, undefined and number**
- 4: 1, number and number

### Respuesta

Por supuesto, el valor de retorno de foo() es 1 debido al operador de incremento. Pero la sentencia let x = y = 0 declara una variable local x. Mientras que y se declaró accidentalmente como una variable global. Esta afirmación es equivalente a,

```jsx
let x;
window.y = 0;
x = window.y;
```

Dado que la variable de ámbito de bloque x no está definida fuera de la función, el tipo tampoco estará definido. Mientras que la variable global y está disponible fuera de la función, el valor es 0 y el tipo es número.

## 3. Funciones, sync, que resultado da

```jsx
function main() {
  console.log("A");
  setTimeout(function print() {
    console.log("B");
  }, 0);
  console.log("C");
}
main();
```

- 1: A, B and C
- 2: B, A and C
- 3: A and C
- **4: A, C and B**

### Respuesta

El orden de las declaraciones se basa en el mecanismo de bucle de eventos. El orden de las declaraciones sigue el siguiente orden,

1. Al principio, la función principal se empuja a la pila.
2. Luego, el navegador empuja la primera declaración de la función principal (es decir, A's console.log) a la pila, ejecutándose y saliendo inmediatamente.
3. Pero la declaración setTimeout se movió a la API del navegador para aplicar el retraso para la devolución de llamada.
4. Mientras tanto, el archivo console.log de C se agregó a la pila, se ejecutó y apareció.
5. La devolución de llamada de setTimeout se movió de la API del navegador a la cola de mensajes.
6. La función principal salió de la pila porque no hay declaraciones para ejecutar
7. La devolución de llamada se movió de la cola de mensajes a la pila ya que la pila está vacía.
8. El archivo console.log para B se agrega a la pila y se muestra en la consola.

## 4. ¿Cuál es el resultado de la verificación de igualdad a continuación?

```jsx
console.log(0.1 + 0.2 === 0.3);
```

- **1: false**
- 2: true

### Respuesta

Esto se debe al problema matemático del punto flotante. Dado que los números de coma flotante están codificados en formato binario, las operaciones de suma sobre ellos conducen a errores de redondeo. Por lo tanto, la comparación de puntos flotantes no da los resultados esperados. Puede encontrar más detalles sobre la explicación aquí [0.30000000000000004.com](http://0.30000000000000004.com/)/

## 5. Funciones, cual es el resultado del siguiente código con condicional sobre una función

```jsx
var y = 1;
if (function f() {}) {
  y += typeof f;
}
console.log(y);
```

- 1: 1function
- 2: 1object
- 3: ReferenceError
- **4: 1undefined**

### Respuesta

Los puntos principales en los fragmentos de código anteriores son,

1. Puede ver la expresión de la función en lugar de la declaración de la función dentro de la declaración if. Así que siempre devuelve verdadero.
2. Dado que no está declarado (o asignado) en ninguna parte, f no está definido y typeof f tampoco está definido.

En otras palabras, es lo mismo que

```jsx
var y = 1;
if ("foo") {
  y += typeof f;
}
console.log(y);
```

> **Note:** En MS Edge browser retorna 1object
> 

## 6. Funciones, retorno de valores que resultado da el siguiente código

```jsx
function foo() {
  return;
  {
    message: "Hello World";
  }
}
console.log(foo());
```

- 1: Hello World
- 2: Object {message: "Hello World"}
- **3: Undefined**
- 4: SyntaxError

### Respuesta

Este es un problema de punto y coma. Normalmente, los puntos y comas son opcionales en JavaScript. Por lo tanto, si falta algún punto y coma (en este caso, retorno), se inserta automáticamente de inmediato. Por lo tanto, la función devolvió como **undefined**.

Mientras que si la llave de apertura está junto con la palabra clave de retorno, la función se devolverá como se esperaba.

```jsx
function foo() {
  return {
    message: "Hello World",
  };
}
console.log(foo()); // {message: "Hello World"}
```

## 7. Arrays, cual es el resultado del siguiente código

```jsx
var myChars = ["a", "b", "c", "d"];
delete myChars[0];
console.log(myChars);
console.log(myChars[0]);
console.log(myChars.length);
```

- 1: [empty, 'b', 'c', 'd'], empty, 3
- 2: [null, 'b', 'c', 'd'], empty, 3
- **3: [empty, 'b', 'c', 'd'], undefined, 4**
- 4: [null, 'b', 'c', 'd'], undefined, 4

### Respuesta

El operador de eliminación eliminará la propiedad del objeto, pero no volverá a indexar la matriz ni cambiará su longitud. Por lo tanto, el número de elementos o la longitud de la matriz no cambiarán. Si intenta imprimir myChars, puede observar que no establece un valor **undefined**, sino que la propiedad se elimina de la matriz. Las versiones más nuevas de Chrome usan vacío en lugar de **undefined** para que la diferencia sea un poco más clara.

## 8. Arrays, cual es el valor según los últimos chrome

```jsx
var array1 = new Array(3);
console.log(array1);

var array2 = [];
array2[2] = 100;
console.log(array2);

var array3 = [, , ,];
console.log(array3);
```

- 1: [undefined × 3], [undefined × 2, 100], [undefined × 3]
- **2: [empty × 3], [empty × 2, 100], [empty × 3]**
- 3: [null × 3], [null × 2, 100], [null × 3]
- 4: [], [100], []

### Respuesta

Las últimas versiones de Chrome muestran una matriz dispersa (están llenas de agujeros) usando esta notación x n vacía. Mientras que las versiones anteriores tienen una notación x n **undefined**. Nota: La última versión de FF muestra n notación de ranuras vacías.

## 9. Objetos, cual es el valor del siguiente código

```jsx
const obj = {
  prop1: function () {
    return 0;
  },
  prop2() {
    return 1;
  },
  ["prop" + 3]() {
    return 2;
  },
};

console.log(obj.prop1());
console.log(obj.prop2());
console.log(obj.prop3());
```

- **1: 0, 1, 2**
- 2: 0, { return 1 }, 2
- 3: 0, { return 1 }, { return 2 }
- 4: 0, 1, undefined

### Respuesta

ES6 proporciona definiciones de métodos y abreviaturas de propiedades para objetos. Entonces, tanto prop2 como prop3 se tratan como valores de funciones regulares.

## 10. Operadores, cual es el resultado del siguiente código

```jsx
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

- 1: true, true
- **2: true, false**
- 3: SyntaxError, SyntaxError,
- 4: false, false

### Respuesta

El punto importante es que si la declaración contiene los mismos operadores (por ejemplo, < o >), entonces se puede evaluar de izquierda a derecha. La primera declaración sigue el siguiente orden,

1. consola.log(1 < 2 < 3);
2. consola.log(verdadero < 3);
3. consola.log(1 < 3); // Verdadero convertido a 1 durante la comparación
4. Verdadero

Mientras que la segunda declaración sigue el siguiente orden,

1. consola.log(3 > 2 > 1);
2. consola.log(verdadero > 1);
3. consola.log(1 > 1); // Falso convertido a 0 durante la comparación
4. FALSO

## 11. Funciones, **non-strict mode, que resultado da el siguiente código**

```jsx
function printNumbers(first, second, first) {
  console.log(first, second, first);
}
printNumbers(1, 2, 3);
```

- 1: 1, 2, 3
- 2: 3, 2, 3
- 3: SyntaxError: Duplicate parameter name not allowed in this context
- **4: 1, 2, 1**

### Respuesta

En el modo no estricto, las funciones regulares de JavaScript permiten duplicar los parámetros con nombre. El fragmento de código anterior tiene parámetros duplicados en el primer y tercer parámetro. El valor del primer parámetro se asigna al tercer argumento que se pasa a la función. Por lo tanto, el tercer argumento anula el primer parámetro.

Nota: En modo estricto, los parámetros duplicados generarán un error de sintaxis.

## 12. Arrow Function, que resultado da el siguiente código

```jsx
const printNumbersArrow = (first, second, first) => {
  console.log(first, second, first);
};
printNumbersArrow(1, 2, 3);
```

- 1: 1, 2, 3
- 2: 3, 2, 3
- **3: SyntaxError: Duplicate parameter name not allowed in this context**
- 4: 1, 2, 1

### Respuesta

A diferencia de las funciones regulares, las funciones de flecha no permiten parámetros duplicados en modo estricto o no estricto. Entonces puede ver **SyntaxError** en la consola.

## 13. Arrow Function, que resultado da el siguiente código

```jsx
const arrowFunc = () => arguments.length;
console.log(arrowFunc(1, 2, 3));
```

- **1: ReferenceError: arguments is not defined**
- 2: 3
- 3: undefined
- 4: null

### Respuesta

Las funciones de flecha no tienen argumentos, enlaces super, this o new.target. Entonces, cualquier referencia a la variable de argumentos intenta resolverse en un enlace en un entorno léxicamente envolvente. En este caso, la variable arguments no se define fuera de la función de flecha. Por lo tanto, recibirá un error de referencia.

Donde como la función normal proporciona el número de argumentos pasados a la función

```jsx
const func = function () {
  return arguments.length;
};
console.log(func(1, 2, 3));
```

Pero si aún desea usar una función de flecha, el operador de descanso en los argumentos proporciona los argumentos esperados

```jsx
const arrowFunc = (...args) => args.length;
console.log(arrowFunc(1, 2, 3));
```

## 14. Propiedades de String, cuál es el valor del siguiente código

```jsx
console.log(String.prototype.trimLeft.name === "trimLeft");
console.log(String.prototype.trimLeft.name === "trimStart");
```

- 1: True, False
- **2: False, True**

### Respuesta

Para mantener la coherencia con funciones como String.prototype.padStart, el nombre del método estándar para recortar los espacios en blanco se considera trimStart. Debido a razones de compatibilidad web, el antiguo nombre del método 'trimLeft' todavía actúa como un alias para 'trimStart'. Por lo tanto, el prototipo de 'trimLeft' siempre es 'trimStart’

## 15. Math, métodos, que resultado da el siguiente código

```jsx
console.log(Math.max());
```

- 1: undefined
- 2: Infinity
- 3: 0
- **4: -Infinity**

### Respuesta

- Infinito es el comparador inicial porque casi todos los demás valores son mayores. Entonces, cuando no se proporcionan argumentos, se devolverá -Infinity. **Nota**: El número cero de argumentos es un caso válido.

## 16. Array, comparaciones que resultado da el siguiente código

```jsx
console.log(10 == [10]);
console.log(10 == [[[[[[[10]]]]]]]);
```

- **1: True, True**
- 2: True, False
- 3: False, False
- 4: False, True

### Respuesta

Según el algoritmo de comparación en la especificación ECMAScript (ECMA-262), la expresión anterior se convirtió en JS como se muestra a continuación

```jsx
10 === Number([10].valueOf().toString()); // 10
```

Por lo tanto, no importa los corchetes numéricos ([]) alrededor del número, siempre se convierte en un número en la expresión.

## 17. Comparaciones, que resultado da el siguiente código

```jsx
console.log(10 + "10");
console.log(10 - "10");
```

- 1: 20, 0
- **2: 1010, 0**
- 3: 1010, 10-10
- 4: NaN, NaN

### Respuesta

El operador de concatenación (+) es aplicable tanto para tipos de números como de cadenas. Entonces, si algún operando es de tipo cadena, ambos operandos se concatenan como cadenas. Mientras que el operador restar (-) intenta convertir los operandos como tipo de número.

## 18. Comparaciones, cual es el resultado del siguiente código

```jsx
console.log([0] == false);
if ([0]) {
  console.log("I'm True");
} else {
  console.log("I'm False");
}
```

- **1: True, I'm True**
- 2: True, I'm False
- 3: False, I'm True
- 4: False, I'm False

### Respuesta

En los operadores de comparación, la expresión [0] se convierte en Number([0].valueOf().toString()) que se resuelve en falso. Mientras que [0] simplemente se convierte en un valor real sin ninguna conversión porque no hay un operador de comparación.

## 19. Arrays, que resultado da el siguiente código

```jsx
console.log([1, 2] + [3, 4]);
```

- 1: [1,2,3,4]
- 2: [1,2][3,4]
- 3: SyntaxError
- **4: 1,23,4**

### Respuesta

El operador + no está destinado ni definido para matrices. Entonces convierte matrices en cadenas y las concatena.

## 20. Set, que resultado da el siguiente código

```jsx
const numbers = new Set([1, 1, 2, 3, 4]);
console.log(numbers);

const browser = new Set("Firefox");
console.log(browser);
```

- **1: {1, 2, 3, 4}, {"F", "i", "r", "e", "f", "o", "x"}**
- 2: {1, 2, 3, 4}, {"F", "i", "r", "e", "o", "x"}
- 3: [1, 2, 3, 4], ["F", "i", "r", "e", "o", "x"]
- 4: {1, 1, 2, 3, 4}, {"F", "i", "r", "e", "f", "o", "x"}

### Respuesta

Dado que el objeto Set es una colección de valores únicos, no permitirá valores duplicados en la colección. Al mismo tiempo, es una estructura de datos que distingue entre mayúsculas y minúsculas.

## 21. Comparador sobre NaN que resultado da el siguiente código

```jsx
console.log(NaN === NaN);
```

- 1: True
- **2: False**

### Respuesta

JavaScript sigue los estándares de especificación IEEE 754. Según esta especificación, los NaN nunca son iguales para los números de punto flotante.

## 22. NaN, que resultado da el siguiente código

```jsx
let numbers = [1, 2, 3, 4, NaN];
console.log(numbers.indexOf(NaN));
```

- 1: 4
- 2: NaN
- 3: SyntaxError
- **4: -1**

### Respuesta

indexOf usa el operador de igualdad estricta (===) internamente y NaN === NaN se evalúa como falso. Dado que indexOf no podrá encontrar NaN dentro de una matriz, siempre devuelve -1. 

Pero puede usar el método Array.prototype.findIndex para averiguar el índice de NaN en una matriz o puede usar Array.prototype.includes para verificar si NaN está presente en una matriz o no.

```jsx
let numbers = [1, 2, 3, 4, NaN];
console.log(numbers.findIndex(Number.isNaN)); // 4

console.log(numbers.includes(NaN)); // true
```

## 23. Rest params operator, que resultado da el siguiente código

```jsx
let [a, ...b,] = [1, 2, 3, 4, 5];
console.log(a, b);
```

- 1: 1, [2, 3, 4, 5]
- 2: 1, {2, 3, 4, 5}
- **3: SyntaxError**
- 4: 1, [2, 3, 4]

### Respuesta

Cuando se usan rest params, no se permiten las comas finales y generarán un SyntaxError. Si elimina la coma final, muestra la primera respuesta

```jsx
let [a, ...b] = [1, 2, 3, 4, 5];
console.log(a, b); // 1, [2, 3, 4, 5]
```

## 24. Funciones async, que resultado da el siguiente código

```jsx
async function func() {
  return 10;
}
console.log(func());
```

- **1: Promise {<fulfilled>: 10}**
- 2: 10
- 3: SyntaxError
- 4: Promise {<rejected>: 10}

### Respuesta

Las funciones asíncronas siempre devuelven una promesa. Pero incluso si el valor de retorno de una función asíncrona no es explícitamente una promesa, estará implícitamente envuelto en una promesa. La función asíncrona anterior es equivalente a la siguiente expresión.

```jsx
function func() {
  return Promise.resolve(10);
}
```

## 25. Funciones async, cual es el resultado del siguiente código

```jsx
async function func() {
  await 10;
}
console.log(func());
```

- 1: Promise {<fulfilled>: 10}
- 2: 10
- 3: SyntaxError
- **4: Promise {<resolved>: undefined}**

### Respuesta

La expresión de espera devuelve el valor 10 con resolución de promesa y el código después de cada expresión de espera se puede tratar como existente en una devolución de llamada .then. En este caso, no hay expresión de retorno al final de la función. Por lo tanto, el valor de retorno predeterminado de undefined se devuelve como la resolución de la promesa. La función asíncrona anterior es equivalente a la siguiente expresión.

```jsx
function func() {
  return Promise.resolve(10).then(() => undefined);
}
```

## 26. Promesas, que resultado da el siguiente código

```jsx
function delay() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

async function delayedLog(item) {
  await delay();
  console.log(item);
}

async function processArray(array) {
  array.forEach(item => {
    await delayedLog(item);
  })
}

processArray([1, 2, 3, 4]);
```

- **1: SyntaxError**
- 2: 1, 2, 3, 4
- 3: 4, 4, 4, 4
- 4: 4, 3, 2, 1

### Respuesta

Aunque "processArray" es una función asíncrona, la función anónima que usamos para forEach es síncrona. Si usa esperar dentro de una función síncrona, arroja un error de sintaxis.

## 27. Promesas, que resultado da el siguiente código

```jsx
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

async function delayedLog(item) {
  await delay();
  console.log(item);
}

async function process(array) {
  array.forEach(async (item) => {
    await delayedLog(item);
  });
  console.log("Process completed!");
}
process([1, 2, 3, 5]);
```

- 1: 1 2 3 5 and Process completed!
- 2: 5 5 5 5 and Process completed!
- 3: Process completed! and 5 5 5 5
- **4: Process completed! and 1 2 3 5**

### Respuesta

El método forEach no esperará hasta que todos los elementos estén terminados, sino que simplemente ejecuta las tareas y continúa. Por lo tanto, la última declaración se muestra primero seguida de una secuencia de resoluciones de promesa.

Pero controlas la secuencia de la matriz usando for..of loop,

```jsx
async function processArray(array) {
  for (const item of array) {
    await delayedLog(item);
  }
  console.log("Process completed!");
}
```

## 28. Set, que resultado da el siguiente código

```jsx
var set = new Set();
set.add("+0").add("-0").add(NaN).add(undefined).add(NaN);
console.log(set);
```

- **1: Set(4) {"+0", "-0", NaN, undefined}**
- 2: Set(3) {"+0", NaN, undefined}
- 3: Set(5) {"+0", "-0", NaN, undefined, NaN}
- 4: Set(4) {"+0", NaN, undefined, NaN}

### Respuesta

El conjunto tiene pocas excepciones de verificación de igualdad,

- Todos los valores de NaN son iguales
- Tanto +0 como -0 se consideran valores diferentes

## 29. Symbol, que resultado da el siguiente código

```jsx
const sym1 = Symbol("one");
const sym2 = Symbol("one");

const sym3 = Symbol.for("two");
const sym4 = Symbol.for("two");

console.log(sym1 === sym2, sym3 === sym4);
```

- 1: true, true
- 2: true, false
- **3: false, true**
- 4: false, false

### Respuesta

El símbolo sigue las siguientes convenciones,

1. Cada valor de símbolo devuelto por Symbol() es único, independientemente de la cadena opcional.
2. La función Symbol.for() crea un símbolo en una lista de registro de símbolos global. Pero no necesariamente crea un nuevo símbolo en cada llamada, primero verifica si un símbolo con la clave dada ya está presente en el registro y devuelve el símbolo si lo encuentra. De lo contrario, se crea un nuevo símbolo en el registro.
Nota: La descripción del símbolo solo es útil para fines de depuración.

## 30. Symbol, que resultado da el siguiente código

```jsx
const sym1 = new Symbol("one");
console.log(sym1);
```

- **1: SyntaxError**
- 2: one
- 3: Symbol('one')
- 4: Symbol

### Respuesta

El símbolo es solo una función estándar y no un constructor de objetos (a diferencia de otras primitivas new Boolean, new String y new Number). Entonces, si intenta llamarlo con el nuevo operador, dará como resultado un TypeError

## 31. Typeof, que da el siguiente resultado

```jsx
let myNumber = 100;
let myString = "100";

if (!typeof myNumber === "string") {
  console.log("It is not a string!");
} else {
  console.log("It is a string!");
}

if (!typeof myString === "number") {
  console.log("It is not a number!");
} else {
  console.log("It is a number!");
}
```

- 1: SyntaxError
- 2: It is not a string!, It is not a number!
- 3: It is not a string!, It is a number!
- **4: It is a string!, It is a number!**

### Respuesta

El valor de retorno de typeof myNumber o typeof myString es siempre un valor verdadero (ya sea "número" o "cadena"). El ! El operador opera en typeof myNumber o typeof myString, convirtiéndolos en valores booleanos. Dado que el valor de !typeof myNumber y !typeof myString es falso, la condición if falla y el control pasa al bloque else.

Para hacer el ! Operador opera en la expresión de igualdad, uno necesita agregar paréntesis:

```jsx
if (!(typeof myNumber === "string"))
```

O simplemente use la operadora de desigualdad:

```jsx
if (typeof myNumber !== "string")
```

## 32. JSON método stringify, cuál es el resultado del siguiente código

```jsx
console.log(
  JSON.stringify({ myArray: ["one", undefined, function () {}, Symbol("")] })
);
console.log(
  JSON.stringify({ [Symbol.for("one")]: "one" }, [Symbol.for("one")])
);
```

- 1: {"myArray":['one', undefined, {}, Symbol]}, {}
- **2: {"myArray":['one', null,null,null]}, {}**
- 3: {"myArray":['one', null,null,null]}, "{ [Symbol.for('one')]: 'one' }, [Symbol.for('one')]"
- 4: {"myArray":['one', undefined, function(){}, Symbol('')]}, {}

### Respuesta

Los símbolos tienen las siguientes restricciones,

- Los valores no definidos, Funciones y Símbolos no son valores JSON válidos. Entonces, esos valores se omiten (en un objeto) o se cambian a nulos (en una matriz). Por lo tanto, devuelve valores nulos para la matriz de valores.
- Todas las propiedades con clave de símbolo se ignorarán por completo. Por lo tanto, devuelve un objeto vacío ({}).

## 33. Clases, que resultado da el siguiente código

```jsx
class A {
  constructor() {
    console.log(new.target.name);
  }
}

class B extends A {
  constructor() {
    super();
  }
}

new A();
new B();
```

- 1: A, A
- **2: A, B**

### Respuesta

Usando constructores, new.target se refiere al constructor (apunta a la definición de clase de la clase que se inicializa) que new invocó directamente. Esto también se aplica al caso si el constructor está en una clase principal y fue delegado de un constructor secundario.

## 34. Rest params, cuál es el resultado del siguiente código

```jsx
const [x, ...y, z] = [1, 2, 3, 4];
console.log(x, y, z);
```

- 1: 1, [2, 3], 4
- 2: 1, [2, 3, 4], undefined
- 3: 1, [2], 3
- **4: SyntaxError**

### Respuesta

Lanza un error de sintaxis porque el elemento resto no debe tener una coma final. Siempre debe considerar usar un operador de descanso como último elemento

## 35. Object properties, que resultado devuelve el siguiente código

```jsx
const { a: x = 10, b: y = 20 } = { a: 30 };

console.log(x);
console.log(y);
```

- **1: 30, 20**
- 2: 10, 20
- 3: 10, undefined
- 4: 30, undefined

### Respuesta

La propiedad del objeto sigue las siguientes reglas,

1. Las propiedades del objeto se pueden recuperar y asignar a una variable con un nombre diferente
2. La propiedad asignó un valor predeterminado cuando el valor recuperado no está definido

## 36. Destructuring, cuál es el resultado del siguiente código

```jsx
function area({ length = 10, width = 20 }) {
  console.log(length * width);
}

area();
```

- 1: 200
- **2: Error**
- 3: undefined
- 4: 0

### Respuesta

Si omite la asignación del lado derecho para el objeto de desestructuración, la función buscará al menos un argumento para proporcionar cuando se invoque. De lo contrario, recibirá un error Error: no se puede leer la propiedad 'longitud' de undefined como se mencionó anteriormente.

Puede evitar el error con cualquiera de los siguientes cambios,

1. Pase al menos un objeto vacío:

```jsx
function area({ length = 10, width = 20 }) {
  console.log(length * width);
}

area({});
```

1. Asignar objeto vacío predeterminado:

```jsx
function area({ length = 10, width = 20 } = {}) {
  console.log(length * width);
}

area();
```

## 37. Arrays, cuál es el resultado del siguiente código

```jsx
function add(item, items = []) {
  items.push(item);
  return items;
}

console.log(add("Orange"));
console.log(add("Apple"));
```

- 1: ['Orange'], ['Orange', 'Apple']
- **2: ['Orange'], ['Apple']**

### Resultado

Dado que el argumento predeterminado se evalúa en el momento de la llamada, se crea un nuevo objeto cada vez que se llama a la función. Entonces, en este caso, se crea la nueva matriz y se empuja un elemento a la matriz vacía predeterminada.

### 38. Destructuring, cuál es el resultado del siguiente código

```jsx
const props = [
  { id: 1, name: "John" },
  { id: 2, name: "Jack" },
  { id: 3, name: "Tom" },
];

const [, , { name }] = props;
console.log(name);
```

- **1: Tom**
- 2: Error
- 3: undefined
- 4: John

### Respuesta

Es posible combinar la desestructuración de matrices y objetos. En este caso, se accede primero al tercer elemento de los accesorios de la matriz, seguido de la propiedad de nombre en el objeto.

## 39. typeof, cuál es el resultado del siguiente código

```jsx
function checkType(num = 1) {
  console.log(typeof num);
}

checkType();
checkType(undefined);
checkType("");
checkType(null);
```

- 1: number, undefined, string, object
- 2: undefined, undefined, string, object
- **3: number, number, string, object**
- 4: number, number, number, number

### Respuesta

Si el argumento de la función se establece implícitamente (sin pasar el argumento) o explícitamente como indefinido, el valor del argumento es el parámetro predeterminado. Mientras que para otros valores falsos ('' o nulos), el valor del argumento se pasa como parámetro.

Por lo tanto, el resultado de las llamadas a funciones clasificadas de la siguiente manera,

1. Las dos primeras llamadas de función registran el tipo de número ya que el tipo de valor predeterminado es número
2. El tipo de '' y los valores nulos son cadena y tipo de objeto respectivamente.

## 40. Funciones, parámetros, cuál es el resultado del siguiente código

```jsx
function greet(greeting, name, message = greeting + " " + name) {
  console.log([greeting, name, message]);
}

greet("Hello", "John");
greet("Hello", "John", "Good morning!");
```

- 1: SyntaxError
- **2: ['Hello', 'John', 'Hello John'], ['Hello', 'John', 'Good morning!']**

### Respuesta

Dado que los parámetros definidos anteriormente están disponibles para los parámetros predeterminados posteriores, este fragmento de código no genera ningún error.

## 41. Funciones, parámetros, cual es el resultado del siguiente código

```jsx
function outer(f = inner()) {
  function inner() {
    return "Inner";
  }
}
outer();
```

- **1: ReferenceError**
- 2: Inner

### Respuesta

Las funciones y variables declaradas en el cuerpo de la función no se pueden consultar desde los inicializadores de parámetros de valores predeterminados. Si aún intenta acceder, arroja un error de referencia en tiempo de ejecución (es decir, el interior no está definido).

## 42. Rest params, cuál es el resultado del siguiente código

```jsx
function myFun(x, y, ...manyMoreArgs) {
  console.log(manyMoreArgs);
}

myFun(1, 2, 3, 4, 5);
myFun(1, 2);
```

- 1: [3, 4, 5], undefined
- 2: SyntaxError
- **3: [3, 4, 5], []**
- 4: [3, 4, 5], [undefined]

### Respuesta

El parámetro rest se usa para contener los parámetros restantes de una función y se convierte en una matriz vacía si no se proporciona el argumento.

### 43. Object, cuál es el resultado del siguiente código

```jsx
const obj = { key: "value" };
const array = [...obj];
console.log(array);
```

- 1: ['key', 'value']
- **2: TypeError**
- 3: []
- 4: ['key']

### Respuesta

La sintaxis extendida solo se puede aplicar a objetos iterables. Por defecto, los Objetos no son iterables, pero se vuelven iterables cuando se usan en un Array, o con funciones de iteración como map(), reduce() y Assign(). Si aún intenta hacerlo, aún arroja TypeError: obj is not iterable.

## 44. Objeto generador, cuál es el resultado del siguiente código

```jsx
function* myGenFunc() {
  yield 1;
  yield 2;
  yield 3;
}
var myGenObj = new myGenFunc();
console.log(myGenObj.next().value);
```

- 1: 1
- 2: undefined
- 3: SyntaxError
- **4: TypeError**

### Respuesta

Los generadores no son de tipo construible. Pero si continúa haciéndolo, aparecerá un error que dice "Error de tipo: myGenFunc no es un constructor”

## 45. Objeto generador, cuál es el resultado del siguiente código

```jsx
function* yieldAndReturn() {
  yield 1;
  return 2;
  yield 3;
}

var myGenObj = yieldAndReturn();
console.log(myGenObj.next());
console.log(myGenObj.next());
console.log(myGenObj.next());
```

- **1: { value: 1, done: false }, { value: 2, done: true }, { value: undefined, done: true }**
- 2: { value: 1, done: false }, { value: 2, done: false }, { value: undefined, done: true }
- 3: { value: 1, done: false }, { value: 2, done: true }, { value: 3, done: true }
- 4: { value: 1, done: false }, { value: 2, done: false }, { value: 3, done: true }

### Respuesta

Una declaración de retorno en una función de generador hará que el generador finalice. Si se devuelve un valor, se establecerá como la propiedad value del objeto y la propiedad done será verdadera. Cuando finaliza un generador, las siguientes llamadas next() devuelven un objeto de esta forma: {valor: indefinido, hecho: verdadero}.

## 46. Objeto generador, que resultado da el siguiente código

```jsx
const myGenerator = (function* () {
  yield 1;
  yield 2;
  yield 3;
})();
for (const value of myGenerator) {
  console.log(value);
  break;
}

for (const value of myGenerator) {
  console.log(value);
}
```

- 1: 1,2,3 and 1,2,3
- 2: 1,2,3 and 4,5,6
- 3: 1 and 1
- **4: 1**

### Respuesta

El generador no debe reutilizarse una vez que se cierra el iterador. es decir, al salir de un ciclo (al finalizar o al usar break & return), el generador se cierra y tratar de iterarlo nuevamente no produce más resultados. Por lo tanto, el segundo ciclo no imprime ningún valor.

## 47. Number, que resultado da el siguiente código

```jsx
const num = 0o38;
console.log(num);
```

- **1: SyntaxError**
- 2: 38

### Respuesta

Si usa un número no válido (fuera del rango 0-7) en el literal octal, JavaScript generará un SyntaxError. En ES5, trata el literal octal como un número decimal.

## 48. Clases, cuál es el resultado del siguiente código

```jsx
const squareObj = new Square(10);
console.log(squareObj.area);

class Square {
  constructor(length) {
    this.length = length;
  }

  get area() {
    return this.length * this.length;
  }

  set area(value) {
    this.area = value;
  }
}
```

- 1: 100
- **2: ReferenceError**

### Respuesta

A diferencia de las declaraciones de funciones, las declaraciones de clases no se elevan. es decir, primero debe declarar su clase y luego acceder a ella, de lo contrario arrojará un error de referencia "Error de referencia no detectado: el cuadrado no está definido".

Nota: Las expresiones de clase también se aplican a las mismas restricciones de elevación de las declaraciones de clase.

## 49. Clases, cuál es el resultado del siguiente código

```jsx
function Person() {}

Person.prototype.walk = function () {
  return this;
};

Person.run = function () {
  return this;
};

let user = new Person();
let walk = user.walk;
console.log(walk());

let run = Person.run;
console.log(run());
```

- 1: undefined, undefined
- 2: Person, Person
- 3: SyntaxError
- **4: Window, Window**

### Respuesta

Cuando se llama a un método regular o prototipo sin un valor para this, los métodos devuelven un valor inicial this si el valor no está indefinido. De lo contrario, se devolverá el objeto de ventana global. En nuestro caso, el valor inicial de this no está definido, por lo que ambos métodos devuelven objetos de ventana.

## 50. Clases, que resultado devuelve el siguiente código

```jsx
class Vehicle {
  constructor(name) {
    this.name = name;
  }

  start() {
    console.log(`${this.name} vehicle started`);
  }
}

class Car extends Vehicle {
  start() {
    console.log(`${this.name} car started`);
    super.start();
  }
}

const car = new Car("BMW");
console.log(car.start());
```

- 1: SyntaxError
- 2: BMW vehicle started, BMW car started
- **3: BMW car started, BMW vehicle started**
- 4: BMW car started, BMW car started

### Respuesta

La palabra clave super se utiliza para llamar a métodos de una superclase. A diferencia de otros lenguajes, la súper invocación no necesita ser una primera declaración. es decir, las declaraciones se ejecutarán en el mismo orden de código.

## 51. Objetos, cual es el resultado del siguiente código

```jsx
const USER = { age: 30 };
USER.age = 25;
console.log(USER.age);
```

- 1: 30
- **2: 25**
- 3: Uncaught TypeError
- 4: SyntaxError

### Respuesta

Aunque usamos variables constantes, su contenido es un objeto y el contenido del objeto (por ejemplo, las propiedades) se puede modificar. Por lo tanto, el cambio va a ser válido en este caso.

## 52. Equals, que resultado da el siguiente código

```jsx
console.log("🙂" === "🙂");
```

- 1: false
- **2: true**

### Respuesta

Los emojis son Unicode y el Unicode para el símbolo de sonrisa es "U+1F642". La comparación Unicode de los mismos emojis es equivalente a la comparación de cadenas. Por lo tanto, la salida siempre es verdadera.

## 53. typeof, que resultado da el siguiente código

```jsx
console.log(typeof typeof typeof true);
```

- **1: string**
- 2: boolean
- 3: NaN
- 4: number

### Respuesta

El operador typeof en cualquier primitiva devuelve un valor de cadena. Entonces, incluso si aplica la cadena de operadores typeof en el valor de retorno, siempre es una cadena.

## 54. Number, condicionales, que valor es el que resuelve el siguiente código

```jsx
let zero = new Number(0);

if (zero) {
  console.log("If");
} else {
  console.log("Else");
}
```

- **1: If**
- 2: Else
- 3: NaN
- 4: SyntaxError

### Respuesta

- El tipo de operador en Número nuevo siempre devuelve objeto. es decir, tipo de nuevo Número (0) --> objeto.
- Los objetos siempre son veraces en el bloque if

Por lo tanto, el bloque de código anterior siempre va a la sección if.

## 55. String, cuál es el resultado del siguiente código

```jsx
let msg = "Good morning!!";

msg.name = "John";

console.log(msg.name);
```

- 1: ""
- 2: Error
- 3: John
- **4: Undefined**

### Respuesta

Devuelve undefined para el modo no estricto y devuelve Error para el modo estricto. En modo no estricto, el objeto contenedor se creará y obtendrá la propiedad mencionada. Pero el objeto desapareció después de acceder a la propiedad en la siguiente línea.

## 56. Function, cuál es el resultado del siguiente código

```jsx
let count = 10;

(function innerFunc() {
  if (count === 10) {
    let count = 11;
    console.log(count);
  }
  console.log(count);
})();
```

- **1: 11, 10**
- 2: 11, 11
- 3: 10, 11
- 4: 10, 10
- 5: 11, undefined

### Respuesta

11 y 10 se registra en la consola.

El innerFunc es un cierre que captura la variable de recuento del ámbito externo. es decir, 10. Pero el condicional tiene otra variable local de conteo que sobre-escribe la variable de conteo externo. Entonces, el primer archivo console.log muestra el valor 11. Mientras que el segundo archivo console.log registra 10 al capturar la variable de conteo desde el exterior.

## 57. Cuál es el resultado del siguiente código

```jsx
console.log(true && 'hi');
console.log(true && 'hi' && 1);
console.log(true && '' && 0);
```

### Respuesta

- 1: hi
- 2: 1
- 3: ''

**Motivo**: el operador devuelve el valor del primer operando falso encontrado al evaluar de izquierda a derecha, o el valor del último operando si son todos verdaderos.

**Nota**: Por debajo de estos valores se consideran valores falsos

- 1: 0
- 2: ''
- 3: null
- 4: undefined
- 5: NAN

## 58. Arrays, que da el siguiente código

```jsx
let arr = [1, 2, 3];
let str = "1,2,3";

console.log(arr == str);
```

- 1: false
- 2: Error
- **3: true**

### Respuesta

Las matrices tienen su propia implementación del método toString que devuelve una lista de elementos separados por comas. Entonces, el fragmento de código anterior devuelve verdadero. Para evitar la conversión del tipo de matriz, debemos usar === para comparar.

## 59. Arrow function, cuál es el resultado del siguiente código

```jsx
getMessage();

var getMessage = () => {
  console.log("Good morning");
};
```

- 1: Good morning
- **2: getMessage is not a function**
- 3: getMessage is not defined
- 4: Undefined

### Respuesta

Hoisting moverá las variables y funciones para que sean la parte superior del alcance. Aunque getMessage es una función de flecha, la función anterior se considerará como una variable debido a su declaración o asignación de variable. Entonces, las variables tendrán un valor indefinido en la fase de memoria y arrojarán un error 'getMessage no es una función' en la fase de ejecución del código.

Si cambiamos var por let o const, nos daría error pero por getMessage is not defined

```jsx
getMessage(); // ReferenceError: getMessage is not defined

const getMessage = () => {
  console.log("Good morning");
};
```

Para que funciones hay que declararla antes

```jsx
const getMessage = () => {
  console.log("Good morning");
};

getMessage(); // 'Good morning'
```

## 60. Promesas, cuál es el resultado

```jsx
let quickPromise = Promise.resolve();

quickPromise.then(() => console.log("promise finished"));

console.log("program finished");
```

- 1: program finished
- 2: Cannot predict the order
- **3: program finished, promise finished**
- 4: promise finished, program finished

### Respuesta

Aunque una promesa se resuelve inmediatamente, no se ejecutará inmediatamente porque sus controladores .then/catch/finally o devoluciones de llamada (también conocidas como tareas) se colocan en la cola. Cada vez que el motor de JavaScript se libera del programa actual, extrae una tarea de la cola y la ejecuta. Esta es la razón por la cual la última declaración se imprime primero antes del registro del controlador de promesa.

Nota: Llamamos a la cola anterior como "MicroTask Queue"

## 61. forEach, cual es el resultado del siguiente código

```jsx
console.log('First line')
['a', 'b', 'c'].forEach((element) => console.log(element))
console.log('Third line')
```

- 1: `First line`, then print `a, b, c` in a new line, and finally print `Third line` as next line
- 2: `First line`, then print `a, b, c` in a first line, and print `Third line` as next line
- 3: Missing semi-colon error
- **4: Cannot read properties of undefined**

### Respuesta

Cuando JavaScript encuentra un salto de línea sin punto y coma, el analizador de JavaScript agregará automáticamente un punto y coma basado en un conjunto de reglas llamadas Inserción automática de punto y coma que determina si el salto de línea es el final de la declaración o no para insertar punto y coma. Pero no asume un punto y coma antes de los corchetes [...]. Entonces, las dos primeras líneas se consideran como una declaración única como se muestra a continuación.

```jsx
console.log('First line')['a', 'b', 'c'].forEach((element) => console.log(element))
```

Por lo tanto, no habrá propiedades de lectura de error indefinido al aplicar el corchete cuadrado de la matriz en la función de registro.

## 62. var, que resultado da

```jsx
var of = ['of'];
for(var of of of) {
  console.log(of);
}
```

- **1: of**
- 2: SyntaxError: Unexpected token of
- 3: SyntaxError: Identifier 'of' has already been declared
- 4: ReferenceError: of is not defined

### Respuesta

En JavaScript, of no se considera una palabra clave reservada. Por lo tanto, se acepta la declaración de la variable con of e imprime el valor de la matriz de using for..of loop.

Pero si usa una palabra clave reservada como en, habrá un error de sintaxis que dice SyntaxError: token inesperado,

```jsx
var in = ['in'];
for(var in in in) {
  console.log(in[in]);
}
```

## 63. Sort, cuál es el resultado

```jsx
const numbers = [11, 25, 31, 23, 33, 18, 200];
numbers.sort();
console.log(numbers);
```

- 1: [11, 18, 23, 25, 31, 33, 200]
- **2: [11, 18, 200, 23, 25, 31, 33]**
- 3: [11, 25, 31, 23, 33, 18, 200]
- 4: Cannot sort numbers

### Respuesta

De forma predeterminada, el método de ordenación ordena los elementos alfabéticamente. Esto se debe a que los elementos se convirtieron en cadenas y las cadenas se compararon en orden de unidades de código UTF-16. Por lo tanto, verá que los números anteriores no están ordenados como se esperaba. Para ordenar numéricamente, solo proporcione una función de comparación que maneje las clasificaciones numéricas.

```jsx
const numbers = [11, 25, 31, 23, 33, 18, 200];
numbers.sort((a, b) => a - b);
console.log(numbers); // [ 11, 18, 23, 25, 31, 33, 200 ]
```

Nota: el método Sort() cambia la matriz original.

## 64. setTimeout, Promise, cuál es el resultado

```jsx
setTimeout(() => {console.log('1')}, 0);
Promise.resolve('hello').then(() => console.log('2'));
console.log('3');
```

- 1: 1, 2, 3
- 2: 1, 3, 2
- 3: 3, 1, 2
- **4: 3, 2, 1**

### Respuesta

Cuando el motor de JavaScript analiza el código anterior, las dos primeras declaraciones son asincrónicas, que se ejecutarán más tarde, y la tercera declaración es sincrónica, que se moverá a la pila de llamadas, se ejecutará e imprimirá el número 3 en la consola. A continuación, Promise es nativo en ES6 y se moverá a la cola de trabajos, que tiene una prioridad más alta que la cola de devolución de llamadas en el orden de ejecución. Por último, dado que setTimeout es parte de WebAPI, la función de devolución de llamada se movió a la cola de devolución de llamada y se ejecutó. Por lo tanto, verá el número 2 impreso primero seguido del 1.

## 65. function, que resultado da el siguiente código

```jsx
console.log(name);
console.log(message());
var name = 'John';
(function message() {
   console.log('Hello John: Welcome');
});
```

- 1: John, Hello John: Welcome
- 2: undefined, Hello John, Welcome
- 3: Reference error: name is not defined, Reference error: message is not defined
- **4: undefined, Reference error: message is not defined**

### Respuesta

IIFE (Expresión de función invocada inmediatamente) es como cualquier otra expresión de función que no se izará. Por lo tanto, habrá un error de referencia para la llamada de mensaje. El comportamiento sería el mismo con la siguiente expresión de función de mensaje1,

```jsx
console.log(name);
console.log(message());
var name = 'John';
var message = function () {
   console.log('Hello John: Welcome');
};
```

## 66. function, cuál es el resultado del siguiente código

```jsx
message()

function message() {
  console.log("Hello");
}
function message() {
  console.log("Bye");
}
```

- 1: Reference error: message is not defined
- 2: Hello
- **3: Bye**
- 4: Compile time error

### Respuesta

As part of hoisting, initially JavaScript Engine or compiler will store first function in heap memory but later rewrite or replaces with redefined function content.

## 67. function, cuál es el resultado del siguiente código

```jsx
var currentCity = "NewYork";

var changeCurrentCity = function() {
  console.log('Current City:', currentCity);
  var currentCity = "Singapore";
  console.log('Current City:', currentCity);
}

changeCurrentCity();
```

- 1: NewYork, Singapore
- 2: NewYork, NewYork
- **3: undefined, Singapore**
- 4: Singapore, Singapore

### Respuesta

Debido a la característica de hositing, las variables declaradas con var tendrán un valor indefinido en la fase de creación, por lo que la variable exterior currentCity obtendrá el mismo valor indefinido. Pero después de unas pocas líneas de código, el motor de JavaScript encontró una nueva llamada de función (cambiarCurrentCity()) para actualizar la ciudad actual con la nueva declaración de var. 

Dado que cada llamada de función creará un nuevo contexto de ejecución, la misma variable tendrá un valor indefinido antes de la declaración y un nuevo valor (Singapur) después de la declaración. Por lo tanto, el valor indefinido se imprime primero seguido del nuevo valor Singapur en la fase de ejecución.

## 68. function, que valor devuelve el siguiente código

```jsx
function second() {
	var message;
  console.log(message);
}

function first() {
	var message="first";
  second();
  console.log(message);
}

var message = "default";
first();
console.log(message);
```

- **1: undefined, first, default**
- 2: default, default, default
- 3: first, first, default
- 4: undefined, undefined, undefined

### Respuesta

Cada contexto (global o funcional) tiene su propio entorno variable y la pila de llamadas de variables en un orden LIFO. Por lo tanto, puede ver el valor de la variable del mensaje de las funciones segunda y primera en un orden seguido del valor de la variable del mensaje de contexto global al final.

## 69. function, que resultado da el siguiente código

```jsx
var expressionOne = function functionOne() {
  console.log("functionOne");
}
functionOne();
```

- **1: functionOne is not defined**
- 2: functionOne
- 3: console.log("functionOne")
- 4: undefined

### Respuestas

La llamada a la función functionOne no formará parte de la cadena de alcance y tiene su propio contexto de ejecución con el entorno variable adjunto. es decir, no se accederá desde el contexto global. Por lo tanto, habrá un error al invocar la función ya que functionOne no está definida.

## 70. Objects, cuál es el resultado del siguiente código

```jsx
const user = {
  name: 'John',
  eat() {
    console.log(this);
    var eatFruit = function() {
      console.log(this);
    }
    eatFruit()
  }
}
user.eat();
```

- 1: {name: "John", eat: f}, {name: "John", eat: f}
- 2: Window {...}, Window {...}
- 3: {name: "John", eat: f}, undefined
- **4: {name: "John", eat: f}, Window {...}**

### Respuesta

this palabra clave tiene un alcance dinámico pero no un alcance léxico. En otras palabras, no importa dónde se haya escrito esto, sino cómo se ha invocado realmente importa. En el fragmento de código anterior, el objeto de usuario invoca la función de comer, por lo que esta palabra clave se refiere al objeto de usuario, pero la función de comer ha invocado a eatFruit y tendrá un objeto de ventana predeterminado.

La caída del hoyo anterior se fija de tres maneras,

1. En ES6, la función de flecha hará que esta palabra clave tenga un alcance léxico. Dado que el objeto que rodea a this objeto es un objeto de usuario, la función eatFruit contendrá un objeto de usuario para this objeto.

```jsx
const user = {
  name: 'John',
  eat() {
    console.log(this);
    var eatFruit = () => {
      console.log(this);
    }
    eatFruit()
  }
}
user.eat();
```

Las siguientes dos soluciones se han utilizado antes de que se introdujera ES6.

1. Es posible crear una referencia de this en una variable separada y usar esa nueva variable en lugar de this palabra clave dentro de la función eatFruit. Esta es una práctica común en jQuery y AngularJS antes de la introducción de ES6.

```jsx
const user = {
  name: 'John',
  eat() {
    console.log(this);
    var self = this;
    var eatFruit = () => {
      console.log(self);
    }
    eatFruit()
  }
}
user.eat();
```

1. La función eatFruit puede vincularse explícitamente con this palabra clave donde se refiere al objeto window.

```jsx
const user = {
  name: 'John',
  eat() {
    console.log(this);
    var eatFruit = function() {
      console.log(this);
    }
    return eatFruit.bind(this)
  }
}
user.eat()();
```

## 71. Strings, que resultado da el siguiente código

```jsx
let message = 'Hello World!';
message[0] = 'J'
console.log(message)

let name = 'John';
name = name + ' Smith';
console.log(name);
```

- 1: Jello World!, John Smith
- 2: Jello World!, John
- **3: Hello World!, John Smith**
- 4: Hello World!, John

### Respuesta

En JavaScript, las primitivas son inmutables, es decir, no hay forma de cambiar un valor primitivo una vez que se crea. Entonces, cuando intenta actualizar el primer carácter de la cadena, no hay cambios en el valor de la cadena e imprime el mismo valor inicial ¡Hola mundo!. Mientras que en el último ejemplo, el valor concatenado se reasigna a la misma variable, lo que dará como resultado la creación de un nuevo bloque de memoria con la referencia que apunta al valor de John Smith y el valor del bloque de memoria anterior (John) se recolectará como basura.

## 72. Objects, que da el siguiente código

```jsx
let user1 = { 
      name : 'Jacob',
      age : 28
    };
    
let user2 = {    
      name : 'Jacob',
      age : 28
    };
    
console.log(user1 === user2);
```

- 1: True
- **2: False**
- 3: Compile time error

### Respuesta

En JavaScript, las variables como objetos, matrices y funciones pasan por referencia. Cuando intenta comparar dos objetos con el mismo contenido, comparará la dirección de memoria o la referencia de esas variables. Estas variables siempre crean bloques de memoria separados, por lo que la comparación siempre devolverá un valor falso.

## 73. setTimeout, cuál es el resultado del siguiente código

```jsx
function greeting() {
  setTimeout(function() {
    console.log(message);
  }, 5000);
  const message = "Hello, Good morning";
}
greeting();
```

- 1: Undefined
- 2: Reference error:
- **3: Hello, Good morning**
- 4: null

### Respuesta

El mensaje variable todavía se trata como un cierre (ya que se ha utilizado en la función interna) aunque se haya declarado después de la función setTimeout. La función con la función setTimeout se enviará a WebAPI y la declaración de la variable se ejecutará en 5 segundos con el valor asignado. Por lo tanto, se mostrará el texto declarado para la variable.

## 74. Number, comparaciones, que da el siguiente código

```jsx
const a = new Number(10);
const b = 10;
console.log(a === b);
```

- **1: False**
- 2: True

### Respuestas

Aunque ambas variables a y b se refieren a un valor numérico, la primera declaración se basa en la función constructora y el tipo de la variable será de tipo objeto. Mientras que la segunda declaración es una asignación primitiva con un número y el tipo es tipo de número. Por lo tanto, el operador de igualdad === generará un valor falso.

## 75. Function, que tipo de función es la siguiente

```jsx
function add(a, b) {
  console.log("The input arguments are: ", a, b);
  return a + b;
}
```

- 1: Pure function
- **2: Impure function**

### Respuesta

Aunque la función anterior devuelve el mismo resultado para los mismos argumentos (entrada) que se pasan en la función, la instrucción console.log() hace que una función tenga efectos secundarios porque afecta el estado de un código externo. es decir, el estado del objeto de la consola y depende de él para realizar el trabajo. Por lo tanto, la función anterior se considera una función impura.

## 76. Promesas, cuál es el resultado del siguiente código

```jsx
const promiseOne = new Promise((resolve, reject) => setTimeout(resolve, 4000));
const promiseTwo = new Promise((resolve, reject) => setTimeout(reject, 4000));

Promise.all([promiseOne, promiseTwo]).then(data => console.log(data));
```

- 1: [{status: "fullfilled", value: undefined}, {status: "rejected", reason: undefined}]
- **2: [{status: "fullfilled", value: undefined}, Uncaught(in promise)]**
- 3: Uncaught (in promise)
- 4: [Uncaught(in promise), Uncaught(in promise)]

### Respuesta

Las promesas anteriores se liquidaron al mismo tiempo, pero una de ellas se resolvió y la otra se rechazó. Cuando usa el método .all en estas promesas, el resultado se acortará al arrojar un error debido al rechazo en la segunda promesa. Pero si usa el método .allSettled, el resultado de ambas promesas se devolverá independientemente del estado de la promesa resuelta o rechazada sin arrojar ningún error.

```jsx
Promise.allSettled([promiseOne, promiseTwo]).then(data => console.log(data));
```
	
>El método `Promise.all()` funciona como un **todo o nada**: devuelve una promesa que se cumple cuando todas las promesas del **array** se cumplen. Si alguna de ellas se rechaza, `Promise.all()` también lo hace.
	
>El método `Promise.allSettled()` funciona como un **todas procesadas**: devuelve una promesa que se cumple cuando todas las promesas del **array** se hayan procesado, independientemente de que se hayan cumplido o rechazado.

## 77. setTimeout, cual es el resultado del siguiente código

```jsx
try {
  setTimeout(() => {
    console.log('try block');
    throw new Error(`An exception is thrown`)
  }, 1000);
} catch(err) {
  console.log('Error: ', err);
}
```

- 1: try block, Error: An exception is thrown
- 2: Error: An exception is thrown
- **3: try block, Uncaught Error: Exception is thrown**
- 4: Uncaught Error: Exception is thrown

### Respuesta

Si coloca los métodos setTimeout y setInterval dentro de la cláusula try y se lanza una excepción, la cláusula catch no detectará ninguno de ellos. Esto se debe a que la declaración try...catch funciona de forma síncrona, y la función del código anterior se ejecuta de forma asíncrona después de un cierto período de tiempo. Por lo tanto, verá una excepción de tiempo de ejecución sin detectar el error. Para resolver este problema, debe colocar el bloque try...catch dentro de la función como se muestra a continuación:

```jsx
setTimeout(() => {
   try {
      console.log('try block');
      throw new Error(`An exception is thrown`)
   } catch(err) {
      console.log('Error: ', err);
   }
  
  }, 1000);
```

Puede usar la función .catch() en las promesas para evitar estos problemas con el código asíncrono.

## 78. Let, var, cuál es el resultado del siguiente código

```jsx
function prueba(){
	var num = 33;
	if (true) {
		let num = (num + 55);
  }
	return num;
}
console.log(prueba());
```

- **ReferenceError**
- 33
- 88
- 55

### Respuesta

ReferenceError: no se puede acceder a la declaración léxica `num` antes de la inicialización. Es decir

Debido al ámbito léxico, el identificador `num` dentro de la expresión (`num + 55`) se evalúa como `num` del bloque `if`, y no como la variable `num` con el valor 33 que esta por encima

En esa misma línea, el `num` del bloque `if` ya se ha creado en el ámbito léxico, pero aún no ha alcanzado (y **terminado**) su inicialización (que es parte de la propia declaración): todavía está en la zona muerta temporal.

## 79. scope var, cuál es el resultado del siguiente código

```jsx
function x() {
  y = 1;
  var z = 2;
}

x();

console.log(y);
console.log(z);
```

- 1, 2
- undefined, 2
- 1, undefined
- **ReferenceError**

### Respuesta

Debido a que la declaracion z, esta en el contexto de la función, devuelve un error de referencia 

Las variables declaradas se limitan al contexto de ejecución en el cual son declaradas. Las variables no declaradas siempre son globales.

Nota: 

> En modo estricto `use strict` se lanzaría un error de referenceError, en la linea y, debido a que no acepta una variable no definida
> 

```jsx
'use strict'
function x() {
  y = 1;   // Lanza un error de tipo "ReferenceError" en modo estricto ('use strict')
  var z = 2;
}
x();
```

## 80. Switch, scope let, cuál es el resultado del siguiente código

```jsx
let counter = 1;
switch (counter) {
  case 0:
    let name = 'John';
		console.log(name);
    break;

  case 1:
    let name = 'Will';
		console.log(name);
    break;
}

```

- John
- Will
- undefined
- **SyntaxisError**

### Respuesta

Para evitar este error, puede crear un bloque anidado dentro de una cláusula de caso y crear un nuevo entorno léxico con ámbito de bloque.

```jsx
let counter = 1;
switch (counter) {
  case 0: {
    let name = "John";
    console.log(name);
    break;
  }
  case 1: {
    let name = "Will";
    console.log(name);
    break;
  }
}

// Will
```

## 81. Temporal Dead Zone, cuál es el resultado del siguiente código

```jsx
function somemethod() {
  console.log(counter1);  
  console.log(counter2);  
  var counter1 = 1;
  let counter2 = 2;
}
somemethod();
```

- **undefined, ReferenceError**
- ErrorSyntaxis
- 1, undefined
- undefined, 2

### Respuesta

Esto es debido a que las variables let no son izadas, sin embargo las variables var si son izadas pero como undefined, es decir que la zona muerta temporal es un comportamiento en JavaScript que ocurre cuando se declara una variable con las palabras clave let y const, pero no con var. 

En ECMAScript 6, acceder a una variable let o const antes de su declaración (dentro de su alcance) provoca un error de referencia. El lapso de tiempo cuando eso sucede, entre la creación del enlace de una variable y su declaración, se denomina zona muerta temporal.

## 82. IIFE (**Immediately Invoked Function Expression) cuál es el resultado**

```jsx
(function () {
  var message = "IIFE";
  console.log(message);
})();
console.log(message);
```

- IFFE
- undefined
- null
- **Error: message is not defined**

### Respuesta

IIFE (Expresión de función invocada inmediatamente) es una función de JavaScript que se ejecuta tan pronto como se define. La firma sería la siguiente,

```jsx
(function () {
  // logic here
})();
```

La razón principal para usar un IIFE es obtener privacidad de datos porque el mundo exterior no puede acceder a las variables declaradas dentro del IIFE. es decir, si intenta acceder a las variables con IIFE, arroja un error como el que daba la función: `Error: message is not defined`
