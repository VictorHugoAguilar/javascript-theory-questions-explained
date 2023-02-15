# 📖 Interacción: alert, prompt, confirm

Como usaremos el navegador como nuestro entorno de demostración, veamos un par de funciones para interactuar con el usuario: `alert`, `prompt`, y `confirm`.

## alert
Ya la hemos visto. Muestra un mensaje y espera a que el usuario presione “Aceptar”.

Por ejemplo:

````js
alert("Hello");
````

La mini ventana con el mensaje se llama * ventana modal *. La palabra “modal” significa que el visitante no puede interactuar con el resto de la página, presionar otros botones, etc., hasta que se haya ocupado de la ventana. En este caso, hasta que presionen “OK”.

## prompt
La función prompt acepta dos argumentos:

````js
result = prompt(title, [default]);
````

Muestra una ventana modal con un mensaje de texto, un campo de entrada para el visitante y los botones OK/CANCELAR.

`title`

El texto a mostrar al usuario.

`default`

Un segundo parámetro opcional, es el valor inicial del campo de entrada.

### ℹ️ Corchetes en la sintaxis `[...]`
Los corchetes alrededor de `default` en la sintaxis de arriba denotan que el parámetro es opcional, no requerido.

El usuario puede escribir algo en el campo de entrada de solicitud y presionar OK, así obtenemos ese texto en `result`. O puede cancelar la entrada, con el botón “Cancelar” o presionando la tecla Esc, de este modo se obtiene `null` en `result`.

La llamada a prompt retorna el texto del campo de entrada o null si la entrada fue cancelada.

Por ejemplo:

````js
let age = prompt ('¿Cuántos años tienes?', 100);

alert(`Tienes ${age} años!`); //Tienes 100 años!
````

### ⚠️ En IE: proporciónale un predeterminado siempre
El segundo parámetro es opcional, pero si no lo proporcionamos, Internet Explorer insertará el texto `"undefined"` en el prompt.

Ejecuta este código en Internet Explorer para verlo:

````js
let test = prompt("Test");
````
Por lo tanto, para que las indicaciones se vean bien en IE, recomendamos siempre proporcionar el segundo argumento:

````js
let test = prompt("Test", ''); // <-- para IE
````

## confirm

La sintaxis:

````js
result = confirm(pregunta);
````

La función `confirm` muestra una ventana modal con una `pregunta` y dos botones: OK y CANCELAR.

El resultado es `true` si se pulsa OK y `false` en caso contrario.

Por ejemplo:

````js
let isBoss = confirm("¿Eres el jefe?");

alert( isBoss ); // true si se pulsa OK
````

## Resumen

Cubrimos 3 funciones específicas del navegador para interactuar con los usuarios:

`alert`
muestra un mensaje.

`prompt`
muestra un mensaje pidiendo al usuario que introduzca un texto. Retorna el texto o, si se hace clic en CANCELAR o se presiona Esc, retorna null.

`confirm`
muestra un mensaje y espera a que el usuario pulse “OK” o “CANCELAR”. Retorna true si se presiona OK y false si se presiona CANCEL/Esc.

Todos estos métodos son modales: detienen la ejecución del script y no permiten que el usuario interactúe con el resto de la página hasta que la ventana se haya cerrado.

Hay dos limitaciones comunes a todos los métodos anteriores:

1. La ubicación exacta de la ventana modal está determinada por el navegador. Normalmente, está en el centro.
2. El aspecto exacto de la ventana también depende del navegador. No podemos modificarlo.

Ese es el precio de la simplicidad. Existen otras formas de mostrar ventanas más atractivas e interactivas para el usuario, pero si la apariencia no importa mucho, estos métodos funcionan bien.

# ✅ Tareas

## Una pagina simple

Crea una página web que pida un nombre y lo muestre.

[solución](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/06_alert-prompt-confirm/solutions/una-pagina-simple.md)

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps)
