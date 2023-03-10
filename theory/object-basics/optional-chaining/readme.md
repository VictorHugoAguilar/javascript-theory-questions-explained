# 馃摉 Encadenamiento opcional '?.'

### 鈿狅笍 Una adici贸n reciente
Una adici贸n reciente

Esta es una adici贸n reciente al lenguaje. Los navegadores antiguos pueden necesitar polyfills.
El encadenamiento opcional ?. es una forma a prueba de errores para acceder a las propiedades anidadas de los objetos, incluso si no existe una propiedad intermedia.

## El problema de la propiedad que no existe

Si acaba de comenzar a leer el tutorial y aprender JavaScript, quiz谩s el problema a煤n no lo haya tocado, pero es bastante com煤n.

Como ejemplo, digamos que tenemos objetos user que contienen informaci贸n de nuestros usuarios.

La mayor铆a de nuestros usuarios tienen la direcci贸n en la propiedad user.address, con la calle en user.address.street, pero algunos no la proporcionaron.

En tal caso, cuando intentamos obtener user.address.streeten un usuario sin direcci贸n obtendremos un error:

````js
let user = {}; // usuario sin propiedad "address"

alert(user.address.street); // Error!
````

Este es el resultado esperado. JavaScript funciona as铆, como user.address es undefined, el intento de obtener user.address.street falla dando un error.

En muchos casos pr谩cticos preferir铆amos obtener undefined en lugar del error (dando a entender 鈥渟in calle鈥?)

鈥? y otro ejemplo. En desarrollo web, podemos obtener un objeto que corresponde a un elemento de p谩gina web usando el llamado a un m茅todo especial como document.querySelector('.elem'), que devuelve null cuando no existe tal elemento.

````js
// Error si el resultado de querySelector (...) es null
let html = document.querySelector('.my-element').innerHTML;
````

Una vez m谩s, si el elemento no existe, obtendremos un error al intentar acceder a la propiedad .innerHTML de null. Y en algunos casos, cuando la ausencia del elemento es normal, quisi茅ramos evitar el error y simplemente aceptar html = null como resultado.

驴C贸mo podemos hacer esto?

La soluci贸n obvia ser铆a chequear el valor usando if o el operador condicional ? antes de usar la propiedad:

````js
let user = {};

alert(user.address ? user.address.street : undefined);
````

Esto funciona, no hay error鈥? Pero es bastante poco elegante. Como puedes ver, "user.address" aparece dos veces en el c贸digo.

El mismo caso, pero con la b煤squeda de document.querySelector:

````js
let html = document.querySelector('.elem') ? document.querySelector('.elem').innerHTML : null;
````

Podemos ver que el elemento de b煤squeda document.querySelector('.elem') es llamado dos veces aqu铆. Nada bueno.

En propiedades anidadas m谩s profundamente, esto se vuelve un problema porque se requerir谩n m谩s repeticiones.

Ejemplo: Tratemos de obtener user.address.street.name de manera similar.

````js
let user = {}; // El usuario no tiene direcci贸n

alert(user.address ? user.address.street ? user.address.street.name : null : null);
````

Esto es horrible, podemos tener problemas para siquiera entender tal c贸digo.

Hay una mejor manera de escribirlo, usando el operador &&:

````js
let user = {}; // usuario sin direcci贸n

alert( user.address && user.address.street && user.address.street.name ); // undefined (sin error)
````

Poniendo AND en el camino completo a la propiedad asegura que todos los componentes existen (si no, la evaluaci贸n se detiene), pero no es lo ideal.

Como puedes ver, los nombres de propiedad a煤n est谩n duplicados en el c贸digo. Por ejemplo en el c贸digo de arriba user.address aparece tres veces.

Es por ello que el encadenamiento opcional ?. fue agregado al lenguaje. 隆Para resolver este problema de una vez por todas!

## Encadenamiento opcional

El encadenamiento opcional ?. detiene la evaluaci贸n y devuelve undefined si el valor antes del ?. es undefined o null.

**De aqu铆 en adelante en este art铆culo, por brevedad, diremos que algo 鈥渆xiste鈥? si no es null o undefined.**

En otras palabras, value?.prop:

* funciona como value.prop si value existe,
* de otro modo (cuando value es undefined/null) devuelve undefined.

Aqu铆 est谩 la forma segura de acceder a user.address.street usando ?.:

````js
let user = {}; // El usuario no tiene direcci贸n

alert( user?.address?.street ); // undefined (no hay error)
````

El c贸digo es corto y claro, no hay duplicaci贸n en absoluto

Aqu铆 tenemos un ejemplo con document.querySelector:

````js
let html = document.querySelector('.elem')?.innerHTML; // ser谩 undefined si no existe el elemento
````

Leer la direcci贸n con user?.Address funciona incluso si el objeto user no existe:

````js
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
````

Tenga en cuenta: la sintaxis ?. hace opcional el valor delante de 茅l, pero no m谩s all谩.

Por ejemplo, en user?.address.street.name, el ?. permite que user sea null/undefined (y devuelve undefined en tal caso), pero solo a user. El resto de las propiedades son accedidas de la manera normal. Si queremos que algunas de ellas sean opcionales, necesitamos reemplazar m谩s . con ?..

### 鈿狅笍 No abuses del encadenamiento opcional
Deber铆amos usar ?. solo donde est谩 bien que algo no exista.

Por ejemplo, si de acuerdo con la l贸gica de nuestro c贸digo, el objeto user debe existir, pero address es opcional, entonces deber铆amos escribir user.address?.street y no user?.address?.street.

De esta forma, si por un error user no est谩 definido, lo sabremos y lo arreglaremos. De lo contrario, los errores de codificaci贸n pueden silenciarse donde no sea apropiado y volverse m谩s dif铆ciles de depurar.

### 鈿狅笍 La variable antes de ?. debe declararse
Si no hay una variable user declarada, entonces user?.anything provocar谩 un error:

````js
// ReferenceError: user no est谩 definido
user?.address;
````

La variable debe ser declarada (con let/const/var user o como par谩metro de funci贸n). El encadenamiento opcional solo funciona para variables declaradas.

## Short-circuiting (Cortocircuitos)

Como se dijo antes, el ?. detiene inmediatamente (鈥渃ortocircuito鈥?) la evaluaci贸n si la parte izquierda no existe.

Entonces, si a la derecha de ?. hay funciones u operaciones adicionales, estas no se ejecutar谩n:

Por ejemplo:

````js
let user = null;
let x = 0;

user?.sayHi(x++); // no hay "user", por lo que la ejecuci贸n no alcanza a sayHi ni a x++

alert(x); // 0, el valor no se incrementa
````

## Otros casos: ?.(), ?.[]

El encadenamiento opcional ?. no es un operador, es una construcci贸n de sintaxis especial que tambi茅n funciona con funciones y corchetes.

Por ejemplo, ?.() se usa para llamar a una funci贸n que puede no existir.

En el siguiente c贸digo, algunos de nuestros usuarios tienen el m茅todo admin, y otros no:

````js
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};

let userGuest = {};

userAdmin.admin?.(); // I am admin

userGuest.admin?.(); // no pasa nada (no existe tal m茅todo)
````

Aqu铆, en ambas l铆neas, primero usamos el punto (userAdmin.admin) para obtener la propiedad admin, porque asumimos que el objeto user existe y es seguro leerlo.

Entonces ?.() comprueba la parte izquierda: si la funci贸n admin existe, entonces se ejecuta (para userAdmin). De lo contrario (para userGuest) la evaluaci贸n se detiene sin errores.

La sintaxis ?.[] tambi茅n funciona si quisi茅ramos usar corchetes [] para acceder a las propiedades en lugar de punto .. Al igual que en casos anteriores, permite leer de forma segura una propiedad de un objeto que puede no existir.

````js
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined
````

Tambi茅n podemos usar ?. con delete:

````js
delete user?.name; // Eliminar user.name si el usuario existe
````

Podemos usar ?. para una lectura y eliminaci贸n segura, pero no para escribir
El encadenamiento opcional ?. no puede usarse en el lado izquierdo de una asignaci贸n:

Por ejemplo:

````js
let user = null;

user?.name = "John"; // Error, no funciona
// porque se eval煤a como: undefined = "John"
````

## Resumen

La sintaxis de encadenamiento opcional `?`. tiene tres formas:

1. `obj?.prop` 鈥? devuelve obj.prop si obj existe, si no, undefined.
2. `obj?.[prop]` 鈥? devuelve obj[prop] si obj existe, si no, undefined.
3. `obj.method?.()` 鈥? llama a obj.method() si obj.method existe, si no devuelve undefined.

Como podemos ver, todos ellos son sencillos y f谩ciles de usar. El ?. comprueba si la parte izquierda es null/undefined y permite que la evaluaci贸n contin煤e si no es as铆.

Una cadena de ?. permite acceder de forma segura a las propiedades anidadas.

A煤n as铆, debemos aplicar ?. con cuidado, solamente donde sea aceptable que, de acuerdo con nuestra l贸gica, la parte izquierda no exista. Esto es para que no nos oculte errores de programaci贸n, si ocurren.

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
