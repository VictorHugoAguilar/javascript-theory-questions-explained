# Recursión y pila

Volvamos a las funciones y estudiémoslas más en profundidad.

Nuestro primer tema será la *recursividad*.

Si no eres nuevo en la programación, probablemente te resulte familiar y puedes saltarte este capítulo.

La recursión es un patrón de programación que es útil en situaciones en las que una tarea puede dividirse naturalmente en varias tareas del mismo tipo, pero más simples. O cuando una tarea se puede simplificar en una acción fácil más una variante más simple de la misma tarea. O, como veremos pronto, tratar con ciertas estructuras de datos.

Sabemos que cuando una función resuelve una tarea, en el proceso puede llamar a muchas otras funciones. Un caso particular de esto se da cuando una función se llama a sí misma. Esto es lo que se llama *recursividad*.

## Dos formas de pensar

Para comenzar con algo simple, escribamos una función `pow(x, n)` que eleve `x` a una potencia natural de `n`. En otras palabras, multiplica `x` por sí mismo `n` veces.

````js
pow(2, 2) = 4
pow(2, 3) = 8
pow(2, 4) = 16
````

Hay dos formas de implementarlo.

1. **Pensamiento iterativo**: el bucle `for`:

````js
function pow(x, n) {
  let result = 1;

  // multiplicar el resultado por x n veces en el ciclo
  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}

alert( pow(2, 3) ); // 8
````

2. **Pensamiento recursivo**: simplifica la tarea y se llama a sí mismo:

````js
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow(x, n - 1);
  }
}

alert( pow(2, 3) ); // 8
````

> Note cómo la variante recursiva es fundamentalmente diferente.

Cuando se llama a `pow(x, n)`, la ejecución se divide en dos ramas:

````js
              if n==1  = x
             /
pow(x, n) =
             \
              else     = x * pow(x, n - 1)
````

1. Si `n == 1`, entonces todo es trivial. Esto se llama base de la recursividad, porque produce inmediatamente el resultado obvio: `pow(x, 1)` es igual a `x`.

2. De lo contrario, podemos representar `pow(x, n)` como `x * pow(x, n - 1)`. En matemáticas, uno escribiría `xn = x * x n-1`. Esto se llama paso recursivo: transformamos la tarea en una acción más simple (multiplicación por `x`) y una llamada más simple de la misma tarea (`pow` con menor `n`). 

Los siguientes pasos lo simplifican más y más hasta que n llegue a `1`.

También podemos decir que `pow` se llama a sí mismo recursivamente hasta que `n == 1`.

![recursividad](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/recurvisidad_01.png?raw=true)

Por ejemplo, para calcular `pow(2, 4)` la variante recursiva realiza estos pasos:

1. pow(2, 4) = 2 * pow(2, 3)
2. pow(2, 3) = 2 * pow(2, 2)
3. pow(2, 2) = 2 * pow(2, 1)
4. pow(2, 1) = 2

Por lo tanto, la recursión reduce una llamada de función a una más simple y luego… a una más simple, y así sucesivamente, hasta que el resultado se vuelve obvio.

> La recursión suele ser más corta
Una solución recursiva suele ser más corta que una iterativa.

Aquí podemos reescribir lo mismo usando el operador condicional `?` En lugar de `if` para hacer que `pow(x, n)` sea más conciso y aún bastante legible:

````js
function pow (x, n) {
   return (n == 1)? x: (x * pow (x, n - 1));
}
````

El número máximo de llamadas anidadas (incluida la primera) se llama profundidad de recursión. En nuestro caso, será exactamente `n`.

La profundidad máxima de recursión está limitada por el motor de JavaScript. Podemos confiar en que sea 10 000; algunos motores permiten más, pero 100 000 probablemente esté fuera del límite para la mayoría de ellos. Hay optimizaciones automáticas que ayudan a aliviar esto (“optimizaciones de llamadas de cola”), pero aún no tienen soporte en todas partes y funcionan solo en casos simples.

Eso limita la aplicación de la recursividad, pero sigue siendo muy amplia. Hay muchas tareas donde la forma recursiva de pensar proporciona un código más simple y fácil de mantener.

## El contexto de ejecución y pila

Ahora examinemos cómo funcionan las llamadas recursivas. Para eso espiemos lo que sucede bajo la capa en las funciones.

La información sobre el proceso de ejecución de una función en ejecución se almacena en su contexto de ejecución.

El contexto de ejecución es una estructura de datos interna que contiene detalles sobre la ejecución de una función: dónde está el flujo de control ahora, las variables actuales, el valor de this (que no usamos aquí) y algunos otros detalles internos.

Una llamada de función tiene exactamente un contexto de ejecución asociado.

Cuando una función realiza una llamada anidada, sucede lo siguiente:

* La función actual se pausa.
* El contexto de ejecución asociado con él se recuerda en una estructura de datos especial llamada pila de contexto de ejecución.
* La llamada anidada se ejecuta.
* Una vez que finaliza, el antiguo contexto de ejecución se recupera de la pila y la función externa se reanuda desde donde se pausó.

Veamos qué sucede durante la llamada de `pow(2, 3)`.

**pow (2, 3)**

Al comienzo de la llamada `pow(2, 3)` el contexto de ejecución almacenará variables: `x = 2, n = 3`, el flujo de ejecución está en la línea `1` de la función.

Podemos esbozarlo como:

![context](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/contexto_01.png?raw=true)

Ahí es cuando la función comienza a ejecutarse. La condición n == 1 es falsa, por lo que el flujo continúa en la segunda rama de if:

````js
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow(x, n - 1);
  }
}

alert( pow(2, 3) );
````

Las variables son las mismas, pero la línea cambia, por lo que el contexto es ahora:

![contexto_2](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/contexto_02.png?raw=true)

Para calcular `x * pow (x, n - 1)`, necesitamos hacer una sub-llamada de pow con nuevos argumentos `pow (2, 2)`.

**pow (2, 2)**

Para hacer una llamada anidada, JavaScript recuerda el contexto de ejecución actual en la pila de contexto de ejecución.

Aquí llamamos a la misma función pow, pero no importa en absoluto. El proceso es el mismo para todas las funciones:

* El contexto actual se “recuerda” en la parte superior de la pila.
* El nuevo contexto se crea para la subllamada.
* Cuando finaliza la subllamada, el contexto anterior se extrae de la pila y su ejecución continúa.

Aquí está la pila de contexto cuando ingresamos la subllamada `pow(2, 2)`:

![context_3](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/representacion_03a.png?raw=true)

El nuevo contexto de ejecución actual está en la parte superior (y en negrita), y los contextos recordados anteriores están debajo.

Cuando terminamos la subllamada: es fácil reanudar el contexto anterior, ya que mantiene ambas variables y el lugar exacto del código donde se detuvo.

> Por favor tome nota:
En la figura usamos la palabra línea “line” porque en nuestro ejemplo hay solo una subllamada en línea, pero generalmente una simple línea de código puede contener múltiples subllamadas, como `pow(…) + pow(…) + otraCosa(…)`.

Entonces sería más preciso decir que la ejecución se reanuda “inmediatamente después de la subllamada”.

**pow(2,1)**

El proceso se repite: se realiza una nueva subllamada en la línea 5, ahora con argumentos `x = 2, n = 1`.

Se crea un nuevo contexto de ejecución, el anterior se coloca en la parte superior de la pila:

![context_4](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/contexto_03.png?raw=true)

Hay 2 contextos antiguos ahora y 1 actualmente en ejecución para `pow(2, 1)`.

**La salida**

Durante la ejecución de `pow(2, 1)`, a diferencia de antes, la condición `n == 1` es verdadera, por lo que funciona la primera rama de if :

````js
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow(x, n - 1);
  }
}
````

No hay más llamadas anidadas, por lo que la función finaliza y devuelve `2`.

Cuando finaliza la función, su contexto de ejecución ya no es necesario y se elimina de la memoria. El anterior se restaura desde la parte superior de la pila:

![context_5](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/contexto_04.png?raw=true)

Se reanuda la ejecución de `pow(2, 2)`. Tiene el resultado de la subllamada `pow(2, 1)`, por lo que también puede finalizar la evaluación de `x * pow(x, n - 1)`, devolviendo `4`.

Luego se restaura el contexto anterior:

![cotext_6](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/advanced-functions/01_recursion/img/contexto_05.png?raw=true)

Cuando termina, tenemos un resultado de `pow(2, 3) = 8`.

La profundidad de recursión en este caso fue: **3**.

Como podemos ver en las ilustraciones anteriores, la profundidad de recursión es igual al número máximo de contexto en la pila.

Tenga en cuenta los requisitos de memoria. Los contextos toman memoria. En nuestro caso, elevar a la potencia de `n` realmente requiere la memoria para `n` contextos, para todos los valores más bajos de `n`.

Un algoritmo basado en bucles ahorra más memoria:

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
````

El pow iterativo utiliza un solo contexto, cambiando i y result en el proceso. Sus requisitos de memoria son pequeños, fijos y no dependen de n.

Cualquier recursión puede reescribirse como un bucle. La variante de bucle generalmente se puede hacer más eficaz.

… Pero a veces la reescritura no es trivial, especialmente cuando la función utiliza sub-llamadas recursivas diferentes según las condiciones y combina sus resultados, o cuando la ramificación es más intrincada. Y la optimización podría ser innecesaria y no merecer la pena el esfuerzo en absoluto.

La recursión puede dar un código más corto y fácil de entender y mantener. No se requiere optimización en todo lugar, principalmente lo que nos interesa es un buen código y por eso se usa.

## Recorridos recursivos

Otra gran aplicación de la recursión es un recorrido recursivo.

Imagina que tenemos una empresa. La estructura del personal se puede presentar como un objeto:

```js
let company = {
  sales: [{
    name: 'John',
    salary: 1000
  }, {
    name: 'Alice',
    salary: 1600
  }],

  development: {
    sites: [{
      name: 'Peter',
      salary: 2000
    }, {
      name: 'Alex',
      salary: 1800
    }],

    internals: [{
      name: 'Jack',
      salary: 1300
    }]
  }
};
````

Vemos que esta empresa tiene departamentos.

Un departamento puede tener una gran variedad de personal. Por ejemplo, el departamento de ventas sales tiene 2 empleados: John y Alice.

O un departamento puede dividirse en subdepartamentos, como development que tiene dos ramas: sites e internals: cada uno de ellos tiene su propio personal.

También es posible que cuando un subdepartamento crece, se divida en subdepartamentos (o equipos).

Por ejemplo, el departamento sites en el futuro puede dividirse en equipos para siteA y siteB. Y ellos, potencialmente, pueden dividirse aún más. Eso no está en la imagen, es solo algo a tener en cuenta.

Ahora digamos que queremos una función para obtener la suma de todos los salarios. ¿Cómo podemos hacer eso?

Un enfoque iterativo no es fácil, porque la estructura no es simple. La primera idea puede ser hacer un bucle for sobre company con un sub-bucle anidado sobre departamentos de primer nivel. Pero luego necesitamos más sub-bucles anidados para iterar sobre el personal en los departamentos de segundo nivel como sites. …¿Y luego otro sub-bucle dentro de los de los departamentos de tercer nivel que podrían aparecer en el futuro? ¿Deberíamos parar en el nivel 3 o hacer 4 niveles de bucles? Si ponemos 3-4 bucles anidados en el código para atravesar un solo objeto, se vuelve bastante feo.

Probemos la recursividad.

Como podemos ver, cuando nuestra función hace que un departamento sume, hay dos casos posibles:

O bien es un departamento “simple” con una array de personas: entonces podemos sumar los salarios en un bucle simple.
O es un objeto con N subdepartamentos: entonces podemos hacer N llamadas recursivas para obtener la suma de cada uno de los subdepartamentos y combinar los resultados.
El primer caso es la base de la recursividad, el caso trivial, cuando obtenemos un array.

El segundo caso, cuando obtenemos un objeto, es el paso recursivo. Una tarea compleja se divide en subtareas para departamentos más pequeños. A su vez, pueden dividirse nuevamente, pero tarde o temprano la división terminará en (1).

El algoritmo es probablemente aún más fácil de leer desde el código:

```js
let company = { // el mismo objeto, comprimido por brevedad
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 1600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// La función para hacer el trabajo
function sumSalaries(department) {
  if (Array.isArray(department)) { // caso (1)
    return department.reduce((prev, current) => prev + current.salary, 0); // suma del Array
  } else { // caso (2)
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // llama recursivamente a subdepartamentos, suma los resultados
    }
    return sum;
  }
}

alert(sumSalaries(company)); // 7700
````

El código es corto y fácil de entender (¿Quizás?). Ese es el poder de la recursividad. También funciona para cualquier nivel de anidamiento de subdepartamentos.

Aquí está el diagrama de llamadas:

![llamadas](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/llamadas_01.png?raw=true)

Podemos ver fácilmente el principio: para un objeto {...} se realizan subllamadas, mientras que los Arrays [...] son las “hojas” del árbol recursivo y dan un resultado inmediato.

Tenga en cuenta que el código utiliza funciones inteligentes que hemos cubierto antes:

Método arr.reduce explicado en el capítulo Métodos de arrays para obtener la suma del Array.
Bucle for (val of Object.values (obj)) para iterar sobre los valores del objeto: Object.values devuelve una matriz de ellos.
Estructuras recursivas
Una estructura de datos recursiva (definida recursivamente) es una estructura que se replica en partes.

Lo acabamos de ver en el ejemplo de la estructura de la empresa anterior.

Un departamento de la empresa es:

O un array de personas.
O un objeto con departamentos.
Para los desarrolladores web hay ejemplos mucho más conocidos: documentos HTML y XML.

En el documento HTML, una etiqueta HTML puede contener una lista de:

Piezas de texto.
Comentarios HTML.
Otras etiquetas HTML (que a su vez pueden contener textos/comentarios, otras etiquetas, etc…).
Esa es, una vez más, una definición recursiva.

Para una mejor comprensión, cubriremos una estructura recursiva más llamada “Lista enlazada” que podría ser una mejor alternativa para las matrices en algunos casos.

Lista enlazada
Imagina que queremos almacenar una lista ordenada de objetos.

La elección natural sería un array:

```js
let arr = [obj1, obj2, obj3];
```

…Pero hay un problema con los Arrays. Las operaciones “eliminar elemento” e “insertar elemento” son costosas. Por ejemplo, la operación arr.unshift(obj) debe renumerar todos los elementos para dejar espacio para un nuevo obj, y si la matriz es grande, lleva tiempo. Lo mismo con arr.shift ().

Las únicas modificaciones estructurales que no requieren renumeración masiva son aquellas que operan con el final del array: arr.push/pop. Por lo tanto, un array puede ser bastante lento para grandes colas si tenemos que trabajar con el principio del mismo.

Como alternativa, si realmente necesitamos una inserción/eliminación rápida, podemos elegir otra estructura de datos llamada lista enlazada.

El elemento de lista enlazada se define de forma recursiva como un objeto con:

* value.
* propiedad next que hace referencia al siguiente elemento de lista enlazado o null si ese es el final.

Por ejemplo:

```js

let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};
````

Representación gráfica de la lista:

![representacion_1](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/representacion_01.png?raw=true)

Un código alternativo para la creación:

```js

let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };
list.next.next.next.next = null;
````

Aquí podemos ver aún más claramente que hay varios objetos, cada uno tiene su value y un next apuntando al vecino. La variable list es el primer objeto en la cadena, por lo que siguiendo los punterosnext de ella podemos alcanzar cualquier elemento.

La lista se puede dividir fácilmente en varias partes y luego volver a unir:

```js
let secondList = list.next.next;
list.next.next = null;
````

![representacion_2](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/representacion_02.png?raw=true)

Para unir:

```js
list.next.next = secondList;
````

Y seguro, podemos insertar o eliminar elementos en cualquier lugar.

Por ejemplo, para anteponer un nuevo valor, necesitamos actualizar el encabezado de la lista:

```js
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };

// anteponer el nuevo valor a la lista
list = { value: "new item", next: list };
````
![representacion_3](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/representacion_03.png?raw=true)

Para eliminar un valor del medio, cambie el next del anterior:


```js
list.next = list.next.next;
```
![representacion_4](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/representacion_04.png?raw=true)

Hicimos que list.next salte sobre 1 al valor 2. El valor 1 ahora está excluido de la cadena. Si no se almacena en ningún otro lugar, se eliminará automáticamente de la memoria.

A diferencia de los arrays, no hay renumeración en masa, podemos reorganizar fácilmente los elementos.

Naturalmente, las listas no siempre son mejores que los Arrays. De lo contrario, todos usarían solo listas.

El principal inconveniente es que no podemos acceder fácilmente a un elemento por su número. En un Array eso es fácil: arr[n] es una referencia directa. Pero en la lista tenemos que comenzar desde el primer elemento e ir siguiente N veces para obtener el enésimo elemento.

… Pero no siempre necesitamos tales operaciones. Por ejemplo, cuando necesitamos una cola o incluso un deque: la estructura ordenada que debe permitir agregar/eliminar elementos muy rápidamente desde ambos extremos.

Las “listas” pueden ser mejoradas:

* Podemos agregar la propiedad prev (previo) junto a next (siguiente) para referenciar el elemento previo para mover hacia atrás fácilmente.
* Podemos también agregar una variable llamada tail (cola) referenciando el último elemento de la lista (y actualizarla cuando se agregan/remueven elementos del final).
* …La estructura de datos puede variar de acuerdo a nuestras necesidades.

## Resumen

### Glosario:

* Recursion es concepto de programación que significa que una función se llama a sí misma. Las funciones recursivas se pueden utilizar para resolver ciertas tareas de manera elegante.

Cada vez que una función se llama a sí misma ocurre un paso de recursión. La base de la recursividad se da cuando los argumentos de la función hacen que la tarea sea tan básica que la función no realiza más llamadas.

* Una estructura de datos definida recursivamente es una estructura de datos que se puede definir utilizándose a sí misma.

Por ejemplo, la lista enlazada se puede definir como una estructura de datos que consiste en un objeto que hace referencia a una lista (o nulo).

````js
list = { value, next -> list }
````

Los árboles como el árbol de elementos HTML o el árbol de departamentos de este capítulo también son naturalmente recursivos: se ramifican y cada rama puede tener otras ramas.

Las funciones recursivas se pueden usar para recorrerlas como hemos visto en el ejemplo `sumSalary`.

Cualquier función recursiva puede reescribirse en una iterativa. Y eso a veces es necesario para optimizar las cosas. Pero para muchas tareas, una solución recursiva es lo suficientemente rápida y fácil de escribir y mantener.

<hr>

# Ejercicio

## Suma todos los números hasta el elegido

Escribe una función sumTo(n) que calcule la suma de los números 1 + 2 + ... + n.

Por ejemplo:

```js
sumTo(1) = 1
sumTo(2) = 2 + 1 = 3
sumTo(3) = 3 + 2 + 1 = 6
sumTo(4) = 4 + 3 + 2 + 1 = 10
...
sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050
```

Escribe 3 soluciones diferentes:

1. Utilizando un bucle for.
2. Usando la recursividad, pues sumTo(n) = n + sumTo(n-1) para n > 1.
3. Utilizando la fórmula de progresión aritmética.

Un ejemplo del resultado:

```js
function sumTo(n) { /*... tu código ... */ }

alert( sumTo(100) ); // 5050
`````

P.D. ¿Qué variante de la solución es la más rápida? ¿Y la más lenta? ¿Por qué?

P.P.D. ¿Podemos usar la recursión para contar sumTo(100000)?

[Solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/solutions/suma_numeros_hasta_elegido.md)

## Calcula el factorial

El factorial de un número natural es un número multiplicado por "número menos uno", luego por "número menos dos", y así sucesivamente hasta 1. El factorial de n se denota como n!

Podemos escribir la definición de factorial así:

```js
n! = n * (n - 1) * (n - 2) * ...*1
````

Valores de factoriales para diferentes n:

```js
1! = 1
2! = 2 * 1 = 2
3! = 3 * 2 * 1 = 6
4! = 4 * 3 * 2 * 1 = 24
5! = 5 * 4 * 3 * 2 * 1 = 120
````

La tarea es escribir una función factorial(n) que calcule n! usando llamadas recursivas.

```js
alert( factorial(5) ); // 120
````

P.D. Pista: n! puede ser escrito como n * (n-1)! Por ejemplo: 3! = 3*2! = 3*2*1! = 6

[Solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/solutions/factorial_numero.md)

## Sucesión de Fibonacci

La secuencia de sucesión de Fibonacci tiene la fórmula Fn = Fn-1 + Fn-2. En otras palabras, el siguiente número es una suma de los dos anteriores.

Los dos primeros números son 1, luego 2(1+1), luego 3(1+2), 5(2+3) y así sucesivamente: 1, 1, 2, 3, 5, 8, 13, 21....

La sucesión de Fibonacci está relacionada la proporción áurea y muchos fenómenos naturales alrededor nuestro.

Escribe una función fib(n) que devuelve la secuencia n-th de Fibonacci.

Un ejemplo de trabajo:

```js
function fib(n) { /* your code */ }

alert(fib(3)); // 2
alert(fib(7)); // 13
alert(fib(77)); // 5527939700884757
````

P.D. La función debería ser rápida. La llamada a fib(77) no debería tardar más de una fracción de segundo.

[Solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/avanced-functions/solutions) 

## Generar una lista de un solo enlace

Digamos que tenemos una lista de un solo enlace (como se describe en el capítulo Recursión y pila):

```js
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};
````

Escribe una función printList(list) que genere los elementos de la lista uno por uno.

Haz dos variantes de la solución: utilizando un bucle y utilizando recursividad.

¿Qué es mejor: con recursividad o sin ella?

[Solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/solutions/generar_lista_solo_enlace.md)

## Genere una lista de un solo enlace en orden inverso

Genere una lista de un solo enlace a partir de la tarea anterior Generar una lista de un solo enlace en orden inverso.

Escribe dos soluciones: utilizando un bucle y utilizando recursividad.

¿Qué es mejor: con recursividad o sin ella?

## Genere una lista de un solo enlace en orden inverso

Genere una lista de un solo enlace a partir de la tarea anterior Generar una lista de un solo enlace en orden inverso.

Escribe dos soluciones: utilizando un bucle y utilizando recursividad.

[Solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/avanced-functions/solutions/genere-una-lista-de-un-solo-enlace-en-orden-inverso.md)

