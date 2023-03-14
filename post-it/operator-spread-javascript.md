# Operador spread (de propagación) en Javascript ES6

---

## Introducción

**Qué es el operador de propagación en ES6, la nueva versión de Javascript, conocido también como spread operator.**

En este artículo vamos a conocer un nuevo operador de Javascript, que nos oferce la versión de ECMAScript 2016, ES6, ya disponible en todos los navegadores modernos. Se trata del "spread operator" u operador de propagación, que nos puede ayudar a ahorrar unas cuantas líneas de código en muchas ocasiones, así como crear un código más consistente.

Para los que conocieron el operador rest, en el pasado artículo del manual de Javascript ES, cabe decir que es más o menos la operación contraria. Mientras que el operador rest genera un array a partir de una lista de valores, el operador spread genera una lista de valores a partir de un array.

Además, estos operadores tienen en común entre sí el utilizar exactamente la misma sintaxis de los tres puntos seguidos. Entonces, si el Rest operator es "..." y es exactamente el mismo código que usamos para el spread operator "..." ¿Cómo lo distinguimos? La diferencia está en que el rest operator lo usas en la cabecera de una función, al implementarla y el spread operator lo usas en la invocación. Lo veremos mejor con un ejemplo.

## Spread operator en funcionamiento

Para nuestro ejemplo vamos a hacer uso de la función min() de la clase Math de Javascript. Por si no lo sabes, esta función espera recibir cualquier número de parámetros numéricos y devuelve el que tenga el valor menor.

Por ejemplo, podemos invocarla así.

```jsx
Math.min(2, 5, 7, 1, 9);
```

Esto nos devolverá el valor 1, que es el mínimo de los parámetros enviados.

Para hacer uso del spread operator necesitamos partir de un array y conseguiremos convertir ese array en una lista de parámetros, de la siguiente manera.

```jsx
let miArray = [2, 5, 7, 1, 9];
let minimo =Math.min(...miArray);
```

Como puedes ver, el operador de propagación se idéntico al operador rest. Lo único que aquí lo estamos usando en la invocación de una función.

## Uso del operador rest en combinación con el operador spread

Estos dos operadores muchas veces los encontramos de la mano, usados en el mismo ejemplo.

Por ejemplo, pongamos una función que recibe cualquier número de cadenas por parámetro y nos devuelve un array con esas mismas cadenas, pero eliminados los espacios en blanco antes y después de la cadena.

Comencemos por refrescar la memoria, viendo la aplicabilidad del operador Rest en este ejemplo.

```jsx
function limpiarEspacios(...cadenas) {
  for (let i=0; i<cadenas.length; i++) {
    cadenas[i] = cadenas[i].trim();
  }
  return cadenas;
}
```

En este caso hemos usado el operador "..." en la invocación de una función, luego lo que quiere decir es que una lista de parámetros la convertirá en un array.

Podemos ver el ejemplo en marcha con este código.

```jsx
let cadenasLimpias = limpiarEspacios('hola ', ' algo ', ' más');
console.log(cadenasLimpias);
```

Ejecutando ese código observarás que "cadenasLimpias" es un array de cadenas, eliminadas los espacios.

Pero ¿Qué pasa si las cadenas que queremos limpiar están en un array?

```jsx
const cadenasOriginales = ['hola ', ' algo ', ' más'];
let cadenasLimpias = limpiarEspacios(cadenasOriginales);
```

Esto te arrojaría un error, pues dentro de la función se intentará hacer trim() sobre un array y Javascript te diría que "cadenas[i].trim is not a function".

Bien, aquí es donde el operador spread sale al rescate, permitiendo convertir tal array en una lista de parámetros para usar en la invocación de la función.

```jsx
const cadenasOriginales = ['hola ', ' algo ', ' más'];
let cadenasLimpias = limpiarEspacios(...cadenasOriginales);
```

En este caso todo irá bien, ya que el array se convertirá en una lista de parámetros, justo lo que necesita la función limpiarEspacios().

Nuevamente queremos insistir en que el operador es exactamente el mismo, es decir, usa la misma sintaxis. Solo que su función será diferente si la usas en la definición de una función o en su invocación. Al definir una función se llama "rest operator" y al invocarla se llama "spread operator".

## Otros usos de spread operator

El operador de propagación también se puede usar al definir literales de array en base a otros arrays. Por ejemplo, mira el código siguiente.

```jsx
let misConocimientos = ['variables', 'operadores', 'estructuras de control', 'funciones'];
let aprendido = ['rest operator', 'spread operator'];
let misConocimientosAmpliados = [...misConocimientos, ...aprendido, 'otra cosa más'];
```

Para la creación del array "misConocimientosAmpliados, definido como un literal, estamos usando dos veces el operador de propagación. Una para incorporar todos los valores de "misConocimientos", como una lista, y otra para incorporar como otra lista de valores el array "aprendido".

## Conclusión

Esperamos que estas explicaciones sobre el operador spread, también llamado operador de propagación, te sirvan para incorporar nuevas alternativas y mejoras en tu código Javascript. Son muy útiles ya que nos permiten realizar de una manera muy cómoda cosas que antes de ES6 debeíamos hacer usando más líneas de código.

Aunque comparta sintaxis con el operador rest de ES6, esperamos que no te lies al usarlo y puedas distinguir qué hace cada cual. Rest sirve para convertir una lista en un array y spread para hacer el paso contrario, a partir de un array generar una lista.

## **Spread Operator en Arrays**

Tal como se comentó en el post “Clonando Objetos en JavaScript (I)” cuando asignamos un objeto o un array a una variable no se crea una copia si no que se guarda una referencia hacia a la original, por tanto, cualquier modificación en la variable asignada también afectará al objeto u array original. Una forma sencilla y rápida de evitar esto es utilizar el operador de propagación o Spread Operator de ES6 (Figura 1).

```jsx
const cars = ['Ford', 'Seat', 'Renault'];
const copyOfCars = [ ...cars];
copyOfCars[2] = 'Opel';
// cars = ['Ford', 'Seat', 'Renault'];
// copyOfCars = ['Ford','Seat','Opel'];
```

*¡ Pero cuidado!* Si alguna de las propiedades del objeto original es un array u otro objeto no se clonaría, por lo que spread operator solo no nos serviría para hacer una copia profunda del objeto original (sólo para objetos planos).

Spread Operator también nos da la posibilidad de concatenar arrays o añadir valores a un array dado (Figura 2).

```jsx
const numbers = [1,2,3];
const newNumber = [...numbers, 4, 5];
console.log(newNumber); // [1,2,3,4,5]

const letter = ['a','b','c'];
const word = ['cat', 'dog', 'horse'];
const letterAndWords = [ ...letter, ...word];
console.log(letterAndWords);
// ['a','b','c', 'cat', 'dog', 'horse']
```

Además el spread operator también nos puede ser útil para pasar todos los valores de un array como argumentos de una función dada (Figura 3).

```jsx
function makeWords(...sounds) {
	console.log(sounds);
}

const vowels = ['a','e','i','o','u'];
makeWords(vowels); //sounds = ['a','e','i','o','u']
```

## **Spread Operator en Objetos**

Del mismo modo que con los arrays podemos usar spread operator para el clonado de objetos, de forma que si modificamos una propiedad en el objeto *deportivo*, el objeto original *coche* permanecerá inalterable.

```jsx
const coche = {
	marca: 'seat',
	modelo: 'leon',
	puertas: 5
}
const deportivo = { ...coche, puertas: 3 }
console.log(deportivo); // { marca: 'seat', modelo: 'leon', puertas: 3 }
```

De la misma forma podemos concatenar o fusionar objetos (Figura 5).

```jsx
const coche = {
	marca: 'seat',
	modelo: 'leon',
	puertas: 5
}
const motor = {
	cilindros: 4,
	caballos: 120
}
const propCoche = { ...coche, ...motor}
console.log(propCoche); 
// { marca: 'seat', modelo: 'leon', puertas: 5, cilindros: 4, caballos: 120 }
```

