# 📖 Formularios: evento y método submit

El evento submit se activa cuando el formulario es enviado, normalmente se utiliza para validar el formulario antes de ser enviado al servidor o bien para abortar el envío y procesarlo con JavaScript.

El método `form.submit()` permite iniciar el envío del formulario mediante JavaScript. Podemos utilizarlo para crear y enviar nuestros propios formularios al servidor.

Veamos más detalles sobre ellos.

## Evento: submit

Mayormente un formulario puede enviarse de dos maneras:

1.  La primera – Haciendo click en `<input type="submit">` o en `<input type="image">`.
2.  La segunda – Pulsando la tecla `Enter` en un campo del formulario.

Ambas acciones causan que el evento submit sea activado en el formulario. El handler puede comprobar los datos, y si hay errores, mostrarlos e invocar `event.preventDefault()`, entonces el formulario no será enviado al servidor.

En el formulario de abajo:

1.  Ve al campo tipo texto y pulsa la tecla Enter.
2.  Haz click en `<input type="submit">`.

Ambas acciones muestran `alert` y el formulario no es enviado debido a la presencia de return `false`:

````html
<form onsubmit="alert('submit!');return false">
  Primero: Enter en el campo de texto <input type="text" value="texto"><br>
  Segundo: Click en "submit": <input type="submit" value="Submit">
</form>
````

### ℹ️ Relación entre submit y click
Cuando un formulario es enviado utilizando Enter en un campo tipo texto, un evento click se genera en el `<input type="submit">`

Muy curioso, dado que no hubo ningún click en absoluto.

Aquí esta la demo:

````html
<form onsubmit="return false">
 <input type="text" size="30" value="Sitúa el cursor aquí y pulsa Enter">
 <input type="submit" value="Submit" onclick="alert('click')">
</form>
````

## Método: submit

Para enviar un formulario al servidor manualmente, podemos usar `form.submit()`.

Entonces el evento submit no será generado. Se asume que si el programador llama `form.submit()`, entonces el script ya realizó todo el procesamiento relacionado.

A veces es usado para crear y enviar un formulario manualmente, como en este ejemplo:

````js
let form = document.createElement('form');
form.action = 'https://google.com/search';
form.method = 'GET';

form.innerHTML = '<input name="q" value="test">';

// el formulario debe estar en el document para poder enviarlo
document.body.append(form);

form.submit();
````

# ✅ Tareas

## Formulario modal

Crea una función `showPrompt(html, callback)` que muestre un formulario con el mensaje html, un campo input y botones `OK/CANCELAR`.

* Un usuario debe escribir algo en el campo de texto y pulsar Enter o el botón OK, entonces `callback(value)` es llamado con el valor introducido.
* En caso contrario, si el usuario pulsa Esc o CANCELAR, entonces callback(null) es llamado.

En ambos casos se finaliza el proceso se y borra el formulario.

Requisitos:

* El formulario debe estar en el centro de la ventana.
* El formulario es modal. Es decir que no habrá interacción con el resto de la página, siempre que sea posible, hasta que el usuario lo cierre.
* Cuando se muestra el formulario, el foco debe estar en el <input> del usuario.
* Las teclas Tab/Shift+Tab deben alternar el foco entre los diferentes campos del formulario, no se permite cambiar el foco a otros elementos de la página.

Ejemplo de uso:

````js
showPrompt("Escribe algo<br>...inteligente :)", function(value) {
  alert(value);
});
````

P.S. El código fuente tiene el HTML/CSS para el formulario con posición fija. Pero tú decides cómo haces el modal.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/forms-submit/solutions/formulario-modal.md)


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/readme.md)
