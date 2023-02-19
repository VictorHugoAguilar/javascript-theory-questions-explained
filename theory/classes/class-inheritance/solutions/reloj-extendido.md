# reloj-extendido

````js
class ExtendedClock extends Clock {
  constructor(options) {
    super(options);
    let { precision = 1000 } = options;
    this.precision = precision;
  }

  start() {
    this.render();
    this.timer = setInterval(() => this.render(), this.precision);
  }
};
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/classes/class-inheritance/readme.md#reloj-extendido)
