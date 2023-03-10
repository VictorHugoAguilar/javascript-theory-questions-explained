# 馃摉 El modo moderno, "use strict"

Durante mucho tiempo, JavaScript evolucion贸 sin problemas de compatibilidad. Se a帽ad铆an nuevas caracter铆sticas al lenguaje sin que la funcionalidad existente cambiase.

Esto ten铆a el beneficio de nunca romper c贸digo existente, pero lo malo era que cualquier error o decisi贸n incorrecta tomada por los creadores de JavaScript se quedaba para siempre en el lenguaje.

Esto fue as铆 hasta 2009, cuando ECMAScript 5 (ES5) apareci贸. Esta versi贸n a帽adi贸 nuevas caracter铆sticas al lenguaje y modific贸 algunas de las ya existentes. Para mantener el c贸digo antiguo funcionando, la mayor parte de las modificaciones est谩n desactivadas por defecto. Tienes que activarlas expl铆citamente usando una directiva especial: `"use strict"`.

## 鈥渦se strict鈥?

La directiva se asemeja a un string: `"use strict"`. Cuando se sit煤a al principio de un script, el script entero funciona de la manera 鈥渕oderna鈥?.

Por ejemplo:

"use strict";

````js
// este c贸digo funciona de la manera moderna
...
````

Aprenderemos funciones (una manera de agrupar comandos) en breve, pero adelantemos que "use strict" se puede poner al inicio de una funci贸n. De esta manera, se activa el modo estricto 煤nicamente en esa funci贸n. Pero normalmente se utiliza para el script entero.

Aseg煤rate de que 鈥渦se strict鈥? est谩 al inicio
Por favor, aseg煤rate de que "use strict" est谩 al principio de tus scripts. Si no, el modo estricto podr铆a no estar activado.

### 鈿狅笍 El modo estricto no est谩 activado aqu铆:

````js
alert("algo de c贸digo");
// la directiva "use strict" de abajo es ignorada, tiene que estar al principio

"use strict";

// el modo estricto no est谩 activado
````

脷nicamente pueden aparecer comentarios por encima de `"use strict"`.

### 鈿狅笍 No hay manera de cancelar use strict

No hay ninguna directiva del tipo `"no use strict"` que haga al motor volver al comportamiento anterior.

Una vez entramos en modo estricto, no hay vuelta atr谩s.

## Consola del navegador

Cuando utilices la consola del navegador para ejecutar c贸digo, ten en cuenta que no utiliza `use strict` por defecto.

En ocasiones, donde `use strict` cause diferencia, obtendr谩s resultados incorrectos.

Entonces, 驴como utilizar `use strict` en la consola?

Primero puedes intentar pulsando Shift+Enter para ingresar m煤ltiples l铆neas y poner `use strict` al principio, como aqu铆:

````js
'use strict'; <Shift+Enter para una nueva l铆nea>
//  ...tu c贸digo
<Intro para ejecutar>
````

Esto funciona para la mayor铆a de los navegadores, espec铆ficamente Firefox y Chrome.

Si esto no funciona, como en los viejos navegadores, hay una fea pero confiable manera de asegurar `use strict`. Ponlo dentro de esta especie de envoltura:

````js
(function() {
  'use strict';

  // ...tu c贸digo...
})()
````

## 驴Deber铆amos utilizar 鈥渦se strict鈥??

La pregunta podr铆a parecer obvia, pero no lo es.

Uno podr铆a recomendar que se comiencen los script con `"use strict"`鈥? 驴Pero sabes lo que es interesante?

El JavaScript moderno admite 鈥渃lases鈥? y 鈥渕贸dulos鈥?, estructuras de lenguaje avanzadas (que seguramente llegaremos a ver), que autom谩ticamente habilitan `use strict`. Entonces no necesitamos agregar la directiva `"use strict"` si las usamos.

**Entonces, por ahora `"use strict";` es un invitado bienvenido al tope de tus scripts. Luego, cuando tu c贸digo sea todo clases y m贸dulos, puedes omitirlo.**

A partir de ahora tenemos que saber acerca de use strict en general.

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/readme.md)
