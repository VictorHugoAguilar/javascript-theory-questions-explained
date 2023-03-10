# Diferencia entre forEach() y map()

# ForEach

El método `forEach()` ejecuta la función que se le pasa por parámetro para cada elemento del array. Este método no devuelve nada, por lo tanto, si intentamos guardar su ejecución en una variable lo que ocurrirá es que esa variable tomará el valor de `undefined`.

En el siguiente ejemplo, en cada iteración el valor de item que se le pasa por parámetro a la función, tomará los valores del 1 al 4 y luego se irán imprimiendo por consola.

```jsx
[1, 2, 3, 4].forEach(function (item) {   
     console.log(item); 
});
// Imprimirá por consola
1
2
3
4
```

En este otro ejemplo voy a guardar la ejecución del `forEach()` en una variable y lo que va a ocurrir es que esa variable tomará el valor de undefined, debido a que `forEach()` no devuelve nada.

```jsx
let numbers = [1, 2, 3, 4].forEach(function (item) {   
     console.log(item); 
});
console.log(numbers);
//Devuelve que numbers es undefined
```

## **Creando un forEach()**

Una manera de comprender mejor las funciones propias de Javascript es intentar crear funciones que simulen sus comportamientos. En este caso vamos a crear nuestro propio `forEach()`.

La función que simula el comportamiento de la función `forEach()` la denominaremos `myForEach()`. Esta función acepta dos parámetros, una función y un array de elementos. Utilizamos un bucle for para iterar sobre cada elemento del array y además aplicaremos la función que pasamos por parámetro a cada elemento.

```jsx
function myForEach(f, items){ 
    for(let i = 0;i < items.length;i++){
         f(items[i]);
    }
}
myForEach(function(item) { console.log(item); }, [1,2,3,4]);
// Imprimirá por consola
1
2
3
4
```

Hay que recalcar que aunque nuestra función anterior tuviera un return, no va a devolver ningún valor. Lo veremos en el siguiente ejemplo.

```jsx
var result = myForEach(function (item) {
     console.log(item * 2);
     return item * 2;
}, [1,2,3,4]);
// Imprimirá por consola
2
4
6
8
console.log(result);
// Devolverá que result es undefined
```

# Map

El método `map()` ejecuta la función que se le pasa por parámetro para cada elemento del array. A diferencia del método `forEach()` este método devuelve un nuevo array con los resultados de aplicar la función a cada elemento.

En el siguiente ejemplo, al igual que con el método `forEach`, en cada iteración el valor de item que se pasa por parámetro a la función, tomará los valores del 1 al 4. A cada elemento se le aplicará la función y su nuevo valor se irá acumulando en un nuevo array que se almacenará en la variable result. Es importante utilizar el `return` dentro de la función, porque en caso contrario obtendremos un nuevo array lleno de `undefined`.

```jsx
var result = [1,2,3,4].map(function (item) { return item * 2; });
console.log(result);
// Resultado
[2,4,6,8]
```

## **Creando un map()**

Vamos a crear una función `map()`, al igual que hicimos con el `forEach()`. De esta manera comprenderemos mejor su funcionamiento.

La función que simula el comportamiento de la función `map()` la he denominado `myMap()`. Esta función acepta dos parámetros, una función y un array de elementos. Creamos un array vacío denominado result y luego utilizaremos un bucle for para iterar sobre cada elemento del array denominado items. En cada iteración aplicaremos la función que hemos pasado por parámetro a cada elemento e iremos guardando los valores en result.

```jsx
function myMap(f, items){
    let result = [];
    for (let i = 0;i < items.length;i++){
       result.push(f(items[i]));
    }
    return result;
}
var result = myMap(function(item){ return item * 2; }, [1,2,3,4]);
console.log(result)
// Resultado
[2, 4, 6, 8]
```

# **Conclusión**

La verdad es que es importante entender la diferencia entre el método `forEach` y el `map`, ya que eso te permite saber cuando utilizar uno o cuando utilizar otro. 

El método `forEach()` está pensado para recorrer colecciones, mientras que el método `map()` está pensado para iterar sobre una colección dada, pero con el objetivo de tratar esa colección y devolver una nueva con los elementos modificados a partir de la anterior.

# Referencias

[https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/forEach](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/forEach)

[https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/map](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/map)
