## Aplicacion parcial para inicio de sesion

1. Utilice una función wrapper (envoltura), de tipo arrow (flecha) para ser conciso:

````js
askPassword(() => user.login(true), () => user.login(false));
````

Ahora obtiene user de variables externas y lo ejecuta de la manera normal.

2. O cree una función parcial desde `user.login` que use user como contexto y tenga el primer argumento correcto:

````js
askPassword(user.login.bind(user, true), user.login.bind(user, false));
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/advanced-functions/10_bind#aplicacion-parcial-para-inicio-de-sesion)
