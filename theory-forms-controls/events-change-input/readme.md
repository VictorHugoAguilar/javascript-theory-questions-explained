# 馃摉 Eventos: change, input, cut, copy, paste

Veamos varios eventos que acompa帽an la actualizaci贸n de datos.

## Evento: change

El evento `change` se activa cuando el elemento finaliza un cambio.

Para ingreso de texto significa que el evento ocurre cuando se pierde foco en el elemento.

Por ejemplo, mientras estamos escribiendo en el siguiente cuadro de texto, no hay evento. Pero cuando movemos el focus (enfoque) a otro lado, por ejemplo hacemos click en un bot贸n, entonces ocurre el evento `change`:

````html
<input type="text" onchange="alert(this.value)">
<input type="button" value="Button">
````

Para otros elementos: `select`, `input` `type=checkbox/radio` se dispara inmediatamente despu茅s de cambiar la opci贸n seleccionada:

````html
<select onchange="alert(this.value)">
  <option value="">Select something</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
````

## Evento: input

El evento input se dispara cada vez que un valor es modificado por el usuario.

A diferencia de los eventos de teclado, ocurre con el cambio a cualquier valor, incluso aquellos que no involucran acciones de teclado: copiar/pegar con el mouse o usar reconocimiento de voz para dictar texto.

Por ejemplo:

````html
<input type="text" id="input"> oninput: <span id="result"></span>
<script>
  input.oninput = function() {
    result.innerHTML = input.value;
  };
</script>
````

Si queremos manejar cualquier modificaci贸n en un `<input>` entonces este evento es la mejor opci贸n.

Por otro lado, el evento input no se activa con entradas del teclado u otras acciones que no involucren modificar un valor, por ejemplo presionar las flechas de direcci贸n 鈬? 鈬? mientras se est谩 en el input.

### 鈩癸笍 No podemos prevenir nada en oninput
El evento input se dispara despu茅s de que el valor es modificado.

Por lo tanto no podemos usar `event.preventDefault()` aqu铆, es demasiado tarde y no tendr铆a efecto.

## Eventos: cut, copy, paste

Estos eventos ocurren al cortar/copiar/pegar un valor.

Estos pertenecen a la clase ClipboardEvent y dan acceso a los datos cortados/copiados/pegados.

Tambi茅n podemos usar `event.preventDefault()` para cancelar la acci贸n y que nada sea cortado/copiado/pegado.

El siguiente c贸digo tambi茅n evita todo evento `cut/copy/paste` y muestra qu茅 es los que estamos intentando cortar/copiar/pegar:

````html
<input type="text" id="input">
<script>
  input.onpaste = function(event) {
    alert("paste: " + event.clipboardData.getData('text/plain'));
    event.preventDefault();
  };

  input.oncut = input.oncopy = function(event) {
    alert(event.type + '-' + document.getSelection());
    event.preventDefault();
  };
</script>
````

Nota que dentro de los manejadores cut y copy, llamar a event.clipboardData.getData(...) devuelve un string vac铆o. Esto es porque el dato no est谩 en el portapapeles a煤n. Y si usamos `event.preventDefault()` no ser谩 copiado en absoluto.

Por ello el ejemplo arriba usa `document.getSelection()` para obtener el texto seleccionado. Puedes encontrar m谩s detalles acerca de selecci贸n en el art铆culo Selection y Range.

No solo es posible copiar/pegar texto, sino cualquier cosa. Por ejemplo, podemos copiar un archivo en el gestor de archivos del SO y pegarlo.

Esto es porque clipboardData implementa la interfaz DataTransfer, usada com煤nmente para 鈥渁rrastrar y soltar鈥? y 鈥渃opiar y pegar鈥?. Ahora esto est谩 fuera de nuestro objetivo, pero puedes encontrar sus m茅todos en la especificaci贸n DataTransfer.

Hay adem谩s una API asincr贸nica adicional para acceso al portapapeles: `navigator.clipboard`. M谩s en la especificaci贸n Clipboard API and events, no soportado en Firefox.

## Restricciones de seguridad

El portapapeles es algo a nivel 鈥済lobal鈥? del SO. Un usuario puede alternar entre ventanas, copiar y pegar diferentes cosas, y el navegador no deber铆a ver todo eso.

Por ello la mayor铆a de los navegadores dan acceso al portapapeles 煤nicamente bajo determinadas acciones del usuario, como copiar y pegar.

Est谩 prohibido generar eventos 鈥減ersonalizados鈥? del portapapeles con dispatchEvent en todos los navegadores excepto Firefox. Incluso si logramos enviar tal evento, la especificaci贸n establece que tal evento 鈥渟int茅tico鈥? no debe brindar acceso al portapapeles.

Incluso si alguien decide guardar `event.clipboardData` en un manejador de evento para accederlo luego, esto no funcionar谩.

Para reiterar, `event.clipboardData` funciona 煤nicamente en el contexto de manejadores de eventos iniciados por el usuario.

Por otro lado, `navigator.clipboard` es una API m谩s reciente, pensada para el uso en cualquier contexto. Esta pide autorizaci贸n al usuario cuando la necesita.

## Resumen

Eventos de modificaci贸n de datos:

| Evento        | Descripci贸n           | Especiales                    |
|---------------|-----------------------|-------------------------------|
|change         | Un valor fue cambiado.|	En ingreso de texto, se dispara cuando el elemento pierde el foco |
|input          |	Cada cambio de entrada de texto |	Se dispara de inmediato con cada cambio, a diferencia de change.  |
|cut/copy/paste |	Acciones cortar/copiar/pegar    |	La acci贸n puede ser cancelada. La propiedad `event.clipboardData` brinda acceso al portapeles. Todos los navegadores excepto Firefox tambi茅n soportan navigator.clipboard.  |

# 鉁? Tareas

Calculadora de deposito

Crea una interfaz que permita ingresar una suma de dep贸sito bancario y porcentaje, luego calcula cu谩nto ser谩 despu茅s de un periodo de tiempo determinado.

Ac谩 una demostraci贸n:

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/events-change-input/img/events-change-input_image_01.png?raw=true)

Cualquier modificaci贸n debe ser procesada de inmediato.

La f贸rmula es:

````js
// initial: la suma inicial de dinero
// interest: e.g. 0.05 significa 5% anual
// years: cu谩ntos a帽os esperar
let result = Math.round(initial * (1 + interest) ** years);
````

[soluci贸n](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/events-change-input/solutions/calculadora-de-deposito.md)

---
[猬咃笍 volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-forms-controls/readme.md)
