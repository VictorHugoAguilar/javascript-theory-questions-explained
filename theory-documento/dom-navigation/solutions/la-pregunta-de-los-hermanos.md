# la-pregunta-de-los-hermanos

1.  Sí, verdadero. El elemento elem.lastChild siempre es el último, no tiene nextSibling.
2.  No, falso. elem.children[0] es el primer hijo entre elementos, pero pueden existir nodos que no son elementos antes que él. previousSibling puede ser un nodo texto.

Ten en cuenta: para ambos casos, si no hay hijos habrá un error.

Si no hay hijos, elem.lastChild es null, entonces no podemos acceder a elem.lastChild.nextSibling. Y la colección elem.children es vacía (como un array vacío []).

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/dom-navigation/readme.md#la-pregunta-de-los-hermanos)
