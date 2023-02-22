# 📖 Shadow DOM y eventos

La idea detrás del shadow tree es encapsular los detalles internos de implementación de un componente.

Digamos que ocurre un evento click dentro de un shadow DOM del componente <user-card>. Pero los scripts en el documento principal no tienen idea acerca del interior del shadow DOM, especialmente si el componente es de una librería de terceros.

Entonces, para mantener los detalles encapsulados, el navegador redirige el evento.

Los eventos que ocurren en el shadow DOM tienen el elemento host como objetivo cuando son atrapados fuera del componente.

Un ejemplo simple:

<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>

Si haces clic en el botón, los mensajes son:

Inner target: BUTTON – el manejador de evento interno obtiene el objetivo correcto, el elemento dentro del shadow DOM.
Outer target: USER-CARD – el manejador de evento del documento obtiene el shadow host como objetivo.
Tener la “redirección de eventos” es muy bueno, porque el documento externo no necesita tener conocimiento acerca del interior del componente. Desde su punto de vista, el evento ocurrió sobre <user-card>.

No hay redirección si el evento ocurre en un elemento eslotado (slot element), que físicamente se aloja en el “light DOM”, el DOM visible.

Por ejemplo, si un usuario hace clic en <span slot="username"> en el ejemplo siguiente, el objetivo del evento es precisamente ese elemento span para ambos manejadores, shadow y light.

<user-card id="userCard">
  <span slot="username">John Smith</span>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Name:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Outer target: ${e.target.tagName}`);
</script>

Si un clic ocurre en "John Smith", el target es <span slot="username"> para ambos manejadores: el interno y el externo. Es un elemento del light DOM, entonces no hay redirección.

Por otro lado, si el clic ocurre en un elemento originalmente del shadow DOM, ej. en <b>Name</b>, entonces, como se propaga hacia fuera del shadow DOM, su event.target se reestablece a <user-card>.

Propagación, event.composedPath()
Para el propósito de propagación de eventos, es usado un “flattened DOM” (DOM aplanado, fusión de light y shadow).

Así, si tenemos un elemento eslotado y un evento ocurre dentro, entonces se propaga hacia arriba a <slot> y más allá.

La ruta completa del destino original “event target”, con todos sus elementos shadow, puede ser obtenida usando event.composedPath(). Como podemos ver del nombre del método, la ruta se toma despúes de la composición.

En el ejemplo de arriba, el “flattened DOM” es:

<user-card id="userCard">
  #shadow-root
    <div>
      <b>Name:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
Entonces, para un clic sobre <span slot="username">, una llamada a event.composedPath() devuelve un array: [span, slot, div, shadow-root, user-card, body, html, document, window]. Que es precisamente la cadena de padres desde el elemento target en el flattened DOM, después de la composición.

Los detalles del árbol Shadow solo son provistos en árboles con {mode:'open'}
Si el árbol shadow fue creado con {mode: 'closed'}, la ruta compuesta comienza desde el host: user-card en adelante.

Este principio es similar a otros métodos que trabajan con el shadow DOM. El interior de árboles cerrados está completamente oculto.

event.composed
La mayoría de los eventos se propagan exitosamente a través de los límites de un shadow DOM. Hay unos pocos eventos que no.

Esto está gobernado por la propiedad composed del objeto de evento. Si es true, el evento cruza los límites. Si no, solamente puede ser capturado dentro del shadow DOM.

Vemos en la especificación UI Events que la mayoría de los eventos tienen composed: true:

blur, focus, focusin, focusout,
click, dblclick,
mousedown, mouseup mousemove, mouseout, mouseover,
wheel,
beforeinput, input, keydown, keyup.
Todos los eventos de toque y puntero también tienen composed: true.

Algunos eventos tienen composed: false:

mouseenter, mouseleave (que no se propagan en absoluto),
load, unload, abort, error,
select,
slotchange.
Estos eventos solo pueden ser capturados dentro del mismo DOM, donde reside el evento target.

Eventos personalizados
Cuando enviamos eventos personalizados, necesitamos establecer ambas propiedades bubbles y composed a true para que se propague hacia arriba y afuera del componente.

Por ejemplo, aquí creamos div#inner en el shadow DOM de div#outer y disparamos dos eventos en él. Solo el que tiene composed: true logra salir hacia el documento:

<div id="outer"></div>

<script>
outer.attachShadow({mode: 'open'});

let inner = document.createElement('div');
outer.shadowRoot.append(inner);

/*
div(id=outer)
  #shadow-dom
    div(id=inner)
*/

document.addEventListener('test', event => alert(event.detail));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: true,
  detail: "composed"
}));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: false,
  detail: "not composed"
}));
</script>
Resumen
Los eventos solo cruzan los límites de shadow DOM si su bandera composed se establece como true.

La mayoría de los eventos nativos tienen composed: true, tal como se describe en las especificaciones relevantes:

Eventos UI https://www.w3.org/TR/uievents.
Eventos Touch https://w3c.github.io/touch-events.
Eventos Pointer https://www.w3.org/TR/pointerevents.
…y así.
Algunos eventos nativos que tienen composed: false:

mouseenter, mouseleave (que tampoco se propagan),
load, unload, abort, error,
select,
slotchange.
Estos eventos solo pueden ser capturados en elementos dentro del mismo DOM.

Si enviamos un evento personalizado CustomEvent, debemos establecer explícitamente composed: true.

Tenga en cuenta que en caso de componentes anidados, un shadow DOM puede estar anidado dentro de otro. En ese caso los eventos se propagan a través de los límites de todos los shadow DOM. Entonces, si se pretende que un evento sea solo para el componente inmediato que lo encierra, podemos enviarlo también en el shadow host y establecer composed: false. Entonces saldrá al shadow DOM del componente, pero no se propagará hacia un DOM de mayor nivel.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-web-components/readme.md)
