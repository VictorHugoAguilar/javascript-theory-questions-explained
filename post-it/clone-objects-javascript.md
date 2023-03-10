Ya que los objetos en javascript son valores por referencia, no pueden copiarse simplemente con el =. Aqui os dejo diferentes maneras de hacerlo.

```javascript
let profesiones = { medico: '🚑', policia: '🚓', bombero: '🚒' }

// "Spread operator"
let clone_one = { ...profesiones }
console.log(clone_one) 
// clone_one { medico: '🚑', policia: '🚓', bombero: '🚒' }

// "Object.assign
let clone_two = Object.assign({}, profesiones)
console.log(clone_two) 
// clone_two { medico: '🚑', policia: '🚓', bombero: '🚒' }

// "JSON"
let clone_three = JSON.parse(JSON.stringify(profesiones))
console.log(clone_three) 
// clone_three { medico: '🚑', policia: '🚓', bombero: '🚒' }
```

## Los objetos son tipo referencia

Si utilizamos el operador de asignación pasa lo siguiente

```javascript
const obj = { one: 1, two: 2 }

const obj2 = obj

console.log(
  obj, // {one: 1, two: 2}
  obj2, // {one: 1, two: 2}
);
```

En principio es todo correcto, el problema viene cuando editamos por ejemplo el segundo objeto

```javascript
const obj2.three = 3;

console.log(obj2);
// {one: 1, two: 2, three: 3} <- ✅

console.log(obj);
// {one: 1, two: 2, three: 3} <- 😱
```

Al ser objetos que van por tipo de referencia, cuando asignas '=' también copias el puntero al espacio de memoria que ocupa. Los tipos de referencia no contienen valores, son un puntero al valor en la memoria.

## Spread Operator

El uso del spread operator clonará el objecto, pero es una copia superficial del mismo.

```javascript
let profesiones = { medico: '🚑', policia: '🚓', bombero: '🚒' }

let clone_spread = { ...profesiones }

console.log(clone_spread)
// clone_spread { medico: '🚑', policia: '🚓', bombero: '🚒' }

```

## Usando Object.assign

Esta opción tambien creará una copia superficial del objeto.

```javascript
let profesiones = { medico: '🚑', policia: '🚓', bombero: '🚒' }

let object_assign = Object.assign({}, profesiones)

console.log(object_assign)
// object_assign { medico: '🚑', policia: '🚓', bombero: '🚒' }
```

Tener en cuenta el primer argumento {}, esto asegurará que no mute el objeto original

## Usando JSON

Está manera si que dará una copia profunda. Aunque es una manera sucia de hacerlo, pero rápida.

```javascript
let profesiones = { medico: '🚑', policia: '🚓', bombero: '🚒' }

let clone_json = JSON.parse(JSON.stringify( profesiones))

console.log(clone_json)
// clone_json { medico: '🚑', policia: '🚓', bombero: '🚒' }
```

## Utilizando librerias externa loadash

DeepClone funciona con todos los tipos, funciones y símbolos, se copian por referencia

```javascript
const lodashClonedeep = require('lodash.clonedeep')

let profesiones = { medico: '🚑', policia: '🚓', bombero: '🚒' }

let clone_lodash = lodashClonedeep(profesiones);

console.log(clone_lodash)
// clone_lodash { medico: '🚑', policia: '🚓', bombero: '🚒' }
```

Ahora está libreria tiene una ventaja que también clona todos los tipos, funciones y símbolos se copian por referencia.

```javascript
const lodashClonedeep = require('lodash.clonedeep')

const arrOfFunction = [
  () => 2, 
  {
    test: () => 3,
  },
  Symbol('4'),
];

// deepClone copy by refence function and Symbol
console.log(lodashClonedeep(arrOfFunction))
// [ [Function (anonymous)], { test: [Function: test] }, Symbol(4) ]

// JSON replace function with null and function in object with undefined
console.log(JSON.parse(JSON.stringify(arrOfFunction)))
// [ null, {}, null ]

// function and symbol are copied by reference in deepClone
console.log(
  lodashClonedeep(arrOfFunction)[0] === lodashClonedeep(arrOfFunction)[0],
)
// true

console.log(
  lodashClonedeep(arrOfFunction)[2] === lodashClonedeep(arrOfFunction)[2],
)
// true
```

El método JSON tiene problemas con las dependencias circulares. Además, el orden de las propiedades en el objeto clonado puede ser diferente.

##  Cuando utilizar una clone superficial o profundo

Si utilizamos el spread operator, para copuar un objeto, solo se copia superficialmente, si la matriz está anidada o es multidimensional, no funcionará correctamente

```javascript
const nestedObject = {
    name: 'batman',
    country: {
      city: 'gotam'
    }
}
```

A. Copia Superficial

Clonamos el objeto y lo modificamos

```javascript
const shallowClone = { ... nestedObject }

// modificamos los valores.
shallowClone.name = 'superman'
shallowClone.country.city = 'metropolis'

console.log(shallowClone);
// {name: 'superman', {city: 'metropolis'}}

console.log(nestedObject);
// {name: 'batman', {city: 'metropolis'}} <- 😱
```

Una copia superficial significa que se copia el primer nivel, se hace referencia a los niveles más profundos.
En temas de perfomance decir que Object.assign es mucho más rápido que JSON.

B. Copia Profunda

Tomemos el mismo ejemplo pero aplicando una copia profunda usando JSON

```javascript
const deepClone = JSON.parse(JSON.stringify(nestedObject));

console.log(deepClone);
// {name: 'superman', {city: 'metropolis'}}

console.log(nestedObject);
// {name: 'batman', {city: 'gotam'}}

```

Como puede ver, la copia profunda es una copia fiel de los objetos anidados. A menudo, la copia superficial es lo suficientemente buena, realmente no necesita una copia profunda.
