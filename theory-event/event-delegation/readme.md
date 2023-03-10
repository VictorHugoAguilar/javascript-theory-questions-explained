# 馃摉 Delegaci贸n de eventos

La captura y el propagaci贸n nos permiten implementar uno de los m谩s poderosos patrones de manejo de eventos llamado delegaci贸n de eventos.

La idea es que si tenemos muchos elementos manejados de manera similar podemos, en lugar de asignar un manejador a cada uno de ellos, poner un 煤nico manejador a su ancestro com煤n.

En el manejador obtenemos `event.target` para ver d贸nde ocurri贸 realmente el evento y manejarlo.

Veamos un ejemplo: El diagrama Pa kua que refleja la antigua filosof铆a china.

Aqu铆 est谩:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_01.png?raw=true)

El HTML es este:

````html
<table>
  <tr>
    <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
  </tr>
  <tr>
    <td class="nw"><strong>Northwest</strong><br>Metal<br>Silver<br>Elders</td>
    <td class="n">...</td>
    <td class="ne">...</td>
  </tr>
  <tr>...2 more lines of this kind...</tr>
  <tr>...2 more lines of this kind...</tr>
</table>
````

La tabla tiene 9 celdas, pero puede haber 99 o 999, eso no importa.

**Nuestra tarea es destacar una celda `<td>` al hacer clic en ella.**

En lugar de asignar un manejador onclick a cada `<td>` (puede haber muchos), configuramos un manejador 鈥渁trapa-todo鈥? en el elemento `<table>`.

Este usar谩 `event.target` para obtener el elemento del clic y destacarlo.

El c贸digo:

````js  
let selectedTd;

table.onclick = function(event) {
  let target = event.target; // 驴d贸nde fue el clic?

  if (target.tagName != 'TD') return; // 驴no es un TD? No nos interesa

  highlight(target); // destacarlo
};

function highlight(td) {
  if (selectedTd) { // quitar cualquier celda destacada que hubiera antes
    selectedTd.classList.remove('highlight');
  }
  selectedTd = td;
  selectedTd.classList.add('highlight'); // y destacar el nuevo td
}
````

A tal c贸digo no le interesa cu谩ntas celdas hay en la tabla. Podemos agregar y quitar `<td>` din谩micamente en cualquier momento y el realzado a煤n funcionar谩.

Pero hay un inconveniente.

El clic puede ocurrir no sobre `<td>`, sino dentro de 茅l.

En nuestro caso, si miramos dentro del HTML, podemos ver tags anidados dentro de `<td>`, como `<strong>:

````html
<td>
  <strong>Northwest</strong>
  ...
</td>
````

Naturalmente, si el clic ocurre en <strong>, este se vuelve el valor de event.target.

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_02.png?raw=true)

En el manejador table.onclick debemos tomar tal `event.target` e indagar si el clic fue dentro de `<td>` o no.

Aqu铆 el c贸digo mejorado:

````js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
````

### Explicaci贸n:

1.  El m茅todo `elem.closest(selector)` devuelve el ancestro m谩s cercano que coincide con el selector. En nuestro caso buscamos `<td>` hacia arriba desde el elemento de origen.
2.  Si event.target no ocurri贸 dentro de alg煤n `<td>`, el llamado retorna inmediatamente pues no hay nada que hacer.
3.  En caso de tablas anidadas, event.target podr铆a ser un `<td>`, pero fuera de la tabla actual. Entonces verificamos que sea realmente un `<td>` de nuestra tabla.
4.  Y, si es as铆, destacarla.

Como resultado, tenemos un c贸digo de realzado r谩pido y eficiente al que no le afecta la cantidad total de `<td>` en la tabla.

## Ejemplo de delegaci贸n: acciones en markup

Hay otros usos para la delegaci贸n de eventos.

Digamos que queremos hacer un men煤 con los botones 鈥淪ave鈥?, 鈥淟oad鈥?, 鈥淪earch鈥? y as铆. Y hay objetos con los m茅todos save, load, search鈥? 驴C贸mo asociarlos?

La primera idea podr铆a ser asignar un controlador separado para cada bot贸n. Pero hay una soluci贸n m谩s elegante. Podemos agregar un controlador para el men煤 completo y un atributo data-action a los botones con el m茅todo a llamar:

````html
<button data-action="save">Click to Save</button>
````

El manejador lee el atributo y ejecuta el m茅todo. Puedes ver el siguiente ejemplo en funcionamiento:

````html
<div id="menu">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="search">Search</button>
</div>

<script>
  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }

    save() {
      alert('saving');
    }

    load() {
      alert('loading');
    }

    search() {
      alert('searching');
    }

    onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this[action]();
      }
    };
  }

  new Menu(menu);
</script>
````

![image_03](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_03.png?raw=true)

Ten en cuenta que `this.onClick` est谩 ligado a this en (*). Esto es importante, porque de otra manera el this que est谩 dentro har铆a referencia al elemento DOM (elem), no al objeto Menu, y this[action] no ser铆a lo que necesitamos.

Entonces, 驴qu茅 ventajas nos ofrece la delegaci贸n aqu铆?

* No necesitamos escribir el c贸digo para asignar el manejador a cada bot贸n. Simplemente hacer un m茅todo y ponerlo en el markup.

* La estructura HTML es flexible, podemos agregar y quitar botones en cualquier momento.

Podr铆amos usar clases .action-save, .action-load, pero un atributo data-action es mejor sem谩nticamente. Y podemos usarlo con reglas CSS tambi茅n.

## El patr贸n 鈥渃omportamiento鈥?

Tambi茅n podemos usar delegaci贸n de eventos para agregar 鈥渃omportamiento鈥? a los elementos de forma declarativa, con atributos y clases especiales.

1.  El patr贸n tiene dos partes:
Agregamos un atributo personalizado al elemento que describe su comportamiento.

2.  Un manejador rastrea eventos del documento completo, y si un evento ocurre en un elemento con el atributo ejecuta la acci贸n.

## Comportamiento: Contador

Por ejemplo, aqu铆 el atributo data-counter agrega un comportamiento: 鈥渋ncrementar el valor con un clic鈥? a los botones:

````html
Counter: <input type="button" value="1" data-counter>
One more counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // si el atributo existe...
      event.target.value++;
    }

  });
</script>
````
![image_04](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_04.png?raw=true)

Si hacemos clic en un bot贸n, su valor se incrementa. Lo importante aqu铆 no son los botones sino el enfoque general.

Puede haber tantos atributos data-counter como queramos. Podemos agregar nuevos al HTML en cualquier momento. Usando delegaci贸n de eventos 鈥渆xtendimos鈥? el HTML, agregando un atributo que describe un nuevo comportamiento.

### 鈿狅笍 Para manejadores de nivel de documento: siempre addEventListener
Cuando asignamos un manejador de evento al objeto document, debemos usar siempre addEventListener, no `document.on<event>`, porque este 煤ltimo causa conflictos: los manejadores nuevos sobrescribir谩n los viejos.

En proyectos reales es normal que haya muchos manejadores en document, asignados en diferentes partes del c贸digo.

## Comportamiento: Conmutador (toggle)

Un ejemplo m谩s de comportamiento. Un clic en un elemento con el atributo data-toggle-id mostrar谩/ocultar谩 el elemento con el id recibido:

````html
<button data-toggle-id="subscribe-mail">
  Show the subscription form
</button>

<form id="subscribe-mail" hidden>
  Your mail: <input type="email">
</form>

<script>
  document.addEventListener('click', function(event) {
    let id = event.target.dataset.toggleId;
    if (!id) return;

    let elem = document.getElementById(id);

    elem.hidden = !elem.hidden;
  });
</script>
````
![image_05](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_05.png?raw=true)

Veamos una vez m谩s lo que hicimos aqu铆: ahora, para agregar la funcionalidad de conmutaci贸n a un elemento, no hay necesidad de conocer JavaScript, simplemente usamos el atributo data-toggle-id.

Esto puede ser muy conveniente: no hay necesidad de escribir JavaScript para cada elemento. Simplemente usamos el comportamiento. El manejador a nivel de documento hace el trabajo para cualquier elemento de la p谩gina.

Podemos combinar m煤ltiples comportamientos en un 煤nico elemento tambi茅n.

El patr贸n 鈥渃omportamiento鈥? puede ser una alternativa a los mini-fragmentos de JavaScript.

## Resumen

隆La delegaci贸n de eventos es verdaderamente fant谩stica! Es uno de los patrones m谩s 煤tiles entre los eventos DOM.

A menudo es usado para manejar elementos similares, pero no solamente para eso.

El algoritmo:

1.  Pone un 煤nico manejador en el contenedor.
2.  Dentro del manejador revisa el elemento de origen event.target.
3.  Si el evento ocurri贸 dentro de un elemento que nos interesa, maneja el evento.

Beneficios:

* Simplifica la inicializaci贸n y ahorra memoria: no hay necesidad de agregar muchos controladores.
* Menos c贸digo: cuando agregamos o quitamos elementos, no hay necesidad de agregar y quitar controladores.
* Modificaciones del DOM: podemos agregar y quitar elementos en masa con innerHTML y similares.

La delegaci贸n tiene sus limitaciones por supuesto:

* Primero, el evento debe 鈥減ropagarse鈥?. Algunos eventos no lo hacen. Adem谩s manejadores de bajo nivel no deben usar `event.stopPropagation()`.
* Segundo, la delegaci贸n puede agregar carga a la CPU, porque el controlador a nivel de contenedor reacciona a eventos en cualquier lugar del mismo, no importa si nos interesan o no. Pero usualmente la carga es imperceptible y no la tomamos en cuenta.

# 鉁? Tareas

## Ocultar mensajes con delegacipn

Hay una lista de mensajes con botones para borrarlos [x]. Haz que funcionen.

Como esto:

![image_05](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_05.png?raw=true)

Luego queda as铆

![image_06](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_06.png?raw=true)

P.D. Debe haber solamente un event lintener en el contenedor, usa delegaci贸n de eventos.

[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/solutions/ocultar-mensajes-con-delegacion.md)

## Menu de arbol

Crea un 谩rbol que muestre y oculte nodos hijos con clics:

![image_07](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_07.png?raw=true)

Requerimientos:

* Solamente un manejador de eventos (usa delegaci贸n)
* Un clic fuera de los nodos de t铆tulos (en un espacio vac铆o) no debe hacer nada.


[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/solutions/menu-de-arbol.md)

## Tabla ordenable

Haz que la tabla se pueda ordenar: los clics en elementos `<th>` deber铆an ordenarla por la columna correspondiente.

Cada `<th>` tiene su tipo de datos en el atributo, como esto:

````html
<table id="grid">
  <thead>
    <tr>
      <th data-type="number">Age</th>
      <th data-type="string">Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5</td>
      <td>John</td>
    </tr>
    <tr>
      <td>10</td>
      <td>Ann</td>
    </tr>
    ...
  </tbody>
</table>
````

En el ejemplo anterior la primera columna tiene n煤meros y la segunda cadenas. La funci贸n de ordenamiento debe manejar el orden de acuerdo al tipo de dato.

Solamente los tipos "string" y "number" deben ser soportados.

Ejemplo en funcionamiento:

![image_08](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_08.png?raw=true)

Al hacer clic sobre titulos de la tabla, se ordenan.

![image_09](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_09.png?raw=true)

P.D. La tabla puede ser grande, con cualquier cantidad de filas y columnas.

[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/solutions/tabla-ordenable.md)

## Comportamiento tooltip

Crea c贸digo JS para el comportamiento 鈥渢ooltip鈥?.

Cuando un mouse pasa sobre un elemento con data-tooltip, el tooltip debe aparecer sobre 茅l, y ocultarse cuando se va.

Un ejemplo en HTML comentado:

````html
<button data-tooltip="the tooltip is longer than the element">Short button</button>
<button data-tooltip="HTML<br>tooltip">One more button</button>
````

En esta tarea suponemos que todos los elementos con data-tooltip solo tienen texto dentro. Sin tags anidados (todav铆a).

Detalles:

* La distancia entre el elemento y el tooltip debe ser 5px.
* El tooltip debe ser centrado relativo al elemento si es posible.
* El tooltip no debe cruzar los bordes de la ventana. Normalmente deber铆a estar sobre el elemento, pero si el elemento est谩 en la parte superior de la p谩gina y no hay espacio para el tooltip, entonces debajo de 茅l.
* El contenido del tooltip est谩 dado en el atributo data-tooltip. Este puede ser HTML arbitrario.

Necesitar谩s dos eventos aqu铆:

* mouseover se dispara cuando el puntero pasa sobre el elemento.
* mouseout se dispara cuando el puntero deja el elemento.

Usa delegaci贸n de eventos: prepare dos manejadores en el document para rastrear todos los 鈥渙vers鈥? y 鈥渙uts鈥? de los elementos con data-tooltip y administra los tooltips desde all铆.

Despu茅s de implementar el comportamiento, incluso gente no familiarizada con JavaScript puede agregar elementos anotados.

P.D. Solamente un tooltip puede mostrarse a la vez.

[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/solutions/comportamiento-tooltip.md)

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/readme.md)
