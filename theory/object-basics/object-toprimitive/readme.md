# 📖 Conversión de objeto a valor primitivo

¿Qué sucede cuando los objetos se suman obj1 + obj2, se restan obj1 - obj2 o se imprimen utilizando alert(obj)?

JavaScript no permite personalizar cómo los operadores trabajan con los objetos. Al contrario de otros lenguajes de programación como Ruby o C++, no podemos implementar un método especial para manejar una suma (u otros operadores).

En ese caso, los objetos se convierten automáticamente en valores primitivos, y luego se lleva a cabo la operación sobre esos primitivos, y resultan en un valor primitivo.

Esto es una limitación importante: el resultado de obj1 + obj2 (u otra operación) ¡no puede ser otro objeto!

Por ejemplo no podemos hacer objetos que representen vectores o matrices (o conquistas o lo que sea), sumarlas y esperar un objeto “sumado” como resultado. Tal objetivo arquitectural cae automáticamente “fuera del tablero”.

Como técnicamente no podemos hacer mucho aquí, no se hacen matemáticas con objetos en proyectos reales. Cuando ocurre, con alguna rara excepción es por un error de código.

En este capítulo cubriremos cómo un objeto se convierte a primitivo y cómo podemos personalizarlo.

Tenemos dos propósitos:

1. Nos permitirá entender qué ocurre en caso de errores de código, cuando tal operación ocurre accidentalmente.
2. Hay excepciones, donde tales operaciones son posibles y se ven bien. Por ejemplo al restar o comparar fechas (objetos Date). Las discutiremos más adelante.

## Reglas de conversión

En el capítulo Conversiones de Tipos, hemos visto las reglas para las conversiones de valores primitivos numéricos, strings y booleanos. Pero dejamos un hueco en los objetos. Ahora, como sabemos sobre métodos y símbolos, es posible completarlo.

1. No hay conversión a boolean. Todos los objetos son true en un contexto booleano, tan simple como eso. Solo hay conversiones numéricas y de strings.
2. La conversión numérica ocurre cuando restamos objetos o aplicamos funciones matemáticas. Por ejemplo, los objetos de tipo Date (que se cubrirán en el capítulo Fecha y Hora) se pueden restar, y el resultado de date1 - date2 es la diferencia horaria entre dos fechas.
3. En cuanto a la conversión de strings: generalmente ocurre cuando imprimimos un objeto como en alert(obj) y en contextos similares.

Podemos implementar la conversión de tipo string y numérica por nuestra cuenta, utilizando métodos de objeto especiales.

Ahora entremos en los detalles técnicos, porque es la única forma de cubrir el tópico en profundidad.

## Hints (sugerencias)

¿Cómo decide JavaScript cuál conversión aplicar?

Hay tres variantes de conversión de tipos que ocurren en varias situaciones. Son llamadas “hints” y están descriptas en la especificación:

* `"string"`
Para una conversión de objeto a string, cuando hacemos una operación que espera un string en un objeto, como alert:

````js
// salida
alert(obj);

// utilizando un objeto como clave
anotherObj[obj] = 123;
````

* `"number"`
Para una conversión de objeto a número, como cuando hacemos operaciones matemáticas:

````js
// conversión explícita
let num = Number(obj);

// matemáticas (excepto + binario)
let n = +obj; // + unario
let delta = date1 - date2;

// comparación menor que / mayor que
let greater = user1 > user2;
````

La mayoría de las funciones matemáticas nativas también incluyen tal conversión.

* `"default"`
Ocurre en casos raros cuando el operador “no está seguro” de qué tipo esperar.

Por ejemplo, el operador binario + puede funcionar con strings (los concatena) y números (los suma). Entonces, si el + binario obtiene un objeto como argumento, utiliza la sugerencia "default" para convertirlo.

También, si un objeto es comparado utilizando == con un string, un número o un símbolo, tampoco está claro qué conversión se debe realizar, por lo que se utiliza la sugerencia "default".

````js
// + binario utiliza la sugerencia "default"
let total = obj1 + obj2;

// obj == número utiliza la sugerencia "default"
if (user == 1) { ... };
````

Los operadores de comparación mayor que y menor que, como < >, también pueden funcionar con strings y números. Aún así, utilizan la sugerencia "number", y no "default". Eso es por razones históricas.

Aunque en la práctica las cosas son más simples.

Todos los objetos nativos&#8209;excepto un caso (objeto Date, lo veremos más adelante)- implementan la conversión "default" del mismo modo que "number". Y probablemente debiéramos hacer lo mismo.

Aún así, es importante conocer los 3 “hints”, pronto veremos el porqué.

**Para realizar la conversión, JavaScript intenta buscar y llamar a tres métodos del objeto:**

1. Busca y llama, si el método existe, a obj[Symbol.toPrimitive](hint): el método con la clave simbólica Symbol.toPrimitive (símbolo del sistema);
2. Si no lo encuentra y “hint” es "string":
intenta llamar a obj.toString() y obj.valueOf(), lo que exista.
3. Si no lo encuentra y “hint” es "number" o "default"
intenta llamar a obj.valueOf() y obj.toString(), lo que exista.

## Symbol.toPrimitive

Empecemos por el primer método. Hay un símbolo incorporado llamado Symbol.toPrimitive que debe utilizarse para nombrar el método de conversión, así:

````js
obj[Symbol.toPrimitive] = function(hint) {
  // aquí va el código para convertir este objeto a un primitivo
  // debe devolver un valor primitivo
  // hint = "sugerencia", uno de: "string", "number", "default"
};
````

Si el método Symbol.toPrimitive existe, es usado para todos los hints y no serán necesarios más métodos.

Por ejemplo, aquí el objeto user lo implementa:

````js
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`sugerencia: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// demostración de conversiones:
alert(user); // sugerencia: string -> {name: "John"}
alert(+user); // sugerencia: number -> 1000
alert(user + 500); // sugerencia: default -> 1500
````

Como podemos ver en el código, user se convierte en un string autodescriptivo o en una cantidad de dinero, depende de la conversión. Un único método user[Symbol.toPrimitive] maneja todos los casos de conversión.

## toString/valueOf

Si no existe Symbol.toPrimitive entonces JavaScript trata de encontrar los métodos toString y valueOf:

* Para una sugerencia “string”: trata de llamar a toString primero; pero si no existe, o si devuelve un objeto en lugar de un valor primitivo, llama a valueOf (así, toString tiene prioridad en conversiones string).
* Para otras sugerencias: trata de llamar a valueOf primero; y si no existe, o si devuelve un objeto en lugar de un valor primitivo, llama a toString (así, valueOf tiene prioridad para matemáticas).
Los métodos toString y valueOf provienen de tiempos remotos. No son símbolos (los símbolos no existían en aquel tiempo) sino métodos “normales” nombrados con strings. Proporcionan una forma alternativa “al viejo estilo” de implementar la conversión.

Estos métodos deben devolver un valor primitivo. Si toString o valueOf devuelve un objeto, entonces se ignora (lo mismo que si no hubiera un método).

De forma predeterminada, un objeto simple tiene los siguientes métodos toString y valueOf:

* El método toString devuelve un string "[object Object]".
* El método valueOf devuelve el objeto en sí.

Aquí está la demostración:

````js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
````

Por lo tanto, si intentamos utilizar un objeto como un string, como en un alert o algo así, entonces por defecto vemos [object Object].

El valueOf predeterminado se menciona aquí solo en favor de la integridad, para evitar confusiones. Como puede ver, devuelve el objeto en sí, por lo que se ignora. No me pregunte por qué, es por razones históricas. Entonces podemos asumir que no existe.

Implementemos estos métodos para personalizar la conversión.

Por ejemplo, aquí user hace lo mismo que el ejemplo anterior utilizando una combinación de toString y valueOf en lugar de Symbol.toPrimitive:

````js
let user = {
  name: "John",
  money: 1000,

  // para sugerencia="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // para sugerencia="number" o "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
````

Como podemos ver, el comportamiento es el mismo que en el ejemplo anterior con Symbol.toPrimitive.

A menudo queremos un único lugar “general” para manejar todas las conversiones primitivas. En este caso, podemos implementar solo toString, así:

````js
let user = {
  name: "John",

  toString() {
    return this.name;
  }
};

alert(user); // toString -> John
alert(user + 500); // toString -> John500
````

En ausencia de Symbol.toPrimitive y valueOf, toString manejará todas las conversiones primitivas.

## Una conversión puede devolver cualquier tipo primitivo

Lo importante que debe saber acerca de todos los métodos de conversión primitiva es que no necesariamente devuelven la primitiva “sugerida”.

No hay control para que toString devuelva exactamente un string, ni para que el método Symbol.toPrimitive con una sugerencia "number" devuelva un número.

Lo único obligatorio: estos métodos deben devolver un valor primitivo, no un objeto.

### ℹ️ Notas históricas
Por razones históricas, si toString o valueOf devuelve un objeto, no hay ningún error, pero dicho valor se ignora (como si el método no existiera). Esto se debe a que en la antigüedad no existía un buen concepto de “error” en JavaScript.

Por el contrario, Symbol.toPrimitive es más estricto, debe devolver un valor primitivo, en caso contrario habrá un error.

## Más conversiones

Como ya sabemos, muchos operadores y funciones realizan conversiones de tipo, por ejemplo la multiplicación * convierte operandos en números.

Si pasamos un objeto como argumento, entonces hay dos etapas de cómputo:

1. El objeto se convierte en un valor primitivo (utilizando las reglas descritas anteriormente).
2. Si es necesario para más cómputo, el valor primitivo resultante también se convierte.

Por ejemplo:

````js
let obj = {
  // toString maneja todas las conversiones en ausencia de otros métodos
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4, objeto convertido a valor primitivo "2", luego la multiplicación lo convirtió en un número
````

1. La multiplicación obj * 2 primero convierte el objeto en valor primitivo (que es un string "2").
2. Luego "2" * 2 se convierte en 2 * 2 (el string se convierte en número).

El + binario concatenará los strings en la misma situación, ya que acepta con gusto un string:

````js
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // 22 ("2" + 2), la conversión a valor primitivo devolvió un string => concatenación
````

## Resumen

La conversión de objeto a valor primitivo es llamada automáticamente por muchas funciones y operadores incorporados que esperan un valor primitivo.

Hay 3 tipos (hints o sugerencias) de estas:

* `"string"` (para alert y otras operaciones que necesitan un string)
* `"number"` (para matemáticas)
* `"default"` (pocos operadores, usualmente los objetos lo implementan del mismo modo que "number")

La especificación describe explícitamente qué operador utiliza qué sugerencia.

El algoritmo de conversión es:

1. Llamar a obj[Symbol.toPrimitive](hint) si el método existe,
2. En caso contrario, si la sugerencia es "string"
- intentar llamar a obj.toString() y obj.valueOf(), lo que exista.
3. En caso contrario, si la sugerencia es "number" o "default"
- intentar llamar a obj.valueOf() y obj.toString(), lo que exista.

Todos estos métodos deben devolver un primitivo para funcionar (si está definido).

En la práctica, a menudo es suficiente implementar solo obj.toString() como un método “atrapatodo” para todas las conversiones a string que deben devolver la representación “legible por humanos” de un objeto, con fines de registro o depuración.

Como en las operaciones matemáticas, JavaScript no ofrece una forma de “sobrescribir” operadores usando métodos. Así que en proyectos de la vida real raramente se los usa en objetos.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
