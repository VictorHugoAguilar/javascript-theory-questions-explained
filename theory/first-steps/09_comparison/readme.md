# 💡 Comparaciones

Conocemos muchos operadores de comparación de las matemáticas:

En Javascript se escriben así:

* Mayor/menor que: `a > b`, `a < b`.
* Mayor/menor o igual que: `a >= b`, `a <= b`.
* Igual: `a == b` (ten en cuenta que el doble signo == significa comparación, mientras que un solo símbolo a = b significaría una asignación).
* Distinto. En matemáticas la notación es `≠`, pero en JavaScript se escribe como una asignación con un signo de exclamación delante: `a != b`.

En este artículo, aprenderemos más sobre los diferentes tipos de comparaciones y de cómo las realiza JavaScript, incluidas las peculiaridades importantes.

Al final, encontrará una buena receta para evitar problemas relacionadas con las “peculiaridades” de JavaScript.

## Booleano es el resultado

Como todos los demás operadores, una comparación retorna un valor. En este caso, el valor es un booleano.

* `true` – significa “sí”, “correcto” o “verdad”.
* `false` – significa “no”, “equivocado” o " no verdad".

Por ejemplo:

````js
alert( 2 > 1 ); // true (correcto)
alert( 2 == 1 ); // false (incorrecto)
alert( 2 != 1 ); // true (correcto)
````

El resultado de una comparación puede asignarse a una variable, igual que cualquier valor:

````js
let result = 5 > 4; // asignar el resultado de la comparación
alert( result ); // true
````

## Comparación de cadenas

Para ver si una cadena es “mayor” que otra, JavaScript utiliza el llamado orden “de diccionario” o “lexicográfico”.

En otras palabras, las cadenas se comparan letra por letra.

Por ejemplo:

````js
alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true
alert( 'Bee' > 'Be' ); // true
````

El algoritmo para comparar dos cadenas es simple:

1. Compare el primer carácter de ambas cadenas.
2. Si el primer carácter de la primera cadena es mayor (o menor) que el de la otra cadena, entonces la primera cadena es mayor (o menor) que la segunda. Hemos terminado.
3. De lo contrario, si los primeros caracteres de ambas cadenas son los mismos, compare los segundos caracteres de la misma manera.
4. Repita hasta el final de cada cadena.
5. Si ambas cadenas tienen la misma longitud, entonces son iguales. De lo contrario, la cadena más larga es mayor.

En los ejemplos anteriores, la comparación `'Z' > 'A'` llega a un resultado en el primer paso.

La segunda comparación `"Glow"` y `"Glee"` necesitan más pasos, se comparan carácter por carácter:

1. `G` es igual que `G`.
2. `l` es igual que `l`.
3. `o` es mayor que `e`. Detente aquí. La primera cadena es mayor.

### ℹ️ No es un diccionario real, sino un orden Unicode
El algoritmo de comparación dado arriba es aproximadamente equivalente al utilizado en los diccionarios o guías telefónicas, pero no es exactamente el mismo.

Por ejemplo, las mayúsculas importan. Una letra mayúscula `"A"` no es igual a la minúscula `"a"`. ¿Cuál es mayor? La `"a"` minúscula. ¿Por qué? Porque el carácter en minúsculas tiene un mayor índice en la tabla de codificación interna que utiliza JavaScript (Unicode). Volveremos a los detalles específicos y las consecuencias de esto en el capítulo Strings.

## Comparación de diferentes tipos
Al comparar valores de diferentes tipos, JavaScript convierte los valores a números.

Por ejemplo:

````js
alert( '2' > 1 ); // true, la cadena '2' se convierte en el número 2
alert( '01' == 1 ); // true, la cadena '01' se convierte en el número 1
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

Desde el punto de vista de JavaScript, este resultado es bastante normal. Una comparación de igualdad convierte valores utilizando la conversión numérica (de ahí que "0" se convierta en 0), mientras que la conversión explícita Boolean utiliza otro conjunto de reglas.

## Igualdad estricta
Una comparación regular de igualdad `==` tiene un problema. No puede diferenciar 0 de `falso`:

````js
alert( 0 == false ); // true
````

Lo mismo sucede con una cadena vacía:

````js
alert( '' == false ); // true
````

Esto sucede porque los operandos de diferentes tipos son convertidos a números por el operador de igualdad ==. Una cadena vacía, al igual que false, se convierte en un cero.

¿Qué hacer si queremos diferenciar 0 de false?

**Un operador de igualdad estricto `===` comprueba la igualdad sin conversión de tipo**.

En otras palabras, si a y b son de diferentes tipos, entonces a === b retorna inmediatamente false sin intentar convertirlos.

Intentémoslo:

````js
alert( 0 === false ); // falso, porque los tipos son diferentes
````

Existe también un operador de “diferencia estricta” !== análogo a !=.

El operador de igualdad estricta es un poco más largo de escribir, pero hace obvio lo que está pasando y deja menos espacio a errores.

## Comparación con nulos e indefinidos
Veamos más casos extremos.

Hay un comportamiento no intuitivo cuando se compara `null` o `undefined` con otros valores.

### Para un control de igualdad estricto `===`
Estos valores son diferentes, porque cada uno de ellos es de un tipo diferente.

````js
alert( null === undefined ); // false
````

### Para una comparación no estricta `==`
Hay una regla especial. Estos dos son una " pareja dulce ": son iguales entre sí (en el sentido de ==), pero no a ningún otro valor.

````js
alert( null == undefined ); // true
````

### Para matemáticas y otras comparaciones `< >` `<=` `>=`
`null/undefined` se convierten en números: `null` se convierte en `0`, mientras que `undefined` se convierte en `NaN`.

Ahora veamos algunos hechos graciosos que suceden cuando aplicamos estas reglas. Y, lo que es más importante, cómo no caer en una trampa con ellas.

### Resultado extraño: null vs 0
Comparemos `null` con un cero:

````js
alert( null > 0 ); /// (1) false
alert( null == 0 ); /// (2) false
alert( null >= 0 ); // (3) true
````

Matemáticamente, eso es extraño. El último resultado afirma que "null es mayor o igual a cero", así que en una de las comparaciones anteriores debe ser true, pero ambas son falsas.

La razón es que una comparación de igualdad == y las comparaciones > < >= <= funcionan de manera diferente. Las comparaciones convierten a null en un número, tratándolo como 0. Es por eso que (3) null >= 0 es verdadero y (1) null > 0 es falso.

Por otro lado, el control de igualdad == para undefined y null se define de tal manera que, sin ninguna conversión, son iguales entre sí y no son iguales a nada más. Es por eso que (2) null == 0 es falso.

## Un indefinido incomparable
El valor `undefined` no debe compararse con otros valores:

````js
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
````

¿Por qué le desagrada tanto el cero? ¡Siempre falso!

Obtenemos estos resultados porque:

* Las comparaciones (1) y (2) retornan falso porque no definido se convierte en NaN y NaN es un valor numérico especial que retorna falso para todas las comparaciones.
* La comparación de igualdad (3) retorna falso porque undefined sólo equivale a null y a ningún otro valor.

## Evitar los problemas
¿Por qué repasamos estos ejemplos? ¿Deberíamos recordar estas peculiaridades todo el tiempo? Bueno, en realidad no. De hecho, estas peculiaridades se volverán familiares con el tiempo, pero hay una manera sólida de evadir los problemas con ellas:

* Trata cualquier comparación con `undefined/null` (excepto la igualdad estricta ===) con sumo cuidado.

* No uses comparaciones `>=` `>` `<` `<=` con una variable que puede ser null/undefined, a menos que estés realmente seguro de lo que estás haciendo. Si una variable puede tener estos valores, verifícalos por separado.

## Resumen

* Los operadores de comparación retornan un valor booleano.
* Las cadenas se comparan letra por letra en el orden del “diccionario”.
* Cuando se comparan valores de diferentes tipos, se convierten en números (excepto un control de igualdad estricta).
* Los valores `null` y undefined son iguales `==` entre sí y no equivalen a ningún otro valor.
* Ten cuidado al usar comparaciones como `>` o `<` con variables que ocasionalmente pueden ser `null/undefined`. Revisar por separado si hay `null/undefined` es una buena idea.

# ✅ Tareas

## Revisa comparaciones

¿Cuál será el resultado de las siguientes expresiones?

````js
5 > 4
"apple" > "pineapple"
"2" > "12"
undefined == null
undefined === null
null == "\n0\n"
null === +"\n0\n"
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/09_comparison/solutions/comparaciones.md)

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps)
