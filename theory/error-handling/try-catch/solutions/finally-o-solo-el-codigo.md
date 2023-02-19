# finally-o-solo-el-codigo

La diferencia se hace evidente cuando miramos el código dentro de una función.

El comportamiento es diferente si hay un “salto fuera” de try..catch.

Por ejemplo, cuando hay un return en el interior de try..catch. La cláusula finally funciona en el caso de cualquier salida de try..catch, incluso a través de la declaración return: justo después de que try..catch haya terminado, pero antes de que el código de llamada obtenga el control.

````js
function f() {
  try {
    alert('inicio');
    return "resultado";
  } catch (err) {
    /// ...
  } finally {
    alert('limpieza!');
  }
}

f(); // limpieza!
````

… O cuando hay un throw (lanzamiento de excepción), como aquí:

````js
function f() {
  try {
    alert('inicio');
    throw new Error("un error");
  } catch (err) {
    // ...
    if("no puede manejar el error") {
      throw err;
    }

  } finally {
    alert('limpieza!')
  }
}

f(); // limpieza!
````

Es “finally” el que garantiza la limpieza aquí. Si acabamos de poner el código al final de f, no se ejecutará en estas situaciones.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/error-handling/try-catch/readme.md#finally-o-solo-el-codigo)
