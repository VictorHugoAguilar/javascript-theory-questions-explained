# Mixins

# Introducción

Los mixins de clase son un patrón para compartir código entre clases usando JavaScript estándar. A diferencia de los patrones de composición **"has-a"** como los controladores reactivos, donde una clase puede poseer un controlador para agregar comportamiento, los mixins implementan una composición **"is-a"**, donde el mixin hace que la clase en sí sea una instancia del comportamiento que se comparte.

Puede usar mixins para personalizar un componente Lit agregando API o anulando sus devoluciones de llamada de ciclo de vida.

# Mixin basics

Los mixins se pueden considerar como "fábricas de subclases" que anulan la clase a la que se aplican y devuelven una subclase, ampliada con el comportamiento en el mixin. Debido a que los mixins se implementan usando expresiones de clase de JavaScript estándar, pueden usar todos los modismos disponibles para la creación de subclases, como agregar nuevos campos/métodos, anular los métodos de superclase existentes y usar `super`.

> ℹ️ Para facilitar la lectura, los ejemplos de esta página eluden algunos de los tipos de TypeScript para funciones mixtas. Consulte Mixins en TypeScript para obtener detalles sobre la tipificación adecuada de mixins en TypeScript.
> 

Para definir un mixin, escriba una función que tome una `superClass` y devuelva una nueva clase que la amplíe, agregando campos y métodos según sea necesario:

```jsx
const MyMixin = (superClass) => class extends superClass {
  /* class fields & methods to extend superClass with */
};
```

Para aplicar un mixin, simplemente pase una clase para generar una subclase con el mixin aplicado. Lo más común es que los usuarios apliquen el mixin directamente a una clase base al definir una nueva clase:

```jsx
class MyElement extends MyMixin(LitElement) {
  /* user code */
}
```

Los mixins también se pueden usar para crear subclases concretas que los usuarios pueden extender como una clase normal, donde el mixin es un detalle de implementación:

```jsx
export const LitElementWithMixin = MyMixin(LitElement);
```

```jsx
import {LitElementWithMixin} from './lit-element-with-mixin.js';

class MyElement extends LitElementWithMixin {
  /* user code */
}
```

Debido a que los mixins de clase son un patrón estándar de JavaScript y no son específicos de Lit, existe una gran cantidad de información en la comunidad sobre cómo aprovechar los mixins para la reutilización de código. Para leer más sobre mixins, aquí hay algunas buenas referencias:

- **Mixins de clase** en MDN
- **Mixins reales** con clases de JavaScript por Justin Fagnani
- **Mixins en el manual** de TypeScript.
- **Dedupe mixin library** por open-wc, incluida una discusión sobre cuándo el uso de mixin puede conducir a la duplicación y cómo usa una biblioteca de deduplicación para evitarlo.
- **Convenciones de mixins** seguidas por la biblioteca de componentes web de Elix. Si bien no es específico de Lit, contiene sugerencias bien pensadas sobre la aplicación de convenciones al definir mixins para componentes web.

# Creating mixins for LitElement

Los mixins aplicados a LitElement pueden implementar o anular cualquiera de las devoluciones de llamada del ciclo de vida de elementos personalizados estándar, como `constructor()` o `connectedCallback()`, así como cualquiera de las devoluciones de llamada del ciclo de vida de actualización reactiva, como `render()` o `updated()`.

Por ejemplo, el siguiente mixin registraría cuándo se crea, conecta y actualiza el elemento:

```jsx
const LoggingMixin = (superClass) => class extends superClass {
  constructor() {
    super();
    console.log(`${this.localName} was created`);
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(`${this.localName} was connected`);
  }
  updated(changedProperties) {
    super.updated?.(changedProperties);
    console.log(`${this.localName} was updated`);
  }
}
```

Tenga en cuenta que un mixin siempre debe realizar una súper llamada a los métodos de ciclo de vida de elementos personalizados estándar implementados por `LitElement`. Al anular una devolución de llamada del ciclo de vida de actualización reactiva, es una buena práctica llamar al supermétodo si ya existe en la superclase (como se muestra arriba con la llamada de encadenamiento opcional a `super.updated?.()`).

También tenga en cuenta que los mixins pueden optar por trabajar antes o después de la implementación base de las devoluciones de llamada del ciclo de vida estándar a través de su elección de cuándo realizar la súper llamada.

Los mixins también pueden agregar propiedades reactivas, estilos y API al elemento subclasificado.

El mixin en el ejemplo a continuación agrega una propiedad reactiva de `highlight` al elemento y un método `renderHighlight()` que el usuario puede llamar para envolver algo de contenido. El contenido envuelto tiene un estilo amarillo cuando se establece la propiedad/atributo de `highlight`.

*highlightable.js*

```jsx
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
/* playground-fold-end */

export const Highlightable = (superClass) => {
  class HighlightableElement extends superClass {
    static properties = {
      highlight: {type: Boolean},
    };
    // Adds some styles...
    static styles = [
      superClass.styles ?? [],
      css`.highlight { background: yellow; }`,
    ];

    constructor() {
      super();
      // ...a public `highlight` property/attribute...
      this.highlight = false;
    }

    // ...and a helper render method:
    renderHighlight(content) {
      return html`
          <div class=${classMap({highlight: this.highlight})}>
            ${content}
          </div>`;
    }
  }
  return HighlightableElement;
};
```

*element-one.js*

```jsx
import {LitElement, html} from 'lit';
import {Highlightable} from './highlightable.js';

export class ElementOne extends Highlightable(LitElement) {
  render() {
    return this.renderHighlight(html`<p>Simple highlight</p>`);
  }
}
customElements.define('element-one', ElementOne);
```

*element-two.js*

```jsx
import {LitElement, html, css} from 'lit';
import {Highlightable} from './highlightable.js';

const HighlightableLitElement = Highlightable(LitElement);

export class ElementTwo extends HighlightableLitElement {
  static styles = [
    HighlightableLitElement.styles || [],
    css`:host { display: block; }`,
  ];
  render() {
    return this.renderHighlight(html`
      <label>
        <input type="checkbox"
          .checked=${this.highlight}
          @change=${this.toggleHighlight}>
        Toggleable highlight
      </label>
    `);
  }
  toggleHighlight(event) {
    this.highlight = event.target.checked;
  }
}
customElements.define('element-two', ElementTwo);
```

*index.html*

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" src="./element-one.js"></script>
  <script type="module" src="./element-two.js"></script>
  <title>lit-element code sample</title>
</head>
<body>
  <element-one highlight></element-one>
  <element-two></element-two>
</body>
</html>
```

Tenga en cuenta que en el ejemplo anterior, se espera que el usuario del mixin llame al método `renderHighlight()` desde su método `render()`, así como también tenga cuidado de agregar los estilos estáticos definidos por el mixin a los estilos de la subclase. La naturaleza de este contrato entre el mixin y el usuario depende de la definición del mixin y debe ser documentada por el autor del mixin.

# Mixins in TypeScript

Al escribir mixins de `LitElement` en TypeScript, hay algunos detalles a tener en cuenta.

## Typing the superclass

Debe restringir el argumento `superClass` al tipo de clase que espera que amplíen los usuarios, si corresponde. Esto se puede lograr utilizando un tipo de ayuda de `Constructor` genérico como se muestra a continuación:

```jsx
import {LitElement} from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

export const MyMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class MyMixinClass extends superClass {
    /* ... */
  };
  return MyMixinClass as /* see "typing the subclass" below */;
}
```

El ejemplo anterior garantiza que la clase que se pasa al mixin se extienda desde `LitElement`, de modo que su mixin pueda confiar en las devoluciones de llamada y otras API proporcionadas por Lit.

## Typing the subclass

Aunque TypeScript tiene soporte básico para inferir el tipo de valor devuelto para la subclase generada mediante el patrón mixin, tiene una grave limitación en el sentido de que la clase inferida no debe contener miembros con modificadores de acceso `privados` o `protegidos`.

> ℹ️ Debido a que `LitElement` en sí tiene miembros privados y protegidos, de forma predeterminada, TypeScript generará un error con "La propiedad '...' de la expresión de clase exportada puede no ser privada o protegida". al devolver una clase que extiende `LitElement`.
> 

Hay dos soluciones alternativas que implican convertir el tipo de retorno de la función mixin para evitar el error anterior.

### Cuando un mixin no agrega una nueva API pública/protegida

Si su mixin solo anula los métodos o propiedades de `LitElement` y no agrega ninguna nueva API propia, simplemente puede convertir la clase generada al tipo de superclase T que se pasó:

```jsx
export const MyMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class MyMixinClass extends superClass {
    connectedCallback() {
      super.connectedCallback();
      this.doSomethingPrivate();
    }
    private doSomethingPrivate() {
      /* does not need to be part of the interface */
    }
  };
  // Cast return type to the superClass type passed in
  return MyMixinClass as T;
}
```

### Cuando un mixin agrega una nueva API pública/protegida

Si su mixin agrega una nueva API protegida o pública que necesita que los usuarios puedan usar en su clase, debe definir la interfaz para el mixin por separado de la implementación, y convertir el tipo de retorno como la intersección de su interfaz de mixin y el tipo de superclase:

```jsx
// Define the interface for the mixin
export declare class MyMixinInterface {
  highlight: boolean;
  protected renderHighlight(): unknown;
}

export const MyMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class MyMixinClass extends superClass {
    @property() highlight = false;
    protected renderHighlight() {
      /* ... */
    }
  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return MyMixinClass as Constructor<MyMixinInterface> & T;
}
```

## Applying decorators in mixins

Debido a las limitaciones del sistema de tipos de TypeScript, los decoradores (como `@property()`) deben aplicarse a una instrucción de declaración de clase y no a una expresión de clase.

En la práctica, esto significa que los mixins en TypeScript deben declarar una clase y luego devolverla, en lugar de devolver una expresión de clase directamente desde la función de flecha.

Soportado:

```jsx
export const MyMixin = <T extends LitElementConstructor>(superClass: T) => {
  // ✅ Defining a class in a function body, and then returning it
  class MyMixinClass extends superClass {
    @property()
    mode = 'on';
    /* ... */
  };
  return MyMixinClass;
}
```

No soportado:

```jsx
export const MyMixin = <T extends LitElementConstructor>(superClass: T) =>
  // ❌ Returning class expression directly using arrow-function shorthand
  class extends superClass {
    @property()
    mode = 'on';
    /* ... */
  }
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
