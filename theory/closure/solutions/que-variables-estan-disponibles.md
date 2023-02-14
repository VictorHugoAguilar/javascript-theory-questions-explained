La respuesta es: Pete.

La función work() en el código a continuación obtiene name del lugar de su origen a través de la referencia del entorno léxico externo:

![que-variables-estan-disponibles](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/closure/solutions/que-variables-estan-disponibles.png?raw=true)

Entonces, el resultado es “Pete”.

Pero si no hubiera let name enmakeWorker (), entonces la búsqueda saldría y tomaría la variable global como podemos ver en la cadena de arriba. En ese caso, el resultado sería John.
