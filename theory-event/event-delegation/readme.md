# 📖 Delegación de eventos

La captura y el propagación nos permiten implementar uno de los más poderosos patrones de manejo de eventos llamado delegación de eventos.

La idea es que si tenemos muchos elementos manejados de manera similar podemos, en lugar de asignar un manejador a cada uno de ellos, poner un único manejador a su ancestro común.

En el manejador obtenemos `event.target` para ver dónde ocurrió realmente el evento y manejarlo.

Veamos un ejemplo: El diagrama Pa kua que refleja la antigua filosofía china.

Aquí está:

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

En lugar de asignar un manejador onclick a cada `<td>` (puede haber muchos), configuramos un manejador “atrapa-todo” en el elemento `<table>`.

Este usará `event.target` para obtener el elemento del clic y destacarlo.

El código:

````js  
let selectedTd;

table.onclick = function(event) {
  let target = event.target; // ¿dónde fue el clic?

  if (target.tagName != 'TD') return; // ¿no es un TD? No nos interesa

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

A tal código no le interesa cuántas celdas hay en la tabla. Podemos agregar y quitar `<td>` dinámicamente en cualquier momento y el realzado aún funcionará.

Pero hay un inconveniente.

El clic puede ocurrir no sobre `<td>`, sino dentro de él.

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

Aquí el código mejorado:

````js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
````

### Explicación:

1.  El método `elem.closest(selector)` devuelve el ancestro más cercano que coincide con el selector. En nuestro caso buscamos `<td>` hacia arriba desde el elemento de origen.
2.  Si event.target no ocurrió dentro de algún `<td>`, el llamado retorna inmediatamente pues no hay nada que hacer.
3.  En caso de tablas anidadas, event.target podría ser un `<td>`, pero fuera de la tabla actual. Entonces verificamos que sea realmente un `<td>` de nuestra tabla.
4.  Y, si es así, destacarla.

Como resultado, tenemos un código de realzado rápido y eficiente al que no le afecta la cantidad total de `<td>` en la tabla.

## Ejemplo de delegación: acciones en markup

Hay otros usos para la delegación de eventos.

Digamos que queremos hacer un menú con los botones “Save”, “Load”, “Search” y así. Y hay objetos con los métodos save, load, search… ¿Cómo asociarlos?

La primera idea podría ser asignar un controlador separado para cada botón. Pero hay una solución más elegante. Podemos agregar un controlador para el menú completo y un atributo data-action a los botones con el método a llamar:

````html
<button data-action="save">Click to Save</button>
````

El manejador lee el atributo y ejecuta el método. Puedes ver el siguiente ejemplo en funcionamiento:

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

Ten en cuenta que this.onClick está ligado a this en (*). Esto es importante, porque de otra manera el this que está dentro haría referencia al elemento DOM (elem), no al objeto Menu, y this[action] no sería lo que necesitamos.

Entonces, ¿qué ventajas nos ofrece la delegación aquí?

* No necesitamos escribir el código para asignar el manejador a cada botón. Simplemente hacer un método y ponerlo en el markup.

* La estructura HTML es flexible, podemos agregar y quitar botones en cualquier momento.

Podríamos usar clases .action-save, .action-load, pero un atributo data-action es mejor semánticamente. Y podemos usarlo con reglas CSS también.

## El patrón “comportamiento”

También podemos usar delegación de eventos para agregar “comportamiento” a los elementos de forma declarativa, con atributos y clases especiales.

1.  El patrón tiene dos partes:
Agregamos un atributo personalizado al elemento que describe su comportamiento.

2.  Un manejador rastrea eventos del documento completo, y si un evento ocurre en un elemento con el atributo ejecuta la acción.

## Comportamiento: Contador

Por ejemplo, aquí el atributo data-counter agrega un comportamiento: “incrementar el valor con un clic” a los botones:

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

Si hacemos clic en un botón, su valor se incrementa. Lo importante aquí no son los botones sino el enfoque general.

Puede haber tantos atributos data-counter como queramos. Podemos agregar nuevos al HTML en cualquier momento. Usando delegación de eventos “extendimos” el HTML, agregando un atributo que describe un nuevo comportamiento.

### ⚠️ Para manejadores de nivel de documento: siempre addEventListener
Cuando asignamos un manejador de evento al objeto document, debemos usar siempre addEventListener, no document.on<event>, porque este último causa conflictos: los manejadores nuevos sobrescribirán los viejos.

En proyectos reales es normal que haya muchos manejadores en document, asignados en diferentes partes del código.

## Comportamiento: Conmutador (toggle)

Un ejemplo más de comportamiento. Un clic en un elemento con el atributo data-toggle-id mostrará/ocultará el elemento con el id recibido:

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

Veamos una vez más lo que hicimos aquí: ahora, para agregar la funcionalidad de conmutación a un elemento, no hay necesidad de conocer JavaScript, simplemente usamos el atributo data-toggle-id.

Esto puede ser muy conveniente: no hay necesidad de escribir JavaScript para cada elemento. Simplemente usamos el comportamiento. El manejador a nivel de documento hace el trabajo para cualquier elemento de la página.

Podemos combinar múltiples comportamientos en un único elemento también.

El patrón “comportamiento” puede ser una alternativa a los mini-fragmentos de JavaScript.

## Resumen

¡La delegación de eventos es verdaderamente fantástica! Es uno de los patrones más útiles entre los eventos DOM.

A menudo es usado para manejar elementos similares, pero no solamente para eso.

El algoritmo:

1.  Pone un único manejador en el contenedor.
2.  Dentro del manejador revisa el elemento de origen event.target.
3.  Si el evento ocurrió dentro de un elemento que nos interesa, maneja el evento.

Beneficios:

* Simplifica la inicialización y ahorra memoria: no hay necesidad de agregar muchos controladores.
* Menos código: cuando agregamos o quitamos elementos, no hay necesidad de agregar y quitar controladores.
* Modificaciones del DOM: podemos agregar y quitar elementos en masa con innerHTML y similares.

La delegación tiene sus limitaciones por supuesto:

* Primero, el evento debe “propagarse”. Algunos eventos no lo hacen. Además manejadores de bajo nivel no deben usar `event.stopPropagation().
* Segundo, la delegación puede agregar carga a la CPU, porque el controlador a nivel de contenedor reacciona a eventos en cualquier lugar del mismo, no importa si nos interesan o no. Pero usualmente la carga es imperceptible y no la tomamos en cuenta.

# ✅ Tareas

## Ocultar mensajes con delegacipn

Hay una lista de mensajes con botones para borrarlos [x]. Haz que funcionen.

Como esto:

![image_05](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_05.png?raw=true)

Luego queda así

![image_06](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_06.png?raw=true)

P.D. Debe haber solamente un event lintener en el contenedor, usa delegación de eventos.

[solución]()

## Menu de arbol

Crea un árbol que muestre y oculte nodos hijos con clics:

![image_07](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/event-delegation/img/event_event-delegation_imagen_07.png?raw=true)

Requerimientos:

* Solamente un manejador de eventos (usa delegación)
* Un clic fuera de los nodos de títulos (en un espacio vacío) no debe hacer nada.


[solución]()

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-event/readme.md)
