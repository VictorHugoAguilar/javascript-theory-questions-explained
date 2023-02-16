# 📖 Recolección de basura

La gestión de la memoria en JavaScript se realiza de forma automática e invisible para nosotros. Creamos datos primitivos, objetos, funciones… Todo ello requiere memoria.

¿Qué sucede cuando algo no se necesita más? ¿Cómo hace el motor de JavaScript para encontrarlo y limpiarlo?

## Alcance

El concepto principal del manejo de memoria en JavaScript es alcance.

Puesto simple, los valores “alcanzables” son aquellos que se pueden acceder o utilizar de alguna manera: Se garantiza que serán conservados en la memoria.

1. Hay un conjunto base de valores inherentemente accesibles, que no se pueden eliminar por razones obvias. Por ejemplo:

- La función ejecutándose actualmente, sus variables locales y parámetros.
- Otras funciones en la cadena actual de llamadas anidadas, sus variables y parámetros.
- Variables Globales
- (Hay algunos otros internos también)
Estos valores se llaman raíces.

2. Cualquier otro valor se considera accesible si se lo puede alcanzar desde una raíz por una referencia o por una cadena de referencias.

Por ejemplo, si hay un objeto en una variable global, y ese objeto tiene una propiedad que hace referencia a otro objeto, este objeto también se considera accesible. Y aquellos a los que este objeto hace referencia también son accesibles. Ejemplos detallados a continuación.

Hay un proceso en segundo plano en el motor de JavaScript que se llama recolector de basura. Este proceso monitorea todos los objetos y elimina aquellos que se han vuelto inalcanzables.

## Un ejemplo sencillo

Aquí va el ejemplo más simple:

````js
// `user` tiene una referencia al objeto
let user = {
  name: "John"
};
````

![image_01]()

Aquí la flecha representa una referencia de objeto. La variable global "user" hace referencia al objeto {name: "John"} (lo llamaremos John por brevedad). La propiedad "name"’ de John almacena un dato primitivo, por lo que está pintada dentro del objeto.

Si se sobrescribe el valor de user, se pierde la referencia:

````js
user = null;
````

![image_02]()

Ahora John se vuelve inalcanzable. No hay forma de acceder a él, no hay referencias a él. El recolector de basura desechará los datos y liberará la memoria.

## Dos referencias

Ahora imaginemos que copiamos la referencia de user a admin:

````js
// `user` tiene una referencia al objeto
let user = {
  name: "John"
};

let admin = user;
````

![image_03]()

Ahora si hacemos lo mismo

````js
user = null;
````

… el objeto todavía es accesible a través de la variable global admin, por lo que debe quedar en la memoria. Si también sobrescribimos admin, entonces se puede eliminar.

## Objetos entrelazados

Ahora un ejemplo más complejo. La familia:

````js
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;

  return {
    father: man,
    mother: woman
  }
}

let family = marry({
  name: "John"
}, {
  name: "Ann"
});
````

La función marry “casa” dos objetos dándoles referencias entre sí y devuelve un nuevo objeto que los contiene a ambos.

La estructura de memoria resultante:

![image_04]()

Por ahora, todos los objetos son accesibles.

Ahora borremos estas dos referencias:

````js
delete family.father;
delete family.mother.husband;
````

![image_05]()

No es suficiente eliminar solo una de estas dos referencias, porque todos los objetos aún serían accesibles.

Pero si eliminamos ambos, entonces podemos ver que John ya no tiene referencias entrantes:

![image_06]()

Las referencias salientes no importan. Solo los entrantes pueden hacer que un objeto sea accesible. Entonces, John ahora es inalcanzable y será eliminado de la memoria con todos sus datos que también se volvieron inaccesibles.

Después de la recolección de basura:

![image_07]()

## Isla inalcanzable

Es posible que toda la isla de objetos interconectados se vuelva inalcanzable y se elimine de la memoria.

El objeto fuente es el mismo que el anterior. Entonces:

````js
family = null;
````

La imagen en memoria se convierte en:

![image_08]()

Este ejemplo demuestra cuán importante es el concepto de alcance.

Es obvio que John y Ann todavía están vinculados, ambos tienen referencias entrantes. Pero eso no es suficiente.

El antiguo objeto "family" se ha desvinculado de la raíz, ya no se hace referencia a él, por lo que toda la isla se vuelve inalcanzable y se eliminará.

## Algoritmos internos

El algoritmo básico de recolección de basura se llama “marcar y barrer”.

Los siguientes pasos de “recolección de basura” se realizan regularmente:

* El recolector de basura busca las raíces y las “marca” (recuerda).
* Luego visita y “marca” todos los objetos referenciados por ellas.
* Luego visita los objetos marcados y marca sus referencias. Todos los objetos visitados son recordados, para no visitar el mismo objeto dos veces en el futuro.
* …Y así sucesivamente hasta que cada referencia alcanzable (desde las raíces) sean visitadas.
* Todos los objetos que no fueron marcados se eliminan.

Por ejemplo, si nuestra estructura de objeto se ve así:

![image_09]()

Podemos ver claramente una “isla inalcanzable” al lado derecho. Ahora veamos cómo el recolector de basura maneja “marcar y barrer”.

El primer paso marca las raíces:

![image_10]()

Luego se buscan sus referencias salientes y se marcan los objetos referenciados:

![image_11]()

… luego se continúa con las referencias salientes de estos objetos, y se continúa marcando mientras sea posible:

![image_12]()

Ahora los objetos que no se pudieron visitar en el proceso se consideran inalcanzables y se eliminarán:

![image_13]()

Podemos imaginar el proceso como derramar un enorme cubo de pintura desde las raíces, que fluye a través de todas las referencias y marca todos los objetos alcanzables. Los elementos que no queden marcados son entonces eliminados.

Ese es el concepto de cómo funciona la recolección de basura. El motor de JavaScript aplica muchas optimizaciones para que se ejecute más rápido y no introduzca retrasos en la ejecución de código.

Algunas de las optimizaciones:

* **Recolección generacional** – los objetos se dividen en dos conjuntos: “nuevos” y “antiguos”. En un código típico, muchos objetos tienen corta vida: aparecen, hacen su trabajo y mueren rápido, entonces tiene sentido rastrear los objetos nuevos y eliminarlos de la memoria si corresponde. Aquellos que sobreviven el tiempo suficiente, se vuelven “viejos” y son examinados con menos frecuencia.
* **Recolección incremental** – Si hay muchos objetos, y tratamos de recorrer y marcar todo el conjunto de objetos a la vez, puede llevar algún tiempo e introducir retrasos notables en la ejecución. Entonces el motor divide la recolección de basura en partes. Luego limpia esas partes, una tras otra. Hay muchas tareas de recolección pequeñas en lugar de una grande. Eso requiere un registro adicional entre ellas para rastrear los cambios, pero tenemos muchos pequeños retrasos en lugar de uno grande.
* **Recolección de tiempo inactivo** – el recolector de basura trata de ejecutarse solo mientras la CPU está inactiva, para reducir el posible efecto en la ejecución.
Hay otras optimizaciones y tipos de algoritmos de recolección de basura. Por mucho que quiera describirlos aquí, tengo que evitarlo porque diferentes motores implementan diferentes ajustes y técnicas. Y, lo que es aún más importante, las cosas cambian a medida que se desarrollan los motores, por lo que probablemente no vale la pena profundizar sin una necesidad real. Por supuesto, si tienes verdadero interés, a continuación hay algunos enlaces para ti.

## Resumen

Los principales puntos a saber:

* La recolección de basura se ejecuta automáticamente. No la podemos forzar o evitar.
* Los objetos se retienen en la memoria mientras son accesibles.
* Ser referenciado no es lo mismo que ser accesible (desde una raíz): un conjunto de objetos interconectados pueden volverse inalcanzables como un todo, como vimos en el ejemplo de arriba.

Los motores modernos implementan algoritmos avanzados de recolección de basura.

Un libro general “The Garbage Collection Handbook: The Art of Automatic Memory Management” (R. Jones et al) cubre algunos de ellos.

Si estás familiarizado con la programación de bajo nivel, la información más detallada sobre el recolector de basura V8 se encuentra en el artículo A tour of V8: Garbage Collection.

V8 blog también publica artículos sobre cambios en la administración de memoria de vez en cuando. Naturalmente, para aprender la recolección de basura, es mejor que se prepare aprendiendo sobre los componentes internos de V8 en general y lea el blog de Vyacheslav Egorov que trabajó como uno de los ingenieros de V8. Estoy diciendo: “V8”, porque se cubre mejor con artículos en Internet. Para otros motores, muchos enfoques son similares, pero la recolección de basura difiere en muchos aspectos.

Es bueno tener un conocimiento profundo de los motores cuando se necesitan optimizaciones de bajo nivel. Sería prudente planificar eso como el siguiente paso después de que esté familiarizado con el lenguaje.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/blob/main/theory/object-basics/readme.md)
