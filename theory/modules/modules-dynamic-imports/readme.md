Importaciones dinámicas
Las declaraciones de exportación e importación que cubrimos en capítulos anteriores se denominan “estáticas”. La sintaxis es muy simple y estricta.

Primero, no podemos generar dinámicamente ningún parámetro de import.

La ruta del módulo debe ser una cadena primitiva, no puede ser una llamada de función. Esto no funcionará:

import ... from getModuleName(); // Error, from sólo permite "string"
En segundo lugar, no podemos importar condicionalmente o en tiempo de ejecución:

if(...) {
  import ...; // ¡Error, no permitido!
}

{
  import ...; // Error, no podemos poner importación en ningún bloque.
}
Esto se debe a que import/export proporcionan una columna vertebral para la estructura del código. Eso es algo bueno, ya que la estructura del código se puede analizar, los módulos se pueden reunir y agrupar en un archivo mediante herramientas especiales, las exportaciones no utilizadas se pueden eliminar (“tree-shaken”). Eso es posible solo porque la estructura de las importaciones/exportaciones es simple y fija.

Pero, ¿cómo podemos importar un módulo dinámicamente, a petición?

La expresión import()
La expresión import(module) carga el módulo y devuelve una promesa que se resuelve en un objeto de módulo que contiene todas sus exportaciones. Se puede llamar desde cualquier lugar del código.

Podemos usarlo dinámicamente en cualquier lugar del código, por ejemplo:

let modulePath = prompt("¿Qué modulo cargar?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)
O, podríamos usar let module = await import(modulePath) si está dentro de una función asíncrona.

Por ejemplo, si tenemos el siguiente módulo say.js:

// 📁 say.js
export function hi() {
  alert(`Hola`);
}

export function bye() {
  alert(`Adiós`);
}
…Entonces la importación dinámica puede ser así:

let {hi, bye} = await import('./say.js');

hi();
bye();
O, si say.js tiene la exportación predeterminada:

// 📁 say.js
export default function() {
  alert("Módulo cargado (export default)!");
}
…Luego, para acceder a él, podemos usar la propiedad default del objeto del módulo:

let obj = await import('./say.js');
let say = obj.default;
// o, en una línea: let {default: say} = await import('./say.js');

say();
Aquí está el ejemplo completo:

Resultadosay.jsindex.html
<!doctype html>
<script>
  async function load() {
    let say = await import('./say.js');
    say.hi(); // ¡Hola!
    say.bye(); // ¡Adiós!
    say.default(); // Módulo cargado (export default)!
  }
</script>
<button onclick="load()">Click me</button>
  
export function hi() {
  alert(`Hola`);
}

export function bye() {
  alert(`Adiós`);
}

export default function() {
  alert("Módulo cargado (export default)!");
}

Por favor tome nota:
Las importaciones dinámicas funcionan en scripts normales, no requieren script type="module".

Por favor tome nota:
Aunque import() parece una llamada de función, es una sintaxis especial que solo usa paréntesis (similar a super ()).

Por lo tanto, no podemos copiar import a una variable o usar call/apply con ella. No es una función.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/modules/readme.md)
