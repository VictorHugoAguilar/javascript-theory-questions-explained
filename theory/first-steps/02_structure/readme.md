# 📖 Estructura del código

Lo primero que estudiaremos son los bloques de construcción del código.

## Sentencias

Las sentencias son construcciones sintácticas y comandos que realizan acciones.

Ya hemos visto una sentencia, `alert('¡Hola mundo!'), que muestra el mensaje “¡Hola mundo!”.

Podemos tener tantas sentencias en nuestro código como queramos, las cuales se pueden separar con un punto y coma.

Por ejemplo, aquí separamos “Hello World” en dos alerts:

````js
alert('Hola'); alert('Mundo');
````

Generalmente, las sentencias se escriben en líneas separadas para hacer que el código sea más legible:

````js
alert('Hola');
alert('Mundo');
````js

## Punto y coma

Se puede omitir un punto y coma en la mayoría de los casos cuando existe un salto de línea.

Esto también funcionaría:

````js
alert('Hola')
alert('Mundo')
````

Aquí, JavaScript interpreta el salto de línea como un punto y coma “implícito”. Esto se denomina inserción automática de punto y coma.

**En la mayoría de los casos, una nueva línea implica un punto y coma. Pero “en la mayoría de los casos” no significa “siempre”!**

Hay casos en que una nueva línea no significa un punto y coma. Por ejemplo:

````js
alert(3 +
1
+ 2);
````

El código da como resultado 6 porque JavaScript no inserta punto y coma aquí. Es intuitivamente obvio que si la línea termina con un signo más "+", es una “expresión incompleta”, un punto y coma aquí sería incorrecto. Y en este caso eso funciona según lo previsto.

**Pero hay situaciones en las que JavaScript “falla” al asumir un punto y coma donde realmente se necesita.**

Los errores que ocurren en tales casos son bastante difíciles de encontrar y corregir.

### ℹ️ Un ejemplo de error

Si tienes curiosidad por ver un ejemplo concreto de tal error, mira este código:

````js
alert("Hello");

[1, 2].forEach(alert);
````

No es necesario pensar en el significado de los corchetes `[]` y `forEach` todavía, los estudiaremos más adelante. Por ahora, solo recuerda el resultado del código: muestra `Hello`, `luego 1`, `luego 2`.

Quitemos el punto y coma del alert:

````js
alert("Hello")

[1, 2].forEach(alert);
````

La diferencia, comparando con el código anterior, es de solo un carácter: falta el punto y coma al final de la primera línea.

Esta vez, si ejecutamos el código, solo se ve el primer `Hello` (y un error pero necesitas abrir la consola para verlo). Los números no aparecen más.

Esto ocurre porque JavaScript no asume un punto y coma antes de los corchetes `[...]`, entonces el código del primer ejemplo se trata como una sola sentencia.

Así es como lo ve el motor:

````js
alert("Hello")[1, 2].forEach(alert);
````

Se ve extraño, ¿verdad? Tal unión en este caso es simplemente incorrecta. Necesitamos poner un punto y coma después del `alert` para que el código funcione bien.

Esto puede suceder en otras situaciones también.

Recomendamos colocar puntos y coma entre las sentencias, incluso si están separadas por saltos de línea. Esta regla está ampliamente adoptada por la comunidad. Notemos una vez más que es posible omitir los puntos y coma la mayoría del tiempo. Pero es más seguro, especialmente para un principiante, usarlos.

## Comentarios

A medida que pasa el tiempo, los programas se vuelven cada vez más complejos. Se hace necesario agregar comentarios que describan lo que hace el código y por qué.

Los comentarios se pueden poner en cualquier lugar de un script. No afectan su ejecución porque el motor simplemente los ignora.

**Los comentarios de una línea comienzan con dos caracteres de barra diagonal `//`**.

El resto de la línea es un comentario. Puede ocupar una línea completa propia o seguir una sentencia.

Como aquí:

````js
// Este comentario ocupa una línea propia.
alert('Hello');

alert('World'); // Este comentario sigue a la sentencia.
````

Los comentarios de varias líneas comienzan con una barra inclinada y un asterisco /* y terminan con un asterisco y una barra inclinada */.

Como aquí:

````js
/* Un ejemplo con dos mensajes.
Este es un comentario multilínea.
*/
alert('Hola');
alert('Mundo');
````

El contenido de los comentarios se ignora, por lo que si colocamos el código dentro de `/* … */`, no se ejecutará.

A veces puede ser útil deshabilitar temporalmente una parte del código:

````js
/* Comentando el código
alert('Hola');
*/
alert('Mundo');
````

### ℹ️ ¡Usa accesos rápidos del teclado!

En la mayoría de los editores, se puede comentar una línea de código presionando Ctrl+/ para un comentario de una sola línea y algo como Ctrl+Shift+/ – para comentarios de varias líneas (selecciona una parte del código y pulsa la tecla de acceso rápido). Para Mac, intenta Cmd en lugar de Ctrl y Option en lugar de Shift.

### ⚠️ ¡Los comentarios anidados no son admitidos!

No puede haber `/*...*/` dentro de otro `/*...*/`.

Dicho código terminará con un error:

````js
/*
  /* comentario anidado ?!? */
*/
alert( 'Mundo' );
````

Por favor, no dudes en comentar tu código.

Los comentarios aumentan el tamaño general del código, pero eso no es un problema en absoluto. Hay muchas herramientas que minimizan el código antes de publicarlo en un servidor de producción. Eliminan los comentarios, por lo que no aparecen en los scripts de trabajo. Por lo tanto, los comentarios no tienen ningún efecto negativo en la producción.

Más adelante, en el tutorial, habrá un capítulo Estilo de codificación que también explica cómo escribir mejores comentarios.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps)
