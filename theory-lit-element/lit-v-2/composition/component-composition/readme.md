# Component composition

# Introducción

La forma más común de manejar la complejidad y factorizar el código Lit en unidades separadas es la composición de componentes: es decir, el proceso de construir un componente grande y complejo a partir de componentes más pequeños y simples. Imagine que se le ha encomendado la tarea de implementar una pantalla de interfaz de usuario:

![Untitled](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/lit-v-2/composition/component-composition/img/image_lit_v2_component_composition_01.png?raw=true)

Probablemente pueda identificar las áreas que implicarán cierta complejidad para implementar. Lo más probable es que esos podrían ser componentes.

Al aislar la complejidad en componentes específicos, hace que el trabajo sea mucho más simple y luego puede componer estos componentes para crear el diseño general.

Por ejemplo, la captura de pantalla bastante simple de arriba incluye varios componentes posibles: una barra superior, un botón de menú, un cajón con elementos de menú para navegar por la sección actual; y un área de contenido principal. Cada uno de estos podría ser representado por un componente. Un componente complejo, como un cajón con un menú de navegación, puede dividirse en muchos componentes más pequeños: el propio cajón, un botón para abrir y cerrar el cajón, el menú, elementos de menú individuales.

Lit le permite componer agregando elementos a su plantilla, ya sean elementos HTML incorporados o elementos personalizados.

```jsx
render() {
  return html`
    <top-bar>
      <icon-button icon="menu" slot="nav-button"></icon-button>
      <span slot="title">Fuzzy</span>
    </top-bar>
    `;
}
```

# What makes a good component (Lo que hace un buen componente)

Al decidir cómo dividir la funcionalidad, hay varias cosas que ayudan a identificar cuándo hacer un nuevo componente. Una parte de la interfaz de usuario puede ser un buen candidato para un componente si se aplica uno o más de los siguientes:

- Tiene su propio estado.
- Tiene su propia plantilla.
- Se usa en más de un lugar, ya sea en este componente o en múltiples componentes.
- Se enfoca en hacer una cosa bien.
- Tiene una API bien definida.

Los controles reutilizables como botones, casillas de verificación y campos de entrada pueden ser excelentes componentes. Pero las piezas de interfaz de usuario más complejas, como los cajones y los carruseles, también son excelentes candidatos para la creación de componentes.

# Passing data up and down the tree (Pasando datos arriba y abajo del árbol)

Al intercambiar datos con subcomponentes, la regla general es seguir el modelo del DOM: propiedades abajo, eventos arriba.

- **Bajan las propiedades**. Establecer propiedades en un subcomponente suele ser preferible a llamar a métodos en el subcomponente. Es fácil establecer propiedades en plantillas Lit y otros sistemas de plantillas declarativas.
- **Eventos arriba**. En la plataforma web, la activación de eventos es el método predeterminado para que los elementos envíen información al árbol, a menudo en respuesta a las interacciones del usuario. Esto permite que el componente host responda al evento, transforme o vuelva a activar el evento para los ancestros que se encuentran más arriba en el árbol.

Algunas implicaciones de este modelo:

- Un componente debe ser la fuente de verdad para los subcomponentes en su sombra DOM. Los subcomponentes no deben establecer propiedades ni llamar a métodos en su componente host.
- Si un componente cambia una propiedad pública sobre sí mismo, debe activar un evento para notificar a los componentes que se encuentran más arriba en el árbol. Por lo general, estos cambios serán el resultado de las acciones del usuario, como presionar un botón o seleccionar un elemento del menú. Piense en el elemento de `input` nativo, que activa un evento cuando el usuario cambia el valor de la entrada.

Considere un componente de menú que incluye un conjunto de elementos de menú y expone `items` y propiedades de `selectedItem` como parte de su API pública. Su estructura DOM podría verse así:

![Untitled](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/lit-v-2/composition/component-composition/img/image_lit_v2_component_composition_02.png?raw=true)

Cuando el usuario selecciona un elemento, el elemento `my-menu` debería actualizar su propiedad selectedItem. También debe activar un evento para notificar a cualquier componente propietario que la selección ha cambiado. La secuencia completa sería algo así:

- El usuario interactúa con un elemento, lo que provoca que se active un evento (ya sea un evento estándar como un `clic` o algún evento específico del componente `my-item`).
- El elemento `my-menu` obtiene el evento y actualiza su propiedad selectedItem. También puede cambiar algún estado para que se resalte el elemento seleccionado.
- El elemento `my-menu` dispara un evento semántico que indica que la selección ha cambiado. Este evento podría llamarse `selected-item-changed`, por ejemplo. Dado que este evento es parte de la API de `my-menu`, debería ser semánticamente significativo en ese contexto.

# Passing data across the tree (Pasar datos a través del árbol)

Propiedades abajo y eventos arriba es una buena regla para empezar. Pero, ¿qué sucede si necesita intercambiar datos entre dos componentes que no tienen una relación de descendencia directa? Por ejemplo, ¿dos componentes que son hermanos en el árbol de la sombra?

Una solución a este problema es utilizar el patrón mediador. En el patrón de mediador, los componentes del mismo nivel no se comunican entre sí directamente. En cambio, las interacciones están mediadas por un tercero.

Una forma sencilla de implementar el patrón de mediador es hacer que el componente propietario controle los eventos de sus elementos secundarios y, a su vez, actualice el estado de sus elementos secundarios según sea necesario pasando los datos modificados de vuelta al árbol. Al agregar un mediador, puede pasar datos a través del árbol usando el conocido principio de eventos arriba, propiedades abajo.

En el siguiente ejemplo, el elemento mediador escucha eventos de los elementos `input` y `button` en su DOM oculto. Controla el estado habilitado del botón para que el usuario solo pueda hacer clic en `submit` cuando haya texto en la entrada.

```jsx
import {LitElement, html, css} from 'lit';

export class MediatorElement extends LitElement {
  static properties = {
    name: {},
    _submitEnabled: {state: true},
  };
  static styles = css`
    :host {
      font-family: sans-serif;
    }
  `;

  constructor() {
    super();
    this.name = 'anonymous';
    this._submitEnabled = false;
  }
  get _input() {
    return this.renderRoot?.querySelector('input') ?? null;
  }

  _inputChanged(e) {
    this._submitEnabled = !!e.target.value;
  }

  _updateName() {
    this.name = this._input.value;
    this._input.value = '';
    this._submitEnabled = false;
  }

  render() {
    return html`<p>Nickname: ${this.name}</p>
        <label>Enter new nickname:
          <input @input=${this._inputChanged}>
        </label>
        <button @click=${this._updateName}
                .disabled=${!this._submitEnabled}>Submit</button>`;
  }
}
customElements.define('mediator-element', MediatorElement);
```

Otros patrones de mediador incluyen patrones de estilo flux/Redux en los que una tienda media los cambios y actualiza los componentes a través de suscripciones. Tener componentes que se suscriban directamente a los cambios puede ayudar a evitar la necesidad de que todos los padres transmitan todos los datos requeridos por sus hijos.

# Light DOM children (Niños DOM ligeros)

Además de los nodos en su shadow DOM, puede representar nodos secundarios proporcionados por el usuario del componente, como el elemento estándar `<select>` puede tomar un conjunto de elementos <option> como elementos secundarios y representarlos como elementos de menú.

Los nodos secundarios a veces se denominan "DOM ligero" para distinguirlos del DOM oculto del componente. Por ejemplo:

```jsx
<top-bar>
  <icon-button icon="menu" slot="nav-button"></icon-button>
  <span slot="title">Fuzzy</span>
</top-bar>
```

Aquí, el elemento `<top-bar>` tiene dos hijos DOM ligeros proporcionados por el usuario: un botón de navegación y un título.

Interactuar con los elementos secundarios del DOM claro es diferente de interactuar con los nodos en el DOM oculto. Los nodos en el DOM oculto de un componente son administrados por el componente y no se debe acceder a ellos desde fuera del componente. Los elementos secundarios Light DOM se administran desde fuera del componente, pero el componente también puede acceder a ellos. El usuario del componente puede agregar o eliminar elementos secundarios DOM ligeros en cualquier momento, por lo que el componente no puede asumir un conjunto estático de nodos secundarios.

El componente tiene control sobre si se renderizan los nodos secundarios y dónde, utilizando el elemento `<slot>` en su shadow DOM. Y puede recibir notificaciones cuando se agregan y eliminan nodos secundarios escuchando el evento de `slotchange`.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
