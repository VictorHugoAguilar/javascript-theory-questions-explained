# un-bucle-infinito-ocasional

Es porque i nunca sería igual a 10.

Ejecuta esto para ver los valores reales de i:

````js
let i = 0;
while (i < 11) {
  i += 0.2;
  if (i > 9.8 && i < 10.2) alert( i );
}
````

Ninguno de ellos es exactamente 10.

Tales cosas suceden por las pérdidas de precisión cuando sumamos decimales como 0.2.

Conclusión: evita chequeos de igualdad al trabajar con números decimales.

--
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/number/readme.md#un-bucle-infinito-ocasional)
