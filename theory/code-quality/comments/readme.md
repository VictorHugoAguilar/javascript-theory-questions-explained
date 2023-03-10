# 馃摉 Comentarios

Como hemos aprendido en el cap铆tulo Estructura del c贸digo, los comentarios pueden ser de una sola l铆nea: comenzando con `//` y de m煤ltiples l铆neas: `/* ... */`.

Normalmente los usamos para describir c贸mo y por qu茅 el c贸digo funciona.

A primera vista, los comentarios pueden ser obvios, pero los principiantes en programaci贸n generalmente los usan incorrectamente.

## Comentarios incorrectos

Los principiantes tienden a utilizar los comentarios para explicar 鈥渓o que est谩 pasando en el c贸digo鈥?. As铆:

````js
// Este c贸digo har谩 esto (...) y esto (...)
// ...y qui茅n sabe qu茅 m谩s...
c贸digo;
muy;
complejo;
````

Pero en un buen c贸digo, la cantidad de comentarios 鈥渆xplicativos鈥? deber铆a ser m铆nima. En serio, el c贸digo deber铆a ser f谩cil de entender sin ellos.

Existe una fant谩stica regla al respeto: 鈥渟i el c贸digo es tan poco claro que necesita un comentario, tal vez en su lugar deber铆a ser reescrito.鈥?.

##聽Receta: funciones externas

A veces es beneficioso reemplazar trozos de c贸digo con funciones, como aqu铆:

````js
function showPrimes(n) {
  nextPrime:
  for (let i = 2; i < n; i++) {

    // comprobar si i es un n煤mero primo
    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }

    alert(i);
  }
}
````

La mejor variante, con una funci贸n externa isPrime:

````js
function showPrimes(n) {

  for (let i = 2; i < n; i++) {
    if (!isPrime(i)) continue;

    alert(i);
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if (n % i == 0) return false;
  }

  return true;
}
````

Ahora podemos entender el c贸digo f谩cilmente. La propia funci贸n se convierte en comentario. Este tipo de c贸digo se le llama auto descriptivo.

## Receta: crear funciones

Y si tenemos una larga 鈥渉oja de c贸digo鈥? como esta:

````js
// aqu铆 a帽adimos whiskey
for(let i = 0; i < 10; i++) {
  let drop = getWhiskey();
  smell(drop);
  add(drop, glass);
}

// aqu铆 a帽adimos zumo
for(let t = 0; t < 3; t++) {
  let tomato = getTomato();
  examine(tomato);
  let juice = press(tomato);
  add(juice, glass);
}

// ...
````

Entonces, una versi贸n mejor puede ser reescribirlo en funciones de esta manera:

````js
addWhiskey(glass);
addJuice(glass);

function addWhiskey(container) {
  for(let i = 0; i < 10; i++) {
    let drop = getWhiskey();
    //...
  }
}

function addJuice(container) {
  for(let t = 0; t < 3; t++) {
    let tomato = getTomato();
    //...
  }
}
````

De nuevo, la propias funciones nos dicen qu茅 est谩 pasando. No hay nada que comentar. Y adem谩s, la estructura del c贸digo es mejor cuando est谩 dividida. Queda claro qu茅 hace cada funci贸n, qu茅 necesita y qu茅 retorna.

En realidad, no podemos evitar totalmente los comentarios 鈥渆xplicativos鈥?. Existen algoritmos complejos. Y existen 鈥渢rucos鈥? ingeniosos con el prop贸sito de optimizar. Pero generalmente, tenemos que intentar mantener el c贸digo simple y auto descriptivo.

## Comentarios correctos

Entonces, los comentarios explicativos suelen ser incorrectos. 驴Qu茅 comentarios son correctos?

### Describe la arquitectura

Proporcionan una descripci贸n general de alto nivel de los componentes, c贸mo interact煤an, cu谩l es el flujo de control en diversas situaciones鈥? En resumen 鈥? la vista panor谩mica del c贸digo. Hay un lenguaje de diagramas especial UML para diagramas de alto nivel. Definitivamente vale la pena estudiarlo.

### Documenta la utilizaci贸n de una funci贸n

Hay una sintaxis especial JSDoc para documentar una funci贸n: utilizaci贸n, par谩metros, valor devuelto.
Por ejemplo:

````js
/**
  * Devuelve x elevado a la potencia de n.
  *
  * @param {number} x El n煤mero a elevar.
  * @param {number} n La potencia, debe ser un n煤mero natural.
  * @return {number} x elevado a la potencia de n.
  */
function pow(x, n) {
  ...
}
````

Este tipo de comentarios nos permite entender el prop贸sito de la funci贸n y c贸mo usarla de la manera correcta sin tener que examinar su c贸digo.

Por cierto, muchos editores como WebStorm tambi茅n pueden entenderlos y usarlos para proveer auto completado y alg煤n tipo de verificaci贸n autom谩tica para el c贸digo.

Adem谩s, existen herramientas como JSDoc 3 que pueden generar documentaci贸n en formato HTML de los comentarios. Puedes leer m谩s informaci贸n sobre JSDoc en https://jsdoc.app.

### 驴Por qu茅 se resuelve de esa manera?

Lo que est谩 escrito es importante. Pero lo que no est谩 escrito puede ser a煤n m谩s importante para entender qu茅 est谩 pasando. 驴Por qu茅 resuelven la tarea exactamente de esa manera? El c贸digo no nos da ninguna respuesta.

Si hay muchas maneras de resolver el problema, 驴por qu茅 esta? Especialmente cuando no es la m谩s obvia.

Sin dichos comentarios, las siguientes situaciones son posibles:

1. T煤 (o tu compa帽ero) abres el c贸digo escrito hace ya alg煤n tiempo, y te das cuenta de que es 鈥渟ub贸ptimo鈥?.
2. Piensas: 鈥淨ue est煤pido que era antes, y que inteligente que soy ahora鈥?, y lo reescribes utilizando la variante 鈥渕谩s obvia y correcta鈥?.
3. 鈥l impulso de reescribir era bueno. Pero en el proceso ves que la soluci贸n 鈥渕谩s obvia鈥? en realidad falla. Incluso recuerdas vagamente el porqu茅, porque ya lo intentaste hace mucho. Vuelves a la variante correcta, pero has estado perdiendo el tiempo.

Los comentarios que explican la soluci贸n correcta son muy importantes. Nos ayudan a continuar el desarrollo de forma correcta.

### 驴Alguna caracter铆stica sutil del c贸digo? 驴D贸nde se usan?

Si el c贸digo tiene algo sutil y contraintuitivo, definitivamente vale la pena comentarlo.

## Resumen

Una se帽al importante de un buen desarrollador son los comentarios: su presencia e incluso su ausencia.

Los buenos comentarios nos permiten mantener bien el c贸digo, volver despu茅s de un retraso y usarlo de manera m谩s efectiva.

### Comenta esto:

* Arquitectura en general, vista de alto nivel.
* Utilizaci贸n de funciones.
* Soluciones importantes, especialmente cuando no son inmediatamente obvias.

### Evita comentarios:

* Que explican 鈥渃贸mo funciona el c贸digo鈥? y 鈥渜u茅 hace鈥?.
* Escr铆belos solo si es imposible escribir el c贸digo de manera tan simple y auto descriptiva que no los necesite.

Los comentarios tambi茅n son usados para herramientas de auto documentaci贸n como JSDoc3: los leen y generan documentaci贸n en HTML (o documentos en otros formatos).

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/code-quality/readme.md)
