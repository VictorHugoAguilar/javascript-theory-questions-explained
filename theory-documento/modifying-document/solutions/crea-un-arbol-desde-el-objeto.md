# crea-un-arbol-desde-el-objeto

La forma más fácil de recorrer el objeto es usando recursividad.

## La solución con innerHTML.

````html
<!DOCTYPE html>
<html>
<body>

  <div id="container"></div>

  <script>
    let data = {
      "Fish": {
        "trout": {},
        "salmon": {}
      },

      "Tree": {
        "Huge": {
          "sequoia": {},
          "oak": {}
        },
        "Flowering": {
          "apple tree": {},
          "magnolia": {}
        }
      }
    };

    function createTree(container, obj) {
      container.innerHTML = createTreeText(obj);
    }

    function createTreeText(obj) { // función recursiva aislada
      let li = '';
      let ul;
      for (let key in obj) {
        li += '<li>' + key + createTreeText(obj[key]) + '</li>';
      }
      if (li) {
        ul = '<ul>' + li + '</ul>'
      }
      return ul || '';
    }

    createTree(container, data);
  </script>
</body>
</html>
`````

## usando DOM

````html
<!DOCTYPE html>
<html>
<body>

  <div id="container"></div>

  <script>
    let data = {
      "Fish": {
        "trout": {},
        "salmon": {}
      },

      "Tree": {
        "Huge": {
          "sequoia": {},
          "oak": {}
        },
        "Flowering": {
          "apple tree": {},
          "magnolia": {}
        }
      }
    };

    function createTree(container, obj) {
      container.append(createTreeDom(obj));
    }

    function createTreeDom(obj) {
      // si no tiene hijos, el llamado devuelve undefined
      // y el <ul> no será creado
      if (!Object.keys(obj).length) return;

      let ul = document.createElement('ul');

      for (let key in obj) {
        let li = document.createElement('li');
        li.innerHTML = key;

        let childrenUl = createTreeDom(obj[key]);
        if (childrenUl) {
          li.append(childrenUl);
        }

        ul.append(li);
      }

      return ul;
    }

    let container = document.getElementById('container');
    createTree(container, data);
  </script>

</body>
</html>
````

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory-documento/modifying-document/readme.md#crea-un-arbol-desde-el-objeto)
