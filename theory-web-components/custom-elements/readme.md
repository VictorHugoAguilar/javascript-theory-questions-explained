# 📖 Elementos personalizados

Podemos crear elementos `HTML` personalizados con nuestras propias clases; con sus propios métodos, propiedades, eventos y demás.

Una vez que definimos el elemento personalizado, podemos usarlo a la par de elementos `HTML` nativos.

Esto es grandioso, porque el el diccionario `HTML` es rico, pero no infinito. No hay `<aletas-faciles>`, `<gira-carrusel>`, `<bella-descarga>`… Solo piensa en cualquier otra etiqueta que puedas necesitar.

Podemos definirlos con una clase especial, y luego usarlos como si siempre hubieran sido parte del `HTML`.

Hay dos clases de elementos personalizados:

1.  **Elementos personalizados autónomos** – son elementos “todo-nuevo”, extensiones de la clase abstracta `HTMLElement`.
2.  **Elementos nativos personalizados** – son extensiones de elementos nativos, por ejemplo un botón personalizado basado en `HTMLButtonElement`.

Primero cubriremos los elementos autónomos, luego pasaremos a la personalización de elementos nativos.

Para crear un elemento personalizado, necesitamos decirle al navegador varios detalles acerca de él: cómo mostrarlo, qué hacer cuando el elemento es agregado o quitado de la página, etc.

Eso se logra creando una clase con métodos especiales. Es fácil, son unos pocos métodos y todos ellos son opcionales.

Este es el esquema con la lista completa:

````js
class MyElement extends HTMLElement {
  constructor() {
    super();
    // elemento creado
  }

  connectedCallback() {
    // el navegador llama a este método cuando el elemento es agregado al documento
    // (puede ser llamado varias veces si un elemento es agregado y quitado repetidamente)
  }

  disconnectedCallback() {
    // el navegador llama a este método cuando el elemento es quitado del documento
    // (puede ser llamado varias veces si un elemento es agregado y quitado repetidamente)
  }

  static get observedAttributes() {
    return [/* array de nombres de atributos a los que queremos monitorear por cambios */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // es llamado cuando uno de los atributos listados arriba es modificado
  }

  adoptedCallback() {
    // es llamado cuando el elemento es movido a un nuevo documento
    // (ocurre en document.adoptNode, muy raramente usado)
  }

  // puede haber otros métodos y propiedades de elemento
}
````

Después de ello, necesitamos registrar el elemento:

````js
// hacer saber al navegador que <my-element> es servido por nuestra nueva clase
customElements.define("my-element", MyElement);
````

A partir de ello, para cada elemento HTML con la etiqueta `<my-element>` se crea una instancia de `MyElement` y se llaman los métodos mencionados. También podemos insertarlo con JavaScript: `document.createElement('my-element')`.

### ℹ️ Los nombres de los elementos personalizados deben incluir un guion -
Los elemento personalizados deben incluir un guion corto - en su nombre. Por ejemplo, `my-element` y super-button son nombres válidos, pero myelement no lo es.

Esto se hace para asegurar que no haya conflicto de nombres entre los elementos nativos y los personalizados.

Ejemplo: “time-formatted”

Ya existe un elemento `<time>` en HTML para presentar fecha y hora, pero este no hace ningún formateo por sí mismo.

Construyamos el elemento `<time-formatted>` que muestre la hora en un bonito formato y reconozca la configuración de lengua local:

````js
<script>
class TimeFormatted extends HTMLElement { // (1)

  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

}

customElements.define("time-formatted", TimeFormatted); // (2)
</script>

<!-- (3) -->
<time-formatted datetime="2019-12-01"
  year="numeric" month="long" day="numeric"
  hour="numeric" minute="numeric" second="numeric"
  time-zone-name="short"
></time-formatted>
````

1.  La clase tiene un solo método, `connectedCallback()`, que es llamado por el navegador cuando se agrega el elemento `<time-formatted>` a la página o cuando el analizador `HTML` lo detecta. Este método usa el formateador de datos nativo Intl.DateTimeFormat, bien soportado por los navegadores, para mostrar una agradable hora formateada.
2.  Necesitamos registrar nuestro nuevo elemento con `customElements.define(tag, class)`.
3.  Y podremos usarlo por doquier.

### ℹ️ Actualización de elementos personalizados
Si el navegador encuentra algún `<time-formatted>` antes de customElements.define, no es un error. Pero el elemento es todavía desconocido, como cualquier etiqueta no estándar.

Tal elemento “undefined” puede ser estilizado con el selector CSS :not(:defined).

Una vez que customElement.define es llamado, estos elementos son “actualizados”: para cada elemento, una nueva instancia de TimeFormatted es creada y `connectedCallback` es llamado. Se vuelven `:defined`.

Para obtener información acerca de los elementos personalizados, tenemos los métodos:

* `customElements.get(name)` – devuelve la clase del elemento personalizado con el name dado,
* `customElements.whenDefined(name)` – devuelve una promesa que se resuelve (sin valor) cuando un elemento personalizado con el name dado se vuelve defined.

### ℹ️ Renderizado en `connectedCallback`, no en el constructor
En el ejemplo de arriba, el contenido del elemento es renderizado (construido) en `connectedCallback`.

¿Por qué no en el constructor?

La razón es simple: cuando el constructor es llamado, es aún demasiado pronto. El elemento es creado, pero el navegador aún no procesó ni asignó atributos en este estado, entonces las llamadas a `getAttribute` devolverían `null`. Así que no podemos renderizar ahora.

Por otra parte, si lo piensas, es más adecuado en términos de performance: demorar el trabajo hasta que realmente se lo necesite.

El connectedCallback se dispara cuando el elemento es agregado al documento. No apenas agregado a otro elemento como hijo, sino cuando realmente se vuelve parte de la página. Así podemos construir un DOM separado, crear elementos y prepararlos para uso futuro. Ellos serán realmente renderizados una vez que estén dentro de la página.

## Observando atributos

En la implementación actual de `<time-formatted>`, después de que el elemento fue renderizado, cambios posteriores en sus atributos no tendrán ningún efecto. Eso es extraño para un elemento HTML, porque cuando cambiamos un atributo (como en a.href) esperamos que dicho cambio sea visible de inmediato. Corrijamos esto.

Podemos observar atributos suministrando la lista de ellos al getter estático `observedAttributes()`. Cuando esos atributos son modificados, se dispara attributeChangedCallback. No se dispara para los atributos no incluidos en la lista, por razones de performance.

A continuación, el nuevo `<time-formatted>` que se actualiza cuando los atributos cambian:

````html
<script>
class TimeFormatted extends HTMLElement {

  render() { // (1)
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}

customElements.define("time-formatted", TimeFormatted);
</script>

<time-formatted id="elem" hour="numeric" minute="numeric" second="numeric"></time-formatted>

<script>
setInterval(() => elem.setAttribute('datetime', new Date()), 1000); // (5)
</script>
````

1.  La lógica de renderizado fue movida al método ayudante `render()`.
2.  Lo llamamos una vez cuando el elemento es insertado en la página.
3.  Al cambiar un atributo listado en `observedAttributes()`, se dispara `attributeChangedCallback`.
4.  …y se re-renderiza el elemento.
5.  Como resultado, ahora podemos crear un reloj dinámico con facilidad.

## Orden de renderizado

Cuando el “parser” construye el DOM, los elementos son procesados uno tras otro, padres antes que hijos. Por ejemplo si tenemos `<outer><inner></inner></outer>`, el elemento `<outer>` es creado y conectado al DOM primero, y luego `<inner>`.

Esto lleva a consecuencias importantes para los elementos personalizados.

Por ejemplo, si un elemento personalizado trata de acceder a `innerHTML` en `connectedCallback`, no obtiene nada:

````html
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
    alert(this.innerHTML); // vacío (*)
  }

});
</script>

<user-info>John</user-info>
````

Si lo ejecutas, el `alert` estará vacío.

Esto es porque no hay hijos en aquel estadio, pues el DOM no está finalizado. Se conectó el elemento personalizado `<user-info>` y está por proceder con sus hijos, pero no lo hizo aún.

Si queremos pasar información al elemento personalizado, podemos usar atributos. Estos están disponibles inmediatamente.

O, si realmente necesitamos acceder a los hijos, podemos demorar el acceso a ellos con un setTimeout de tiempo cero.

Esto funciona:

````html
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
    setTimeout(() => alert(this.innerHTML)); // John (*)
  }

});
</script>

<user-info>John</user-info>
````

Ahora el alert en la línea (*) muestra “John” porque lo corremos asincrónicamente, después de que el armado HTML está completo. Podemos procesar los hijos si lo necesitamos y finalizar la inicialización.

Por otro lado, la solución tampoco es perfecta. Si los elementos anidados también usan setTimeout para inicializarse, entonces van a la cola: el setTimeout externo se dispara primero y luego el interno.

Como consecuencia, el elemento externo termina la inicialización antes que el interno.

Demostrémoslo con un ejemplo:

````html
<script>
customElements.define('user-info', class extends HTMLElement {
  connectedCallback() {
    alert(`${this.id} connected.`);
    setTimeout(() => alert(`${this.id} initialized.`));
  }
});
</script>

<user-info id="outer">
  <user-info id="inner"></user-info>
</user-info>
````

Orden de salida:

1.  outer conectado.
2.  inner conectado.
3.  outer inicializado.
4.  inner inicializado.

Claramente vemos que el elemento finaliza su inicialización `(3)` antes que el interno `(4)`.

No existe un callback nativo que se dispare después de que los elementos anidados estén listos. Si es necesario, podemos implementarlo nosotros mismos. Por ejemplo, los elementos internos pueden disparar eventos como initialized, y los externos pueden escucharlos para reaccionar a ellos.

## Elementos nativos personalizados

Los elementos nuevos que creamos, tales como `<time-formatted>`, no tienen ninguna semántica asociada. Para los motores de búsqueda son desconocidos, y los dispositivos de accesibilidad tampoco pueden manejarlos.

Pero estas cosas son importantes. Por ejemplo, un motor de búsqueda podría estar interesado en saber que realmente mostramos la hora. y si hacemos una clase especial de botón, ¿por qué no reusar la funcionalidad ya existente de `<button>?`

Podemos extender y personalizar elementos `HTML` nativos, heredando desde sus clases.

Por ejemplo, los botones son instancias de `HTMLButtonElement`, construyamos sobre ello.

1.  Extender `HTMLButtonElement` con nuestra clase:

````js
class HelloButton extends HTMLButtonElement { /* métodos de elemento personalizado */ }
````

2.  Ponemos el tercer argumento de customElements.define, el cual especifica la etiqueta:

````js
customElements.define('hello-button', HelloButton, {extends: 'button'});
````

3.  Puede haber diferentes etiquetas que comparten la misma clase DOM, por eso se necesita especificar extends.

Por último, para usar nuestro elemento personalizado, insertamos una etiqueta común `<button>`, pero le agregamos `is="hello-button"`:

````html
<button is="hello-button">...</button>
````

El ejemplo completo:

````html
<script>
// El botón que dice "hello" al hacer clic
class HelloButton extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener('click', () => alert("Hello!"));
  }
}

customElements.define('hello-button', HelloButton, {extends: 'button'});
</script>

<button is="hello-button">Click me</button>

<button is="hello-button" disabled>Disabled</button>
````

Nuestro nuevo botón extiende el `‘button’` nativo. Así mantenemos los mismos estilos y características estándar, como por ejemplo el atributo disabled.

## Referencias

* HTML estándar vivo: https://html.spec.whatwg.org/#custom-elements.
* Compatibilidad: https://caniuse.com/#feat=custom-elementsv1.

## Resumen

Los elementos personalizados pueden ser de dos tipos:

1.  “Autónomos” – son etiquetas nuevas, se crean extendiendo `HTMLElement`.

Esquema de definición:

````js
class MyElement extends HTMLElement {
  constructor() { super(); /* ... */ }
  connectedCallback() { /* ... */ }
  disconnectedCallback() { /* ... */  }
  static get observedAttributes() { return [/* ... */]; }
  attributeChangedCallback(name, oldValue, newValue) { /* ... */ }
  adoptedCallback() { /* ... */ }
 }
customElements.define('my-element', MyElement);
/* <my-element> */
````

2. “Elementos nativos personalizados” – se crean extendiendo elementos ya existentes.

Requiere un argumento más `.define`, y `is="..."` en `HTML`:

````js
class MyButton extends HTMLButtonElement { /*...*/ }
customElements.define('my-button', MyElement, {extends: 'button'});
/* <button is="my-button"> */
````

Los elementos personalizados tienen muy buen soporte entre los navegadores. Existe un polyfill https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs.

# ✅ Tareas

## Elemento reloj dinamico

Ya tenemos un elemento `<time-formatted>` para mostrar la hora agradablemente formateada.

Crea el elemento `<live-timer>` para mostrar la hora actual:

Internamente debe usar `<time-formatted>`, no duplicar su funcionalidad.

Actualiza (¡tic!) cada segundo.
Por cada tic, se debe generar un evento personalizado llamado tick con la fecha actual en `event.detail` (ver artículo Envío de eventos personalizados).

Uso:

````html
<live-timer id="elem"></live-timer>

<script>
  elem.addEventListener('tick', event => console.log(event.detail));
</script>
````

[solución]()
  
---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-web-components/readme.md)
