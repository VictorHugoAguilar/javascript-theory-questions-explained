# Remplazar if...elseif..elseif o switch por object literal

<p>En muchos lenguajes de programación, la switch declaración existe, pero ¿debería seguir existiendo? Si es un programador de JavaScript, a menudo salta dentro y fuera de los objetos, creándolos, instanciandolos y manipulándolos.</p>
<p>Los objetos son realmente flexibles, están en el corazón de casi todo en JavaScript, y usarlos en lugar de la switchdeclaración ha sido algo que he estado haciendo últimamente.</p>

## If...elseif...elseif

<p>Cuando comienza a ver muchas else if declaraciones, es probable que algo esté mal y, en general, debe usar algo así switch, ya que es más adecuado para el propósito y la intención. Aquí hay algunos else if abusos:</p>
<p>Esta implementación es demasiado vaga, hay espacio para errores, además es una sintaxis muy detallada para seguir repitiéndola.</p>
<p>También hay espacio para trucos, ya que puede evaluar múltiples expresiones dentro de cada uno else if, como else if (mood === 'happy' &amp;&amp; somethingElse !== 'sad'). Fue el switch la mejor herramienta para el trabajo, aunque debe seguir agregando declaraciones break; para evitar que los casos fracasen, uno de sus muchos problemas.</p>

```javascript
function getEmoji(mood) {
    if (mood === "happy") {
        return "😃";
    } else if (mood === "sad") {
        return "😔";
    } else if (mood === "angry") {
        return "😡";
    } else {
        return "😑";
    }
}

console.log("Getting angry emoji", getEmoji("angry"));
// Getting angry emoji 😡
```

## Switch

<p> Se siente un poco fuera de lugar sintácticamente, ya que es lo único que no usa llaves y debes recordarlo breakpara cada case. Además, su rendimiento es menos que estelar ya que su flujo de control es procedimental.</p>
<p> Afortunadamente, los literales de objetos de JavaScript son una alternativa bastante buena para la mayoría switchde los casos de uso de declaraciones que se me ocurren. La idea es definir un objeto con una clave para cada uno caseque tendría en una switchdeclaración. Luego puede acceder a su valor directamente usando la expresión que pasaría a la switch declaración.</p>

```javascript
function getEmoji(mood) {
    switch (mood) {
        case "happy":
            return "😊";
        case "sad":
            return "😔";
        case "angry":
            return "😡";
        default:
            return "😑";
    }
}
console.log("Getting sad emoji", getEmoji("sad"));
// Getting angry emoji 😡
```

## Algunos problemas con los switch

<p>Hay varios problemas con switch, desde su flujo de control de procedimientos hasta su forma no estándar en la que maneja los bloques de código, el resto de JavaScript usa llaves, pero Switch no lo hace. Sintácticamente, no es uno de los mejores de JavaScript, ni lo es su diseño. ¡Nos vemos obligados a agregar declaraciones break manualmente dentro de cada case, lo que puede conducir a una depuración difícil y errores anidados más adelante en el caso si lo olvidamos! Douglas Crockford ha escrito y hablado al respecto en numerosas ocasiones, sus recomendaciones son tratarlo con precaución.</p>
<p>A menudo usamos búsquedas de objetos para cosas en JavaScript, a menudo para cosas que nunca contemplaríamos usar switch, así que ¿por qué no usar un objeto literal para reemplazar switch? Los objetos son mucho más flexibles, tienen mejor legibilidad y mantenibilidad y no necesitamos introducir break manualmente en cada “caso”. También son mucho más amigables con los nuevos desarrolladores de JavaScript, ya que son objetos estándar.</p>
<p>A medida que aumenta el número de "casos", el rendimiento del objeto (tabla hash) mejora el costo promedio del cambio (el orden de los casos es importante). El enfoque de objeto es una búsqueda de tabla hash, y el conmutador tiene que evaluar cada caso hasta que encuentre una coincidencia y una ruptura.</p>

## Búsquedas de objetos literales

<p>Usamos Objetos todo el tiempo, ya sea como constructores o literales. A menudo, los usamos para fines de búsqueda de objetos, para obtener valores de las propiedades de los objetos.</p>
<p>Configuremos un objeto literal simple que devuelva Stringsolo un valor.</p>

```javascript
function getEmoji(mood) {
    let emoji = {
        happy: "😊",
        sad: "😔",
        angry: "😡",
    }[mood];
    return emoji || "😑";
}

console.log("Getting happy emoji", getEmoji("happy"));
// Getting happy emoji 😊
console.log("Getting default emoji", getEmoji());
// Getting default emoji 😑
console.log("Getting haa emoji", getEmoji("haa"));
// Getting haa emoji 😑
```

## Casos por defecto

<p>Para manejarlo, simplemente podemos agregar una 'default'clave y verificar si el valor de la expresión existe en nuestro objeto.</p>
<p>El literal de objeto debería ser capaz de manejar casos fallidos, similar a lo que sucede cuando no hay break declaración. Se trata de simplemente extraer y reutilizar la lógica en el objeto literal.</p>
<p>Para resumir todo esto, podemos generalizar y extraer esta lógica en una función reutilizable simple. Le proporcionaremos el objeto de búsqueda y un nombre opcional para el caso predeterminado (lo usaremos de forma predeterminada _default para evitar conflictos). Esta función, a su vez, devolverá una función con la lógica de búsqueda adecuada y podemos usarla para reemplazar cualquier switch declaración.</p>

```javascript
const switchFn =
    (lookupObject, defaultCase = "_default") =>
    (expression) =>
        (lookupObject[expression] || lookupObject[defaultCase])();

const logMood = {
    happy: () => "😊",
    sad: () => "😔",
    ungry: () => "😡",
    default: () => "😑",
};

const moodSwitch = switchFn(logMood, "default");

console.log("mood ", moodSwitch("happy"));
// mood 😊
console.log(moodSwitch("nothing"));
// mood 😑
```
<p>Estas son soluciones muy básicas, y los objetos literales contienen un función que devuelve un String, en el caso de que solo necesite un String, puede usar un String como el valor de la clave; algunas veces las funciones contendrán lógica, que será devuelta por la función.</p>
<p> Si está mezclando funciones con cadenas, podría ser más fácil usar una función en todo momento para evitar buscar mood invocar si es una función; no queremos intentar invocar un String.</p>

# Resumen

<p>Los objetos literales son un control de flujo más natural en JavaScript, switches un poco antiguo y torpe y propenso a errores de depuración difíciles. Los objetos son más extensibles, fáciles de mantener y podemos probarlos mucho mejor. </p>
<p>También forman parte de un patrón de diseño y se utilizan con mucha frecuencia en el día a día en otras tareas de programación. Los objetos literales pueden contener funciones, así como cualquier otro tipo de objeto , ¡lo que los hace realmente flexibles! Cada función en el literal también tiene un alcance de función, por lo que podemos devolver el cierre de la función principal que invocamos (en este caso, moodSwitch devuelve el cierre).</p>