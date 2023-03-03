# Changes

# Introducción

Lit es un sucesor de la biblioteca Polymer. Si tiene un proyecto creado con Polymer y quiere migrarlo a Lit, o si está familiarizado con Polymer y quiere saber cómo se compara con Lit, este es el documento adecuado para usted.

Este documento proporciona una descripción general rápida de cómo Lit se relaciona con Polymer y proporciona un libro de cocina que muestra cómo el código común de Polymer se traduce a Lit.

# ¿Cómo se relaciona Lit con Polymer?

Polymer fue una de las primeras bibliotecas para crear componentes web. Lit es un sucesor de Polymer, construido por el mismo equipo y con muchos de los mismos objetivos. Los proyectos comparten muchos objetivos, pero Lit aprovecha las lecciones aprendidas durante el desarrollo de Polymer.

Debido a que Polymer es el predecesor de Lit, hay muchas similitudes entre los dos. Ambas bibliotecas facilitan la creación de componentes que funcionan como elementos HTML integrados y ambas cuentan con plantillas HTML declarativas.

Lit se diferencia de Polymer en varios aspectos:

- **La representación de Lit es asíncrona y por lotes de forma predeterminada**. Con algunas excepciones, todas las actualizaciones de Polymer son síncronas.
- **Lit expone un ciclo de vida de actualización que proporciona un mecanismo poderoso para observar los cambios en las propiedades y calcular los valores derivados de ellos**. Polymer tiene observadores declarativos y propiedades calculadas, pero puede ser difícil predecir el orden en que se ejecutarán los observadores.
- **Lit se enfoca en la creación de JavaScript primero, utilizando módulos nativos de JavaScript**. Polymer se centró originalmente en la creación de HTML primero, lo que fue posible gracias a la especificación de importaciones de HTML, que desde entonces se eliminó de la plataforma web.
- **Las expresiones lit usan JavaScript estándar**. Polymer utiliza un lenguaje específico de dominio limitado en sus enlaces. Debido a que Lit usa JavaScript estándar, también puede usar JavaScript para controlar el flujo dentro de las expresiones (plantillas condicionales y plantillas repetidas), donde Polymer usa elementos auxiliares especializados.
- **Lit apunta a un modelo mental simple y comprensible con flujo de datos unidireccional**. Polymer admite el enlace de datos bidireccional y los observadores, lo que puede ser muy bueno en proyectos simples, pero tiende a dificultar el razonamiento sobre el flujo de datos a medida que el proyecto se vuelve más complejo.

# Migración de Polymer a Lit

Si planea migrar de Polymer a Lit, no tiene que hacerlo todo de una vez. Polymer y Lit funcionan juntos, por lo que puede migrar un componente a la vez.

Hay algunas cosas que querrá hacer para actualizar su proyecto antes de comenzar a trabajar con Lit:

- Actualice su proyecto a Polymer 3.
- Asegúrese de que las herramientas de su proyecto sean compatibles con las funciones de JavaScript más nuevas.
- Retire el enlace bidireccional.

## Actualización a Polymer 3

Polymer 2.x y versiones anteriores utilizan importaciones de HTML, que desde entonces se han eliminado de la plataforma web. Polymer 3 y Lit se distribuyen como módulos de JavaScript, lo que significa que funcionan bien juntos y pueden aprovechar una amplia gama de herramientas web modernas.

En la mayoría de los casos, la mayor parte del proceso de migración se puede automatizar mediante la herramienta de modulación de polymer. Para obtener más información, consulte la guía de actualización de Polymer 3.0.

## Ayuda de idioma

Polymer usó funciones de la versión ECMAScript 2015 de la especificación de JavaScript. Si comenzó con uno de los kits de inicio de Polymer, es posible que su cadena de herramientas no admita JavaScript más reciente.

Lit usa funciones de ECMAScript 2019 (y algunos códigos de ejemplo de Lit pueden incluir funciones de lenguaje más nuevas). Deberá actualizar sus herramientas si no admiten estas nuevas funciones de JavaScript. Por ejemplo:

- Campos de instancia públicos y campos estáticos públicos. Estos son ampliamente utilizados en el código de ejemplo:

```jsx
static styles = [ css`:host { display: block; }` ];
```

- Async y await, que se pueden usar para simplificar el código basado en promesas. Por ejemplo:

```jsx
async _loginClickHandler() {
  this.loggedIn = true;
  // Wait for `loggedIn` state to be rendered to the DOM
  await this.updateComplete;
  this.dispatchEvent(new Event('login'));
}
```

Para obtener más información sobre los requisitos de idioma para Lit, consulte Requisitos.

## Eliminación de binding bidireccionales

El enlace bidireccional de Polymer acopla de forma eficaz y estrecha una propiedad principal con una propiedad secundaria. Este estrecho acoplamiento crea una serie de problemas, por lo que el equipo optó por no agregar un enlace bidireccional a Lit.

Eliminar los enlaces bidireccionales **antes** de migrar a Lit reducirá la complejidad de su migración y le permitirá probar su aplicación en Polymer sin enlaces bidireccionales antes de comenzar su migración.

Si su aplicación no utiliza enlace bidireccional, puede omitir esta sección.

### **Problemas con el enlace bidireccional**

Para los enlaces bidireccionales, Polymer utiliza su propio protocolo, que tiene tres componentes principales:

- Un enlace de anfitrión a hijo.
- Un detector de eventos que maneja los eventos de cambio de propiedad del elemento secundario.
- Una facilidad para que el niño dispare automáticamente eventos de cambio cuando cambien las propiedades (`notify: verdadero`).

Este último elemento es el más problemático. Los componentes activan eventos de cambio para cualquier cambio en una propiedad, y cada evento de cambio se maneja de forma síncrona. El uso generalizado del enlace bidireccional en toda una aplicación puede dificultar el razonamiento sobre el flujo de datos y el orden en que los componentes se actualizan.

Idealmente, un evento es una señal discreta enviada para comunicar un cambio explícito que de otro modo no sería fácilmente observable. Enviar un evento como efecto secundario de establecer una propiedad, como lo hace Polymer, hace que la comunicación sea potencialmente redundante e implícita. Este comportamiento implícito, en particular, puede dificultar la comprensión del flujo de datos.

Para resumir las pautas de mejores prácticas de elementos personalizados, un componente debe activar eventos:

- Cuando el estado del elemento cambia como resultado de la interacción del usuario, como hacer clic en un botón o editar un campo de texto dentro del componente.
- Cuando algo interno cambia dentro del componente, como un temporizador que se apaga o una animación que se completa.

Idealmente, un componente debe activar eventos semánticos, que describen qué cambió en lugar de dejar que los eventos de interfaz de usuario de bajo nivel se desborden. Por ejemplo, un formulario que permite al usuario actualizar los datos del perfil puede activar un evento de actualización del perfil cuando el usuario hace clic en el botón Listo. El evento de actualización de perfil es relevante para el padre: el evento de clic no lo es.

### Sustitución de fijaciones bidireccionales

Hay muchas formas de reemplazar los enlaces bidireccionales. Si solo está buscando migrar una aplicación Polymer existente a Lit, es posible que desee reemplazar los enlaces bidireccionales con un código que cumple una función similar:

- Eliminar el evento de cambio de propiedad automático (`notify: verdadero`).
- Reemplace el evento de cambio de propiedad automático con un evento de cambio más intencional.
- Reemplace la anotación de enlace bidireccional con un enlace unidireccional y un controlador de eventos. (Este paso es opcional, pero simplifica la transición a Lit.)

Por ejemplo, si el niño está actualizando una propiedad de notificación debido a una interacción del usuario, elimine la `notify: true` y active el evento de cambio de evento manualmente, según el evento de interacción del usuario.

Considere el siguiente código de polymer:

```jsx
static get properties() {
  return {
    name: {
      type: String,
      notify: true
    }
  };
}

static get template() {
  return html`
    Name: [[name]]<br>
    Enter name: <input value={{name::input}}>
  `;
}
```

Este componente utiliza un enlace bidireccional con el elemento `input` y tiene una propiedad de notificación, por lo que un elemento principal puede usar un enlace bidireccional con la propiedad de `name`. El enlace bidireccional a la entrada tiene sentido ya que el enlace se establece solo cuando se activa el evento de `input`. Sin embargo, al agregar un event listener para el evento `input`, puede eliminar la propiedad de notificación:

```jsx
static properties = {
  name: {
    type: String,
  }
}

static get template() {
  return html`
    Name: [[name]]<br>
    Enter name: <input on-input="inputChanged" value=[[name]]>
  `;
}

inputChanged(e) {
  this.name = e.target.value;
  const propChangeEvent = new CustomEvent('name-changed', {
    detail: { value: this.name }
  });
  this.dispatchEvent(propChangeEvent);
}
```

Este código escucha explícitamente los eventos de entrada y activa los eventos con `name-changed`. Este código funcionará con un padre que espera el protocolo de enlace bidireccional de Polymer, por lo que puede actualizar los componentes de uno en uno.

Este código no activará un evento de cambio de propiedad cuando el padre establece la propiedad de `name`, lo cual es bueno. Y puede migrar este código bastante directamente a Lit.

Con un controlador de eventos como este, también podría agregar lógica al componente secundario, como activar solo el evento de  `name-changed` cuando el usuario deja de escribir durante un cierto intervalo.

> ℹ️ Flujo de datos unidireccional. Otra alternativa es reemplazar los enlaces bidireccionales con un patrón de flujo de datos unidireccional, utilizando un contenedor de estado como Redux. Los componentes individuales pueden suscribirse para recibir actualizaciones del estado y enviar acciones para actualizar el estado. Recomendamos esto para nuevos desarrollos, pero puede requerir más trabajo si ya tiene una aplicación basada en enlaces bidireccionales.
> 

# Polymer to Lit cookbook

Esta sección muestra cómo el código Polymer maneja las tareas comunes y muestra el código Lit equivalente. Esto puede ser útil si ya está familiarizado con Polymer y quiere aprender Lit; o si está migrando un proyecto existente de Polymer a Lit.

Esta sección asume que está utilizando Polymer 3.0. Si está migrando un proyecto de Polymer a Lit, querrá migrar primero a Polymer 3.0.

Para obtener más información específica sobre la migración de un proyecto existente, consulte Migración de Polymer a Lit.

> ℹ️ ¿JavaScript o TypeScript? Lit funciona bien con cualquiera. La mayoría de los ejemplos de Lit se muestran usando un widget de muestra de código intercambiable, por lo que puede seleccionar la sintaxis de TypeScript o JavaScript.
> 

## Definiendo un componente

Tanto Polymer como Lit se basan en componentes web, por lo que definir un componente es muy similar en ambas bibliotecas. En el caso más simple, la única diferencia es la clase base.

Polymer:

```jsx
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

export class MyElement extends PolymerElement { /* ... */ }
customElements.define('my-element', MyElement);
```

Lit:

```jsx
import {LitElement} from 'lit';

export class MyElement extends LitElement { /* ... */  }
customElements.define('my-element', MyElement);
```

### Acerca decorators

Lit proporciona un conjunto de decoradores que pueden mejorar su experiencia de desarrollador, como el elemento personalizado que se muestra en el ejemplo de TypeScript en la sección anterior. Tenga en cuenta que las muestras de TypeScript en este sitio incluyen decoradores, mientras que las muestras de JavaScript los omiten, pero en realidad puede usar JavaScript con decoradores o usar TypeScript sin decoradores. Tu decides. El uso de decoradores en JavaScript requiere un compilador como Babel. (Dado que ya necesita un compilador para TypeScript, solo necesita configurarlo para procesar decoradores).

## DOM template

Tanto Polymer 3 como Lit proporcionan una función de etiqueta `html` para definir plantillas.

Polymer:

```jsx
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

export class MyElement extends PolymerElement {
  static get template() {
    return html`<b>Hello</b>`;
  }
}
customElements.define('my-element', MyElement);
```

Lit:

```jsx
import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  render() {
    return html`<b>Hello</b>`;
  }
}
customElements.define('my-element', MyElement);
```

Tenga en cuenta que el `html` de Lit es diferente del `html` de Polymer. Tienen el mismo propósito básico, pero funcionan de manera diferente. El `html` de Polymer se llama una vez durante la inicialización del elemento. El `html` de Lit generalmente se llama durante cada actualización. El trabajo de configuración se realiza una vez por cadena literal de plantilla, por lo que las llamadas posteriores a la función `html` de Lit para actualizaciones incrementales son muy rápidas.

## Styles

Los componentes de polymer suelen incluir estilos directamente en la plantilla.

```jsx
static get template() {
  return html`
    <style>
      .fancy { color: blue; }
    </style>
    ...
  `;
}
```

En Lit, normalmente proporciona estilos en un campo de `styles` estáticos utilizando la función de etiqueta `css`.

```jsx
import {LitElement, css, html} from 'lit';
  ...

  static styles = css`.fancy { color: blue; }`;
```

También se admite agregar una etiqueta de estilo directamente en la plantilla, como lo haría en Polymer:

```jsx
import {LitElement, html} from 'lit';
  ...
  render() {
    return html`
      <style>
        .fancy { color: blue; }
      </style>
      ...
  }ℹ️
```

El uso de una etiqueta de estilo puede tener un rendimiento un poco menor que el campo de `styles` estáticos, porque los estilos se evalúan una vez por instancia en lugar de una vez por clase.

## Data binding

Donde Polymer tiene enlace de datos, Lit tiene expresiones en sus plantillas. Las expresiones lit son expresiones estándar de JavaScript que están vinculadas a una ubicación particular en la plantilla. Como tal, las expresiones Lit pueden hacer casi todo lo que puede hacer con los enlaces de datos de Polymer, y muchas cosas que no puede hacer fácilmente en Polymer.

> ℹ️ Binding bidireccionales. El equipo de literatura tomó la decisión intencional de no implementar enlaces de datos bidireccionales. Si bien esta característica parece simplificar algunas necesidades comunes, en la práctica dificulta razonar sobre el flujo de datos y el orden en que los componentes se actualizan. Recomendamos eliminar el enlace bidireccional antes de migrar a Lit.
> 

Polymer:

```jsx
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class UserView extends PolymerElement {
  static get properties() {
    return {
      name: String
    };
  }

  static get template() {
    return html`
      <div>[[name]]</div>
    `;
  }
}
```

Lit:

```jsx
import {html, LitElement} from 'lit';

class UserView extends LitElement {

  static properties = {
    name: {}
  }

  render() {
    return html`
      <div>${this.name}</div>
    `;
  }
}
```

Como puede ver, la principal diferencia es reemplazar los corchetes dobles alrededor de la unión de polymer:

`[[expression]]`

con la sintaxis de expresión para un literal de plantilla etiquetada:

`${expression}`

Además, tenga en cuenta que la expresión Lit usa `this.name` en lugar de solo `name`. Los enlaces de polymer solo permiten ciertas cosas dentro de la anotación de enlace, como un nombre de propiedad o una ruta (como `user.id` o `shapes[4].type`). Los nombres de propiedad o las rutas se evalúan en relación con el ámbito de vinculación actual.

Puede utilizar cualquier expresión de JavaScript estándar en Lit y se aplican los ámbitos de JavaScript estándar. Por ejemplo, puede acceder a las variables locales creadas dentro del método `render()`, o acceder a las variables de instancia usando `this`.

```jsx
render() {
  let count = this.getMatchingItems(this.pattern);

  return html`You have ${count} matches.`
}
```

Al igual que Polymer, Lit admite la configuración de propiedades, atributos y controladores de eventos mediante expresiones. Lit usa una sintaxis ligeramente diferente, con prefijos en lugar de sufijos. La siguiente tabla resume las diferencias entre la sintaxis de enlace de polymer y Lit:

| Type | Polymer | Lit |
| --- | --- | --- |
| Property | property-name=[[value]] | .propertyName=${value} |
| Attribute | attribute-name$=[[value]] | attribute-name=${value} |
| Boolean attribute | attribute-name?=[[value]] | ?attribute-name=${value} |
| Event | on-event-name$=[[handler]] | @event-name=${handler} |

Notas:

- Expresiones de propiedad. Lit usa el nombre de la propiedad literal, con el prefijo de un punto. Polymer utiliza el nombre de atributo correspondiente.
- Manejadores de eventos. En Lit, el controlador puede ser un método, como `${this.clickHandler}` o una función de flecha. Usando una función de flecha, puede cerrar sobre otros datos o llamar a una función con una firma diferente. Por ejemplo:

```jsx
<input @change=${(e) => this.setValue(e.target.value)}>
```

## Two-way bindings

En general, recomendamos eliminar los enlaces bidireccionales antes de migrar proyectos de Polymer a Lit. Para obtener más información, consulte Eliminación del enlace bidireccional.

Si ha reemplazado sus enlaces bidireccionales con enlaces unidireccionales y detectores de eventos, debería poder migrarlos directamente a Lit.

Si está escribiendo un componente Lit para reemplazar un componente principal que solía usar un enlace bidireccional para comunicarse con un componente secundario de Polymer, agregue una expresión de propiedad para establecer la propiedad y un detector de eventos para manejar el evento de cambio de propiedad.

Polymer:

```jsx
static get template() {
  return html`
    <polymer-child
      childprop="[[parentprop]]"
      on-childprop-changed="childpropChanged">
    </polymer-child>
  `;
}

childpropChanged(e) {
  this.parentprop = e.detail.value;
}
```

Lit:

```jsx
static template = html`
  <polymer-child
    .childprop=${this.parentprop}
    @childprop-changed=${(e) => this.parentprop = e.detail.value}>
  </polymer-child>
`;
```

### Conditional templates

Polymer admite condicionales mediante el elemento auxiliar `dom-if`.

```jsx
<template is="dom-if" if="">
  <div>condition is true</div>
</template>
```

En Lit, puede usar expresiones condicionales de JavaScript. El operador condicional (o ternario) funciona bien:

```jsx
html`${this.condition
    ?  html`<div>condition is true</div>`
    : ''
}`;
```

A diferencia de Polymer `dom-if`, el operador condicional le permite proporcionar contenido tanto para condiciones `true` como `false`, aunque también puede devolver la cadena vacía para que no represente nada, como en el ejemplo.

### Ocultar o recrear DOM

Por defecto, el `dom-if` de Polymer se comporta un poco diferente a un condicional Lit. Cuando la condición pasa de un valor `true` a uno `false`, el `dom-if` simplemente oculta el DOM condicional, en lugar de eliminarlo del árbol DOM. Esto puede ahorrar algunos recursos cuando la condición vuelva a ser `true`.

Al migrar un dom-if de Polymer a Lit, tiene varias opciones:

- Use un condicional de JavaScript simple. Lit elimina y descarta el DOM condicional cuando una condición cambia a falso. `dom-if` hace lo mismo si establece la propiedad de `restamp` en `true`.
- Utilice el atributo `hidden` estándar para ocultar el contenido sin eliminarlo de la página.

```jsx
<header hidden=${this.headerHidden}>
```

Esto es bastante ligero. Sin embargo, el DOM se crea en el primer renderizado incluso si la condición es falsa.

- Envuelva un condicional en la directiva de `cache` para evitar descartar y volver a crear el DOM cuando cambie la condición.

En la mayoría de los casos, el condicional simple funciona bien. Si el DOM condicional es grande y complejo y observa retrasos en la recreación del DOM cuando la condición cambia a verdadera, puede usar la directiva de caché de Lit para conservar el DOM condicional. Cuando se usa el caché, el DOM aún se elimina del árbol, pero se almacena en caché en la memoria, lo que puede ahorrar recursos cuando cambia la condición.

```jsx
import {LitElement, html} from 'lit';
import {cache} from 'lit/directives/cache.js';
...

   return html`${cache(this.condition
    ?  html`<div>condition is true</div>`
    : ''
   )}`;
```

Dado que esto no generará nada cuando la condición sea falsa, puede usarlo para evitar crear una pieza compleja de DOM en la carga de la página inicial.

### Repitiendo templates

Polymer usa el asistente `dom-repeat` para repetir plantillas.

```jsx
<template is="dom-repeat" items="">
  <li></li>
</template>
```

La plantilla dentro de `dom-repeat` puede acceder a un conjunto limitado de propiedades: propiedades en el elemento host, además de las propiedades de índice y elemento agregadas por `dom-repeat`.

Al igual que con los condicionales, Lit puede manejar repeticiones usando JavaScript, haciendo que una expresión devuelva una matriz de valores. La directiva `map` de Lit funciona como el método de matriz `map()`, excepto que acepta otros tipos de iterables, como conjuntos o generadores.

```jsx
import {map} from 'lit/directives/map.js';
...
  render() {
    return html`
      <ul>
        ${map(this.items, (item) =>
          html`<li>${item.name}</li>`)
        }
      </ul>
    `;
  }
```

Mientras que los enlaces de Polymer solo pueden acceder a ciertas propiedades, las expresiones Lit pueden acceder a cualquier cosa disponible en el ámbito de JavaScript.

También puedes generar una matriz en el método `render()`:

```jsx
render() {
  const itemTemplates = [];
  for (i of this.items) {
    itemTemplates.push(html`<li>${i}</li>`);
  }

  return html`
    <ul>
      ${itemTemplates}
    </ul>
  `;
}
```

### Manejo de eventos de plantillas repetitivas

Hay diferentes formas de agregar detectores de eventos (event listeners) a elementos repetidos:

- Si el evento burbujea, puede usar la delegación de eventos, agregando un solo oyente a un elemento principal.
- Si el evento no burbujea, puede agregar un oyente a cada elemento repetido.

Al manejar eventos de elementos generados por plantillas repetitivas, con frecuencia necesita identificar tanto el elemento que activó el evento como los datos que generaron ese elemento.

Polymer ayuda con esto último agregando datos al objeto de evento.

Lit no agrega estos datos adicionales, pero puede adjuntar un valor único a cada elemento repetido para facilitar la referencia:

```jsx
render() {
  return html`
    <div @click=${this.handleClick}>
      ${map(this.items, (item) => {
        return html`<button data-id=${item.id}>${item.text}</button>`
      }
    </div>
  `;
}
```

Al agregar oyentes (listeners) a elementos individuales, también puede usar una función de flecha para pasar datos directamente al controlador de eventos (event handler):

```jsx
render() {
  return html`
    <div>
      ${this.items.map((item) => {
          return html`<button
            @click=${() => this._handleClick(item)}>
            ${item.text}
          </button>`;
        }
       }
    </div>
  `;
}
```

## Properties

Las propiedades reactivas de Lit coinciden bastante bien con las propiedades declaradas de Polymer. Las propiedades reactivas admiten muchas de las mismas funciones que las propiedades declaradas, incluida la sincronización de valores entre la propiedad y un atributo.

### Configurando propiedades

Al igual que Polymer, Lit le permite configurar propiedades usando un campo de propiedades estáticas.

Polymer:

```jsx
static get properties() {
    return {
      user: String,
      count: {
        type: Number,
        notify: true
      }
    }
  }
```

Lit:

```jsx
static properties = {
  user: {},
  count: {
    type: Number
  }
}
```

Tanto Polymer como Lit admiten varias opciones al declarar una propiedad. La siguiente lista muestra las opciones de polymer y sus equivalentes Lit.

| type | La opción de tipo de Lit tiene el mismo propósito. |
| --- | --- |
| value | Lit no admite establecer el valor de una propiedad de esta manera. En su lugar, establezca un valor predeterminado en el constructor. Si usa el decorador @property, también puede usar un inicializador de campo de clase. |
| reflectToAttribute | En Lit, esta opción se ha abreviado para reflejar. |
| readOnly | Lit no incluye ningún soporte integrado para propiedades reactivas de solo lectura. Si necesita hacer que una propiedad calculada forme parte de la API pública de un componente, puede agregar un getter sin setter. |
| notify | Esta función se utiliza para admitir el enlace bidireccional. No se implementó en Literatura debido a los problemas descritos en Problemas con el enlace bidireccional.
Los componentes de Lit pueden usar las API web nativas (como dispatchEvent) para activar eventos en respuesta a la entrada del usuario o cuando cambia un estado interno. |
| computed | Las propiedades calculadas declarativas no se admiten en Lit. Ver propiedades calculadas para alternativas. |
| observer | Lit no admite observadores directamente. En su lugar, proporciona una serie de puntos de anulación en el ciclo de vida en los que puede tomar medidas en función de cualquier propiedad que haya cambiado.’ |

### Captador estático versus campo de clase estático

Tenga en cuenta que el ejemplo de Polymer usa un getter—static get properties()—donde el ejemplo de Lit JavaScript usa un campo de clase—static properties. Estas dos formas funcionan de la misma manera. Cuando se publicó Polymer 3, la compatibilidad con los campos de clase no estaba muy extendida, por lo que el código de ejemplo de Polymer usa el getter.

Si está agregando componentes Lit a una aplicación Polymer existente, es posible que su cadena de herramientas no admita el formato de campo de clase. En cuyo caso, puede usar el getter estático, en su lugar.

```jsx
static get properties() {`
  return {
    user: {},
    count: {
      type: Number
    }
  }
}
```

### Propiedades de matriz y tipo de objeto

Al igual que Polymer, Lit realiza comprobaciones sucias cuando cambian las propiedades para evitar realizar un trabajo innecesario. Esto puede generar problemas si tiene una propiedad que contiene un objeto o una matriz. Si muta el objeto o la matriz, Lit no detectará ningún cambio.

En la mayoría de los casos, la mejor manera de evitar estos problemas es usar patrones de datos inmutables, de modo que siempre asigne un nuevo objeto o valor de matriz en lugar de mutar un objeto o matriz existente. Lo mismo es generalmente cierto para el polymer.

Polymer incluye API para establecer subpropiedades de forma observable y matrices mutantes, pero son algo difíciles de usar correctamente. Si usa estas API, es posible que deba migrar a un patrón de datos inmutable.

### Propiedades de solo lectura

Las propiedades de solo lectura no eran una característica muy utilizada en Polymer y no son difíciles de implementar si es necesario, por lo que no se incluyeron en la API de Lit.

Para exponer un valor de estado interno como parte de la API pública del componente, puede agregar un captador sin definidor. También puede activar un evento cuando cambia el estado (por ejemplo, un componente que carga recursos de la red puede tener un estado de "carga" y activar un evento cuando cambia ese estado).

Las propiedades de solo lectura de Polymer incluyen un setter oculto. Puede agregar un setter privado para su propiedad si tiene sentido para su componente.

```jsx
static properties = {
  name: {attribute: false}
};

constructor() {
  super();
  this._name = 'Somebody';
}

get name() { return this._name }

_setName(name) {
  this._name = name;
  this.requestUpdate('name');
}
```

Tenga en cuenta que si la propiedad no está incluida en la plantilla del componente, no necesita declararla (con `@property` o `static properties`) ni llamar a `requestUpdate()`.

## Computed properties and observers

Lit proporciona una serie de métodos de ciclo de vida reemplazables que se llaman cuando cambian las propiedades reactivas. Utilice estos métodos para implementar la lógica que iría en propiedades calculadas u observadores en Polymer.

Las siguientes listas resumen cómo migrar diferentes tipos de propiedades calculadas y observadores.

**Propiedades calculadas**:

- Para los valores utilizados de forma efímera en la plantilla, calcule los valores como variables locales en `render()` y utilícelos en la plantilla antes de regresar.
- Para los valores que deben almacenarse de manera persistente o que son costosos de calcular, hágalo en `willUpdate()`.
- Use el método `changesProperties.has()` para calcular solo cuando cambien las dependencias, para evitar costosos re-cálculos en cada actualización.

**Observadores**:

- Si el observador necesita actuar directamente sobre el DOM en función de los cambios de propiedad, utilice updated(). Esto se llama después de la devolución de llamada `render()`.
- De lo contrario, utilice `willUpdate()`.
- En cualquier caso, use `changesProperties.has()` para saber cuándo ha cambiado una propiedad.

**Observadores basados en rutas**:

- Estos son observadores complejos que observan rutas como foo.bar o foo.*:

```jsx
observers: ['fooBarChanged(foo.bar)', 'fooChanged(foo.*)']
```

- Esta función era muy específica del sistema de datos de Polymer que no tiene equivalente en Lit.
- Recomendamos usar patrones inmutables como una forma más interoperable de comunicar cambios de propiedad profundos.

### Cálculo de valores (Computing) transitorios en render()

Si necesita calcular valores transitorios que solo se usan para renderizar, puede calcularlos directamente en el método `render()`.

Polymer:

```jsx
static get template() {
    return html`
      <p>Text: <span></span></p>
    `;
  }

  static get properties() {
    return {
      /* ... */
      cyphertext: {
        type: String,
        computed: 'rot13(cleartext)'
      }
    }
  }
```

Lit:

```jsx
render() {
  const cyphertext = rot13(this.cleartext);
  return html`Text: ${cyphertext}`;
}
```

Además, debido a que Lit le permite usar cualquier expresión de JavaScript en una plantilla, los enlaces calculados (computed binding) de Polymer se pueden reemplazar con expresiones en línea, incluidas las llamadas a funciones.

Polymer:

```jsx
static get template() {
    return html`
      My name is <span>[[_formatName(given, family)]]</span>
    `;
  }
```

Lit:

```jsx
render() {
  html`
      My name is <span>${this._formatName(given, family)}</span>
    `;
}
```

Dado que las expresiones Lit son JavaScript simple, debe usar `this` dentro de la expresión para acceder a una propiedad o método de instancia.

### Computing properties in willUpdate()

La devolución de llamada `willUpdate()` es un lugar ideal para calcular propiedades en función de otros valores de propiedad. `willUpdate()` recibe un map de los valores de propiedad cambiados, para que pueda manejar los cambios actuales.

```jsx
willUpdate(changedProperties) {
    if (changedProperties.has('userId') || changedProperties.has('avatarId')) {
      this.imageUrl = this._getImageUrl(this.userId, this.avatarId);
    }
  }
```

El uso de `willUpdate()` le permite elegir qué hacer en función del conjunto completo de propiedades modificadas. Esto evita problemas con múltiples observadores o propiedades calculadas que interactúan de manera impredecible.

# Mixins

Los mixins fueron una de varias formas de empaquetar la funcionalidad reutilizable para usarla en un componente Polymer. Si está portando una mezcla de Polymer a Lit, tiene varias opciones.

- **Funciones independientes (Standalone functions)**. Debido a que los enlaces de datos de Polymer solo pueden acceder a los miembros de la instancia, la gente a menudo creaba un mixin simplemente para hacer que una función estuviera disponible en un enlace de datos. Esto no es obligatorio en Lit, ya que puede usar cualquier expresión de JavaScript en su plantilla. En lugar de usar un mixin, puede importar una función de otro módulo y usarla directamente en su plantilla.
- **Lit mixins**. Los mixins de Lit funcionan de manera muy similar a los mixins de Polymer, por lo que muchos mixins de Polymer se pueden volver a implementar como mixins de Lit.
- **Controladores reactivos (Reactive controllers)**. Los controladores reactivos son una forma alternativa de empaquetar funciones reutilizables.

# Lifecycle

Los componentes iluminados tienen el mismo conjunto de devoluciones de llamada de ciclo de vida de componentes web estándar que los componentes de polymer.

Además, los componentes de Lit tienen un conjunto de devoluciones de llamadas que se pueden usar para personalizar el ciclo de actualización reactiva.

Si está utilizando la devolución de llamada `ready()` en su elemento Polymer, es posible que pueda usar la devolución de llamada `firstUpdated()` de Lit para el mismo propósito. La devolución de llamada `firstUpdated()` se invoca después de la primera vez que se representa el DOM del componente. Podría usarlo, por ejemplo, si desea enfocar un elemento en el DOM renderizado.

```jsx
firstUpdated() {
 this.renderRoot.getElementById('my-text-area').focus();
}
```

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-lit-element/readme.md)
