# Properties

## Descripción general

LitElement administra sus propiedades declaradas y sus atributos correspondientes. Por defecto, LitElement:

- Asegúrese de que se programe una actualización de elementos cuando cambie cualquier propiedad declarada.
- Capture valores de instancia para propiedades declaradas. Aplique cualquier valor de propiedad que se establezca antes de que el navegador registre una definición de elemento personalizado.
- Configure un atributo observado (no reflejado) con el nombre en minúsculas de cada propiedad.
- Manejar la conversión de atributos para propiedades declaradas como tipo String, Number, Boolean, Array y Object.
- Use la comparación directa (oldValue !== newValue) para probar los cambios de propiedad.
- Aplicar las opciones de propiedad y los accesores declarados por una superclase.

> ⚠️ Recuerde declarar todas las propiedades que desea que administre LitElement. Para que se apliquen las características de la propiedad anteriores, debe declarar la propiedad.
> 

## Declaracion de propiedades

Declara las propiedades de tu elemento usando un campo de propiedades estáticas o usando decoradores:

*Properties field*

```jsx
static get properties() {
  return {
    propertyName: options
  };
}
```

*Decorator (requires TypeScript or Babel)*

```jsx
export class MyElement extends LitElement {
  @property(options)
  propertyName;
```

En cualquier caso, puede pasar un objeto de opciones para configurar funciones para la propiedad.

### Opciones de propiedad

El objeto de opciones puede tener las siguientes propiedades:

- atributo

Si la propiedad está asociada con un atributo o un nombre personalizado para el atributo asociado. Valor predeterminado: verdadero. Consulte Configurar atributos observados. Si el atributo es falso, las opciones de conversión, reflejo y tipo se ignoran.

- convertidor

Un convertidor personalizado para convertir entre propiedades y atributos. Si no se especifica, utilice el convertidor de atributos predeterminado.

- ha cambiado

Una función que toma un valor antiguo y un valor nuevo y devuelve un valor booleano para indicar si una propiedad cambió cuando se estableció. Si no se especifica, LitElement usa una verificación de desigualdad estricta (newValue !== oldValue) para determinar si el valor de la propiedad ha cambiado.

- noAccessor

Establézcalo en verdadero para evitar generar el descriptor de acceso de propiedad predeterminado. Valor predeterminado: falso.

- reflect

Si el valor de la propiedad se refleja en el atributo asociado. Valor predeterminado: falso. Consulte Configurar atributos reflejados.

- type

Una sugerencia de tipo para convertir entre propiedades y atributos. Esta sugerencia la utiliza el convertidor de atributos predeterminado de LitElement y se ignora si se establece el convertidor. Si no se especifica el tipo, se comporta como tipo: Cadena. Consulte Usar el convertidor de atributos predeterminado de LitElement.

Un objeto de opciones vacío es equivalente a especificar el valor predeterminado para todas las opciones.

> ℹ️ Un objeto de opciones con otro nombre. Esta guía utiliza el término descriptivo "objeto de opciones". En la práctica, el objeto de opciones es una instancia de PropertyDeclaration, por lo que verá ese nombre si está utilizando un IDE o consultando la referencia de la API. Por cualquier nombre, es un objeto que define un conjunto de opciones.
> 

### Declarar propiedades en un campo de propiedades estáticas

Para declarar propiedades en un campo de propiedades estáticas:

```jsx
static get properties() {
  return {
    greeting: {type: String},
    data: {attribute: false},
    items: {}
  };
}
```

Un objeto de opción vacío equivale a especificar el valor predeterminado para todas las opciones.

> ℹ️ Las propiedades declaradas se inicializan como campos de clase estándar, ya sea en el constructor o con un inicializador de campo si usa decoradores.
> 

**Example: Declare properties with a static `properties` field**

```jsx
import {LitElement, html} from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      greeting: {type: String},
      data: {attribute: false},
      items: {type: Array},
    };
  }

  constructor() {
    super();
    this.greeting = 'Hello';
    this.data = {name: 'Cora'};
    this.items = [1, 2, 3];
  }

  render() {
    return html`
      <p>${this.greeting} ${this.data.name}.</p>
      <p>You have ${this.items.length} items.</p>
    `;
  }
}

customElements.define('my-element', MyElement);
```

## Declarar propiedades con decoradoras.

Utilice el decorador @property para declarar propiedades (en lugar del campo de propiedades estáticas).

```jsx
@property({type: String})
mode = 'auto';

@property()
data = {};
```

El argumento del decorador @property es un objeto de opciones. Omitir el argumento equivale a especificar el valor predeterminado para todas las opciones.

> ℹ️ Uso de decoradores. Los decoradores son una característica de JavaScript propuesta, por lo que deberá usar un transpilador como Babel o el compilador TypeScript para usar decoradores. Consulte Uso de decoradores para obtener más detalles.
> 

También hay un decorador @internalProperty para propiedades privadas o protegidas que debería desencadenar un ciclo de actualización. No se debe hacer referencia a las propiedades declaradas con @internalProperty desde fuera del componente.

```jsx
@internalProperty()
protected active = false;
```

El decorador @internalProperty establece automáticamente el atributo en falso; la única opción que puede especificar para una propiedad interna es la función hasChanged.

El decorador @internalProperty puede servir como una pista para un minificador de código de que el nombre de la propiedad se puede cambiar durante la minificación.

Ejemplo: declarar propiedades con decoradores

```jsx
import {LitElement, html, customElement, property} from 'lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property()
  greeting = 'Hello';

  @property({attribute: false})
  data = {name: 'Cora'};

  @property({type: Array})
  items = [1, 2, 3];

  render() {
    return html`
      <p>${this.greeting} ${this.data.name}.</p>
      <p>You have ${this.items.length} items.</p>
    `;
  }
}
```

## ¿Qué sucede cuando las propiedades cambian?

Un cambio de propiedad puede desencadenar un ciclo de actualización asíncrono, lo que hace que el componente vuelva a representar su plantilla.

Cuando una propiedad cambia, ocurre la siguiente secuencia:

1. Se llama al setter de la propiedad.
2. El setter llama a la función hasChanged de la propiedad. La función hasChanged toma los valores antiguos y nuevos de la propiedad y devuelve verdadero si el cambio desencadena una actualización. (El hasChanged predeterminado usa una prueba de desigualdad estricta (oldValue !== newValue) para determinar si la propiedad ha cambiado).
3. Si hasChanged devuelve verdadero, el setter llama a requestUpdate para programar una actualización. La actualización en sí ocurre de forma asincrónica, por lo que si se actualizan varias propiedades a la vez, solo activan una única actualización.
4. Se llama al método de actualización del componente, reflejando las propiedades modificadas en los atributos y volviendo a representar las plantillas del componente.

Hay muchas formas de conectarse y modificar el ciclo de vida de la actualización. Para obtener más información, consulte Ciclo de vida.

## Inicializar valores de propiedad

Por lo general, inicializa los valores de propiedad en el constructor de elementos.

Al usar decoradores, puede inicializar el valor de la propiedad como parte de la declaración (equivalente a establecer el valor en el constructor).

Es posible que desee diferir la inicialización de una propiedad si el valor es costoso de calcular y no es necesario para la representación inicial de su componente. Este es un caso bastante raro.

### Inicializar valores de propiedad en el constructor de elementos.

Si implementa un campo de propiedades estáticas, inicialice sus valores de propiedad en el constructor de elementos:

```jsx
static get properties() { return { /* Property declarations */ }; }

constructor() {
  // Always call super() first
  super();

  // Initialize properties
  this.greeting = 'Hello';
}
```

> ⚠️ Recuerde llamar a super() primero en su constructor, o su elemento no se representará en absoluto.
> 

Ejemplo: inicializar valores de propiedad en el constructor de elementos

### Inicializar valores de propiedad al usar decoradores

Al usar el decorador @property, puede inicializar una propiedad como parte de la declaración:

```jsx
@property({type : String})
greeting = 'Hello';
```

## Configurar atributos

### Convertir entre propiedades y atributos

Mientras que las propiedades de los elementos pueden ser de cualquier tipo, los atributos son siempre cadenas. Esto afecta los atributos observados y los atributos reflejados de las propiedades que no son cadenas:

- Para observar un atributo (establecer una propiedad a partir de un atributo), el valor del atributo debe convertirse de una cadena para que coincida con el tipo de propiedad.
- Para reflejar un atributo (establecer un atributo de una propiedad), el valor de la propiedad debe convertirse en una cadena.

**Usar el convertidor predeterminado**
LitElement tiene un convertidor predeterminado que maneja los tipos de propiedad String, Number, Boolean, Array y Object.

Para usar el convertidor predeterminado, especifique la opción de tipo en su declaración de propiedad:

```jsx
// Use LitElement's default converter
prop1: { type: String },
prop2: { type: Number },
prop3: { type: Boolean },
prop4: { type: Array },
prop5: { type: Object }
```

La siguiente información muestra cómo el convertidor predeterminado maneja la conversión para cada tipo.

### Convertir de atributo a propiedad

- Para cadenas, cuando se define el atributo, establezca la propiedad en el valor del atributo.
- Para Numbers, cuando se define el atributo, establezca la propiedad en Number(attributeValue).
- Para booleanos, cuando el atributo es:
    - no nulo, establezca la propiedad en verdadero.
    - nulo o indefinido, establezca la propiedad en falso.
- Para objetos y matrices, cuando el atributo es:
    - Definido, establezca el valor de la propiedad en JSON.parse(attributeValue).

### Convertir de propiedad a atributo

- Para cadenas, cuando la propiedad es:
    - nulo, elimine el atributo.
    - indefinido, no cambie el atributo.
    - Definido y no nulo, establezca el atributo en el valor de la propiedad.
- Para Numbers, cuando la propiedad es:
    - nulo, elimine el atributo.
    - indefinido, no cambie el atributo.
    - Definido y no nulo, establezca el atributo en el valor de la propiedad.
- Para booleanos, cuando la propiedad es:
    - veraz, crea el atributo.
    - falso, elimine el atributo.
- Para objetos y matrices, cuando la propiedad es:
    - nulo o indefinido, elimine el atributo.
    - Definido y no nulo, establezca el valor del atributo en JSON.stringify(propertyValue).

Ejemplo: usar el convertidor predeterminado

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    prop1: { type: String, reflect: true },
    prop2: { type: Number, reflect: true },
    prop3: { type: Boolean, reflect: true },
    prop4: { type: Array, reflect: true },
    prop5: { type: Object, reflect: true }
  };}

  constructor() {
    super();
    this.prop1 = '';
    this.prop2 = 0;
    this.prop3 = false;
    this.prop4 = [];
    this.prop5 = { };
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log('attribute change: ', name, newVal);
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  render() {
    return html`
      <p>prop1 ${this.prop1}</p>
      <p>prop2 ${this.prop2}</p>
      <p>prop3 ${this.prop3}</p>

      <p>prop4: ${this.prop4.map((item, index) =>
        html`<span>[${index}]:${item}&nbsp;</span>`)}
      </p>

      <p>prop5:
        ${Object.keys(this.prop5).map(item =>
          html`<span>${item}: ${this.prop5[item]}&nbsp;</span>`)}
      </p>

      <button @click="${this.changeProperties}">change properties</button>
      <button @click="${this.changeAttributes}">change attributes</button>
    `;
  }

  changeAttributes() {
    let randy = Math.floor(Math.random()*10);
    let myBool = this.getAttribute('prop3');

    this.setAttribute('prop1', randy.toString());
    this.setAttribute('prop2', randy.toString());
    this.setAttribute('prop3', myBool? '' : null);
    this.setAttribute('prop4', JSON.stringify([...this.prop4, randy]));
    this.setAttribute('prop5',
      JSON.stringify(Object.assign({}, this.prop5, {[randy]: randy})));
    this.requestUpdate();
  }

  changeProperties() {
    let randy = Math.floor(Math.random()*10);
    let myBool = this.prop3;

    this.prop1 = randy.toString();
    this.prop2 = randy;
    this.prop3 = !myBool;
    this.prop4 = [...this.prop4, randy];
    this.prop5 = Object.assign({}, this.prop5, {[randy]: randy});
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
  }

}

customElements.define('my-element', MyElement);
```

### Configurar un convertidor personalizado

Puede especificar un convertidor de propiedad personalizado en su declaración de propiedad con la opción de convertidor:

```jsx
myProp: {
  converter: // Custom property converter
}
```

El convertidor puede ser un objeto o una función. Si es un objeto, puede tener claves para fromAttribute y toAttribute:

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

Si convertidor es una función, se usa en lugar de fromAttribute:

```jsx
myProp: {
  converter: (value, type) => {
    // `value` is a string
    // Convert it to a value of type `type` and return it
  }
}
```

Si no se proporciona la función toAttribute para un atributo reflejado, el atributo se establece en el valor de la propiedad sin conversión.

Durante una actualización:

- Si toAttribute devuelve nulo, se elimina el atributo.
- Si toAttribute devuelve undefined, el atributo no cambia.

### Ejemplo: configurar un convertidor personalizado

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    myProp: {
      reflect: true,
      converter: {
        toAttribute(value) {
          console.log('myProp\'s toAttribute.');
          console.log('Processing:', value, typeof(value));
          let retVal = String(value);
          console.log('Returning:', retVal, typeof(retVal));
          return retVal;
        },

        fromAttribute(value) {
          console.log('myProp\'s fromAttribute.');
          console.log('Processing:', value, typeof(value));
          let retVal = Number(value);
          console.log('Returning:', retVal, typeof(retVal));
          return retVal;
        }
      }
    },

    theProp: {
      reflect: true,
      converter(value) {
        console.log('theProp\'s converter.');
        console.log('Processing:', value, typeof(value));

        let retVal = Number(value);
        console.log('Returning:', retVal, typeof(retVal));
        return retVal;
      }},
  };}

  constructor() {
    super();
    this.myProp = 'myProp';
    this.theProp = 'theProp';
  }

  attributeChangedCallback(name, oldval, newval) {
    // console.log('attribute change: ', name, newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <p>myProp ${this.myProp}</p>
      <p>theProp ${this.theProp}</p>

      <button @click="${this.changeProperties}">change properties</button>
      <button @click="${this.changeAttributes}">change attributes</button>
    `;
  }

  changeAttributes() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.setAttribute('myprop', 'myprop ' + randomString);
    this.setAttribute('theprop', 'theprop ' + randomString);
    this.requestUpdate();
  }

  changeProperties() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.myProp='myProp ' + randomString;
    this.theProp='theProp ' + randomString;
  }
}
customElements.define('my-element', MyElement);
```

### Configurar atributos observados

Un atributo observado activa el atributo de devolución de llamada API de elementos personalizadosChangedCallback cada vez que cambia. De forma predeterminada, cada vez que un atributo activa esta devolución de llamada, LitElement establece el valor de propiedad del atributo mediante la función fromAttribute de la propiedad. Consulte Convertir entre propiedades y atributos para obtener más información.

De forma predeterminada, LitElement crea un atributo observado correspondiente para todas las propiedades declaradas. El nombre del atributo observado es el nombre de la propiedad, en minúsculas:

```jsx
// observed attribute name is "myprop"
myProp: { type: Number }
```

Para crear un atributo observado con un nombre diferente, establezca el atributo en una cadena:

```jsx
// Observed attribute will be called my-prop
myProp: { attribute: 'my-prop' }
```

Para evitar que se cree un atributo observado para una propiedad, establezca el atributo en falso. La propiedad no se inicializará a partir de atributos en el marcado y los cambios de atributos no la afectarán.

```jsx
// No observed attribute for this property
myProp: { attribute: false }
```

Un atributo observado se puede usar para proporcionar un valor inicial para una propiedad a través del marcado. Consulte Inicializar propiedades con atributos en marcado.

### Ejemplo: Configurar atributos observados

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    myProp: { attribute: true },
    theProp: { attribute: false },
    otherProp: { attribute: 'other-prop' },
  };}

  constructor() {
    super();
    this.myProp = 'myProp';
    this.theProp = 'theProp';
    this.otherProp = 'otherProp';
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', name, newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <p>myProp ${this.myProp}</p>
      <p>theProp ${this.theProp}</p>
      <p>otherProp ${this.otherProp}</p>

      <button @click="${this.changeAttributes}">change attributes</button>
    `;
  }

  changeAttributes() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.setAttribute('myprop', 'myprop ' + randomString);
    this.setAttribute('theprop', 'theprop ' + randomString);
    this.setAttribute('other-prop', 'other-prop ' + randomString);
    this.requestUpdate();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
  }
}
customElements.define('my-element', MyElement);
```

### Configurar atributos reflejados

Puede configurar una propiedad para que cada vez que cambie, su valor se refleje en su atributo observado. Por ejemplo:

```jsx
// Value of property "myProp" will reflect to attribute "myprop"
myProp: {reflect: true}
```

Cuando la propiedad cambia, LitElement usa la función toAttribute en el convertidor de la propiedad para establecer el valor del atributo a partir del nuevo valor de la propiedad.

- Si toAttribute devuelve nulo, se elimina el atributo.
- Si toAttribute devuelve undefined, el atributo no cambia.
- Si toAttribute no está definido, el valor del atributo se establece en el valor de la propiedad sin conversión.

LitElement rastrea el estado de reflexión durante las actualizaciones. LitElement realiza un seguimiento de la información de estado para evitar crear un bucle infinito de cambios entre una propiedad y un atributo observado y reflejado.

### Ejemplo: Configurar atributos reflejados

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() { return {
    myProp: { reflect: true }
  };}

  constructor() {
    super();
    this.myProp='myProp';
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', newval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <p>${this.myProp}</p>

      <button @click="${this.changeProperty}">change property</button>
    `;
  }

  changeProperty() {
    let randomString = Math.floor(Math.random()*100).toString();
    this.myProp='myProp ' + randomString;
  }

}
customElements.define('my-element', MyElement);
```

### Establecer valores de propiedad a partir de atributos en el marcado

Si una propiedad está configurada con atributo: verdadero (el valor predeterminado), los usuarios pueden establecer los valores de propiedad a partir de los atributos observados en el marcado estático:

*index.html*

```jsx
<my-element
  mystring="hello world"
  mynumber="5"
  mybool
  myobj='{"stuff":"hi"}'
  myarray='[1,2,3,4]'></my-element>
```

Consulte los atributos observados y la conversión entre propiedades y atributos para obtener más información sobre cómo configurar la inicialización a partir de atributos.

> ℹ️ Atributos versus enlaces de propiedad. Establecer un valor de atributo estático no es lo mismo que vincularlo a una propiedad. Consulte Vincular a una propiedad.
> 

## Configurar accesores de propiedad

De forma predeterminada, LitElement genera un par getter/setter para todas las propiedades declaradas. El setter se invoca cada vez que establece la propiedad:

```jsx
// Declare a property
static get properties() { return { myProp: { type: String } }; }
...
// Later, set the property
this.myProp = 'hi'; // invokes myProp's generated property accessor
```

Los accesores generados llaman automáticamente a requestUpdate, iniciando una actualización si aún no ha comenzado.

### Cree sus propios accesorios de propiedad

Para especificar cómo funciona la obtención y la configuración de una propiedad, puede definir su par getter/setter. Por ejemplo:

```jsx
static get properties() { return { myProp: { type: String } }; }

set myProp(value) {
  // Implement setter logic here...
  // retrieve the old property value and store the new one
  this.requestUpdate('myProp', oldValue);
}
get myProp() { ... }

...

// Later, set the property
this.myProp = 'hi'; // Invokes your setter
```

Si su clase define sus propios accesores para una propiedad, LitElement no los sobrescribirá con los accesores generados. Si su clase no define descriptores de acceso para una propiedad, LitElement los generará, incluso si una superclase ha definido la propiedad o los descriptores de acceso.

Los configuradores que genera LitElement llaman automáticamente a requestUpdate. Si escribe su propio setter, debe llamar a requestUpdate manualmente, proporcionando el nombre de la propiedad y su valor anterior.

Ejemplo

Un patrón común para los descriptores de acceso es almacenar el valor de la propiedad mediante una propiedad privada a la que solo se accede dentro del componente. Este ejemplo usa un prefijo de guión bajo (_prop) para identificar la propiedad privada; también podría usar las palabras clave privadas o protegidas de TypeScript.

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return { prop: { type: Number } };
  }

  set prop(val) {
    let oldVal = this._prop;
    this._prop = Math.floor(val);
    this.requestUpdate('prop', oldVal);
  }

  get prop() { return this._prop; }

  constructor() {
    super();
    this._prop = 0;
  }

  render() {
    return html`
      <p>prop: ${this.prop}</p>
      <button @click="${() =>  { this.prop = Math.random()*10; }}">
        change prop
      </button>
    `;
  }
}
customElements.define('my-element', MyElement);
```

Si desea utilizar su propio acceso a la propiedad con el decorador @property, puede lograrlo colocando el decorador en el captador:

```jsx
private _myProp: string = '';

  @property({ type: String })
  get myProp(): string {
    return this._myProp;
  }
  set myProp(value: string) {
    const oldValue = this._myProp;
    this._myProp = value;
    this.requestUpdate('myProp', oldValue);
  }
```

### Impedir que LitElement genere un acceso a la propiedad

En casos excepcionales, una subclase puede necesitar cambiar o agregar opciones de propiedad para una propiedad que existe en su superclase.

Para evitar que LitElement genere un descriptor de acceso de propiedad que sobrescriba el descriptor de acceso definido de la superclase, establezca noAccessor en verdadero en la declaración de propiedad:

```jsx
static get properties() {
  return { myProp: { type: Number, noAccessor: true } };
}
```

No necesita configurar noAccessor al definir sus propios accesores.

### Ejemplo Elemento de subclase

```jsx
import { SuperElement } from './super-element.js';

class SubElement extends SuperElement {
  static get properties() {
    return { prop: { reflect: true, noAccessor: true } };
  }
}

customElements.define('sub-element', SubElement);
```

## Configurar cambios de propiedad

Todas las propiedades declaradas tienen una función, hasChanged, que se llama cuando se establece la propiedad.

hasChanged compara los valores antiguos y nuevos de la propiedad y evalúa si la propiedad ha cambiado o no. Si hasChanged devuelve verdadero, LitElement inicia una actualización de elementos si aún no está programada. Consulte la documentación del ciclo de vida de actualización de elementos para obtener más información sobre cómo funcionan las actualizaciones.

Por defecto:

- hasChanged devuelve verdadero si newVal !== oldVal.
- hasChanged devuelve falso si tanto el valor nuevo como el antiguo son NaN.

Para personalizar hasChanged para una propiedad, especifíquelo como una opción de propiedad:

```jsx
myProp: { hasChanged(newVal, oldVal) {
  // compare newVal and oldVal
  // return `true` if an update should proceed
}}
```

> ℹ️ no se puede llamar a hasChanged para cada cambio. Si hasChanged de una propiedad devuelve verdadero una vez, no se volverá a llamar hasta después de la próxima actualización, incluso si la propiedad se cambia varias veces. Si desea recibir una notificación cada vez que se establece una propiedad, debe crear un definidor personalizado para la propiedad, como se describe en Crear sus propios accesores de propiedad.
> 

### Ejemplo: Configurar cambios de propiedad

```jsx
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties(){ return {
    myProp: {
      type: Number,

      /**
       * Compare myProp's new value with its old value.
       *
       * Only consider myProp to have changed if newVal is larger than
       * oldVal.
       */
      hasChanged(newVal, oldVal) {
        if (newVal > oldVal) {
          console.log(`${newVal} > ${oldVal}. hasChanged: true.`);
          return true;
        }
        else {
          console.log(`${newVal} <= ${oldVal}. hasChanged: false.`);
          return false;
        }
      }
    }};
  }

  constructor(){
    super();
    this.myProp = 1;
  }

  render(){
    return html`
      <p>${this.myProp}</p>
      <button @click="${this.getNewVal}">get new value</button>
    `;
  }

  updated(){
    console.log('updated');
  }

  getNewVal(){
    let newVal = Math.floor(Math.random()*10);
    this.myProp = newVal;
  }

}
customElements.define('my-element', MyElement);
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
