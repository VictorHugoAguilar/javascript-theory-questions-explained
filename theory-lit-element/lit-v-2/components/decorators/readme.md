# Decorators

# Introducción

Los decoradores son funciones especiales que pueden modificar el comportamiento de clases, métodos de clase y campos de clase. Lit usa decoradores para proporcionar API declarativas para cosas como el registro de elementos, propiedades reactivas y consultas.

Los decoradores son una propuesta de etapa 3 para agregar al estándar ECMAScript. Actualmente, ningún navegador implementa decoradores, pero compiladores como Babel y TypeScript brindan soporte para una versión anterior de la propuesta de decoradores. Los decoradores iluminados funcionan con Babel y TypeScript, y se actualizarán para trabajar con la especificación final cuando se implemente en los navegadores.

> ℹ️ **¿Qué significa la etapa 3?** La etapa 3 significa que el texto de la especificación está completo y listo para que los navegadores lo implementen. Una vez que la especificación se ha implementado en varios navegadores, puede pasar a la etapa final, la etapa 4, y agregarse al estándar ECMAScript. Una propuesta de la etapa 3 aún puede cambiar, pero solo si se descubren problemas críticos durante la implementación.
> 

Lit proporciona un conjunto de decoradores que reducen la cantidad de código repetitivo que necesita escribir al definir un componente. Por ejemplo, los decoradores `@customElement` y `@property` hacen que la definición de un elemento básico sea más compacta:

```jsx
@customElement('my-element')
export class MyElement extends LitElement {
  @property() greeting = "Welcome";
  @property() name = "Sally";
  @property({type: Boolean}) emphatic = true;
  //...
}
```

El decorador `@customElement` define un elemento personalizado, equivalente a llamar:

```jsx
customElements.define('my-element', MyElement);
```

El decorador `@property` declara una propiedad reactiva.

# Built-in decorators

| Decorator | Summary | More Info |
| --- | --- | --- |
| @customElement | Defines a custom element | https://lit.dev/docs/components/decorators/#custom-element |
| @eventOptions | Adds event listener options. | https://lit.dev/docs/components/events/#event-options-decorator |
| @property | Defines a public property. | https://lit.dev/docs/components/properties/#declare-with-decorators |
| @state | Defines a private state property | https://lit.dev/docs/components/properties/#declare-with-decorators |
| @query | Defines a property that returns an element in the component template. | https://lit.dev/docs/components/shadow-dom/#query |
| @queryAll | Defines a property that returns a list of elements in the component template. | https://lit.dev/docs/components/shadow-dom/#query-all |
| @queryAsync | Defines a property that returns a promise that resolves to an element in the component template. | https://lit.dev/docs/components/shadow-dom/#query-async |
| @queryAssignedElements | Defines a property that returns the child elements assigned to a specific slot. | https://lit.dev/docs/components/shadow-dom/#query-assigned-nodes |
| @queryAssignedNodes | Defines a property that returns the child nodes assigned to a specific slot. | https://lit.dev/docs/components/shadow-dom/#query-assigned-nodes |

# Importing decorators

Puede importar todos los decoradores iluminados a través del módulo lit/decorators.js:

```jsx
import {customElement, property, eventOptions, query} from 'lit/decorators.js';
```

Para reducir la cantidad de código necesario para ejecutar el componente, los decoradores se pueden importar individualmente al código del componente. Todos los decoradores están disponibles en `lit/decorators/<decorator-name>.js`. Por ejemplo,

```jsx
import {customElement} from 'lit/decorators/custom-element.js';
import {eventOptions} from 'lit/decorators/event-options.js';
```

# Enabling decorators

Para usar decoradores, debe compilar su código con un compilador como TypeScript o Babel.

En el futuro, cuando los decoradores se conviertan en una función nativa de la plataforma web, es posible que esto ya no sea necesario.

## Using decorators with TypeScript

Para usar decoradores con TypeScript, habilite la opción del compilador experimentalDecorators.

También debe asegurarse de que la configuración `useDefineForClassFields` sea `false`. Tenga en cuenta que esto solo debería ser necesario cuando el `target` se establece en `esnext` o superior, pero se recomienda asegurarse explícitamente de que esta configuración sea `false`.

```jsx
"experimentalDecorators": true,
"useDefineForClassFields": false,
```

No se requiere ni se recomienda habilitar `emitDecoratorMetadata`.

## Using decorators with Babel

Si está compilando JavaScript con Babel, puede habilitar los decoradores agregando los siguientes complementos y configuraciones:

- @babel/plugin-propuesta-decoradores
- @babel/plugin-propuesta-clase-propiedades

Tenga en cuenta que `@babel/plugin-proposal-class-properties` puede no ser necesario con las últimas versiones de Babel.

Para configurar los complementos, agregue un código como este a su configuración de Babel:

```jsx
"assumptions": {
  "setPublicClassFields": true
},
"plugins": [
  ["@babel/plugin-proposal-decorators", {
    "version": "2018-09",
    "decoratorsBeforeExport": true
  }],
  ["@babel/plugin-proposal-class-properties"]
]
```

> ℹ️ El soporte del decorador de Babel ha sido probado con la versión: '2018-09'. Este es actualmente el valor predeterminado, pero recomendamos configurar la versión explícitamente en caso de que cambie el valor predeterminado. No se admiten otras versiones ('2021-12' o 'heredada'), pero esto puede cambiar a medida que evoluciona Babel. Consulte la documentación de Babel si desea experimentar.
> 

## Using decorators with TypeScript and Babel

Al usar TypeScript con Babel, es importante ordenar la transformación de TypeScript antes de que los decoradores se transformen en su configuración de Babel de la siguiente manera:

```jsx
{
  "assumptions": {
    "setPublicClassFields": true
  },
  "plugins": [
    ["@babel/plugin-transform-typescript", {
      "allowDeclareFields": true
    }],
    ["@babel/plugin-proposal-decorators", {
      "version": "2018-09",
      "decoratorsBeforeExport": true
    }],
    ["@babel/plugin-proposal-class-properties"]
  ]
}
```

La configuración `allowDeclareFields` generalmente no es necesaria, pero puede ser útil si desea definir una propiedad reactiva sin usar un decorador. Por ejemplo,

```jsx
static properties = { foo: {} };

declare foo: string;

constructor() {
  super();
  this.foo = 'bar';
}
```

## Avoiding issues with class fields and decorators (Evitar problemas con campos de clase y decoradores)

Los campos de clase tienen una interacción problemática con la declaración de propiedades reactivas. Consulte Evitar problemas con campos de clase al declarar propiedades para obtener más información.

La propuesta actual de la **etapa 3** de los decoradores no aborda directamente este problema, pero debe resolverse a medida que la propuesta evolucione y madure.

Al usar decoradores, la configuración del transpilador para Babel y TypeScript debe configurarse correctamente como se muestra en las secciones anteriores para TypeScript y Babel.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
