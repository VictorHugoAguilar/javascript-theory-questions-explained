# 📖 Estilo de codificación

Nuestro código debe ser lo más limpio y fácil de leer como sea posible.

Ese es en realidad el arte de la programación: tomar una tarea compleja y codificarla de manera correcta y legible para los humanos. Un buen estilo de código ayuda mucho en eso.

## Sintaxis

Aquí hay una hoja de ayuda con algunas reglas sugeridas (ver abajo para más detalles):

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/code-quality/coding-style/img/image_01.png?raw=true)

Ahora discutamos en detalle las reglas y las razones para ellas.

### ⚠️ No existen reglas “usted debe”
Nada está escrito en piedra aquí. Estos son preferencias de estilos, no dogmas religiosos.

## Llaves

En la mayoría de proyectos de Javascript las llaves están escritas en estilo “Egipcio” con la llave de apertura en la misma linea como la correspondiente palabra clave – no en una nueva linea. Debe haber también un espacio después de la llave de apertura, como esto:

````js
if (condition) {
  // hacer esto
  // ...y eso
  // ...y eso
}
````

Una construcción de una sola línea, como if (condition) doSomething(), es un caso límite importante. ¿Deberíamos usar llaves?

Aquí están las variantes anotadas para que puedas juzgar la legibilidad por ti mismo.

1. 😠 Los principiantes a veces hacen eso. ¡Malo! Las llaves no son necesarias:

````js
if (n < 0) {alert(`Power ${n} is not supported`);}
````

2. 😠 Dividir en una línea separada sin llaves. Nunca haga eso, es fácil cometer un error al agregar nuevas líneas:

````js
if (n < 0)

  alert(`Power ${n} is not supported`);
````

3. 😏 Una línea sin llaves: aceptable, si es corta:

````js
if (n < 0) alert(`Power ${n} is not supported`);
````

4. 😃 La mejor variante:

````js
if (n < 0) {
  alert(`Power ${n} is not supported`);
}
````

Para un código muy breve, se permite una línea, p. if (cond) return null. Pero un bloque de código (la última variante) suele ser más legible.

## Tamaño de línea

A nadie le gusta leer una larga línea horizontal de código. Es una buena práctica dividirlos.

Por ejemplo:

````js
// acento grave ` permite dividir la cadena de caracteres en múltiples líneas
let str = `
  ECMA International's TC39 is a group of JavaScript developers,
  implementers, academics, and more, collaborating with the community
  to maintain and evolve the definition of JavaScript.
`;
````

Y para sentencias `if`:

````js
if (
  id === 123 &&
  moonPhase === 'Waning Gibbous' &&
  zodiacSign === 'Libra'
) {
  letTheSorceryBegin();
}
````

La longitud máxima de la línea debe acordarse con el equipo de trabajo. Suele tener 80 o 120 caracteres.

## Indentación (sangría)

Hay dos tipos de indentación:

* **Indentación horizontal: 2 o 4 espacios.**

Se realiza una sangría horizontal utilizando 2 o 4 espacios o el símbolo de tabulación horizontal (key Tabulador). Cuál elegir es una vieja guerra santa. Los espacios son más comunes hoy en día.

Una ventaja de los espacios sobre las tabulaciones es que los espacios permiten configuraciones de sangría más flexibles que el símbolo del tabulador.

Por ejemplo, podemos alinear los argumentos con el paréntesis de apertura, así:

````js
show(parameters,
     aligned, // 5 espacios de relleno a la izquierda
     one,
     after,
     another
  ) {
  // ...
}
````

* **Indentación vertical: líneas vacías para dividir código en bloques lógicos.**

Incluso una sola función a menudo se puede dividir en bloques lógicos. En el siguiente ejemplo, la inicialización de variables, el bucle principal y la devolución del resultado se dividen verticalmente:

````js
function pow(x, n) {
  let result = 1;
  //              <--
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  //              <--
  return result;
}
````

Insertar una nueva línea extra donde ayude a hacer el código mas legible. No debe haber más de nueve líneas de código sin una indentación vertical.

## Punto y coma

Debe haber un punto y coma después de cada declaración, incluso si se puede omitir.

Hay idiomas en los que un punto y coma es realmente opcional y rara vez se usa. Sin embargo, en JavaScript, hay casos en los que un salto de línea no se interpreta como un punto y coma, lo que deja el código vulnerable a errores. Vea más sobre eso en el capítulo Estructura del código.

Si eres un programador de JavaScript experimentado, puedes elegir un estilo de código sin punto y coma como StandardJS. De lo contrario, es mejor usar punto y coma para evitar posibles escollos. La mayoría de los desarrolladores ponen punto y coma.

## Niveles anidados

Intenta evitar anidar el código en demasiados niveles de profundidad.

Algunas veces es buena idea usar la directiva “continue” en un bucle para evitar anidamiento extra.

Por ejemplo, en lugar de añadir un if anidado como este:

````js
for (let i = 0; i < 10; i++) {
  if (cond) {
    ... // <- un nivel más de anidamiento
  }
}
````

Podemos escribir:

````js
for (let i = 0; i < 10; i++) {
  if (!cond) continue;
  ...  // <- sin nivel extra de anidamiento
}
````

Algo similar se puede hacer con if/else y return.

Por ejemplo, las dos construcciones siguientes son idénticas.

Opción 1:

````js
function pow(x, n) {
  if (n < 0) {
    alert("Negative 'n' not supported");
  } else {
    let result = 1;

    for (let i = 0; i < n; i++) {
      result *= x;
    }

    return result;
  }
}
````

Opción 2:

````js
function pow(x, n) {
  if (n < 0) {
    alert("Negative 'n' not supported");
    return;
  }

  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
````

El segundo es más legible porque el “caso especial” de n < 0 se maneja desde el principio. Una vez que se realiza la verificación, podemos pasar al flujo de código “principal” sin la necesidad de anidamiento adicional.

## Colocación de funciones

Si está escribiendo varias funciones “auxiliares” y el código que las usa, hay tres formas de organizar las funciones.

1. Declare las funciones anteriores al código que las usa:

````js
// declaración de funciones
function createElement() {
  ...
}

function setHandler(elem) {
  ...
}

function walkAround() {
  ...
}

// el código que las usan
let elem = createElement();
setHandler(elem);
walkAround();
````

2. Código primero, después funciones

````js
// El código que usa a las funciones
let elem = createElement();
setHandler(elem);
walkAround();

// --- Funciones auxiliares ---
function createElement() {
  ...
}

function setHandler(elem) {
  ...
}

function walkAround() {
  ...
}
````

3. Mixto: una función es declarada donde se usa por primera vez.

La mayoría del tiempo, la segunda variante es preferida.

Eso es porque al leer el código, primero queremos saber qué hace. Si el código va primero, entonces queda claro desde el principio. Entonces, tal vez no necesitemos leer las funciones, especialmente si sus nombres son descriptivos de lo que realmente hacen.

## Guías de estilo

Una guía de estilo contiene reglas generales sobre “cómo escribir” el código, cuáles comillas usar, cuántos espacios para indentar, la longitud máxima de la línea, etc. Muchas cosas menores.

Cuando todos los miembros de un equipo usan la misma guía de estilo, el código se ve uniforme, independientemente de qué miembro del equipo lo haya escrito.

Por supuesto, un equipo siempre puede escribir su propia guía de estilo, pero generalmente no es necesario. Hay muchas guías existentes para elegir.

Algunas opciones populares:

* Google JavaScript Style Guide
* Airbnb JavaScript Style Guide
* Idiomatic.JS
* StandardJS
* (y mucho mas)

Si eres un desarrollador novato, puedes comenzar con la guía al comienzo de este capítulo. Luego, puedes buscar otras guías de estilo para recoger más ideas y decidir cuál te gusta más.

## Linters automatizados

Linters son herramientas que pueden verificar automáticamente el estilo de su código y hacer sugerencias de mejora.

Lo mejor de ellos es que la comprobación de estilo también puede encontrar algunos errores, como errores tipográficos en nombres de variables o funciones. Debido a esta característica, se recomienda usar un linter incluso si no desea apegarse a un “estilo de código” en particular.

Aquí hay algunas herramientas de linting conocidas:

* JSLint – uno de los primeros linters.
* JSHint – más ajustes que JSLint.
* ESLint – probablemente el más reciente.

Todos ellos pueden hacer el trabajo. El autor usa ESLint.

La mayoría de las linters están integradas con muchos editores populares: solo habilite el complemento en el editor y configure el estilo.

Por ejemplo, para ESLint debe hacer lo siguiente:

1. Instala Node.JS.
2. Instala ESLint con el comando npm install -g eslint (npm es un instalador de paquetes de Javascript).
3. Crea un archivo de configuración llamado .eslintrc en la raíz de tu proyecto de javascript (en la carpeta que contiene todos tus archivos).
4. Instala/Habilita el plugin para que tu editor se integre con ESLint. La mayoría de editores tienen uno.

Aquí un ejemplo de un archivo .eslintrc:

````js
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "no-console": 0,
    "indent": 2
  }
}
````

Aquí la directiva "extends" denota que la configuración se basa en el conjunto de configuraciones “eslint: recomendado”. Después de eso, especificamos el nuestro.

También es posible descargar conjuntos de reglas de estilo de la web y extenderlos. Consulte https://eslint.org/docs/user-guide/getting-started para obtener más detalles sobre la instalación.

También algunos IDE tienen linting incorporado, lo cual es conveniente pero no tan personalizable como ESLint.

## Resumen

Todas las reglas de sintaxis descritas en este capítulo (y en las guías de estilo mencionadas) tienen como objetivo aumentar la legibilidad de su código. Todos ellos son discutibles.

Cuando pensamos en escribir un código “mejor”, las preguntas que debemos hacernos son: “¿Qué hace que el código sea más legible y fácil de entender?” y “¿Qué puede ayudarnos a evitar errores?” Estas son las principales cosas a tener en cuenta al elegir y debatir estilos de código.

La lectura de guías de estilo populares le permitirá mantenerse al día con las últimas ideas sobre las tendencias de estilo de código y las mejores prácticas.

# ✅ Tareas

## Estilo pobre

¿Qué hay de malo con el estilo de código a continuación?

````js
function pow(x,n)
{
  let result=1;
  for(let i=0;i<n;i++) {result*=x;}
  return result;
}

let x=prompt("x?",''), n=prompt("n?",'')
if (n<=0)
{
  alert(`Power ${n} is not supported, please enter an integer number greater than zero`);
}
else
{
  alert(pow(x,n))
}
````

Arreglalo.

[solución]()
