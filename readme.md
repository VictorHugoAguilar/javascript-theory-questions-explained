
# Javascript Interview Question Explained

## 1. Clases Js, hosting que resultado da

```tsx
var car = new Vehicle("Honda", "white", "2010", "UK");
console.log(car);

function Vehicle(model, color, year, country) {
  this.model = model;
  this.color = color;
  this.year = year;
  this.country = country;
}
```

- 1: Undefined
- 2: ReferenceError
- 3: null
- **4: {model: "Honda", color: "white", year: "2010", country: "UK"}**

### Respuesta

Las declaraciones de función se izan de forma similar a cualquier variable. Entonces, la ubicación de la declaración de la función Vehicle no hace ninguna diferencia. 

## 2. Funciones, que resultado da

```tsx
function foo() {
  let x = (y = 0);
  x++;
  y++;
  return x;
}
console.log(foo(), typeof x, typeof y);
```

- 1: 1, undefined and undefined
- 2: ReferenceError: X is not defined
- **3: 1, undefined and number**
- 4: 1, number and number

### Respuesta

Por supuesto, el valor de retorno de foo() es 1 debido al operador de incremento. Pero la sentencia let x = y = 0 declara una variable local x. Mientras que y se declaró accidentalmente como una variable global. Esta afirmación es equivalente a,

```jsx
let x;
window.y = 0;
x = window.y;
```

Dado que la variable de ámbito de bloque x no está definida fuera de la función, el tipo tampoco estará definido. Mientras que la variable global y está disponible fuera de la función, el valor es 0 y el tipo es número.

## 3. Funciones, sync, que resultado da

```jsx
function main() {
  console.log("A");
  setTimeout(function print() {
    console.log("B");
  }, 0);
  console.log("C");
}
main();
```

- 1: A, B and C
- 2: B, A and C
- 3: A and C
- **4: A, C and B**

### Respuesta

El orden de las declaraciones se basa en el mecanismo de bucle de eventos. El orden de las declaraciones sigue el siguiente orden,

1. Al principio, la función principal se empuja a la pila.
2. Luego, el navegador empuja la primera declaración de la función principal (es decir, A's console.log) a la pila, ejecutándose y saliendo inmediatamente.
3. Pero la declaración setTimeout se movió a la API del navegador para aplicar el retraso para la devolución de llamada.
4. Mientras tanto, el archivo console.log de C se agregó a la pila, se ejecutó y apareció.
5. La devolución de llamada de setTimeout se movió de la API del navegador a la cola de mensajes.
6. La función principal salió de la pila porque no hay declaraciones para ejecutar
7. La devolución de llamada se movió de la cola de mensajes a la pila ya que la pila está vacía.
8. El archivo console.log para B se agrega a la pila y se muestra en la consola.

## 4. ¿Cuál es el resultado de la verificación de igualdad a continuación?

```jsx
console.log(0.1 + 0.2 === 0.3);
```

- **1: false**
- 2: true

### Respuesta

Esto se debe al problema matemático del punto flotante. Dado que los números de coma flotante están codificados en formato binario, las operaciones de suma sobre ellos conducen a errores de redondeo. Por lo tanto, la comparación de puntos flotantes no da los resultados esperados. Puede encontrar más detalles sobre la explicación aquí [0.30000000000000004.com](http://0.30000000000000004.com/)/
