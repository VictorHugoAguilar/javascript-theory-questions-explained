## Reescribe el switch en un if

Para que coincida con la funcionalidad de `switch` exactamente, el `if` debe utilizar una comparación estricta `'==='`.

Pero para strings, un simple `'=='` también funciona.

````js
if(navegador == 'Edge') {
  alert("¡Tienes Edge!");
} else if (navegador == 'Chrome'
 || navegador == 'Firefox'
 || navegador == 'Safari'
 || navegador == 'Opera') {
  alert( 'Está bien, soportamos estos navegadores también' );
} else {
  alert( '¡Esperamos que la página se vea bien!' );
}
````

> Nota: la construcción navegador == 'Chrome' || navegador == 'Firefox' … fue separada en varias líneas para mejorar su lectura.

Pero la construcción switch sigue siendo más clara y descriptiva.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/14_switch/readme.md#reescribe-el-switch-en-un-if)
