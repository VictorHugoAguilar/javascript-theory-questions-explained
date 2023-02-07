
# Javascript Interview Question Explained

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
- **4: {model: "Honda", color: "white", year: "2010", country: "UK"}**  <--

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
- **3: 1, undefined and number** <--
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
- **4: A, C and B** <--

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

- **1: false** <--
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
- **4: 1undefined** <--

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
- **3: Undefined** <--
- 4: SyntaxError

### Respuesta

Este es un problema de punto y coma. Normalmente, los puntos y comas son opcionales en JavaScript. Por lo tanto, si falta algún punto y coma (en este caso, retorno), se inserta automáticamente de inmediato. Por lo tanto, la función devolvió como indefinida.

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
- **3: [empty, 'b', 'c', 'd'], undefined, 4** <--
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
- **2: [empty × 3], [empty × 2, 100], [empty × 3]** <--
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

- **1: 0, 1, 2** <--
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
- **2: true, false** <--
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
- **4: 1, 2, 1** <--

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
- **3: SyntaxError: Duplicate parameter name not allowed in this context** <--
- 4: 1, 2, 1

### Respuesta

A diferencia de las funciones regulares, las funciones de flecha no permiten parámetros duplicados en modo estricto o no estricto. Entonces puede ver **SyntaxError** en la consola.

## 13. Arrow Function, que resultado da el siguiente código

```jsx
const arrowFunc = () => arguments.length;
console.log(arrowFunc(1, 2, 3));
```

- **1: ReferenceError: arguments is not defined** <--
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
- **2: False, True** <--

### Respuesta

Para mantener la coherencia con funciones como String.prototype.padStart, el nombre del método estándar para recortar los espacios en blanco se considera trimStart. Debido a razones de compatibilidad web, el antiguo nombre del método 'trimLeft' todavía actúa como un alias para 'trimStart'. Por lo tanto, el prototipo de 'trimLeft' siempre es 'trimStart’

## 15. Math, métodos, que resultado da el siguiente código

```jsx
console.log(Math.max());
```

- 1: undefined
- 2: Infinity
- 3: 0
- **4: -Infinity** <--

### Respuesta

- Infinity es el comparador inicial porque casi todos los demás valores son mayores. Entonces, cuando no se proporcionan argumentos, se devolverá -Infinity. **Nota**: El número cero de argumentos es un caso válido.

## 16. Array, comparaciones que resultado da el siguiente código

```jsx
console.log(10 == [10]);
console.log(10 == [[[[[[[10]]]]]]]);
```

- **1: True, True** <--
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
- **2: 1010, 0** <--
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

- **1: True, I'm True** <--
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
- **4: 1,23,4** <--

### Respuesta

El operador + no está destinado ni definido para matrices. Entonces convierte matrices en cadenas y las concatena.

## 20. Set, que resultado da el siguiente código

```jsx
const numbers = new Set([1, 1, 2, 3, 4]);
console.log(numbers);

const browser = new Set("Firefox");
console.log(browser);
```

- **1: {1, 2, 3, 4}, {"F", "i", "r", "e", "f", "o", "x"}** <--
- 2: {1, 2, 3, 4}, {"F", "i", "r", "e", "o", "x"}
- 3: [1, 2, 3, 4], ["F", "i", "r", "e", "o", "x"]
- 4: {1, 1, 2, 3, 4}, {"F", "i", "r", "e", "f", "o", "x"}

### Respuesta

Dado que el objeto Set es una colección de valores únicos, no permitirá valores duplicados en la colección. Al mismo tiempo, es una estructura de datos que distingue entre mayúsculas y minúsculas.

## 21. Comparadores, NaN que resultado da el siguiente código

```jsx
console.log(NaN === NaN);
```

- 1: True
- **2: False** <--

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
- **3: SyntaxError** <--
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

- **1: Promise {<fulfilled>: 10}** <--
- 2: 10
- 3: SyntaxError
- 4: Promise {<rejected>: 10}

### Respuesta

Las funciones asíncronas siempre devuelven una promesa. Pero incluso si el valor de retorno de una función asíncrona no es explícitamente una promesa, estará implícitamente envuelto en una promesa. La función asíncrona anterior es equivalente a la siguiente expresión,

```jsx
function func() {
  return Promise.resolve(10);
}
```

## 25. Funciones async, cúal es el resultado del siguiente código

```jsx
async function func() {
  await 10;
}
console.log(func());
```

- 1: Promise {<fulfilled>: 10}
- 2: 10
- 3: SyntaxError
- **4: Promise {<resolved>: undefined}** <--

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

- **1: SyntaxError** <--
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
- **4: Process completed! and 1 2 3 5** <--

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

- **1: Set(4) {"+0", "-0", NaN, undefined}** <--
- 2: Set(3) {"+0", NaN, undefined}
- 3: Set(5) {"+0", "-0", NaN, undefined, NaN}
- 4: Set(4) {"+0", NaN, undefined, NaN}

### Respuesta

El conjunto tiene pocas excepciones de verificación de igualdad,

- Todos los valores de NaN son iguales
- Tanto +0 como -0 se consideran valores diferentes
