# transforma-border-left-width-en-borderleftwidth

````js
function camelize(str) {
  return str
    .split('-') // separa 'my-long-word' en el array ['my', 'long', 'word']
    .map(
      // convierte en mayúscula todas las primeras letras de los elementos del array excepto por el primero
      // convierte ['my', 'long', 'word'] en ['my', 'Long', 'Word']
      (word, index) => index == 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(''); // une ['my', 'Long', 'Word'] en 'myLongWord'
}


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/array-methods/readme.md#transforma-border-left-width-en-borderleftwidth)
