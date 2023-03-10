# 馃摉 Comparaciones

Conocemos muchos operadores de comparaci贸n de las matem谩ticas:

En Javascript se escriben as铆:

* Mayor/menor que: `a > b`, `a < b`.
* Mayor/menor o igual que: `a >= b`, `a <= b`.
* Igual: `a == b` (ten en cuenta que el doble signo == significa comparaci贸n, mientras que un solo s铆mbolo a = b significar铆a una asignaci贸n).
* Distinto. En matem谩ticas la notaci贸n es `鈮燻, pero en JavaScript se escribe como una asignaci贸n con un signo de exclamaci贸n delante: `a != b`.

En este art铆culo, aprenderemos m谩s sobre los diferentes tipos de comparaciones y de c贸mo las realiza JavaScript, incluidas las peculiaridades importantes.

Al final, encontrar谩 una buena receta para evitar problemas relacionadas con las 鈥減eculiaridades鈥? de JavaScript.

## Booleano es el resultado

Como todos los dem谩s operadores, una comparaci贸n retorna un valor. En este caso, el valor es un booleano.

* `true` 鈥? significa 鈥渟铆鈥?, 鈥渃orrecto鈥? o 鈥渧erdad鈥?.
* `false` 鈥? significa 鈥渘o鈥?, 鈥渆quivocado鈥? o " no verdad".

Por ejemplo:

````js
alert( 2 > 1 ); // true (correcto)
alert( 2 == 1 ); // false (incorrecto)
alert( 2 != 1 ); // true (correcto)
````

El resultado de una comparaci贸n puede asignarse a una variable, igual que cualquier valor:

````js
let result = 5 > 4; // asignar el resultado de la comparaci贸n
alert( result ); // true
````

## Comparaci贸n de cadenas

Para ver si una cadena es 鈥渕ayor鈥? que otra, JavaScript utiliza el llamado orden 鈥渄e diccionario鈥? o 鈥渓exicogr谩fico鈥?.

En otras palabras, las cadenas se comparan letra por letra.

Por ejemplo:

````js
alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true
alert( 'Bee' > 'Be' ); // true
````

El algoritmo para comparar dos cadenas es simple:

1. Compare el primer car谩cter de ambas cadenas.
2. Si el primer car谩cter de la primera cadena es mayor (o menor) que el de la otra cadena, entonces la primera cadena es mayor (o menor) que la segunda. Hemos terminado.
3. De lo contrario, si los primeros caracteres de ambas cadenas son los mismos, compare los segundos caracteres de la misma manera.
4. Repita hasta el final de cada cadena.
5. Si ambas cadenas tienen la misma longitud, entonces son iguales. De lo contrario, la cadena m谩s larga es mayor.

En los ejemplos anteriores, la comparaci贸n `'Z' > 'A'` llega a un resultado en el primer paso.

La segunda comparaci贸n `"Glow"` y `"Glee"` necesitan m谩s pasos, se comparan car谩cter por car谩cter:

1. `G` es igual que `G`.
2. `l` es igual que `l`.
3. `o` es mayor que `e`. Detente aqu铆. La primera cadena es mayor.

### 鈩癸笍 No es un diccionario real, sino un orden Unicode
El algoritmo de comparaci贸n dado arriba es aproximadamente equivalente al utilizado en los diccionarios o gu铆as telef贸nicas, pero no es exactamente el mismo.

Por ejemplo, las may煤sculas importan. Una letra may煤scula `"A"` no es igual a la min煤scula `"a"`. 驴Cu谩l es mayor? La `"a"` min煤scula. 驴Por qu茅? Porque el car谩cter en min煤sculas tiene un mayor 铆ndice en la tabla de codificaci贸n interna que utiliza JavaScript (Unicode). Volveremos a los detalles espec铆ficos y las consecuencias de esto en el cap铆tulo Strings.

## Comparaci贸n de diferentes tipos
Al comparar valores de diferentes tipos, JavaScript convierte los valores a n煤meros.

Por ejemplo:

````js
alert( '2' > 1 ); // true, la cadena '2' se convierte en el n煤mero 2
alert( '01' == 1 ); // true, la cadena '01' se convierte en el n煤mero 1
````
Para valores booleanos, true se convierte en 1 y false en 0.

Por ejemplo:

````js
alert( true == 1 ); // true
alert( false == 0 ); // true
````

Una consecuencia graciosa
Es posible que al mismo tiempo:

Dos valores sean iguales.
Uno de ellos sea true como booleano y el otro sea false como booleano.
Por ejemplo:

````js
let a = 0;
alert( Boolean(a) ); // false

let b = "0";
alert( Boolean(b) ); // true

alert( a == b ); // true!
````

Desde el punto de vista de JavaScript, este resultado es bastante normal. Una comparaci贸n de igualdad convierte valores utilizando la conversi贸n num茅rica (de ah铆 que "0" se convierta en 0), mientras que la conversi贸n expl铆cita Boolean utiliza otro conjunto de reglas.

## Igualdad estricta
Una comparaci贸n regular de igualdad `==` tiene un problema. No puede diferenciar 0 de `falso`:

````js
alert( 0 == false ); // true
````

Lo mismo sucede con una cadena vac铆a:

````js
alert( '' == false ); // true
````

Esto sucede porque los operandos de diferentes tipos son convertidos a n煤meros por el operador de igualdad ==. Una cadena vac铆a, al igual que false, se convierte en un cero.

驴Qu茅 hacer si queremos diferenciar 0 de false?

**Un operador de igualdad estricto `===` comprueba la igualdad sin conversi贸n de tipo**.

En otras palabras, si a y b son de diferentes tipos, entonces a === b retorna inmediatamente false sin intentar convertirlos.

Intent茅moslo:

````js
alert( 0 === false ); // falso, porque los tipos son diferentes
````

Existe tambi茅n un operador de 鈥渄iferencia estricta鈥? !== an谩logo a !=.

El operador de igualdad estricta es un poco m谩s largo de escribir, pero hace obvio lo que est谩 pasando y deja menos espacio a errores.

## Comparaci贸n con nulos e indefinidos
Veamos m谩s casos extremos.

Hay un comportamiento no intuitivo cuando se compara `null` o `undefined` con otros valores.

### Para un control de igualdad estricto `===`
Estos valores son diferentes, porque cada uno de ellos es de un tipo diferente.

````js
alert( null === undefined ); // false
````

### Para una comparaci贸n no estricta `==`
Hay una regla especial. Estos dos son una " pareja dulce ": son iguales entre s铆 (en el sentido de ==), pero no a ning煤n otro valor.

````js
alert( null == undefined ); // true
````

### Para matem谩ticas y otras comparaciones `< >` `<=` `>=`
`null/undefined` se convierten en n煤meros: `null` se convierte en `0`, mientras que `undefined` se convierte en `NaN`.

Ahora veamos algunos hechos graciosos que suceden cuando aplicamos estas reglas. Y, lo que es m谩s importante, c贸mo no caer en una trampa con ellas.

### Resultado extra帽o: null vs 0
Comparemos `null` con un cero:

````js
alert( null > 0 ); /// (1) false
alert( null == 0 ); /// (2) false
alert( null >= 0 ); // (3) true
````

Matem谩ticamente, eso es extra帽o. El 煤ltimo resultado afirma que "null es mayor o igual a cero", as铆 que en una de las comparaciones anteriores debe ser true, pero ambas son falsas.

La raz贸n es que una comparaci贸n de igualdad == y las comparaciones > < >= <= funcionan de manera diferente. Las comparaciones convierten a null en un n煤mero, trat谩ndolo como 0. Es por eso que (3) null >= 0 es verdadero y (1) null > 0 es falso.

Por otro lado, el control de igualdad == para undefined y null se define de tal manera que, sin ninguna conversi贸n, son iguales entre s铆 y no son iguales a nada m谩s. Es por eso que (2) null == 0 es falso.

## Un indefinido incomparable
El valor `undefined` no debe compararse con otros valores:

````js
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
````

驴Por qu茅 le desagrada tanto el cero? 隆Siempre falso!

Obtenemos estos resultados porque:

* Las comparaciones (1) y (2) retornan falso porque no definido se convierte en NaN y NaN es un valor num茅rico especial que retorna falso para todas las comparaciones.
* La comparaci贸n de igualdad (3) retorna falso porque undefined s贸lo equivale a null y a ning煤n otro valor.

## Evitar los problemas
驴Por qu茅 repasamos estos ejemplos? 驴Deber铆amos recordar estas peculiaridades todo el tiempo? Bueno, en realidad no. De hecho, estas peculiaridades se volver谩n familiares con el tiempo, pero hay una manera s贸lida de evadir los problemas con ellas:

* Trata cualquier comparaci贸n con `undefined/null` (excepto la igualdad estricta ===) con sumo cuidado.

* No uses comparaciones `>=` `>` `<` `<=` con una variable que puede ser null/undefined, a menos que est茅s realmente seguro de lo que est谩s haciendo. Si una variable puede tener estos valores, verif铆calos por separado.

## Resumen

* Los operadores de comparaci贸n retornan un valor booleano.
* Las cadenas se comparan letra por letra en el orden del 鈥渄iccionario鈥?.
* Cuando se comparan valores de diferentes tipos, se convierten en n煤meros (excepto un control de igualdad estricta).
* Los valores `null` y undefined son iguales `==` entre s铆 y no equivalen a ning煤n otro valor.
* Ten cuidado al usar comparaciones como `>` o `<` con variables que ocasionalmente pueden ser `null/undefined`. Revisar por separado si hay `null/undefined` es una buena idea.

# 鉁? Tareas

## Revisa comparaciones

驴Cu谩l ser谩 el resultado de las siguientes expresiones?

````js
5 > 4
"apple" > "pineapple"
"2" > "12"
undefined == null
undefined === null
null == "\n0\n"
null === +"\n0\n"
````

[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/09_comparison/solutions/comparaciones.md)

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/readme.md)
