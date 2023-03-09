# Overview

# Introducción

La composición es una estrategia para gestionar la complejidad y organizar el código en piezas reutilizables. Lit proporciona algunas opciones para la composición y la reutilización de código:

- Composición de componentes.
- Controladores reactivos.
- Mezclas de clase.

La **composición de componentes** es el proceso de ensamblar componentes complejos a partir de componentes más simples. Un componente puede utilizar subcomponentes en su plantilla. Los componentes pueden usar mecanismos DOM estándar para comunicarse: establecer propiedades en subcomponentes y escuchar eventos de subcomponentes.

Aunque la composición de componentes es la forma predeterminada de pensar en dividir un proyecto Lit complejo en unidades más pequeñas, hay otros dos patrones de código notables útiles para factorizar su código Lit:

**Los controladores reactivos** son objetos que pueden conectarse al ciclo de vida de actualización de un componente Lit, encapsulando el estado y el comportamiento relacionado con una característica en una unidad de código separada.

**Las mezclas de clase** le permiten escribir definiciones de componentes parciales reutilizables y "mezclarlas" en la cadena de herencia de un componente.

Tanto los controladores mixtos como los reactivos le permiten factorizar la lógica de los componentes relacionada con una característica determinada en una unidad reutilizable. Consulte la siguiente sección para ver una comparación de controladores y mixins.

# Controllers and mixins

Los controladores y los mixins de clase son muy similares en algunos aspectos. Ambos pueden conectarse al ciclo de vida de un componente de host, mantener el estado y desencadenar actualizaciones de host.

La principal diferencia entre los controladores y los mixins es su relación con el componente. Un componente tiene una relación "tiene un" con un controlador reactivo, ya que posee el controlador. Un componente tiene una relación "es-a" con un mixin, ya que el componente es una instancia de la clase mixin.

Un **controlador reactivo** es un objeto separado propiedad de un componente. El controlador puede acceder a métodos y campos en el componente, y el componente puede acceder a métodos y campos en el controlador. Pero alguien que use el componente no puede (fácilmente) acceder al controlador, a menos que el componente le exponga una API pública. Los métodos de ciclo de vida del controlador se llaman antes que el método de ciclo de vida correspondiente en el componente.

Un **mixin**, por otro lado, se convierte en parte de la cadena de prototipos del componente. Cualquier campo o método público definido por el mixin es parte de la API del componente. Y debido a que un mixin es parte de la cadena de prototipos, su componente tiene cierto control de cuándo se llaman las devoluciones de llamada del ciclo de vida del mixin.

En general, si está tratando de decidir si empaquetar una característica como un controlador o una mezcla, debe elegir un controlador a menos que la característica requiera uno de los siguientes:

- Agregar API pública al componente.
- Acceso muy granular al ciclo de vida del componente.


---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-theory-questions-explained/blob/main/theory-lit-element/readme.md#lit-element-v2)
