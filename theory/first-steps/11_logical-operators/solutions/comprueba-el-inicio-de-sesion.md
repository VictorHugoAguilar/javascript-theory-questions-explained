## comprueba-el-inicio-de-sesion

````js
let userName = prompt("Quién está ahí?", "");

if (userName == "Admin") {

    let pass = prompt("¿Contraseña?", "");

    if (pass === "TheMaster") {
  alert( "Bienvenido!" );
    } else if (pass === "" || pass === null) {
  alert( "Cancelado." );
    } else {
  alert( "Contraseña incorrecta" );
    }

} else if (userName === "" || userName === null) {
    alert( "Canceledo" );
} else {
    alert( "No te conozco" );
}
````
Nota las sangrías verticales dentro de los bloques `if`. Técnicamente no son necesarias, pero facilitan la lectura del código.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/first-steps/11_logical-operators/readme.md#comprueba-el-inicio-de-sesion)
