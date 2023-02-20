# 📖 Envío de eventos personalizados

No solo podemos asignar controladores, sino también generar eventos desde JavaScript.

Los eventos personalizados se pueden utilizar para crear “componentes gráficos”. Por ejemplo, un elemento raíz de nuestro propio menú basado en JS puede desencadenar eventos que indiquen lo que sucede con el menú: abrir (menú abierto),seleccionar (se selecciona un elemento) y así sucesivamente. Otro código puede escuchar los eventos y observar lo que sucede con el menú.

No solo podemos generar eventos completamente nuevos, que inventamos para nuestros propios fines, sino también eventos integrados, como click, mousedown, etc. Eso puede ser útil para las pruebas automatizadas.

## Constructor de eventos

Las clases de eventos integradas forman una jerarquía, similar a las clases de elementos DOM. La raíz es la clase incorporada Event.

Podemos crear objetos Event así:

````js
let event = new Event(type[, options]);
````

Argumentos:

* type – tipo de event, un string como "click" o nuestro propio evento como "mi-evento".

* options – el objeto con 2 propiedades opcionales:
  - bubbles: true/false – si es true, entonces el evento se propaga.
  - cancelable: true/false – si es true, entonces la “acción predeterminada” puede ser prevenida. Más adelante veremos qué significa para los eventos personalizados.
  Por defecto, los dos son false: {bubbles: false, cancelable: false}.

## dispatchEvent

Después de que se crea un objeto de evento, debemos “ejecutarlo” en un elemento usando la llamada elem.dispatchEvent(event).

Luego, los controladores reaccionan como si fuera un evento normal del navegador. Si el evento fue creado con la bandera bubbles, entonces se propaga.

En el siguiente ejemplo, el evento click se inicia en JavaScript. El controlador funciona de la misma manera que si se hiciera clic en el botón:

````html
<button id="elem" onclick="alert('Clic!');">Click automático</button>

<script>
  let event = new Event("click");
  elem.dispatchEvent(event);
</script>
````

### ℹ️ event.isTrusted
Hay una forma de diferenciar un evento de usuario “real” de uno generado por script.

La propiedad event.isTrusted es true para eventos que provienen de acciones de usuarios reales y false para eventos generados por script.

## Ejemplo de Bubbling

Podemos crear un evento bubbling con el nombre "hello" y capturarlo en document.

Todo lo que necesitamos es establecer bubbles en true:

````html
<h1 id="elem">Hola desde el script!</h1>

<script>
  // Captura en document...
  document.addEventListener("hello", function(event) { // (1)
    alert("Hola desde " + event.target.tagName); // Hola desde H1
  });

  // ...Envío en elem!
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

// el controlador del documento se activará y mostrará el mensaje.

</script>
````

Notas:

1.  Debemos usar addEventListener para nuestros eventos personalizados, porque on<event> solo existe para eventos incorporados, document.onhello no funciona.
2.  Debes poner bubbles:true, de otra manera el evento no se propagará.

La mecánica de bubbling es la misma para los eventos integrados (click) y personalizados (hello). También hay etapas de captura y propagación.
  
## MouseEvent, KeyboardEvent y otros

Aquí hay una breve lista de clases para eventos UI (interfaz de usuario) de la especificación de eventos UI:

* UIEvent
* FocusEvent
* MouseEvent
* WheelEvent
* KeyboardEvent
* …

Deberíamos usarlos en lugar de new Event si queremos crear tales eventos. Por ejemplo, new MouseEvent("click").

El constructor correcto permite especificar propiedades estándar para ese tipo de evento.

Como clientX/clientY para un evento de mouse:

````js
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // 100
````

Tenga en cuenta: el constructor genérico Event no lo permite.

Intentemos:

````js
let event = new Event("click", {
  bubbles: true, // solo bubbles y cancelable
  cancelable: true, // funcionan en el constructor de Event
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // undefined, se ignora la propiedad desconocida!
````

Técnicamente, podemos solucionarlo asignando directamente event.clientX=100 después de la creación. Entonces eso es una cuestión de conveniencia y de seguir las reglas. Los eventos generados por el navegador siempre tienen el tipo correcto.

La lista completa de propiedades para diferentes eventos de UI se encuentra en la especificación, por ejemplo, MouseEvent.

## Eventos personalizados

Para nuestros tipos de eventos completamente nuevos, como "hello", deberíamos usar new CustomEvent. Técnicamente, CustomEvent es lo mismo que Event, con una excepción.

En el segundo argumento (objeto) podemos agregar una propiedad adicional detail para cualquier información personalizada que queramos pasar con el evento.

Por ejemplo:

````html
<h1 id="elem">Hola para John!</h1>

<script>
  // detalles adicionales que vienen con el evento para el controlador.
  elem.addEventListener("hello", function(event) {
    alert(event.detail.name);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
    detail: { name: "John" }
  }));
</script>
````

La propiedad detail puede tener cualquier dato. Técnicamente podríamos vivir sin él, porque podemos asignar cualquier propiedad a un objeto new Event regular después de su creación. Pero CustomEvent proporciona el campo especial detail para evitar conflictos con otras propiedades del evento.

Además, la clase de evento describe “qué tipo de evento” es, y si el evento es personalizado, entonces deberíamos usar CustomEvent solo para tener claro qué es.

## event.preventDefault()

Muchos eventos del navegador tienen una “acción predeterminada”, como ir a un enlace, iniciar una selección, etc.

Para eventos nuevos y personalizados, definitivamente no hay acciones predeterminadas del navegador, pero un código que distribuye dicho evento puede tener sus propios planes de qué hacer después de activar el evento.

Al llamar a event.preventDefault(), un controlador de eventos puede enviar una señal de que esas acciones deben cancelarse.

En ese caso, la llamada a elem.dispatchEvent(event) devuelve false. Y el código que lo envió sabe que no debería continuar.

Veamos un ejemplo práctico: un conejo escondido (podría ser un menú de cierre u otra cosa).

A continuación puede ver una función #rabbit y hide() que distribuye el evento "hide" en él, para que todas las partes interesadas sepan que el conejo se va a esconder.

Cualquier controlador puede escuchar ese evento con rabbit.addEventListener('hide', ...) y, si es necesario, cancelar la acción usando event.preventDefault(). Entonces el conejo no desaparecerá:

````html
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">Esconder()</button>

<script>
  // hide() será llamado automáticamente en 2 segundos.
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // sin esa bandera preventDefault no funciona
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('La acción fue impedida por un controlador');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("¿Llamar a preventDefault?")) {
      event.preventDefault();
    }
  });
</script>
````

Tenga en cuenta: el evento debe tener la bandera cancelable: true, de lo contrario, la llamada event.preventDefault() se ignora.

## Los eventos dentro de eventos son sincrónicos

Usualmente los eventos se procesan en una cola. Por ejemplo: si el navegador está procesando onclick y ocurre un nuevo evento porque el mouse se movió, entonces el manejo de este último se pone en cola, y el controlador correspondiente mousemove será llamado cuando el procesamiento de onclick haya terminado.

La excepción notable es cuando un evento se inicia desde dentro de otro, por ejemplo, usando dispatchEvent. Dichos eventos se procesan inmediatamente: se llaman los nuevos controladores de eventos y luego se reanuda el manejo de eventos actual.

Por ejemplo, en el código siguiente, el evento menu-open se activa durante el onclick.

Se procesa inmediatamente, sin esperar a que termine el controlador onclick:

````html
<button id="menu">Menu (dame clic)</button>

<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // se dispara entre 1 y 2
  document.addEventListener('menu-open', () => alert('anidado'));
</script>
````

El orden de salida es: 1 → anidado → 2.

Tenga en cuenta que el evento anidado menu-open se captura en document. La propagación y el manejo del evento anidado finaliza antes de que el procesamiento vuelva al código externo (onclick).

No se trata solo de dispatchEvent, hay otros casos. Si un controlador de eventos llama a métodos que desencadenan otros eventos, también se procesan sincrónicamente, de forma anidada.

Supongamos que no nos gusta. Querríamos que onclick se procesara por completo primero, independientemente de menu-open o cualquier otro evento anidado.

Entonces podemos poner el dispatchEvent (u otra llamada de activación de eventos) al final de onclick o, mejor aún, envolverlo en el setTimeout de retardo cero:

````html
<button id="menu">Menu (dame clic)</button>

<script>
  menu.onclick = function() {
    alert(1);

    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('anidado'));
</script>
````

Ahora dispatchEvent se ejecuta asincrónicamente después de que la ejecución del código actual finaliza, incluyendo menu.onclick. Los controladores de eventos están totalmente separados.

El orden de salida se convierte en: 1 → 2 → anidado.

## Resumen

Para generar un evento a partir del código, primero necesitamos crear un objeto de evento.

El constructor genérico Event(name, options) acepta un nombre de evento arbitrario y el objeto options con dos propiedades:

* bubbles: true si el evento debe propagarse.
* cancelable: true si event.preventDefault() debe funcionar.

Otros constructores de eventos nativos como MouseEvent, KeyboardEvent, y similares, aceptan propiedades específicas para ese tipo de evento. Por ejemplo, clientX para eventos de mouse.

Para eventos personalizados deberíamos usar el constructor CustomEvent. Este tiene una opción adicional llamada detail a la que podemos asignarle los datos específicos del evento. De esta forma, todos los controladores pueden accederlos como event.detail.

A pesar de la posibilidad técnica de generar eventos del navegador como click o keydown, debemos usarlo con mucho cuidado.

No deberíamos generar eventos de navegador, ya que es una forma trillada de ejecutar controladores. Esa es una mala arquitectura la mayor parte del tiempo.

Se pueden generar eventos nativos:

* Como un truco sucio para hacer que las bibliotecas de terceros funcionen de la manera necesaria, si es que ellas no proporcionan otros medios de interacción.
* Para pruebas automatizadas, que el script “haga clic en el botón” y vea si la interfaz reacciona correctamente.

Los eventos personalizados con nuestros propios nombres a menudo se generan con fines arquitectónicos, para señalar lo que sucede dentro de nuestros menús, controles deslizantes, carruseles, etc.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/readme.md)
