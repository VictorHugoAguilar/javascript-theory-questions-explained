# un-numero-aleatorio-entre-min-y-max

Necesitamos hacer un “mapeo” de todos los valores del intervalo 0…1 a valores desde min a max.

Esto puede hacerse en dos pasos:

Si multiplicamos el número aleatorio 0…1 por max-min, entonces el intervalo de valores posibles va de 0..1 a 0..max-min.
Ahora si sumamos min, el intervalo posible se vuelve desde min a max.
La función:

````js
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert( random(1, 5) );
alert( random(1, 5) );
alert( random(1, 5) );
````js

--
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/number/readme.md#un-numero-aleatorio-entre-min-y-max)
