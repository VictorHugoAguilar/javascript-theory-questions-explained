# cual-es-el-resultado-de-las-alertas-aplicadas-al-operador-and

La respuesta: 1 y después undefined.

````js
alert( alert(1) && alert(2) );
````

La llamada a `alert` retorna `undefined` (solo muestra un mensaje, así que no hay un valor que retornar relevante)

Debido a ello, `&&` evalúa el operando de la izquierda (imprime 1) e inmediatamente se detiene porque undefined es un valor `falso`. Como `&&` busca un valor falso y lo retorna, terminamos.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/11_logical-operators/readme.md#cual-es-el-resultado-de-las-alertas-aplicadas-al-operador-and)
