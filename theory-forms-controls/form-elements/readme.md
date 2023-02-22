# 📖 Propiedades y Métodos de Formularios

Los formularios y controles, como `<input>`, tienen muchos eventos y propiedades especiales.

Trabajar con formularios será mucho más conveniente cuando los aprendamos.

## Navegación: Formularios y elementos

Los formularios del documento son miembros de la colección especial `document.forms`.

Esa es la llamada “Colección nombrada”: es ambas cosas, nombrada y ordenada. Podemos usar el nombre o el número en el documento para conseguir el formulario.

````js
document.forms.my; // el formulario con name="my"
document.forms[0]; // el primer formulario en el documento
````

Cuando tenemos un formulario, cualquier elemento se encuentra disponible en la colección nombrada `form.elements`.

Por ejemplo:

````html
<form name="my">
  <input name="one" value="1">
  <input name="two" value="2">
</form>

<script>
  // obtención del formulario
  let form = document.forms.my; // elemento <form name="my">

  // get the element
  let elem = form.elements.one; // elemento <input name="one">

  alert(elem.value); // 1
</script>
````

Puede haber múltiples elementos con el mismo nombre. Esto es típico en el caso de los botones de radio y checkboxes.

En ese caso `form.elements[name]` es una colección. Por ejemplo:

````html
<form>
  <input type="radio" name="age" value="10">
  <input type="radio" name="age" value="20">
</form>

<script>
let form = document.forms[0];

let ageElems = form.elements.age;

alert(ageElems[0]); // [object HTMLInputElement]
</script>
````

Estas propiedades de navegación no dependen de la estructura de las etiquetas. Todos los controles, sin importar qué tan profundos se encuentren en el formulario, están disponibles en form.elements.

### ℹ️ Fieldsets como “sub-formularios”
Un formulario puede tener uno o varios elementos `<fieldset>` dentro. Estos también tienen la propiedad `elements` que lista los controles del formulario dentro de ellos.

Por ejemplo:

````html
<body>
  <form id="form">
    <fieldset name="userFields">
      <legend>info</legend>
      <input name="login" type="text">
    </fieldset>
  </form>

  <script>
    alert(form.elements.login); // <input name="login">

    let fieldset = form.elements.userFields;
    alert(fieldset); // HTMLFieldSetElement

    // podemos obtener el input por su nombre tanto desde el formulario como desde el fieldset
    alert(fieldset.elements.login == form.elements.login); // true
  </script>
</body>
````

### ⚠️ Notación corta: `form.name`

Hay una notación corta: podemos acceder el elemento como `form[index/name]`.

En otras palabras, en lugar de `form.elements.login` podemos escribir `form.login`.

Esto también funciona, pero tiene un error menor: si accedemos un elemento, y cambiamos su name, se mantendrá disponible mediante el nombre anterior (así como mediante el nuevo).

Esto es fácil de ver en un ejemplo:

````html
<form id="form">
  <input name="login">
</form>

<script>
  alert(form.elements.login == form.login); // true, el mismo <input>

  form.login.name = "username"; // cambiamos el nombre el <input>

  // form.elements actualiza el nombre:
  alert(form.elements.login); // undefined
  alert(form.elements.username); // input

  // form permite ambos nombres: el nuevo y el viejo
  alert(form.username == form.login); // true
</script>
````

Esto usualmente no es un problema, porque raramente se cambian los nombres de los elementos de un formulario.

## Referencia inversa: `element.form`

Para cualquier elemento, el formulario está disponible como element.form. Así que un formulario referencia todos los elementos, y los elementos referencian el formulario.

Aquí la imagen:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/form-elements/img/form-elements_image_01.png?raw=true)

Por ejemplo:

````html
<form id="form">
  <input type="text" name="login">
</form>

<script>
  // form -> element
  let login = form.login;

  // element -> form
  alert(login.form); // HTMLFormElement
</script>
````

## Elementos del formulario

Hablemos de los controles de los formularios.

### input y textarea

Podemos acceder sus valores como `input.value` (cadena) o `input.checked` (booleano) para casillas de verificación (checkboxes) y botones de opción (radio buttons).

De esta manera:

````html
input.value = "New value";
textarea.value = "New text";

input.checked = true; // para checkboxes o radios
````

### ⚠️ Usa `textarea.value`, no `textarea.innerHTML`
Observa que incluso aunque `<textarea>...</textarea>` contenga su valor como `HTML` anidado, nunca deberíamos usar `textarea.innerHTML` para acceder a él.

Esto solo guarda el `HTML` que había inicialmente en la página, no su valor actual.

## select y option

Un elemento `<select>` tiene 3 propiedades importantes:

1.  `select.options` – la colección de subelementos `<option>`,
2.  `select.value` – el valor del `<option>` seleccionado actualmente, y
3.  `select.selectedIndex` – el número del `<option>` seleccionado actualmente.

Ellas proveen tres formas diferentes de asignar un valor para un elemento `<select>`:

1.  Encontrar el elemento `<option>` correspondiente (por ejemplo entre `select.options`) y asignar a su `option.selected` un `true`.
2.  Si conocemos un nuevo valor: Asignar tal valor a `select.value`.
3.  Si conocemos el nuevo número de opción: Asignar tal número a `select.selectedIndex`.

Aquí hay un ejemplo de los tres métodos:

````html
<select id="select">
  <option value="apple">Apple</option>
  <option value="pear">Pear</option>
  <option value="banana">Banana</option>
</select>

<script>
  // las tres líneas hacen lo mismo
  select.options[2].selected = true;
  select.selectedIndex = 2;
  select.value = 'banana';
  // Recuerda que las opciones comienzan en cero, así que index 2 significa la tercera opción.
</script>
````

A diferencia de la mayoría de controles, `<select>` permite seleccionar múltiples opciones a la vez si tiene el atributo multiple. Esta característica es raramente utilizada.

En ese caso, necesitamos usar la primera forma: Añade/elimina la propiedad selected de los subelementos `<option>`.

Podemos obtener su colección como select.options, por ejemplo:

````html
<select id="select" multiple>
  <option value="blues" selected>Blues</option>
  <option value="rock" selected>Rock</option>
  <option value="classic">Classic</option>
</select>

<script>
  // obtener todos los valores seleccionados del multi-select
  let selected = Array.from(select.options)
    .filter(option => option.selected)
    .map(option => option.value);

  alert(selected); // blues,rock
</script>
````

La especificación completa del elemento <select> está disponible en la especificación https://html.spec.whatwg.org/multipage/forms.html#the-select-element.
  
## new Option

En la especificación hay una sintaxis muy corta para crear elementos `<option>`:

````js
option = new Option(text, value, defaultSelected, selected);
````

Esta sintaxis es opcional. Podemos usar `document.createElement('option')` y asignar atributos manualmente. Aún puede ser más corta, aquí los parámetros:

* `text` – el texto dentro del option,
* `value` – el valor del option,
* `defaultSelected` – si es `true`, entonces se le crea el atributo HTML `selected`,
* `selected` – si es `true`, el option se selecciona.

La diferencia entre `defaultSelected` y `selected` es que defaultSelected asigna el atributo HTML, el que podemos obtener usando option.getAttribute('selected'), mientras que selected hace que el option esté o no seleccionado.

En la práctica, uno debería usualmente establecer ambos valores en `true` o `false`. O simplemente omitirlos, quedarán con el predeterminado `false`.

Por ejemplo, aquí creamos un nuevo Option “unselected”:

````js
let option = new Option("Text", "value");
// crea <option value="value">Text</option>
````

El mismo elemento, pero seleccionado:

````js
let option = new Option("Text", "value", true, true);
````

Los elementos Option tienen propiedades:

* `option.selected`
Es el option seleccionado.
* `option.index`
El número del option respecto a los demás en su <select>.
* `option.text`
El contenido del option (visto por el visitante).

## Referencias

Especificación: https://html.spec.whatwg.org/multipage/forms.html.

## Resumen

Navegación de formularios:

* `document.forms`
Un formulario está disponible como `document.forms[name/index]`.
* `form.elements`
Los elementos del formulario están disponibles como `form.elements[name/index]`, o puedes usar solo `form[name/index]`. La propiedad elements también funciona para los `<fieldset>`.
* `element.form`
Los elementos referencian a su formulario en la propiedad `form`.

El valor está disponible con `input.value`, `textarea.value`, `select.value` etc. Para checkboxes y radios, usa `input.checked` para determinar si el valor está seleccionado.

Para `<select>` también podemos obtener el valor con el índice `select.selectedIndex` o a través de la colección de opciones `select.options`.

Esto es lo básico para empezar a trabajar con formularios. Conoceremos muchos ejemplos más adelante en el tutorial.

En el siguiente capítulo vamos a hablar sobre los eventos `focus` y `blur` que pueden ocurrir en cualquier elemento, pero son manejados mayormente en formularios.

# ✅ Tareas

## Anade una opcion al select

Tenemos un `<select>`:

````html
<select id="genres">
  <option value="rock">Rock</option>
  <option value="blues" selected>Blues</option>
</select>
````

Utiliza JavaScript para:

1.  Mostrar el valor y el texto del option seleccionado.
2.  Añadir un option: `<option value="classic">Classic</option>`.
3.  Seleccionarlo.

Nota, si haz hecho todo bien, tu alert debería mostrar blues.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/form-elements/solutions/anade-una-opcion-al-select.md)
  

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/readme.md)
