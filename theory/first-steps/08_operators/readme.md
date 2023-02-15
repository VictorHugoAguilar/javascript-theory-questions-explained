# 📖 Operadores básicos, matemáticas

Conocemos varios operadores matemáticos porque nos los enseñaron en la escuela. Son cosas como la suma `+`, multiplicación `*`, resta `-`, etcétera.

## Términos: “unario”, “binario”, “operando”
Antes de continuar, comprendamos la terminología común.

* *Un operando* – es a lo que se aplican los operadores. Por ejemplo, en la multiplicación de `5 * 2` hay dos operandos: el operando izquierdo es `5` y el operando derecho es `2`. A veces, la gente los llama “argumentos” en lugar de “operandos”.

* Un *operador es unario* si tiene un solo operando. Por ejemplo, la negación unaria `-` invierte el signo de un número:

````js
let x = 1;

x = -x;
alert( x ); // -1, se aplicó negación unaria
````

* Un operador es binario si tiene dos operandos. El mismo negativo también existe en forma binaria:

````js
let x = 1, y = 3;
alert( y - x ); // 2, binario negativo resta valores
````

Formalmente, estamos hablando de dos operadores distintos: la negación unaria (un operando: revierte el símbolo) y la resta binaria (dos operandos: resta).

## Matemáticas
Están soportadas las siguientes operaciones:

* Suma `+`,
* Resta `-`,
* Multiplicación `*`,
* División `/`,
* Resto `%`,
* Exponenciación `**`.

Los primeros cuatro son conocidos mientras que `%` y `**` deben ser explicados más ampliamente.

## Resto %

El operador resto `%`, a pesar de su apariencia, no está relacionado con porcentajes.

El resultado de a `% b` es el resto de la división entera de a por b.

Por ejemplo:

````js
alert( 5 % 2 ); // 1, es el resto de 5 dividido por 2
alert( 8 % 3 ); // 2, es el resto de 8 dividido por 3
alert( 8 % 4 ); // 0, es el resto de 8 dividido por 4
````

## Exponenciación **

El operador exponenciación `a ** b` eleva `a` a la potencia de `b`.

En matemáticas de la escuela, lo escribimos como ab.

Por ejemplo:

````js
alert( 2 ** 2 ); // 2² = 4
alert( 2 ** 3 ); // 2³ = 8
alert( 2 ** 4 ); // 2⁴ = 16
````

Matemáticamente, la exponenciación está definida para operadores no enteros también.

Por ejemplo, la raíz cuadrada es el exponente ½:

````js
alert( 4 ** (1/2) ); // 2 (potencia de 1/2 es lo mismo que raíz cuadrada)
alert( 8 ** (1/3) ); // 2 (potencia de 1/3 es lo mismo que raíz cúbica)
````

## Concatenación de cadenas con el binario +

Ahora veamos las características de los operadores de JavaScript que van más allá de la aritmética escolar.

Normalmente el operador + suma números.

Pero si se aplica el + binario a una cadena, los une (concatena):

````js
let s = "my" + "string";
alert(s); // mystring
````

Tenga presente que si uno de los operandos es una cadena, el otro es convertido a una cadena también.

Por ejemplo:

````js
alert( '1' + 2 ); // "12"
alert( 2 + '1' ); // "21"
````

Vieron, no importa si el primer operando es una cadena o el segundo.

Aquí hay un ejemplo algo más complejo:

````js
alert(2 + 2 + '1' ); // "41" y no "221"
````

Aquí, los operadores trabajan uno después de otro. El primer + suma dos números entonces devuelve 4, luego el siguiente + le agrega la cadena 1, así que se evalúa como 4 + '1' = 41.

````js
alert('1' + 2 + 2); // "122", no es "14"
````

Aquí el primer operando es una cadena, el compilador trata los otros dos operandos como cadenas también. El 2 es concatenado a '1', entonces es como '1' + 2 = "12" y "12" + 2 = "122".

El binario + es el único operador que soporta cadenas en esa forma. Otros operadores matemáticos trabajan solamente con números y siempre convierten sus operandos a números.

Por ejemplo, resta y división:

````js
alert( 2 - '1' ); // 1
alert( '6' / '2' ); // 3
````

## Conversión numérica, unario +

La suma `+` existe en dos formas: la forma binaria que utilizamos arriba y la forma unaria.

El unario suma o, en otras palabras, el operador suma + aplicado a un solo valor, no hace nada a los números. Pero si el operando no es un número, el unario suma lo convierte en un número.

Por ejemplo:

````js
// Sin efecto en números
let x = 1;
alert( +x ); // 1

let y = -2;
alert( +y ); // -2

// Convierte los no números
alert( +true ); // 1
alert( +"" );   // 0
````

Realmente hace lo mismo que `Number(...)`, pero es más corto.

La necesidad de convertir cadenas en números surge con mucha frecuencia. Por ejemplo, si estamos obteniendo valores de campos de formulario HTML, generalmente son cadenas.

El operador binario suma los agregaría como cadenas:

````js
let apples = "2";
let oranges = "3";

alert( apples + oranges ); // "23", el binario suma concatena las cadenas
````

Si queremos tratarlos como números, necesitamos convertirlos y luego sumarlos:

````js
let apples = "2";
let oranges = "3";

// ambos valores convertidos a números antes del operador binario suma
alert( +apples + +oranges ); // 5

// la variante más larga
// alert( Number(apples) + Number(oranges) ); // 5
````

Desde el punto de vista de un matemático, la abundancia de signos más puede parecer extraña. Pero desde el punto de vista de un programador no hay nada especial: primero se aplican los signos más unarios que convierten las cadenas en números, y luego el signo más binario los suma.

¿Por qué se aplican los signos más unarios a los valores antes que los binarios? Como veremos, eso se debe a su mayor precedencia.

## Precedencia del operador

Si una expresión tiene más de un operador, el orden de ejecución se define por su precedencia o, en otras palabras, el orden de prioridad predeterminado de los operadores.

Desde la escuela, todos sabemos que la multiplicación en la expresión 1 + 2 * 2 debe calcularse antes de la suma. Eso es exactamente la precedencia. Se dice que la multiplicación tiene una mayor precedencia que la suma.

Los paréntesis anulan cualquier precedencia, por lo que si no estamos satisfechos con el orden predeterminado, podemos usarlos para cambiarlo. Por ejemplo, escriba (1 + 2) * 2.

Hay muchos operadores en JavaScript. Cada operador tiene un número de precedencia correspondiente. El que tiene el número más grande se ejecuta primero. Si la precedencia es la misma, el orden de ejecución es de izquierda a derecha.

Aquí hay un extracto de la tabla de precedencia (no necesita recordar esto, pero tenga en cuenta que los operadores unarios son más altos que el operador binario correspondiente):


| Precedencia  |  Nombre          | Signo |
|--------------|------------------|-------|
| 14           |  suma unaria     | +     |
| 14           |	negación unaria | -     |
| 13           |  exponenciación  |	**    |
| 12           |	multiplicación  |	*     |
| 12           |  división	      | /     |
| 11	         |  suma	          | +     |
| 11	         |  resta	          | -     |
| …	           |  …	              | …     |
| 2	           |  asignación	    | =     |


Como podemos ver, la “suma unaria” tiene una prioridad de 14, que es mayor que el 11 de “suma” (suma binaria). Es por eso que, en la expresión "+apples + +oranges", las sumas unarias se hacen antes de la adición.

## Asignación

Tengamos en cuenta que una asignación = también es un operador. Está listado en la tabla de precedencia con la prioridad muy baja de 2.

Es por eso que, cuando asignamos una variable, como x = 2 * 2 + 1, los cálculos se realizan primero y luego se evalúa el =, almacenando el resultado en x.

````js
let x = 2 * 2 + 1;

alert( x ); // 5
````

## Asignación = devuelve un valor
El hecho de que = sea un operador, no una construcción “mágica” del lenguaje, tiene un implicación interesante.

Todos los operadores en JavaScript devuelven un valor. Esto es obvio para + y -, pero también es cierto para =.

La llamada x = value escribe el value en x y luego lo devuelve.

Aquí hay una demostración que usa una asignación como parte de una expresión más compleja:

````js
let a = 1;
let b = 2;

let c = 3 - (a = b + 1);

alert( a ); // 3
alert( c ); // 0
````

En el ejemplo anterior, el resultado de la expresión (a = b + 1) es el valor asignado a a (es decir, 3). Luego se usa para evaluaciones adicionales.

Código gracioso, ¿no? Deberíamos entender cómo funciona, porque a veces lo vemos en las bibliotecas de JavaScript.

Pero no deberíamos escribir algo así. Tales trucos definitivamente no hacen que el código sea más claro o legible.

## Asignaciones encadenadas
Otra característica interesante es la habilidad para encadenar asignaciones:

````js
let a, b, c;

a = b = c = 2 + 2;

alert( a ); // 4
alert( b ); // 4
alert( c ); // 4
````

Las asignaciones encadenadas evalúan de derecha a izquierda. Primero, se evalúa la expresión más a la derecha 2 + 2 y luego se asigna a las variables de la izquierda: c, b y a. Al final, todas las variables comparten un solo valor.

Una vez más, con el propósito de la legibilidad es mejor separa tal código en unas pocas líneas:

````js
c = 2 + 2;
b = c;
a = c;
````

Es más fácil de leer, especialmente cuando se hace de un vistazo.

## Modificar en el lugar

A menudo necesitamos aplicar un operador a una variable y guardar el nuevo resultado en esa misma variable.

Por ejemplo:

````js
let n = 2;
n = n + 5;
n = n * 2;
````

Esta notación puede ser acortada utilizando los operadores += y *=:

````js
let n = 2;
n += 5; // ahora n = 7  (es lo mismo que n = n + 5)
n *= 2; // ahora n = 14 (es lo mismo que n = n * 2)

alert( n ); // 14
````

Los operadores cortos “modifica y asigna” existen para todos los operadores aritméticos y de nivel bit: /=, -=, etcétera.

Tales operadores tienen la misma precedencia que la asignación normal, por lo tanto se ejecutan después de otros cálculos:

````js
let n = 2;

n *= 3 + 5; // el lado derecho es evaluado primero, es lo mismo que n *= 8

alert( n ); // 16
````

## Incremento/decremento

Aumentar o disminuir un número en uno es una de las operaciones numéricas más comunes.

Entonces, hay operadores especiales para ello:

* **Incremento** ++ incrementa una variable por 1:

````js
let counter = 2;
counter++;      // funciona igual que counter = counter + 1, pero es más corto
alert( counter ); // 3
````

* **Decremento** -- decrementa una variable por 1:

````js
let counter = 2;
counter--;      // funciona igual que counter = counter - 1, pero es más corto
alert( counter ); // 1
````

### ⚠️ Importante:
Incremento/decremento sólo puede ser aplicado a variables. Intentar utilizarlo en un valor como 5++ dará un error.

Los operadores ++ y -- pueden ser colocados antes o después de una variable.

* Cuando el operador va después de la variable, está en “forma de sufijo”: counter++.
* La “forma de prefijo” es cuando el operador va antes de la variable: ++counter.

Ambas sentencias hacen la misma cosa: aumentar counter por 1.

¿Existe alguna diferencia? Sí, pero solamente la podemos ver si utilizamos el valor devuelto de ++/--.

Aclaremos. Tal como conocemos, todos los operadores devuelven un valor. Incremento/decremento no es una excepción. La forma prefijo devuelve el nuevo valor mientras que la forma sufijo devuelve el valor anterior (antes del incremento/decremento).

Para ver la diferencia, aquí hay un ejemplo:

````js
let counter = 1;
let a = ++counter; // (*)

alert(a); // 2
````

En la línea (*), la forma prefijo ++counter incrementa counter y devuelve el nuevo valor, 2. Por lo tanto, el alert muestra 2.

Ahora usemos la forma sufijo:

````js
let counter = 1;
let a = counter++; // (*) cambiado ++counter a counter++

alert(a); // 1
````

En la línea (*), la forma sufijo counter++ también incrementa counter, pero devuelve el antiguo valor (antes de incrementar). Por lo tanto, el alert muestra 1.

Para resumir:

* Si no se usa el resultado del incremento/decremento, no hay diferencia en la forma de usar:

````js
let counter = 0;
counter++;
++counter;
alert( counter ); // 2, las líneas de arriba realizan lo mismo
````

* Si queremos aumentar un valor y usar inmediatamente el resultado del operador, necesitamos la forma de prefijo:

````js
let counter = 0;
alert( ++counter ); // 1
````

* Si queremos incrementar un valor, pero usamos su valor anterior, necesitamos la forma sufijo:

````js
let counter = 0;
alert( counter++ ); // 0
````

### ℹ️ Incremento/decremento entre otros operadores

Los operadores ++/-- también pueden ser usados dentro de expresiones. Su precedencia es más alta que la mayoría de los otros operadores aritméticos.

Por ejemplo:

````js
let counter = 1;
alert( 2 * ++counter ); // 4
````

Compara con:

````js
let counter = 1;
alert( 2 * counter++ ); // 2, porque counter++ devuelve el valor "antiguo"
````

Aunque técnicamente está bien, tal notación generalmente hace que el código sea menos legible. Una línea hace varias cosas, no es bueno.

Mientras lee el código, un rápido escaneo ocular “vertical” puede pasar por alto fácilmente algo como ‘counter++’ y no será obvio que la variable aumentó.

Aconsejamos un estilo de “una línea – una acción”:

````js
let counter = 1;
alert( 2 * counter );
counter++;
````

## Operadores a nivel de bit

Los operadores a nivel bit tratan los argumentos como números enteros de 32 bits y trabajan en el nivel de su representación binaria.

Estos operadores no son específicos de JavaScript. Son compatibles con la mayoría de los lenguajes de programación.

La lista de operadores:

* AND ( & )
* OR ( | )
* XOR ( ^ )
* NOT ( ~ )
* LEFT SHIFT ( << )
* RIGHT SHIFT ( >> )
* ZERO-FILL RIGHT SHIFT ( >>> )

Estos operadores se usan muy raramente, cuando necesitamos manejar la representación de números en su más bajo nivel. No tenemos en vista usarlos pronto pues en el desarrollo web tiene poco uso; pero en ciertas áreas especiales, como la criptografía, son útiles. Puedes leer el artículo Operadores a nivel de bit en MDN cuando surja la necesidad.

## Coma

El operador coma , es uno de los operadores más raros e inusuales. A veces, es utilizado para escribir código más corto, entonces tenemos que saberlo para poder entender qué está pasando.

El operador coma nos permite evaluar varias expresiones, dividiéndolas con una coma ,. Cada una de ellas es evaluada, pero sólo el resultado de la última es devuelto.

Por ejemplo:

````js
let a = (1 + 2, 3 + 4);

alert( a ); // 7 (el resultado de 3 + 4)
````

Aquí, se evalúa la primera expresión 1 + 2 y se desecha su resultado. Luego, se evalúa 3 + 4 y se devuelve como resultado.

### ℹ️ Coma tiene muy baja precedencia
Tenga en cuenta que el operador coma tiene una precedencia muy baja, inferior a =, por lo que los paréntesis son importantes en el ejemplo anterior.

Sin ellos: a = 1 + 2, 3 + 4 se evalúa primero el +, sumando los números a a = 3, 7, luego el operador de asignación = asigna a = 3, y el resto es ignorado. Es igual que (a = 1 + 2), 3 + 4.

¿Por qué necesitamos un operador que deseche todo excepto la última expresión?

A veces, las personas lo usan en construcciones más complejas para poner varias acciones en una línea.

Por ejemplo:

````js
// tres operaciones en una línea
for (a = 1, b = 3, c = a * b; a < 10; a++) {
 ...
}
````

Tales trucos se usan en muchos frameworks de JavaScript. Por eso los estamos mencionando. Pero generalmente no mejoran la legibilidad del código, por lo que debemos pensar bien antes de usarlos.

# ✅ Tareas

## Las formas sufijo y prefijo

¿Cuáles son los valores finales de todas las variables a, b, c y d después del código a continuación?

````js
let a = 1, b = 1;

let c = ++a; // ?
let d = b++; // ?
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/08_operators/solutions/las-formas-sufijo-y-prefijo.md)

## Resultado de asignacion

¿Cuáles son los valores de ‘a’ y ‘x’ después del código a continuación?

````js
let a = 2;

let x = 1 + (a *= 2);
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/08_operators/solutions/resultado-de-asignacion.md)

## Conversiones de tipos

¿Cuáles son los resultados de estas expresiones?

````js
"" + 1 + 0
"" - 1 + 0
true + false
6 / "3"
"2" * "3"
4 + 5 + "px"
"$" + 4 + 5
"4" - 2
"4px" - 2
"  -9  " + 5
"  -9  " - 5
null + 1
undefined + 1
" \t \n" - 2
````

Piensa bien, anótalos y luego compara con la respuesta.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/08_operators/solutions/corregir-la-adicion.md)

## Corregir la adicion

Aquí hay un código que le pide al usuario dos números y muestra su suma.

Funciona incorrectamente. El resultado en el ejemplo a continuación es 12 (para valores de captura predeterminados).

¿Por qué? Arreglalo. El resultado debería ser 3.

````js
let a = prompt("¿Primer número?", 1);
let b = prompt("¿Segundo número?", 2);

alert(a + b); // 12
````

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/08_operators/solutions/corregir-la-adicion.md)


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/readme.md)
