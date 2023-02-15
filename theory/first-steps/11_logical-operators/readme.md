# 📖 Operadores Lógicos

Hay cuatro operadores lógicos en JavaScript: `||` (O), `&&` (Y), `!` (NO), `??` (Fusión de nulos). Aquí cubrimos los primeros tres, el operador ?? se verá en el siguiente artículo.

Aunque sean llamados lógicos, pueden ser aplicados a valores de cualquier tipo, no solo booleanos. El resultado también puede ser de cualquier tipo.

Veamos los detalles.

## || (OR)

El operador OR se representa con dos símbolos de linea vertical:

````js
result = a || b;
````

En la programación clásica, el OR lógico esta pensado para manipular solo valores booleanos. Si cualquiera de sus argumentos es true, retorna true, de lo contrario retorna false.

En JavaScript, el operador es un poco más complicado y poderoso. Pero primero, veamos qué pasa con los valores booleanos.

Hay cuatro combinaciones lógicas posibles:

````js
alert(true || true); // true (verdadero)
alert(false || true); // true
alert(true || false); // true
alert(false || false); // false (falso)
````

Como podemos ver, el resultado es siempre true excepto cuando ambos operandos son false.

Si un operando no es un booleano, se lo convierte a booleano para la evaluación.

Por ejemplo, el número 1 es tratado como true, el número 0 como false:

````js
if (1 || 0) { // Funciona como if( true || false )
  alert("valor verdadero!");
}
````

La mayoría de las veces, OR || es usado en una declaración if para probar si alguna de las condiciones dadas es true.

Por ejemplo:

````js
let hour = 9;

if (hour < 10 || hour > 18) {
  alert( 'La oficina esta cerrada.' );
}
````

Podemos pasar mas condiciones:

````js
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert("La oficina esta cerrada."); // Es fin de semana
}
````

## OR "||" encuentra el primer valor verdadero

La lógica descrita arriba es algo clásica. Ahora, mostremos las características “extra” de JavaScript.

El algoritmo extendido trabaja de la siguiente forma.

Dado múltiples valores aplicados al operador OR:

````js
result = value1 || value2 || value3;
````

El operador OR || realiza lo siguiente:

* Evalúa los operandos de izquierda a derecha.
* Para cada operando, convierte el valor a booleano. Si el resultado es true, se detiene y retorna el valor original de ese operando.
* Si todos los operandos han sido evaluados (todos eran false), retorna el ultimo operando.

Un valor es retornado en su forma original, sin la conversión.

En otras palabras, una cadena de OR "||" devuelve el primer valor verdadero o el último si ningún verdadero es encontrado.

Por ejemplo:

````js
alert(1 || 0); // 1 (1 es un valor verdadero)

alert(null || 1); // 1 (1 es el primer valor verdadero)
alert(null || 0 || 1); // 1 (el primer valor verdadero)

alert(undefined || null || 0); // 0 (todos son valores falsos, retorna el último valor)
````

Esto brinda varios usos interesantes comparados al “OR puro, clásico, de solo booleanos”.

1. **Obtener el primer valor verdadero de una lista de variables o expresiones.**

Por ejemplo, tenemos las variables firstName, lastName y nickName, todas opcionales (pueden ser undefined o tener valores falsos).

Usemos OR `||` para elegir el que tiene los datos y mostrarlo (o anónimo si no hay nada configurado):

````js
let firstName = "";
let lastName = "";
let nickName = "SuperCoder";

alert( firstName || lastName || nickName || "Anonymous"); // SuperCoder
````

Si todas las variables fueran falsas, aparecería `"Anonymous"`.

2. **Evaluación del camino más corto**.

Otra característica del operador OR || es la evaluación de “el camino más corto” o “cortocircuito”.

Esto significa que || procesa sus argumentos hasta que se alcanza el primer valor verdadero, y ese valor se devuelve inmediatamente sin siquiera tocar el otro argumento.

La importancia de esta característica se vuelve obvia si un operando no es solo un valor sino una expresión con un efecto secundario, como una asignación de variable o una llamada a función.

En el siguiente ejemplo, solo se imprime el segundo mensaje:

````js
true || alert("not printed");
false || alert("printed");
````

En la primera línea, el operador OR || detiene la evaluación inmediatamente después de ver que es verdadera, por lo que la alerta no se ejecuta.

A veces se usa esta función para ejecutar comandos solo si la condición en la parte izquierda es falsa.

## && (AND)

El operador AND es representado con dos ampersands `&&`:

````js
result = a && b;
````

En la programación clásica, AND retorna `true` si ambos operandos son valores verdaderos y `false` en cualquier otro caso.

````js
alert(true && true); // true
alert(false && true); // false
alert(true && false); // false
alert(false && false); // false
````

Un ejemplo con if:

````js
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert("La hora es 12:30");
}
````

Al igual que con OR, cualquier valor es permitido como operando de AND:

````js
if (1 && 0) { // evaluado como true && false
  alert( "no funcionará porque el resultado es un valor falso" );
}
````

## AND “&&” encuentra el primer valor falso

Dado múltiples valores aplicados al operador AND:

````js
result = value1 && value2 && value3;
````

El operador AND `&&` realiza lo siguiente:

* Evalúa los operandos de izquierda a derecha.
* Para cada operando, los convierte a un booleano. Si el resultado es false, se detiene y retorna el valor original de dicho operando.
* Si todos los operandos han sido evaluados (todos fueron valores verdaderos), retorna el último operando.

En otras palabras, AND retorna el primer valor falso o el último valor si ninguno fue encontrado.

Las reglas anteriores son similares a las de OR. La diferencia es que AND retorna el primer valor falso mientras que OR retorna el primer valor verdadero.

Ejemplo:

````js
// si el primer operando es un valor verdadero,
// AND retorna el segundo operando:
alert(1 && 0); // 0
alert(1 && 5); // 5

// si el primer operando es un valor falso,
// AND lo retorna. El segundo operando es ignorado
alert(null && 5); // null
alert(0 && "cualquier valor"); // 0
````

También podemos pasar varios valores de una vez. Observa como el primer valor falso es retornado:

````js
alert(1 && 2 && null && 3); // null
````
Cuando todos los valores son verdaderos, el último valor es retornado:

````js
alert(1 && 2 && 3); // 3, el último.
````

### ℹ️ La precedencia de AND && es mayor que la de OR ||
La precedencia del operador AND `&&` es mayor que la de OR `||`.

Así que el código `a && b || c && d` es básicamente el mismo que si la expresiones && estuvieran entre paréntesis: `(a && b) || (c && d)`

### ⚠️ No remplace if con || ni &&
A veces, la gente usa el operador AND `&&` como una "forma más corta de escribir if".

Por ejemplo:

````js
let x = 1;

(x > 0) && alert("¡Mayor que cero!");
````

La acción en la parte derecha de && sería ejecutada sólo si la evaluación la alcanza. Eso es, solo si (x > 0) es verdadero.

Así que básicamente tenemos un análogo para:

````js
let x = 1;

if (x > 0) alert("Mayor que cero!");
````

Aunque la variante con `&&` parece más corta, if es más obvia y tiende a ser un poco más legible. Por lo tanto, recomendamos usar cada construcción para su propósito: use if si queremos si y use `&&` si queremos AND.

## ! (NOT)

El operador booleano NOT se representa con un signo de exclamación `!`.

La sintaxis es bastante simple:

````js
result = !value;
````

El operador acepta un solo argumento y realiza lo siguiente:

Convierte el operando al tipo booleano: true/false.
Retorna el valor contrario.
Por ejemplo:

````js
alert(!true); // false
alert(!0); // true
````

Un doble NOT `!!` es a veces usado para convertir un valor al tipo booleano:

````js
alert(!!"cadena de texto no vacía"); // true
alert(!!null); // false
````

Eso es, el primer NOT convierte el valor a booleano y retorna el inverso, y el segundo NOT lo invierte de nuevo. Al final, tenemos una simple conversión a booleano.

Hay una manera un poco mas prolija de realizar lo mismo – una función integrada Boolean:

````js
alert(Boolean("cadena de texto no vacía")); // true
alert(Boolean(null)); // false
````

La precedencia de NOT `!` es la mayor de todos los operadores lógicos, así que siempre se ejecuta primero, antes que `&&` o `||`.

# ✅ Tareas

## Cual es el resultado de OR

¿Cuál será la salida del siguiente código?

````js
alert( null || 2 || undefined );
````

[solución]()

## Cual es el resultado de las alertas aplicadas al operador OR

¿Cuál será la salida del siguiente código?

````js
alert( alert(1) || 2 || alert(3) );
````

[solución]()

## Cual es el resultado de AND

¿Cuál será la salida del siguiente código?

````js
alert( 1 && null && 2 );
````

[solución]()

## Cual es el resultado de las alertas aplicadas al operador AND

¿Cuál será la salida del siguiente código?

````js
alert( alert(1) && alert(2) );
````

[solución]()

## El resultado de OR AND OR

¿Cuál será el resultado?

````js
alert( null || 2 && 3 || 4 );
````

[solución]()

## Comprueba el rango por dentro

Escribe una condición “if” para comprobar que age(edad) está entre 14 y 90 inclusive.

“Inclusive” significa que age puede llegar a ser uno de los extremos, 14 o 90.

[solución]()

## Comprueba el rango por fuera

Escribe una condición if para comprobar que age NO está entre 14 y 90 inclusive.

Crea dos variantes: la primera usando NOT !, y la segunda sin usarlo.

[solución]()

## Un pregunta acerca de if

¿Cuáles de estos alerts va a ejecutarse?

¿Cuáles serán los resultados de las expresiones dentro de if(...)?

````js
if (-1 || 0) alert( "primero" );
if (-1 && 0) alert( "segundo" );
if (null || -1 && 1) alert( "tercero" );
````

[solución]()

## Comprueba el inicio de sesión

Escribe un código que pregunte por el inicio de sesión con `propmt`.

Si el visitante ingresa `"Admin"`, entonces `prompt(pregunta)` por una contraseña, si la entrada es una linea vacía o Esc – muestra “Cancelado.”, si es otra cadena de texto – entonces muestra “No te conozco”.

La contraseña se comprueba de la siguiente manera:

* Si es igual a “TheMaster”, entonces muestra “Bienvenido!”,
* Si es otra cadena de texto – muetra “Contraseña incorrecta”,
* Para una cadena de texto vacía o una entrada cancelada, muestra “Cancelado.”

El esquema:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/11_logical-operators/img/image_01.png?raw=true)

Por favor usa bloques anidados de if. Piensa en la legibilidad general del código.

Pista: si se le pasa una entrada vacía a un prompt, retorna una cadena de texto vacía ''. Presionando ESC durante un prompt retorna `null`.

[solución]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/readme.md)
