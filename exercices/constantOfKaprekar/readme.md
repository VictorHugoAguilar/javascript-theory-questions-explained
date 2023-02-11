## Constante de Kaprekar

El número 6174 es conocido como la Constante de Kaprekar en honor de su descubridor el matemático indio Dattatreya Ramachandra Kaprekar. Este número es el resultado de la aplicación repetida de la Operación de Kaprekar1​2​ que consiste en los siguientes pasos:

* Escoger cualquier número de cuatro dígitos (con limitadas excepciones, véase más abajo).
* Ordenar los cuatro dígitos en orden descendente, para obtener el minuendo de una resta.
* Ordenar los mismos cuatro dígitos en orden ascendente, para obtener el sustraendo de la misma resta.
* Calcular el resto, restando el sustraendo del minuendo.
* Si el resto no es igual a 6174, repetir los cuatro pasos anteriores, añadiendo ceros a la derecha al minuendo y a la izquierda al sustraendo, siempre que sea necesario para completar los cuatro dígitos.

Esta operación, repetida si es necesario en varias ocasiones (nunca más de siete veces), termina dando el resultado 6174. El proceso termina porque si se sigue repitiendo la secuencia de pasos, se sigue obteniendo el mismo resultado ya que 7641 – 1467 = 6174.

Por ejemplo, supongamos que partimos del número de cuatro dígitos 5432:

```js
5432 – 2345 = 3087
8730 – 0378 = 8352
8532 – 2358 = 6174
````

**Excepciones**: números de cuatro dígitos iguales, por ejemplo, el 1111, debido que su sustracción resulta en el número cero. Números de cuatro dígitos con tres números repetidos, como por ejemplo, el 1112, resultan en 999 después de una iteración de la resta, y resultarían en 0, después de una segunda, si no se añadieran ceros a la derecha al minuendo y a la izquierda al sustraendo para completar los cuatro dígitos, del siguiente modo:

```js
2111 – 1112 = 0999
9990 – 0999 = 8991
9981 – 1899 = 8082
8820 – 0288 = 8532
8532 – 2358 = 6174
````

**Particularidades**:
Todos los números que surgen de la resta, y así también los números ordenados de menor a mayor y de mayor a menor son divisibles por 9
