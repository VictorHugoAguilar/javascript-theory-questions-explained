# 馃摉 Conversi贸n de objeto a valor primitivo

驴Qu茅 sucede cuando los objetos se suman obj1 + obj2, se restan obj1 - obj2 o se imprimen utilizando alert(obj)?

JavaScript no permite personalizar c贸mo los operadores trabajan con los objetos. Al contrario de otros lenguajes de programaci贸n como Ruby o C++, no podemos implementar un m茅todo especial para manejar una suma (u otros operadores).

En ese caso, los objetos se convierten autom谩ticamente en valores primitivos, y luego se lleva a cabo la operaci贸n sobre esos primitivos, y resultan en un valor primitivo.

Esto es una limitaci贸n importante: el resultado de obj1 + obj2 (u otra operaci贸n) 隆no puede ser otro objeto!

Por ejemplo no podemos hacer objetos que representen vectores o matrices (o conquistas o lo que sea), sumarlas y esperar un objeto 鈥渟umado鈥? como resultado. Tal objetivo arquitectural cae autom谩ticamente 鈥渇uera del tablero鈥?.

Como t茅cnicamente no podemos hacer mucho aqu铆, no se hacen matem谩ticas con objetos en proyectos reales. Cuando ocurre, con alguna rara excepci贸n es por un error de c贸digo.

En este cap铆tulo cubriremos c贸mo un objeto se convierte a primitivo y c贸mo podemos personalizarlo.

Tenemos dos prop贸sitos:

1. Nos permitir谩 entender qu茅 ocurre en caso de errores de c贸digo, cuando tal operaci贸n ocurre accidentalmente.
2. Hay excepciones, donde tales operaciones son posibles y se ven bien. Por ejemplo al restar o comparar fechas (objetos Date). Las discutiremos m谩s adelante.

## Reglas de conversi贸n

En el cap铆tulo Conversiones de Tipos, hemos visto las reglas para las conversiones de valores primitivos num茅ricos, strings y booleanos. Pero dejamos un hueco en los objetos. Ahora, como sabemos sobre m茅todos y s铆mbolos, es posible completarlo.

1. No hay conversi贸n a boolean. Todos los objetos son true en un contexto booleano, tan simple como eso. Solo hay conversiones num茅ricas y de strings.
2. La conversi贸n num茅rica ocurre cuando restamos objetos o aplicamos funciones matem谩ticas. Por ejemplo, los objetos de tipo Date (que se cubrir谩n en el cap铆tulo Fecha y Hora) se pueden restar, y el resultado de date1 - date2 es la diferencia horaria entre dos fechas.
3. En cuanto a la conversi贸n de strings: generalmente ocurre cuando imprimimos un objeto como en alert(obj) y en contextos similares.

Podemos implementar la conversi贸n de tipo string y num茅rica por nuestra cuenta, utilizando m茅todos de objeto especiales.

Ahora entremos en los detalles t茅cnicos, porque es la 煤nica forma de cubrir el t贸pico en profundidad.

## Hints (sugerencias)

驴C贸mo decide JavaScript cu谩l conversi贸n aplicar?

Hay tres variantes de conversi贸n de tipos que ocurren en varias situaciones. Son llamadas 鈥渉ints鈥? y est谩n descriptas en la especificaci贸n:

* `"string"`
Para una conversi贸n de objeto a string, cuando hacemos una operaci贸n que espera un string en un objeto, como alert:

````js
// salida
alert(obj);

// utilizando un objeto como clave
anotherObj[obj] = 123;
````

* `"number"`
Para una conversi贸n de objeto a n煤mero, como cuando hacemos operaciones matem谩ticas:

````js
// conversi贸n expl铆cita
let num = Number(obj);

// matem谩ticas (excepto + binario)
let n = +obj; // + unario
let delta = date1 - date2;

// comparaci贸n menor que / mayor que
let greater = user1 > user2;
````

La mayor铆a de las funciones matem谩ticas nativas tambi茅n incluyen tal conversi贸n.

* `"default"`
Ocurre en casos raros cuando el operador 鈥渘o est谩 seguro鈥? de qu茅 tipo esperar.

Por ejemplo, el operador binario + puede funcionar con strings (los concatena) y n煤meros (los suma). Entonces, si el + binario obtiene un objeto como argumento, utiliza la sugerencia "default" para convertirlo.

Tambi茅n, si un objeto es comparado utilizando == con un string, un n煤mero o un s铆mbolo, tampoco est谩 claro qu茅 conversi贸n se debe realizar, por lo que se utiliza la sugerencia "default".

````js
// + binario utiliza la sugerencia "default"
let total = obj1 + obj2;

// obj == n煤mero utiliza la sugerencia "default"
if (user == 1) { ... };
````

Los operadores de comparaci贸n mayor que y menor que, como < >, tambi茅n pueden funcionar con strings y n煤meros. A煤n as铆, utilizan la sugerencia "number", y no "default". Eso es por razones hist贸ricas.

Aunque en la pr谩ctica las cosas son m谩s simples.

Todos los objetos nativos&#8209;excepto un caso (objeto Date, lo veremos m谩s adelante)- implementan la conversi贸n "default" del mismo modo que "number". Y probablemente debi茅ramos hacer lo mismo.

A煤n as铆, es importante conocer los 3 鈥渉ints鈥?, pronto veremos el porqu茅.

**Para realizar la conversi贸n, JavaScript intenta buscar y llamar a tres m茅todos del objeto:**

1. Busca y llama, si el m茅todo existe, a obj[Symbol.toPrimitive](hint): el m茅todo con la clave simb贸lica Symbol.toPrimitive (s铆mbolo del sistema);
2. Si no lo encuentra y 鈥渉int鈥? es "string":
intenta llamar a obj.toString() y obj.valueOf(), lo que exista.
3. Si no lo encuentra y 鈥渉int鈥? es "number" o "default"
intenta llamar a obj.valueOf() y obj.toString(), lo que exista.

## Symbol.toPrimitive

Empecemos por el primer m茅todo. Hay un s铆mbolo incorporado llamado Symbol.toPrimitive que debe utilizarse para nombrar el m茅todo de conversi贸n, as铆:

````js
obj[Symbol.toPrimitive] = function(hint) {
  // aqu铆 va el c贸digo para convertir este objeto a un primitivo
  // debe devolver un valor primitivo
  // hint = "sugerencia", uno de: "string", "number", "default"
};
````

Si el m茅todo Symbol.toPrimitive existe, es usado para todos los hints y no ser谩n necesarios m谩s m茅todos.

Por ejemplo, aqu铆 el objeto user lo implementa:

````js
let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`sugerencia: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// demostraci贸n de conversiones:
alert(user); // sugerencia: string -> {name: "John"}
alert(+user); // sugerencia: number -> 1000
alert(user + 500); // sugerencia: default -> 1500
````

Como podemos ver en el c贸digo, user se convierte en un string autodescriptivo o en una cantidad de dinero, depende de la conversi贸n. Un 煤nico m茅todo user[Symbol.toPrimitive] maneja todos los casos de conversi贸n.

## toString/valueOf

Si no existe Symbol.toPrimitive entonces JavaScript trata de encontrar los m茅todos toString y valueOf:

* Para una sugerencia 鈥渟tring鈥?: trata de llamar a toString primero; pero si no existe, o si devuelve un objeto en lugar de un valor primitivo, llama a valueOf (as铆, toString tiene prioridad en conversiones string).
* Para otras sugerencias: trata de llamar a valueOf primero; y si no existe, o si devuelve un objeto en lugar de un valor primitivo, llama a toString (as铆, valueOf tiene prioridad para matem谩ticas).
Los m茅todos toString y valueOf provienen de tiempos remotos. No son s铆mbolos (los s铆mbolos no exist铆an en aquel tiempo) sino m茅todos 鈥渘ormales鈥? nombrados con strings. Proporcionan una forma alternativa 鈥渁l viejo estilo鈥? de implementar la conversi贸n.

Estos m茅todos deben devolver un valor primitivo. Si toString o valueOf devuelve un objeto, entonces se ignora (lo mismo que si no hubiera un m茅todo).

De forma predeterminada, un objeto simple tiene los siguientes m茅todos toString y valueOf:

* El m茅todo toString devuelve un string "[object Object]".
* El m茅todo valueOf devuelve el objeto en s铆.

Aqu铆 est谩 la demostraci贸n:

````js
let user = {name: "John"};

alert(user); // [object Object]
alert(user.valueOf() === user); // true
````

Por lo tanto, si intentamos utilizar un objeto como un string, como en un alert o algo as铆, entonces por defecto vemos [object Object].

El valueOf predeterminado se menciona aqu铆 solo en favor de la integridad, para evitar confusiones. Como puede ver, devuelve el objeto en s铆, por lo que se ignora. No me pregunte por qu茅, es por razones hist贸ricas. Entonces podemos asumir que no existe.

Implementemos estos m茅todos para personalizar la conversi贸n.

Por ejemplo, aqu铆 user hace lo mismo que el ejemplo anterior utilizando una combinaci贸n de toString y valueOf en lugar de Symbol.toPrimitive:

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

A menudo queremos un 煤nico lugar 鈥済eneral鈥? para manejar todas las conversiones primitivas. En este caso, podemos implementar solo toString, as铆:

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

En ausencia de Symbol.toPrimitive y valueOf, toString manejar谩 todas las conversiones primitivas.

## Una conversi贸n puede devolver cualquier tipo primitivo

Lo importante que debe saber acerca de todos los m茅todos de conversi贸n primitiva es que no necesariamente devuelven la primitiva 鈥渟ugerida鈥?.

No hay control para que toString devuelva exactamente un string, ni para que el m茅todo Symbol.toPrimitive con una sugerencia "number" devuelva un n煤mero.

Lo 煤nico obligatorio: estos m茅todos deben devolver un valor primitivo, no un objeto.

### 鈩癸笍 Notas hist贸ricas
Por razones hist贸ricas, si toString o valueOf devuelve un objeto, no hay ning煤n error, pero dicho valor se ignora (como si el m茅todo no existiera). Esto se debe a que en la antig眉edad no exist铆a un buen concepto de 鈥渆rror鈥? en JavaScript.

Por el contrario, Symbol.toPrimitive es m谩s estricto, debe devolver un valor primitivo, en caso contrario habr谩 un error.

## M谩s conversiones

Como ya sabemos, muchos operadores y funciones realizan conversiones de tipo, por ejemplo la multiplicaci贸n * convierte operandos en n煤meros.

Si pasamos un objeto como argumento, entonces hay dos etapas de c贸mputo:

1. El objeto se convierte en un valor primitivo (utilizando las reglas descritas anteriormente).
2. Si es necesario para m谩s c贸mputo, el valor primitivo resultante tambi茅n se convierte.

Por ejemplo:

````js
let obj = {
  // toString maneja todas las conversiones en ausencia de otros m茅todos
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4, objeto convertido a valor primitivo "2", luego la multiplicaci贸n lo convirti贸 en un n煤mero
````

1. La multiplicaci贸n obj * 2 primero convierte el objeto en valor primitivo (que es un string "2").
2. Luego "2" * 2 se convierte en 2 * 2 (el string se convierte en n煤mero).

El + binario concatenar谩 los strings en la misma situaci贸n, ya que acepta con gusto un string:

````js
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // 22 ("2" + 2), la conversi贸n a valor primitivo devolvi贸 un string => concatenaci贸n
````

## Resumen

La conversi贸n de objeto a valor primitivo es llamada autom谩ticamente por muchas funciones y operadores incorporados que esperan un valor primitivo.

Hay 3 tipos (hints o sugerencias) de estas:

* `"string"` (para alert y otras operaciones que necesitan un string)
* `"number"` (para matem谩ticas)
* `"default"` (pocos operadores, usualmente los objetos lo implementan del mismo modo que "number")

La especificaci贸n describe expl铆citamente qu茅 operador utiliza qu茅 sugerencia.

El algoritmo de conversi贸n es:

1. Llamar a obj[Symbol.toPrimitive](hint) si el m茅todo existe,
2. En caso contrario, si la sugerencia es "string"
- intentar llamar a obj.toString() y obj.valueOf(), lo que exista.
3. En caso contrario, si la sugerencia es "number" o "default"
- intentar llamar a obj.valueOf() y obj.toString(), lo que exista.

Todos estos m茅todos deben devolver un primitivo para funcionar (si est谩 definido).

En la pr谩ctica, a menudo es suficiente implementar solo obj.toString() como un m茅todo 鈥渁trapatodo鈥? para todas las conversiones a string que deben devolver la representaci贸n 鈥渓egible por humanos鈥? de un objeto, con fines de registro o depuraci贸n.

Como en las operaciones matem谩ticas, JavaScript no ofrece una forma de 鈥渟obrescribir鈥? operadores usando m茅todos. As铆 que en proyectos de la vida real raramente se los usa en objetos.

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
