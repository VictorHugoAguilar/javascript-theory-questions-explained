<p>La característica más importante de Vue 3 es la API de composición. Esta ofrece un enfoque alternativo para crear componentes que es muy diferente a la API de opciones existente. No tengo ningún problema en admitir que cuando lo vi por primera vez, no lo entendí. Cuanto más lo uso, más sentido tiene. Si bien no reescribirá aplicaciones completas con la API de composición, le hará pensar en cómo crear componentes y componer la funcionalidad en el futuro.</p>
<p>Ahora viene una de las cuestiones que me planteo al ir descubriendo la api de composición, y es cuando utilizar ref o cuando utilizar reactive en la declaración de las propiedades. Aqui nos centraremos en Ref vs Reactive y no en la mecánica de la API de composición.</p>

## Estados reactivos en vue 2

Cuando desee que Vue realice un seguimiento de los cambios en los datos, debe declarar esa propiedad dentro de un objeto que se devuelve desde la función de datos.

```js
<template>
    <h1>{{ title }}</h1>
</template>

<script>
export default {
    data() {
        return {
            title: "Hello, Vue 🫡!",
        };
    },
};
</script>
```

<p>Por debajo, Vue 2 analiza cada propiedad y usa <span style="background-color:#69F0AE; color:#546E7A">Object.defineProperty()</span> para crear captadores y definidores para cada dato que necesita para realizar un seguimiento. Esta es una explicación básica del proceso, pero lo que quiero transmitir es que no es magia. No puede simplemente crear datos en cualquier lugar y esperar que Vue realice un seguimiento de ellos. Debes seguir el proceso de definición en la función  <span style="background-color:#69F0AE; color:#546E7A">data()</span>.</p>

## REF VS REACTIVE

<p>Con la API de opciones, tenemos que seguir algunas reglas al definir datos reactivos y la API de composición no es diferente. No puede simplemente declarar datos y esperar que Vue sepa que le gustaría realizar un seguimiento de los cambios. En el siguiente ejemplo, definí un título y lo devolví desde la función setup() para que esté disponible en la plantilla.</p>

```js
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    setup() {
      let title = "Hello, Vue 3 🫡!";
      return { title };
    }
  };
</script>
```

<p>Esto funcionará, pero la propiedad del título no es reactiva. Esto significa que si algo cambia de título, esos cambios NO se reflejarán en el DOM. Digamos, por ejemplo, que desea actualizar el título después de 5 segundos, lo siguiente NO funcionará. </p>

```js
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    setup() {
      let title = "Hello, Vue 3 🫡!";

      setTimeout(() => {
        title = "Esto nunca se mostrará 🤬";
      }, 5000);

      return { title };
    }
  };
</script>
```

<p> Para solucionar el ejemplo anterior, podemos importar {ref} desde 'vue' y usar  <span style="background-color:#69F0AE; color:#546E7A">ref()</span>, que marcará esa variable como datos reactivos. Por debajo en Vue 3, creará un Proxy.</p>

```js
template>
  <h1>{{ title }}</h1>
</template>

<script>
  import { ref } from "vue";

  export default {
    setup() {
      const title = ref("Hello, Vue 3 🫡!");

      setTimeout(() => {
        title.value = "Nuevo título este sí,😜";
      }, 5000);

      return { title };
    }
  };
</script>
```

<p> Cuando se trata de ref vs reactive existen diferentes utilizaciones, como por ejemplo la primera tiene que ver con la creación de un componente como el que mencionamos anteriormente y necesita definir datos reactivos. La segunda es cuando está creando funciones componibles que usarán funciones o componentes
</p>

## REF

Si desea convertir un tipo de datos primitivo en una propiedad reactiva, <span style="background-color:#69F0AE; color:#546E7A">ref()</span> será su primera opción. Si necesita un repaso, los siete tipos de datos primitivos en JavaScript son:

-   String
-   Number
-   BigInt
-   Boolean
-   Symbol
-   Null
-   Undefined

```js
import { ref } from "vue";

export default {
    setup() {
        const title = ref("🤭");
        const one = ref(1);
        const isValid = ref(true);
        const foo = ref(null);
    },
};
```

<p>Del ejemplo anterior, teníamos un String llamado título, por lo que  <span style="background-color:#69F0AE; color:#546E7A">ref()</span> era una buena opción para declarar datos reactivos</p>

```js
import { ref } from "vue";

export default {
    setup() {
        const title = ref("Hello, Vue 3 🫡!");

        setTimeout(() => {
            title.value = "New Title 🤖";
        }, 5000);

        return { title };
    },
};
```

<p>¿Por qué usar una const para el título cuando el valor va a cambiar? ¿No deberíamos usar let aquí? Si fuera a console.log(título), es posible que esperara ver el valor ¡Hola, Vue 3!, en su lugar, obtiene un objeto que se ve así:</p>

```js
{_isRef: true}
value: (...)
_isRef: true
get value: ƒ value()
set value: ƒ value(newVal)
__proto__: Object
```

<p> <span style="background-color:#69F0AE; color:#546E7A">ref()</span> toma un valor interno y devuelve un objeto ref reactivo y mutable. El objeto ref tiene una sola propiedad .value que apunta al valor interno. Esto significa que si desea acceder o mutar el valor, debe usar title.value. y debido a que este es un objeto que no cambiará, he decidido declararlo como const.</p>

## REF UNWRAPPING

<p>La siguiente pregunta que podría hacerse es "¿Por qué no tenemos que hacer referencia a .value en la plantilla"?</p>

```js
<template>
    <h1>{{ title }}</h1>
</template>
```

<p>Cuando se devuelve una referencia como una propiedad en el contexto de representación (el objeto devuelto por la configuración()) y se accede a ella en la plantilla, se desenvuelve automáticamente en el valor interno. No es necesario agregar .value en la plantilla.</p>

<p>Las propiedades calculadas funcionan de la misma manera, por lo que si necesita el valor de una propiedad calculada dentro del método setup(), deberá usar .value</p>

## REACTIVE

<p>Acabamos de ver algunos ejemplos del uso de  <span style="background-color:#69F0AE; color:#546E7A">ref()</span> cuando desea definir datos reactivos en valores primitivos. ¿Qué sucede si desea crear un objeto reactivo? En ese caso, aún podría usar  <span style="background-color:#69F0AE; color:#546E7A">ref()</span> pero debajo, solo está llamando a  <span style="background-color:#69F0AE; color:#546E7A">reactive()</span>, así que me limitaré a usar  <span style="background-color:#69F0AE; color:#546E7A">reactive()</span>.</p>
<p>Por otro lado, ese reactivo () no funcionará con valores primitivos.  <span style="background-color:#69F0AE; color:#546E7A">reactive()</span> toma un objeto y devuelve un proxy reactivo del original. Esto es equivalente a Vue.observable() de 2.x y se le cambió el nombre para evitar confusiones con los observables de RxJS.</p>

```js
import { reactive } from "vue";

export default {
    setup() {
        const data = reactive({
            title: "Hello, Vue 3 🫡!",
        });

        return { data };
    },
};
```

<p>La gran diferencia aquí es cuando desea acceder a los datos definidos usando reactivo() en su plantilla. En el ejemplo anterior, los datos son un objeto que contiene una propiedad denominada título. Deberá hacer referencia a data.title en su plantilla:</p>

```js
<template>
  <h1>{{ data.title }}</h1>
</template>

<script>
  import { ref } from "vue";

  export default {
    setup() {
      const data = ref({
        title: "Hello, Vue 3 🫡!"
      });

      return { data };
    }
  };
</script>
```

## Ejemplo de creación composable logic

<p>Se le ha encomendado la tarea de crear alguna lógica que realice un seguimiento de la posición del mouse de un usuario. También necesita la capacidad de reutilizar esta lógica en cualquier componente que lo necesite. Crea una función de composición que realiza un seguimiento de las coordenadas x e y y luego las devuelve al consumidor.</p>

```js
import { ref, onMounted, onUnmounted } from "vue";

export function useMousePosition() {
    const x = ref(0);
    const y = ref(0);

    function update(e) {
        x.value = e.pageX;
        y.value = e.pageY;
    }

    onMounted(() => {
        window.addEventListener("mousemove", update);
    });

    onUnmounted(() => {
        window.removeEventListener("mousemove", update);
    });

    return { x, y };
}
```

<p>Si desea consumir esta lógica en un componente, puede llamar a la función, desestructurar el objeto de retorno y luego devolver las coordenadas x e y a su plantilla.</p>

```js
<template>
  <h1>Use Mouse Demo</h1>
  <p>x: {{ x }} | y: {{ y }}</p>
</template>

<script>
  import { useMousePosition } from "./use/useMousePosition";

  export default {
    setup() {
      const { x, y } = useMousePosition();
      return { x, y };
    }
  };
</script>
```

<p>Esto funcionará, pero cuando echó un vistazo a esta función, decidió refactorizar x e y en un objeto de posición:</p>

```js
import { ref, onMounted, onUnmounted } from "vue";

export function useMousePosition() {
    const pos = {
        x: 0,
        y: 0,
    };

    function update(e) {
        pos.x = e.pageX;
        pos.y = e.pageY;
    }

    // ...
}
```

<p>El problema de este enfoque es que el consumidor de la función de composición debe mantener la referencia al objeto devuelto en todo momento para conservar la reactividad. Esto significa que el objeto no puede ser desestructurado o esparcido:</p>

```js
// consuming component
export default {
    setup() {
        // reactivity lost!
        const { x, y } = useMousePosition();
        return {
            x,
            y,
        };

        // reactivity lost!
        return {
            ...useMousePosition(),
        };

        // this is the only way to retain reactivity.
        // you must return `pos` as-is and reference x and y as `pos.x` and `pos.y`
        // in the template.
        return {
            pos: useMousePosition(),
        };
    },
};
```

<p>Sin embargo, esto no significa que no puedas usar reactivos. Hay un método  <span style="background-color:#69F0AE; color:#546E7A">toRefs()</span> que convertirá un objeto reactivo en un objeto simple, donde cada propiedad en el objeto resultante es una referencia que apunta a la propiedad correspondiente en el objeto original.</p>

```js
function useMousePosition() {
    const pos = reactive({
        x: 0,
        y: 0,
    });

    // ...
    return toRefs(pos);
}

// x & y are now refs!
const { x, y } = useMousePosition();
```

<p>Como puede ver, hay algunas cosas a tener en cuenta al crear funciones de composición. Mientras comprenda cómo se pueden consumir sus funciones, debería estar bien.</p>

## referencias

-   [Documentacion Vue.js](https://vuejs.org/guide/extras/composition-api-faq.html#ref-vs-reactive)
-   [Stackoverflow](https://stackoverflow.com/questions/61452458/ref-vs-reactive-in-vue-3)
