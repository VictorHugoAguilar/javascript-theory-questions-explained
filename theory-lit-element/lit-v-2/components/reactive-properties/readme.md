# Reactive properties

# Introducción

Los componentes iluminados reciben entradas y almacenan su estado como propiedades o campos de clase de JavaScript. Las propiedades reactivas son propiedades que pueden desencadenar el ciclo de actualización reactiva cuando se modifican, volver a representar el componente y, opcionalmente, leerse o escribirse en los atributos.

```jsx
class MyElement extends LitElement {
  static properties = {
    name: {},
  };
}
```

Lit gestiona tus propiedades reactivas y sus atributos correspondientes. En particular:

- **Actualizaciones reactivas.** Lit genera un par getter/setter para cada propiedad reactiva. Cuando cambia una propiedad reactiva, el componente programa una actualización.
- **Manejo de atributos**. De forma predeterminada, Lit configura un atributo observado correspondiente a la propiedad y actualiza la propiedad cuando cambia el atributo. Los valores de propiedad también pueden, opcionalmente, reflejarse en el atributo.
- **Propiedades de superclase**. Lit aplica automáticamente las opciones de propiedad declaradas por una superclase. No necesita volver a declarar propiedades a menos que desee cambiar las opciones.
- **Actualización de elementos**. Si un componente de Lit se define después de que el elemento ya está en el DOM, Lit maneja la lógica de actualización, asegurando que cualquier propiedad establecida en un elemento antes de que se actualice desencadene los efectos secundarios reactivos correctos cuando el elemento se actualice.

# Public properties and internal state

Las propiedades públicas son parte de la API pública del componente. En general, las propiedades públicas, especialmente las propiedades reactivas públicas, deben tratarse como entrada.

El componente no debería cambiar sus propias propiedades públicas, excepto en respuesta a la entrada del usuario. Por ejemplo, un componente de menú puede tener una propiedad `selected` pública que el propietario del elemento puede inicializar en un valor dado, pero que el componente mismo actualiza cuando el usuario selecciona un elemento. En estos casos, el componente debe enviar un evento para indicar al propietario del componente que la propiedad `selected` cambió. Consulte Envío de eventos para obtener más detalles.

Lit también es compatible con el estado reactivo interno. El estado reactivo interno hace referencia a las propiedades reactivas que no forman parte de la API del componente. Estas propiedades no tienen un atributo correspondiente y, por lo general, se marcan como protegidas o privadas en TypeScript.

```jsx
static properties = {
  _counter: {state: true};
};

constructor() {
  super();
  this._counter = 0;
}
```

El componente manipula su propio estado reactivo interno. En algunos casos, el estado reactivo interno puede inicializarse desde propiedades públicas, por ejemplo, si hay una transformación costosa entre la propiedad visible para el usuario y el estado interno.

# Public reactive properties

Declare las propiedades reactivas públicas de su elemento usando decoradores o el campo de propiedades estáticas.

En cualquier caso, puede pasar un objeto de opciones para configurar funciones para la propiedad.

# Declaring properties with decorators

Utilice el decorador `@property` con una declaración de campo de clase para declarar una propiedad reactiva.

```jsx
class MyElement extends LitElement {
  @property({type: String})
  mode: string;

  @property({attribute: false})
  data = {};
}
```

El argumento para los decoradores de `@property` es un objeto de opciones. Omitir el argumento equivale a especificar el valor predeterminado para todas las opciones.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un compilador como Babel o el compilador TypeScript para usar decoradores.
> 

## Declaring properties in a static properties class field

Para declarar propiedades en un campo de clase de propiedades estáticas:

```jsx
class MyElement extends LitElement {
  static properties = {
    mode: {type: String},
    data: {attribute: false},
  };

  constructor() {
    super();
    this.data = {};
  }
}
```

Un objeto de opción vacío equivale a especificar el valor predeterminado para todas las opciones.

## Evitar problemas con los campos de clase al declarar propiedades

Los campos de clase tienen una interacción problemática con las propiedades reactivas. Los campos de clase se definen en la instancia del elemento. Las propiedades reactivas se definen como accesores en el prototipo del elemento. De acuerdo con las reglas de JavaScript, una propiedad de instancia tiene prioridad y efectivamente oculta una propiedad de prototipo. Esto significa que los descriptores de acceso de propiedad reactivos no funcionan cuando se utilizan campos de clase. Cuando se establece una propiedad, el elemento no se actualiza.

En JavaScript, no debe usar campos de clase al declarar propiedades reactivas. En su lugar, las propiedades deben inicializarse en el constructor de elementos:

```jsx
constructor() {
  super();
  this.data = {};
}
```

Para **TypeScript**, puede usar **class fields** para declarar propiedades reactivas siempre que use uno de estos patrones:

- Establezca la configuración useDefineForClassFields en su tsconfig en falso. Tenga en cuenta que esto no es necesario para algunas configuraciones de TypeScript, pero se recomienda configurarlo explícitamente como falso.
- Agregue la palabra clave declare en el campo y coloque el inicializador del campo en el constructor.

Al compilar JavaScript con Babel, puede usar campos de clase para declarar propiedades reactivas siempre que establezca `setPublicClassFields` en verdadero en la configuración de suposiciones de su `babelrc`. Tenga en cuenta que para versiones anteriores de Babel, también debe incluir el complemento `@babel/plugin-proposal-class-properties`:

```jsx
assumptions = {
  "setPublicClassFields": true
};

plugins = [
  ["@babel/plugin-proposal-class-properties"],
];
```

## Property options

El objeto de opciones puede tener las siguientes propiedades:

**`atributo`**

Si la propiedad está asociada con un atributo o un nombre personalizado para el atributo asociado. Valor predeterminado: verdadero. Si el `attribute` es `false`, las opciones de `converter`, `reflex` y `type` se ignoran. Para obtener más información, consulte Establecer el nombre del atributo.

**`converter`**

Un convertidor personalizado para convertir entre propiedades y atributos. Si no se especifica, utilice el convertidor de atributos predeterminado.

**`hasChanged`**

Una función llamada cada vez que se establece la propiedad para determinar si la propiedad ha cambiado y debe desencadenar una actualización. Si no se especifica, LitElement usa una verificación de desigualdad estricta (`newValue !== oldValue`) para determinar si el valor de la propiedad ha cambiado. Para obtener más información, consulte Personalización de la detección de cambios.

**`noAccessor`**

Establézcalo en verdadero para evitar generar los descriptores de acceso de propiedad predeterminados. Esta opción rara vez es necesaria. Valor predeterminado: `false`. Para obtener más información, consulte Impedir que Lit genere un descriptor de acceso de propiedad.

**`reflex`**

Si el valor de la propiedad se refleja en el atributo asociado. Valor predeterminado: falso. Para obtener más información, consulte Habilitación de la `reflex` de atributos.

**`state`**

Establézcalo en verdadero para declarar la propiedad como estado reactivo interno. El estado reactivo interno desencadena actualizaciones como propiedades reactivas públicas, pero Lit no genera un atributo para él y los usuarios no deben acceder a él desde fuera del componente. Equivale a usar el decorador `@state`. Valor predeterminado: `false`. Para obtener más información, consulte Estado reactivo interno.

**`type`**

Al convertir un atributo con valor de cadena en una propiedad, el convertidor de atributos predeterminado de Lit analizará la cadena en el tipo dado y viceversa al reflejar una propiedad en un atributo. Si se establece el convertidor, este campo se pasa al convertidor. Si no se especifica el tipo, el convertidor predeterminado lo trata como `tipo: string`. Consulte Uso del convertidor predeterminado.

Cuando se usa TypeScript, este campo generalmente debe coincidir con el tipo de TypeScript declarado para el campo. Sin embargo, el tiempo de ejecución de Lit utiliza la opción de tipo para la serialización/deserialización de cadenas, y no debe confundirse con un mecanismo de verificación de tipo.

Omitir el objeto de opciones o especificar un objeto de opciones vacío es equivalente a especificar el valor predeterminado para todas las opciones.

## Estado reactivo interno

El estado reactivo interno hace referencia a las propiedades reactivas que no forman parte de la API pública del componente. Estas propiedades de estado no tienen atributos correspondientes y no están diseñadas para usarse desde fuera del componente. El propio componente debe establecer el estado reactivo interno.

Use el decorador `@state` para declarar el estado reactivo interno:

```jsx
@state()
protected _active = false;
```

Usando el campo de clase de `propiedades estáticas`, puede declarar el estado reactivo interno usando la opción `state: true`.

```jsx
static properties = {
  _active: {state: true}
};

constructor() {
  this._active = false;
}
```

No se debe hacer referencia al estado reactivo interno desde fuera del componente. En TypeScript, estas propiedades deben marcarse como privadas o protegidas. También recomendamos usar una convención como un guión bajo inicial `(_)` para identificar propiedades privadas o protegidas para los usuarios de JavaScript.

El estado reactivo interno funciona igual que las propiedades reactivas públicas, excepto que no hay ningún atributo asociado con la propiedad. La única opción que puede especificar para el estado reactivo interno es la función `hasChanged`.

El decorador `@state` también puede servir como una pista para un minificador de código de que el nombre de la propiedad se puede cambiar durante la minificación.

# ¿Qué sucede cuando las propiedades cambian?

Un cambio de propiedad puede desencadenar un ciclo de actualización reactiva, lo que hace que el componente vuelva a representar su plantilla.

Cuando una propiedad cambia, ocurre la siguiente secuencia:

1. Se llama al setter de la propiedad.
2. El setter llama al método `requestUpdate` del componente.
3. Se comparan los valores antiguos y nuevos de la propiedad.
    1. Por defecto, Lit usa una estricta prueba de desigualdad para determinar si el valor ha cambiado (es decir, `newValue !== oldValue`).
    2. Si la propiedad tiene una función `hasChanged`, se llama con los valores antiguo y nuevo de la propiedad.
4. Si se detecta el cambio de propiedad, se programa una actualización de forma asíncrona. Si ya hay una actualización programada, solo se ejecuta una única actualización.
5. Se llama al método de actualización del componente, reflejando las propiedades modificadas en los atributos y volviendo a representar las plantillas del componente.

Tenga en cuenta que si muta una propiedad de objeto o matriz, no activará una actualización, porque el objeto en sí no ha cambiado. Para obtener más información, consulte Mutación de propiedades de objeto y matriz.

Hay muchas formas de conectarse y modificar el ciclo de actualización reactiva. Para obtener más información, consulte Ciclo de actualización reactiva.

## Mutación de propiedades de object y array

Mutar un objeto o una matriz no cambia la referencia del objeto, por lo que no activará una actualización. Puede manejar las propiedades de objeto y matriz de una de dos maneras:

- **Patrón de datos inmutable**. Trate los objetos y las matrices como inmutables. Por ejemplo, para eliminar un elemento de myArray, construya una nueva matriz:
    
    ```jsx
    this.myArray = this.myArray.filter((_, i) => i !== indexToRemove);
    ```
    
     Si bien este ejemplo es simple, a menudo es útil usar una biblioteca como Immer para administrar datos inmutables. Esto puede ayudar a evitar el código repetitivo engañoso al configurar objetos profundamente anidados.
    
- **Activación manual de una actualización**. Mute los datos y llame a `requestUpdate()` para activar una actualización directamente. Por ejemplo:
    
    ```jsx
    this.myArray.splice(indexToRemove, 1);
    this.requestUpdate();
    ```
    
    Cuando se llama sin argumentos, `requestUpdate()` programa una actualización, sin llamar a la función `hasChanged()`. Pero tenga en cuenta que `requestUpdate()` solo hace que se actualice el componente actual. Es decir, si un componente usa el código que se muestra arriba y el componente pasa `this.myArray` a un subcomponente, el subcomponente detectará que la referencia de la matriz no ha cambiado, por lo que no se actualizará.
    

**En general, usar el flujo de datos de arriba hacia abajo con objetos inmutables es lo mejor para la mayoría de las aplicaciones**. Garantiza que cada componente que necesita generar un nuevo valor lo haga (y lo hace de la manera más eficiente posible, ya que las partes del árbol de datos que no cambiaron no harán que los componentes que dependen de ellos se actualicen).

Mutar datos directamente y llamar a `requestUpdate()` debe considerarse un caso de uso avanzado. En este caso, usted (o algún otro sistema) necesita identificar todos los componentes que usan los datos mutados y llamar a `requestUpdate()` en cada uno. Cuando esos componentes se distribuyen en una aplicación, esto se vuelve difícil de administrar. No hacerlo de manera sólida significa que puede modificar un objeto que se representa en dos partes de su aplicación, pero solo se actualiza una parte.

En casos simples, cuando sabe que una determinada pieza de datos solo se usa en un solo componente, debería ser seguro mutar los datos y llamar a `requestUpdate()`, si lo prefiere.

# Attributes

Si bien las propiedades son excelentes para recibir datos de JavaScript como entrada, los atributos son la forma estándar en que HTML permite configurar elementos a partir del marcado, sin necesidad de usar JavaScript para establecer propiedades. Proporcionar una interfaz de propiedades y atributos para sus propiedades reactivas es una forma clave en que los componentes de Lit pueden ser útiles en una amplia variedad de entornos, incluidos aquellos representados sin un motor de plantillas del lado del cliente, como páginas HTML estáticas servidas desde CMS.

De forma predeterminada, Lit configura un atributo observado correspondiente a cada propiedad reactiva pública y actualiza la propiedad cuando cambia el atributo. Los valores de propiedad también pueden, opcionalmente, reflejarse (reescribirse en el atributo).

Mientras que las propiedades de los elementos pueden ser de cualquier tipo, los atributos son siempre cadenas. Esto afecta los atributos observados y los atributos reflejados de las propiedades que no son cadenas:

- Para **observar** un atributo (establecer una propiedad a partir de un atributo), el valor del atributo debe convertirse de una cadena para que coincida con el tipo de propiedad.
- Para **reflejar** un atributo (establecer un atributo de una propiedad), el valor de la propiedad debe convertirse en una cadena.

## Setting the attribute name

De forma predeterminada, Lit crea un atributo observado correspondiente para todas las propiedades reactivas públicas. El nombre del atributo observado es el nombre de la propiedad, en minúsculas:

```jsx
// observed attribute name is "myvalue"
static properties = {
  myValue: { type: Number },
};

constructor() {
  super();
  this.myValue = 0;
}
```

Para crear un atributo observado con un nombre diferente, establezca el atributo en una cadena:

```jsx
// Observed attribute will be called my-name
static properties = {
  myName: { attribute: 'my-name' },
};

constructor() {
  super();
  this.myName = 'Ogden'
}
```

Para evitar que se cree un atributo observado para una propiedad, establezca el `attribute` en `false`. La propiedad no se inicializará a partir de atributos en el marcado y los cambios de atributos no la afectarán.

```jsx
// No observed attribute for this property
static properties = {
  myData: { attribute: false },
};

constructor() {
  super();
  this.myData = {};
}
```

El estado reactivo interno nunca tiene un atributo asociado.

Un atributo observado se puede usar para proporcionar un valor inicial para una propiedad a partir del marcado. Por ejemplo:

```jsx
<my-element myvalue="99"></my-element>
```

## Using the default converter

Lit tiene un convertidor predeterminado que maneja los tipos de propiedad `String`, `Number`, `Boolean`, `Array` y `Object`.

Para usar el convertidor predeterminado, especifique la opción de `type` en su declaración de propiedad:

```jsx
// Use the default converter
static properties = {
  count: { type: Number },
};

constructor() {
  super();
  this.count = 0;
}
```

Si no especifica un tipo o un convertidor personalizado para una propiedad, se comporta como si hubiera especificado el `type: String`.

Las siguientes tablas muestran cómo el convertidor predeterminado maneja la conversión para cada tipo.

### **From attribute to property**

| Type | Conversion |
| --- | --- |
| String | If the element has the corresponding attribute, set the property to the attribute value. |
| Number | If the element has the corresponding attribute, set the property to Number(attributeValue). |
| Boolean | If the element has the corresponding attribute, set the property to true.If not, set the property to false. |
| Object, Array | If the element has the corresponding attribute, set the property value to JSON.parse(attributeValue). |

Para cualquier caso excepto `booleano`, si el elemento no tiene el atributo correspondiente, la propiedad mantiene su valor por defecto, o `undefinido` si no se establece ningún valor por defecto.

### **From property to attribute**

| Type | Conversion |
| --- | --- |
| String, Number | If property is defined and non-null, set the attribute to the property value.If property is null or undefined, remove the attribute. |
| Boolean | If property is truthy, create the attribute and set its value to an empty string.If property is falsy, remove the attribute |
| Object, Array | If property is defined and non-null, set the attribute to JSON.stringify(propertyValue).If property is null or undefined, remove the attribute. |

## Proporcionar un convertidor personalizado

Puede especificar un convertidor de propiedad personalizado en su declaración de propiedad con la opción de convertidor:

```jsx
myProp: {
  converter: // Custom property converter
}
```

El `converter` puede ser un objeto o una función. Si es un objeto, puede tener claves para `fromAttribute` y `toAttribute`:

```jsx
prop1: {
  converter: {
    fromAttribute: (value, type) => {
      // `value` is a string
      // Convert it to a value of type `type` and return it
    },
    toAttribute: (value, type) => {
      // `value` is of type `type`
      // Convert it to a string and return it
    }
  }
}
```

Si `converter` es una función, se usa en lugar de `fromAttribute`:

```jsx
myProp: {
  converter: (value, type) => {
    // `value` is a string
    // Convert it to a value of type `type` and return it
  }
}
```

Si no se proporciona la función `toAttribute` para un atributo reflejado, el atributo se establece en el valor de la propiedad mediante el convertidor predeterminado.

Si `toAttribute` devuelve un valor `null` o `undefinido`, se elimina el atributo.

## Boolean attributes

Para que una propiedad booleana sea configurable a partir de un atributo, su valor predeterminado debe ser falso. Si el valor predeterminado es verdadero, no puede establecerlo en falso desde el marcado, ya que la presencia del atributo, con o sin valor, equivale a verdadero. Este es el comportamiento estándar de los atributos en la plataforma web.

Si este comportamiento no se ajusta a su caso de uso, hay un par de opciones:

- Cambie el nombre de la propiedad para que el valor predeterminado sea falso. Por ejemplo, la plataforma web usa el atributo deshabilitado (predeterminado en falso), no habilitado.
- En su lugar, utilice un atributo con valor de cadena o valor numérico.

## Enabling attribute reflection

Puede configurar una propiedad para que cada vez que cambie, su valor se refleje en su atributo correspondiente. Los atributos reflejados son útiles porque los atributos son visibles para CSS y para las API DOM como `querySelector`.

Por ejemplo:

```jsx
// Value of property "active" will reflect to attribute "active"
active: {reflect: true}
```

Cuando la propiedad cambia, Lit establece el valor del atributo correspondiente como se describe en Uso del convertidor predeterminado o Proporcionar un convertidor personalizado.

```jsx
import {LitElement, html, css} from 'lit';

class MyElement extends LitElement {
  static properties = {
    active: {type: Boolean, reflect: true},
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([active]) {
      border: 1px solid red;
    }`;

  constructor() {
    super();
    this.active = false;
  }

  render() {
    return html`
      <span>Active: ${this.active}</span>
      <button @click="${() =>
        (this.active = !this.active)}">Toggle active</button>
    `;
  }
}
customElements.define('my-element', MyElement);
```

Por lo general, los atributos deben considerarse como una entrada al elemento por parte de su propietario, en lugar de estar bajo el control del propio elemento, por lo que la reflexión de las propiedades en los atributos debe hacerse con moderación. Es necesario hoy en día para casos como el estilo y la accesibilidad, pero es probable que esto cambie a medida que la plataforma agregue funciones como el pseudoselector de estado y el modelo de objetos de accesibilidad, que llenan estos vacíos.

No se recomienda reflejar propiedades de tipo objeto o matriz. Esto puede causar que los objetos grandes se serialicen en el DOM, lo que puede resultar en un rendimiento deficiente.

> ℹ️ Lit rastrea el estado de reflexión durante las actualizaciones. Es posible que se haya dado cuenta de que si los cambios de propiedad se reflejan en un atributo y los cambios de atributo actualizan la propiedad, tiene el potencial de crear un bucle infinito. Sin embargo, Lit rastrea cuándo las propiedades y los atributos se configuran específicamente para evitar que esto suceda.
> 

# Custom property accessors

De forma predeterminada, LitElement genera un par getter/setter para todas las propiedades reactivas. El setter se invoca cada vez que establece la propiedad:

```jsx
// Declare a property
static properties = {
  greeting: {},
}
constructor() {
  this.super();
  this.greeting = 'Hello';
}
...
// Later, set the property
this.greeting = 'Hola'; // invokes greeting's generated property accessor
```

Los accesores generados llaman automáticamente a `requestUpdate()`, iniciando una actualización si aún no ha comenzado.

## Creating custom property accessors

Para especificar cómo funciona la obtención y la configuración de una propiedad, puede definir su propio par getter/setter. Por ejemplo:

```jsx
static properties = {
  prop: {},
};

_prop = 0;

set prop(val) {
  let oldVal = this._prop;
  this._prop = Math.floor(val);
  this.requestUpdate('prop', oldVal);
}

get prop() { return this._prop; }
```

Para usar accesores de propiedad personalizados con los decoradores `@property` o `@state`, coloque el decorador en el getter, como se muestra arriba.

Los setters que Lit genera automáticamente llaman a `requestUpdate()`. Si escribe su propio setter, debe llamar a `requestUpdate()` manualmente, proporcionando el nombre de la propiedad y su valor anterior.

En la mayoría de los casos, **no es necesario crear accesores de propiedad personalizados.** Para calcular valores de propiedades existentes, recomendamos usar la devolución de llamada `willUpdate`, que le permite establecer valores durante el ciclo de actualización sin activar una actualización adicional. Para realizar una acción personalizada después de que se actualice el elemento, recomendamos usar la devolución de llamada `updated`. Se puede usar un configurador personalizado en casos excepcionales cuando es importante validar sincrónicamente cualquier valor que establezca el usuario.

Si su clase define sus propios accesores para una propiedad, Lit no los sobrescribirá con los accesores generados. Si su clase no define descriptores de acceso para una propiedad, Lit los generará, incluso si una superclase ha definido la propiedad o los descriptores de acceso.

## Prevent Lit from generating a property accessor

En casos excepcionales, una subclase puede necesitar cambiar o agregar opciones de propiedad para una propiedad que existe en su superclase.

Para evitar que Lit genere un descriptor de acceso de propiedad que sobrescriba el descriptor de acceso definido de la superclase, establezca `noAccessor` en `true` en la declaración de propiedad:

```jsx
static properties = {
  myProp: { type: Number, noAccessor: true }
};
```

No necesita configurar `noAccessor` al definir sus propios accesores.

# Customizing change detection

Todas las propiedades reactivas tienen una función, `hasChanged()`, que se llama cuando se establece la propiedad.

hasChanged compara los valores antiguos y nuevos de la propiedad y evalúa si la propiedad ha cambiado o no. Si `hasChanged()` devuelve `true`, Lit inicia una actualización de elementos si aún no está programada. Para obtener más información sobre las actualizaciones, consulte Ciclo de actualización reactiva.

La implementación predeterminada de `hasChanged()` utiliza una comparación de desigualdad estricta: `hasChanged()` devuelve verdadero si `newVal !== oldVal`.

Para personalizar `hasChanged()` para una propiedad, especifíquelo como una opción de propiedad:

```jsx
static properties = {
  myProp: {
    hasChanged(newVal, oldVal) {
      return newVal?.toLowerCase() !== oldVal?.toLowerCase();
    }
  }
};
```

En el siguiente ejemplo, `hasChanged()` solo devuelve verdadero para valores impares.

```jsx
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
  static properties = {
    value: {
      // only update for odd values of newVal.
      hasChanged(newVal, oldVal) {
        const hasChanged = newVal % 2 == 1;
        console.log(`${newVal}, ${oldVal}, ${hasChanged}`);
        return hasChanged;
      },
    },
  };

  constructor() {
    super();
    this.value = 1;
  }

  render() {
    return html`
      <p>${this.value}</p>
      <button @click="${this.getNewVal}">Get new value</button>
    `;
  }

  getNewVal() {
    this.value = Math.floor(Math.random() * 100);
  }
}
customElements.define('my-element', MyElement);
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
