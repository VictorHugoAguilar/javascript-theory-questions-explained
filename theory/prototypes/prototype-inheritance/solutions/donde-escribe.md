# donde-escribe

### La respuesta es: rabbit.

Esto se debe a que this es un objeto antes del punto, por lo que `rabbit.eat()` modifica rabbit.

La búsqueda y ejecución de propiedades son dos cosas diferentes.

El método `rabbit.eat` se encuentra primero en el prototipo, luego se ejecuta con `this = rabbit`.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/prototypes/prototype-inheritance/readme.md#donde-escribe)
