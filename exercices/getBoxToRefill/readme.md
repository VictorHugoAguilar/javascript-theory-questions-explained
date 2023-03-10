# Reponer elementos en los almacenes

En los almacenes están haciendo inventario. Hay tres almacenes (que se representa cada uno como un Array). En cada almacén hay elemento.

Nos han pedido que escribamos un programa que nos diga qué elementos hay que comprar para reponer en nuestros almacenes ahora. Un elemento se tiene que reponer cuando sólo hay stock en uno de los tres almacenes.

Por ejemplo, si tenemos los siguientes almacenes:

```js
const a1 = ['bici', 'coche', 'bici', 'bici']
const a2 = ['coche', 'bici', 'muñeca', 'coche']
const a3 = ['bici', 'pc', 'pc']
````

* El almacén a1 tiene "bici" y "coche".
* El almacén a2 tiene "coche", "bici" y "muñeca".
* El almacén a3 tiene "bici" y "pc".
* El regalo "muñeca" y "pc" sólo están en los almacenes a2 y a3 respectivamente.

```js
const gifts = getBoxToRefill(a1, a2, a3) // ['muñeca', 'pc']
````

Como ves, los almacenes pueden tener el mismo regalo repetido varias veces. Pero, por más existencias que haya en un almacén, si no tenemos en los otros dos, debemos reponerlo para tener mejor distribución.

📝 Summary
Crea una función getBoxToRefill que reciba tres Array como parámetros.
La función debe devolver un Array con los regalos que hay que reponer.
Un regalo se debe reponer cuando sólo hay stock en uno de los tres almacenes.
Si no hay ningún regalo que reponer, la función debe devolver un Array vacío.
Si hay más de un regalo que reponer, la función debe devolver un Array con todos los regalos que hay que reponer.
