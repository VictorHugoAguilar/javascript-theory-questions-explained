# Creating directives

# Introducción

Las directivas son funciones que pueden personalizar cómo `lit-html` representa los valores. Los autores de plantillas pueden usar directivas en sus plantillas como otras funciones

```jsx
html`<div>
     ${fancyDirective('some text')}
  </div>`
```

Sin embargo, en lugar de devolver un valor para renderizar, la directiva controla lo que se renderiza en su ubicación en el DOM.

Internamente, `lit-html` usa la interfaz `Part` para representar el DOM dinámico asociado con un enlace. Una directiva tiene acceso a la `Part` asociada con su enlace. Por ejemplo, puede encontrar el valor actual de la pieza y establecer un nuevo valor para la pieza.

Para crear una directiva, pase una función de fábrica a la función de directiva de `lit-html`:

```jsx
const helloDirective = directive(() => (part) => { part.setValue('Hello')});

const helloTemplate = html`<div>${helloDirective()}</div>`
```

La función de fábrica puede tomar argumentos opcionales para que el autor de la plantilla pase la configuración y los valores.

La función devuelta se llama cada vez que se procesa la parte. El argumento `part` es un objeto `part` con una API para administrar directamente el DOM dinámico asociado con las expresiones. Cada tipo de vinculación tiene su propio objeto `part` específico:

- `NodePart` para enlaces de contenido.
- `AttributePart` para enlaces de atributos estándar.
- `BooleanAttributePart` para enlaces de atributos booleanos.
- `EventPart` para enlaces de eventos.
- `PropertyPart` para enlaces de propiedad.

Cada uno de estos tipos de piezas implementa una API común:

- `value`. Contiene el valor actual de la parte.
- `setValue`. Establece el valor pendiente de la pieza.
- `commit`. Escribe el valor pendiente en el DOM. En la mayoría de los casos, esto sucede automáticamente; este método solo se requiere para casos de uso avanzado, como directivas asincrónicas. Consulte Directivas asíncronas para obtener más información.

Aquí hay un ejemplo de una directiva que toma una función y la evalúa en un bloque try/catch para implementar expresiones seguras para excepciones:

```jsx
const safe = directive((f) => (part) => {
  try {
    part.setValue(f());
  } catch (e) {
    console.error(e);
  }
});
```

Ahora la directiva `safe` se puede usar para envolver una función:

```jsx
let data;

// Don't throw an exception if data.foo doesn't exist.
const myTemplate = () => html`foo = ${safe(() => data.foo)}`;
```

Este ejemplo incrementa un contador en cada renderizado:

```jsx
const renderCounter = directive((initialValue) => (part) =>
  part.setValue(part.value === undefined
     ? initialValue
     :  part.value + 1);
 );
```

El usuario lo usa en una plantilla pasando un valor inicial:

```jsx
const myTemplate = () => html`
  <div>
    ${renderCounter(0)}
  </div>`;
```

# Limitar una directiva a un tipo de enlace

Algunas directivas solo son útiles en un contexto, como un enlace de atributo o un enlace de contenido. Si se coloca en el contexto incorrecto, la directiva debería arrojar un error apropiado.

Este ejemplo muestra una directiva que solo debería funcionar en un enlace de contenido (es decir, un `NodePart`).

```jsx
const myListDirective = directive((items) => (part) => {
  if (!(part instanceof NodePart)) {
    throw new Error('myListDirective can only be used in content bindings');
  }
  // Carry on ...
  ...
```

# Directivas asíncronas

Las directivas se invocan durante el proceso de renderizado. Las directivas de ejemplo anteriores son síncronas: llaman a `setValue` en sus partes antes de regresar, por lo que sus resultados se escriben en el DOM durante la llamada de procesamiento.

A veces, desea que una directiva pueda actualizar el DOM de forma asíncrona, por ejemplo, si depende de un evento asíncrono como una solicitud de red.

Cuando una directiva establece un valor de forma asincrónica, debe llamar  a la parte del método `commit` para escribir el valor actualizado en el DOM.

Aquí hay un ejemplo trivial de una directiva asíncrona:

```jsx
const resolvePromise = directive((promise) => (part) => {
  // This first setValue call is synchronous, so
  // doesn't need the commit
  part.setValue("Waiting for promise to resolve.");

  Promise.resolve(promise).then((resolvedValue) => {
    part.setValue(resolvedValue);
    part.commit();
  });
});
```

Aquí hay un ejemplo igualmente trivial de la directiva en uso:

```jsx
const waitForIt = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise is resolved.");
  }, 1000);
});

const myTemplate = () =>
   html`<div>${resolvePromise(waitForIt)}</div>`;
```

Aquí, la plantilla renderizada muestra "Esperando que se resuelva la promesa", seguido un segundo más tarde por "Promesa resuelta".

# Mantener el estado entre renders

Si su directiva necesita mantener el estado entre renderizaciones, puede confiar en el hecho de que el objeto `Part` que representa una ubicación determinada en el DOM permanece igual entre llamadas para `renderizar`. En el ejemplo de `renderCounter`, el valor de la parte sirve como estado.

Si necesita almacenar un estado más complicado, puede usar un `WeakMap`, usando la `part` como clave.

```jsx
import {directive} from 'lit-html';

// Define the map at module level
const stateMap = new WeakMap();

const statefulDirective = directive(() => (part) => {
  let myState = stateMap.get(part);
  if (myState === undefined) {
    // Initialize state for this location
    myState = {};
    stateMap.set(part, myState);
  }
  // ... use the state somehow
});
```

> ℹ️ ¿Por qué un mapa débil? El uso de un mapa débil garantiza que los objetos Part y los datos de estado se puedan recolectar como elementos no utilizados cuando ya no estén en uso, lo que evita una pérdida de memoria. Para obtener más información, consulte la página de MDN en WeakMap.
> 

# Repetición de directivas en enlaces de contenido

A veces, desea que una directiva administre varias partes anidadas. Por ejemplo, una directiva que representa una lista de elementos (como `repeat`) podría crear una parte anidada para cada elemento. Mantener partes separadas le permite manipularlas de manera eficiente: por ejemplo, puede cambiar el valor de una sola parte sin volver a representar la lista completa.

Para crear partes anidadas, construye instancias de NodePart y las asocia con ubicaciones específicas en el DOM. La sección de DOM controlada por un `NodePart` determinado debe estar delimitada por nodos estáticos que sirven como marcadores. (`lit-html` generalmente usa nodos de comentarios para estos marcadores).

![image_01](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/lit-html/creating-directives/img/lit_html_creating_directives_image_01.png?raw=true)

Como se muestra en el diagrama, los nodos administrados por NodePart aparecen entre su startNode y endNode. El siguiente código crea y agrega una nueva pieza anidada dentro de una pieza existente (la "pieza contenedora").

```jsx
import {NodePart} from 'lit-html';
const newPart = new NodePart(containerPart.options);

newPart.appendIntoPart(containerPart);
```

El resultado final se parece a esto:

![image_02](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/lit-html/creating-directives/img/lit_html_creating_directives_image_02.png?raw=true)

El método `appendIntoPart` crea los nodos de marcador e inserta la parte anidada por usted. En algunos casos, es posible que deba administrar manualmente los nodos de marcador (por ejemplo, si está insertando una parte anidada en el medio de la lista secundaria). En este caso, puedes usar un código como este:

```jsx
import {NodePart, createMarker} from 'lit-html';

// Create a new part, passing in the render options from the original part
const newPart = new NodePart(containerPart.options);

// Create markers surrounding content managed by the new part
const container = containerPart.startNode.parentNode;
const startNode = createMarker();
container.insertBefore(startNode, containerPart.endNode);
container.insertBefore(createMarker(), containerPart.endNode);

newPart.insertAfterNode(startNode);
```

Poniéndolo todo junto: la siguiente directiva de ejemplo toma un valor y lo inserta en el DOM dos veces creando dos partes anidadas. Como se muestra en Mantener el estado entre renderizados, utiliza un `WeakMap` para almacenar estas partes anidadas.

```jsx
// Import lit-html APIs
import {html, render, directive, NodePart, appendIntoPart} from 'lit-html';

// Stores the nested parts associated with a single instance of the directive
const nestedPartMap = new WeakMap();

// Creates a new nested part and adds it to the DOM
// managed by containerPart
const createAndAppendPart = (containerPart) => {
  const newPart = new NodePart(containerPart.options);
  newPart.appendIntoPart(containerPart);

  return newPart;
}

// duplicate directive takes a single value, and renders it
// in the DOM twice
const duplicate = directive((value) => {

  // the directive function itself
  return (containerPart) => {
    if (!(containerPart instanceof NodePart)) {
      throw new Error('duplicate directive can only be used in content bindings');
    }

    let part1, part2;
    const nestedParts = nestedPartMap.get(containerPart);
    if (nestedParts === undefined) {
      // create parts
      part1 = createAndAppendPart(containerPart);
      part2 = createAndAppendPart(containerPart);
      nestedPartMap.set(containerPart, [part1, part2]);
    } else {
      [part1, part2] = nestedParts;
    }

    // for imperatively created parts, need to call commit()
    // after setValue()
    part1.setValue(value);
    part1.commit();
    part2.setValue(value);
    part2.commit();
  }
});
```

La clase `NodePart` proporciona una serie de otros métodos convenientes, incluidos otros métodos para agregar partes anidadas y un método `clear` para eliminar todo el DOM asociado con una `part`.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
