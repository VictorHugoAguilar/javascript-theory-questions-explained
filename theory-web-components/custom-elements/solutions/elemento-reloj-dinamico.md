# elemento-reloj-dinamico

Tener en cuenta:

1.  Borramos el temporizador `setInterval` cuando el elemento es quitado del documento. Esto es importante, de otro modo continuará ejecutando aunque no se lo necesite más, y el navegador no puede liberar la memoria asignada a este elemento.
2.  Podemos acceder a la fecha actual con la propiedad `elem.date`. Todos los métodos y propiedades de clase son naturalmente métodos y propiedades del elemento.


````html
<!DOCTYPE html>

<!-- No modificar esto -->
<script>
  class TimeFormatted extends HTMLElement {
    render() {
      let date = new Date(this.getAttribute("datetime") || Date.now());

      this.innerHTML = new Intl.DateTimeFormat("default", {
        year: this.getAttribute("year") || undefined,
        month: this.getAttribute("month") || undefined,
        day: this.getAttribute("day") || undefined,
        hour: this.getAttribute("hour") || undefined,
        minute: this.getAttribute("minute") || undefined,
        second: this.getAttribute("second") || undefined,
        timeZoneName: this.getAttribute("time-zone-name") || undefined,
      }).format(date);
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minute",
        "second",
        "time-zone-name",
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  }

  customElements.define("time-formatted", TimeFormatted);
</script>

<script>
  class TimeFormatted extends HTMLElement {
    render() {
      let date = new Date(this.getAttribute("datetime") || Date.now());

      this.innerHTML = new Intl.DateTimeFormat("default", {
        year: this.getAttribute("year") || undefined,
        month: this.getAttribute("month") || undefined,
        day: this.getAttribute("day") || undefined,
        hour: this.getAttribute("hour") || undefined,
        minute: this.getAttribute("minute") || undefined,
        second: this.getAttribute("second") || undefined,
        timeZoneName: this.getAttribute("time-zone-name") || undefined,
      }).format(date);
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minute",
        "second",
        "time-zone-name",
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  }

  customElements.define("time-formatted", TimeFormatted);
</script>

<live-timer id="elem"></live-timer>

<script>
  elem.addEventListener("tick", (event) => console.log(event.detail));
</script>

````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-web-components/custom-elements/readme.md#elemento-reloj-dinamico)
