# haz-los-enlaces-externos-naranjas

Primero, necesitamos encontrar todos los enlaces externos.

**Hay dos**.

El primero es encontrar todos los enlaces usando document.querySelectorAll('a') y luego filtrar lo que necesitamos:

````js
let links = document.querySelectorAll('a');

for (let link of links) {
  let href = link.getAttribute('href');
  if (!href) continue; // no atributo

  if (!href.includes('://')) continue; // no protocolo

  if (href.startsWith('http://internal.com')) continue; // interno

  link.style.color = 'orange';
}
````

Tenga en cuenta: nosotros usamos link.getAttribute('href'). No link.href, porque necesitamos el valor del HTML.

…Otra forma más simple sería agregar las comprobaciones al selector CSS:

````js
// busque todos los enlaces que tengan: // en href
//pero href no comienza con http://internal.com
let selector = 'a[href*="://"]:not([href^="http://internal.com"])';
let links = document.querySelectorAll(selector);

links.forEach(link => link.style.color = 'orange');
````

````html
<!DOCTYPE HTML>
<html>
<body>

  <a name="list">La lista:</a>
  <ul>
    <li><a href="http://google.com">http://google.com</a></li>
    <li><a href="/tutorial">/tutorial.html</a></li>
    <li><a href="local/path">local/path</a></li>
    <li><a href="ftp://ftp.com/my.zip">ftp://ftp.com/my.zip</a></li>
    <li><a href="http://nodejs.org">http://nodejs.org</a></li>
    <li><a href="http://internal.com/test">http://internal.com/test</a></li>
  </ul>

  <script>
    let selector = 'a[href*="://"]:not([href^="http://internal.com"])';
    let links = document.querySelectorAll(selector);

    links.forEach(link => link.style.color = 'orange');
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/dom-attributes-and-properties/readme.md#haz-los-enlaces-externos-naranjas)
