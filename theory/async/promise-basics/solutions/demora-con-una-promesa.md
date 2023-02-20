# demora-con-una-promesa

````js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('runs after 3 seconds'));
````

Please note that in this task resolve is called without arguments. We don’t return any value from delay, just ensure the delay.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/async/promise-basics#readme#demora-con-una-promesa)
