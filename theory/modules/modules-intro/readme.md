# 📖 Módulos, introducción

A medida que nuestra aplicación crece, queremos dividirla en múltiples archivos, llamados “módulos”. Un módulo puede contener una clase o una biblioteca de funciones para un propósito específico.

Durante mucho tiempo, JavaScript existió sin una sintaxis de módulo a nivel de lenguaje. Eso no fue un problema, porque inicialmente los scripts eran pequeños y simples, por lo que no era necesario.

Pero con el tiempo los scripts se volvieron cada vez más complejos, por lo que la comunidad inventó una variedad de formas de organizar el código en módulos, bibliotecas especiales para cargar módulos a pedido.

Para nombrar algunos (por razones históricas):

* AMD – uno de los sistemas de módulos más antiguos, implementado inicialmente por la biblioteca require.js.
* CommonJS – el sistema de módulos creado para el servidor Node.js.
* UMD – un sistema de módulos más, sugerido como universal, compatible con AMD y CommonJS.

Ahora, todo esto se convierte lentamente en una parte de la historia, pero aún podemos encontrarlos en viejos scripts.

El sistema de módulos a nivel de idioma apareció en el estándar en 2015, evolucionó gradualmente desde entonces y ahora es compatible con todos los principales navegadores y en Node.js. Así que estudiaremos los módulos modernos de Javascript de ahora en adelante.

## Qué es un módulo?

Un módulo es solo un archivo. Un script es un módulo. Tan sencillo como eso.

Los módulos pueden cargarse entre sí y usar directivas especiales export e import para intercambiar funcionalidad, llamar a funciones de un módulo de otro:

* La palabra clave export etiqueta las variables y funciones que deberían ser accesibles desde fuera del módulo actual.
* `import` permite importar funcionalidades desde otros módulos.

Por ejemplo, si tenemos un archivo sayHi.js que exporta una función:

````js
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
````

…Luego, otro archivo puede importarlo y usarlo:

````js
// 📁 main.js
import {sayHi} from './sayHi.js';

alert(sayHi); // function...
sayHi('John'); // Hello, John!
````

La directiva import carga el módulo por la ruta ./sayHi.js relativo con el archivo actual, y asigna la función exportada sayHi a la variable correspondiente.

Ejecutemos el ejemplo en el navegador.

Como los módulos admiten palabras clave y características especiales, debemos decirle al navegador que un script debe tratarse como un módulo, utilizando el atributo <script type =" module ">.

Asi:

Resultado

// index.html

````html
<!doctype html>
<script type="module">
  import {sayHi} from './say.js';

  document.body.innerHTML = sayHi('John');
</script>
````

````js
export function sayHi(user){
  return `Hello, ${user}`;
}  
````

El navegador busca y evalúa automáticamente el módulo importado (y sus importaciones si es necesario), y luego ejecuta el script.

### ⚠️ Los módulos funcionan solo a través de HTTP(s), no localmente
Si intenta abrir una página web localmente a través del protocolo file://, encontrará que las directivas import y export no funcionan. Use un servidor web local, como static-server o use la capacidad de “servidor en vivo” de su editor, como VS Code Live Server Extension para probar los módulos.

## Características del módulo central
¿Qué hay de diferente en los módulos en comparación con los scripts “normales”?

Hay características principales, válidas tanto para el navegador como para JavaScript del lado del servidor.

### Siempre en modo estricto
Los módulos siempre trabajan en modo estricto. Por ejemplo, asignar a una variable sin declarar nos dará un error.

````html
<script type="module">
  a = 5; // error
</script>
````

### Alcance a nivel de módulo

Cada módulo tiene su propio alcance de nivel superior. En otras palabras, las variables y funciones de nivel superior de un módulo no se ven en otros scripts.

En el siguiente ejemplo, se importan dos scripts y hello.js intenta usar la variable user declarada en user.js. Falla, porque es un módulo separado (puedes ver el error en la consola):

Resultado

````html
// file: index.html

<!doctype html>
<script type="module" src="user.js"></script>
<script type="module" src="hello.js"></script>
````

````js
// file: hello.js
import {user} from './user.js';

document.body.innerHTML = user; // John
````

````js
// file: user.js
export let user = "John";
````

Los módulos deben hacer export a lo que ellos quieren que esté accesible desde afuera y hacer import de lo que necesiten.

* user.js debe exportar la variable user .
* hello.js debe importarla desde el módulo user.js.

En otra palabras, con módulos usamos import/export en lugar de depender de variables globales.

Esta es la variante correcta:

Resultado

````js  
// file: hello.js
import {user} from './user.js';

document.body.innerHTML = user; // John
````
  
````js  
// file: user.js
export let user = "John";  
````
  
````html
//  file: index.html
<!doctype html>
<script type="module" src="hello.js"></script>
````
    
En el navegador, hablando de páginas HTML, también existe el alcance independiente de nivel superior para cada <script type="module">:

Aquí hay dos scripts en la misma página, ambos type="module". No ven entre sí sus variables de nivel superior:

````html  
<script type="module">
  // La variable sólo es visible en éste script de módulo
  let user = "John";
</script>

<script type="module">
  alert(user); // Error: user no está definido
</script>
````

### ℹ️ Por favor tome nota:
En el navegador, podemos hacer que una variable sea global a nivel window si explícitamente la asignamos a la propiedad window, por ejemplo window.user = "John".

Así todos los scripts la verán, con o sin `type="module"`.

Dicho esto, hacer este tipo de variables globales está muy mal visto. Por favor evítalas.

Un código de módulo se evalúa solo la primera vez cuando se importa
Si el mismo módulo se importa en varios otros módulos, su código se ejecuta solo una vez: en el primer import. Luego, sus exportaciones se otorgan a todos los importadores que siguen.

Eso tiene consecuencias importantes para las que debemos estar prevenidos.

Echemos un vistazo usando ejemplos:

Primero, si ejecutar un código de módulo trae efectos secundarios, como mostrar un mensaje, importarlo varias veces lo activará solo una vez, la primera vez:

````js  
// 📁 alert.js
alert("Módulo es evaluado!");
````
````js
// Importar el mismo módulo desde archivos distintos

// 📁 1.js
import `./alert.js`; // Módulo es evaluado!

// 📁 2.js
import `./alert.js`; // (no muestra nada)
````
  
El segundo import no muestra nada, porque el módulo ya fue evaluado.

Existe una regla: el código de módulos del nivel superior debe ser usado para la inicialización y creación de estructuras de datos internas específicas del módulo. Si necesitamos algo que pueda ser llamado varias veces debemos exportarlo como una función, como hicimos con el sayHi de arriba.

Consideremos un ejemplo más avanzado.

Digamos que un módulo exporta un objeto:

````js  
// 📁 admin.js
export let admin = {
  name: "John"
};
````

Si este módulo se importa desde varios archivos, el módulo solo se evalúa la primera vez, se crea el objeto admin y luego se pasa a todos los importadores adicionales.

Todos los importadores obtienen exactamente el único objeto admin:

````js  
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

// Ambos 1.js y 2.js hacen referencia al mismo objeto admin
// Los cambios realizados en 1.js son visibles en 2.js
````
  
Como puedes ver, cuando 1.js cambia la propiedad name en el admin importado, entonces 2.js puede ver el nuevo admin.name.

Esto es porque el modulo se ejecuta solo una vez. Los exports son generados y luego compartidos entre importadores, entonces si algo cambia en el objeto admin, otros importadores lo verán.

**Tal comportamiento es en verdad muy conveniente, porque nos permite configurar módulos.**

En otras palabras, un módulo puede brindar una funcionalidad genérica que necesite ser configurada. Por ejemplo, la autenticación necesita credenciales. Entonces se puede exportar un objeto de configuración esperando que el código externo se lo asigne.

Aquí está el patrón clásico:

1. Un módulo exporta algún medio de configuración, por ejemplo un objeto configuración.
2. En el primer import lo inicializamos, escribimos en sus propiedades. Los scripts de la aplicación de nivel superior pueden hacerlo.
3. Importaciones posteriores usan el módulo.

Por ejemplo, el módulo admin.js puede proporcionar cierta funcionalidad (ej. autenticación), pero espera que las credenciales entren al objeto admin desde afuera:

````js  
// 📁 admin.js
export let config = { };

export function sayHi() {
  alert(`Ready to serve, ${config.user}!`);
}
````

Aquí admin.js exporta el objeto config (inicialmente vacío, pero podemos tener propiedades por defecto también).

Entonces en init.js, el primer script de nuestra app, importamos config de él y establecemos config.user:

````js    
// 📁 init.js
import {config} from './admin.js';
config.user = "Pete";
````
  
…Ahora el módulo admin.js está configurado.

Importadores posteriores pueden llamarlo, y él muestra correctamente el usuario actual:

````js  
// 📁 another.js
import {sayHi} from './admin.js';

sayHi(); // Ready to serve, Pete!
````

## import.meta

El objeto `import.meta` contiene la información sobre el módulo actual.

Su contenido depende del entorno. En el navegador, contiene la URL del script, o la URL de una página web actual si está dentro de HTML:

  ````html
<script type="module">
  alert(import.meta.url); // script URL
  // para un script inline es la URL de la página HTML actual
</script>
  ````

## En un módulo, “this” es indefinido (undefined).

Esa es una característica menor, pero para completar, debemos mencionarla.

En un módulo, el nivel superior this no está definido.

Compárelo con scripts que no sean módulos, donde this es un objeto global:

````html
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
````

## Funciones específicas del navegador

También hay varias diferencias de scripts específicas del navegador con type =" module " en comparación con las normales.

Es posible que desee omitir esta sección por ahora si está leyendo por primera vez o si no usa JavaScript en un navegador.

## Los módulos son diferidos

Los módulos están siempre diferidos, el mismo efecto que el atributo defer (descrito en el capítulo Scripts: async, defer), para ambos scripts externos y en línea.

En otras palabras:

* descargar módulos externo <script type="module" src="..."> no bloquea el procesamiento de HTML, se cargan en paralelo con otros recursos.
* los módulos esperan hasta que el documento HTML esté completamente listo (incluso si son pequeños y cargan más rápido que HTML), y luego lo ejecuta.
* se mantiene el orden relativo de los scripts: los scripts que van primero en el documento, se ejecutan primero.

Como efecto secundario, los módulos siempre “ven” la página HTML completamente cargada, incluidos los elementos HTML debajo de ellos.

Por ejemplo:

````html
<script type="module">
  alert(typeof button); // objeto: el script puede 'ver' el botón de abajo
  // debido que los módulos son diferidos, el script se ejecuta después de que la página entera se haya cargado
</script>
````
  
Abajo compare con un script normal:

````html
<script>
  alert(typeof button); // button es indefinido, el script no puede ver los elementos de abajo
  // los scripts normales corren inmediatamente, antes que el resto de la página sea procesada
</script>

<button id="button">Button</button>
````
  
Note que: ¡el segundo script se ejecuta antes que el primero! Entonces vemos primero undefined, y después object.

Esto se debe a que los módulos están diferidos, por lo que esperamos a que se procese el documento. El script normal se ejecuta inmediatamente, por lo que vemos su salida primero.

Al usar módulos, debemos tener en cuenta que la página HTML se muestra a medida que se carga, y los módulos JavaScript se ejecutan después de eso, por lo que el usuario puede ver la página antes de que la aplicación JavaScript esté lista. Es posible que algunas funciones aún no funcionen. Deberíamos poner “indicadores de carga”, o asegurarnos de que el visitante no se confunda con eso.

## Async funciona en scripts en línea

Para los scripts que no son módulos, el atributo async solo funciona en scripts externos. Los scripts asíncronos se ejecutan inmediatamente cuando están listos, independientemente de otros scripts o del documento HTML.

Para los scripts de módulo, también funciona en scripts en línea.

Por ejemplo, el siguiente script en línea tiene async, por lo que no espera nada.

Realiza la importación (extrae ./Analytics.js) y se ejecuta cuando está listo, incluso si el documento HTML aún no está terminado o si aún hay otros scripts pendientes.

Eso es bueno para la funcionalidad que no depende de nada, como contadores, anuncios, detectores de eventos a nivel de documento.

````html
<!-- todas las dependencias se extraen (analytics.js), y el script se ejecuta -->
<!-- no espera por el documento u otras etiquetas <script> -->
<script async type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
````

## Scripts externos

Los scripts externos que tengan type="module" son diferentes en dos aspectos:

1. Los scripts externos con el mismo src sólo se ejecutan una vez:

````html
<!-- el script my.js se extrae y ejecuta sólo una vez -->
<script type="module" src="my.js"></script>
<script type="module" src="my.js"></script>
````

2. Los scripts externos que se buscan desde otro origen (p.ej. otra sitio web) require encabezados CORS, como se describe en el capítulo Fetch: Cross-Origin Requests. En otras palabras, si un script de módulo es extraído desde otro origen, el servidor remoto debe proporcionar un encabezado Access-Control-Allow-Origin permitiendo la búsqueda.

<!-- otro-sitio-web.com debe proporcionar Access-Control-Allow-Origin -->
<!-- si no, el script no se ejecutará -->
<script type="module" src="http://otro-sitio-web.com/otro.js"></script>
Esto asegura mejor seguridad de forma predeterminada.

## No se permiten módulos sueltos

En el navegador, import debe obtener una URL relativa o absoluta. Los módulos sin ninguna ruta se denominan módulos sueltos. Dichos módulos no están permitidos en import.

Por ejemplo, este import no es válido:

import {sayHi} from 'sayHi'; // Error, módulo suelto
// el módulo debe tener una ruta, por ejemplo './sayHi.js' o dondequiera que el módulo esté
Ciertos entornos, como Node.js o herramientas de paquete permiten módulos simples sin ninguna ruta, ya que tienen sus propias formas de encontrar módulos y hooks para ajustarlos. Pero los navegadores aún no admiten módulos sueltos.

## Compatibilidad, “nomodule”

Los navegadores antiguos no entienden type = "module". Los scripts de un tipo desconocido simplemente se ignoran. Para ellos, es posible proporcionar un respaldo utilizando el atributo nomodule:

````html
<script type="module">
  alert("Ejecuta en navegadores modernos");
</script>

<script nomodule>
  alert("Los navegadores modernos conocen tanto type=module como nomodule, así que omita esto")
  alert("Los navegadores antiguos ignoran la secuencia de comandos con type=module desconocido, pero ejecutan esto.");
</script>
````

## Herramientas de Ensamblaje
En la vida real, los módulos de navegador rara vez se usan en su forma “pura”. Por lo general, los agrupamos con una herramienta especial como Webpack y los implementamos en el servidor de producción.

Uno de los beneficios de usar empaquetadores – dan más control sobre cómo se resuelven los módulos, permitiendo módulos simples y mucho más, como los módulos CSS/HTML.

Las herramientas de compilación hacen lo siguiente:

1. Toman un módulo “principal”, el que se pretende colocar en <script type="module"> en HTML.
2. Analiza sus dependencias: las importa y luego importaciones de importaciones etcétera.
3. Compila un único archivo con todos los módulos (o múltiples archivos, eso es ajustable), reemplazando los llamados nativos de import con funciones del empaquetador para que funcione. Los módulos de tipo “Especial” como módulos HTML/CSS también son supported.
4. Durante el proceso, otras transformaciones y optimizaciones se pueden aplicar:
  - Se elimina código inaccesible.
  - Se elimina exportaciones sin utilizar (“tree-shaking”).
  - Sentencias específicas de desarrollo tales como console y debugger se eliminan.
  - La sintaxis JavaScript moderna puede transformarse en una sintaxis más antigua con una funcionalidad similar utilizando Babel.
  - El archivo resultante se minimiza. (se eliminan espacios, las variables se reemplazan con nombres cortos, etc).

Si utilizamos herramientas de ensamblaje, entonces, a medida que los scripts se agrupan en un solo archivo (o pocos archivos), las declaraciones import/export dentro de esos scripts se reemplazan por funciones especiales de ensamblaje. Por lo tanto, el script “empaquetado” resultante no contiene ninguna import/export, no requiere type="module", y podemos ponerla en un script normal:

````html
<!-- Asumiendo que obtenemos bundle.js desde una herramienta como Webpack -->
<script src="bundle.js"></script>
````

Dicho esto, los módulos nativos también se pueden utilizar. Por lo tanto no estaremos utilizando Webpack aquí: tú lo podrás configurar más adelante.

# Resumen

Para resumir, los conceptos centrales son:

1. Un módulo es un archivo. Para que funcione import/export, los navegadores necesitan <script type="module">. Los módulos tienen varias diferencias:
  - Diferido por defecto.
  - Async funciona en scripts en línea.
  - Para cargar scripts externos de otro origen (dominio/protocolo/puerto), se necesitan encabezados CORS.
  - Se ignoran los scripts externos duplicados.
2. Los módulos tienen su propio alcance local de alto nivel y funcionalidad de intercambio a través de ‘import/export’.
3. Los módulos siempre usan use strict.
4. El código del módulo se ejecuta solo una vez. Las exportaciones se crean una vez y se comparten entre los importadores.

Cuando usamos módulos, cada módulo implementa la funcionalidad y la exporta. Luego usamos import para importarlo directamente donde sea necesario. El navegador carga y evalúa los scripts automáticamente.

En la producción, las personas a menudo usan paquetes como Webpack para agrupar módulos por rendimiento y otras razones.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/data-types/readme.md)
