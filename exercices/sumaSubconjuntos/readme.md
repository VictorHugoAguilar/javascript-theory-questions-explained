En este reto partimos de un conjunto de enteros positivos (le llamaremos lista) y un entero (le llamaremos suma). Se trata de encontar esi existe algún subconjunto de lista suyos componentes sumen el valor de suma

La idea es resolverlo mediante programación dinámica, no recursiva. Es decir parte del caso más simple y ve ampliando hasta encontrar la solución.

Ejemplos de la función:

existeSuma([3,4,2,8,7], 6)   -> true   

existeSuma([3,4,2,8,7], 26)   -> false   

existeSuma([4],  4)   -> true  
