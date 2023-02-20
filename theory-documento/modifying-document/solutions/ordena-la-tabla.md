# ordena-la-tabla

La solución es corta, pero puede verse algo dificultosa así que brindamos comentarios extendidos:

````js
let sortedRows = Array.from(table.tBodies[0].rows) // 1
  .sort((rowA, rowB) => rowA.cells[0].innerHTML.localeCompare(rowB.cells[0].innerHTML));

table.tBodies[0].append(...sortedRows); // (3)
````

El algoritmo paso a paso:

1.  Obtener todos los `<tr>` de `<tbody>`.
2.  Entonces ordenarlos comparando por el contenido de su primer `<td>` (el campo nombre).
3.  Ahora insertar nodos en el orden correcto con `.append(...sortedRows).

No necesitamos quitar los elementos row, simplemente “reinsertarlos”, ellos dejan el viejo lugar automáticamente.

P.S. En nuestro caso, hay un `<tbody>` explícito en la tabla, pero incluso si la tabla HTML no tiene `<tbody>`, la estructura DOM siempre lo tiene.
  
## solucion completa
  
````html
<!DOCTYPE html>

<table id="table">
<thead>
  <tr>
    <th>Name</th><th>Surname</th><th>Age</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>John</td><td>Smith</td><td>10</td>
  </tr>
  <tr>
    <td>Pete</td><td>Brown</td><td>15</td>
  </tr>
  <tr>
    <td>Ann</td><td>Lee</td><td>5</td>
  </tr>
  <tr>
    <td>...</td><td>...</td><td>...</td>
  </tr>
</tbody>
</table>

<script>
  let sortedRows = Array.from(table.tBodies[0].rows)
    .sort((rowA, rowB) => rowA.cells[0].innerHTML.localeCompare(rowB.cells[0].innerHTML));

  table.tBodies[0].append(...sortedRows);
</script>
````

#ordena-la-tabla
