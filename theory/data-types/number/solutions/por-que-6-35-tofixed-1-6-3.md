# por-que-6-35-tofixed-1-6-3

Internamente, la fracción decimal 6.35 resulta en binario sin fin. Como siempre en estos casos, es almacenado con pérdida de precisión.

Veamos:

````js
alert( 6.35.toFixed(20) ); // 6.34999999999999964473
````

La pérdida de precisión puede causar que el número incremente o decremente. En este caso particular el número se vuelve ligeramente menor, por ello es redondeado hacia abajo.

¿Y qué pasa con 1.35?

````js
alert( 1.35.toFixed(20) ); // 1.35000000000000008882
````

Aquí la pérdida de precisión hace el número algo mayor, por ello redondea hacia arriba.

¿Cómo podemos arreglar el problema con 6.35 si queremos redondearlo de manera correcta?

Debemos llevarlo más cerca de un entero antes del redondeo:

````js
alert( (6.35 * 10).toFixed(20) ); // 63.50000000000000000000
````

Observa que 63.5 no tiene pérdida de precisión en absoluto. Esto es porque la parte decimal 0.5 es realmente 1/2. Fracciones divididas por potencias de 2 son representadas exactamente en el sistema binario, ahora podemos redondearlo:

````js
alert( Math.round(6.35 * 10) / 10 ); // 6.35 -> 63.5 -> 64(redondeado) -> 6.4
````

--
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/number/readme.md#s#por-que-6-35-tofixed-1-6-3)
