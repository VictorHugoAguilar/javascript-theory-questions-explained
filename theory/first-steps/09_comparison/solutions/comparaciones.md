## Comparaciones

````js
5 > 4 → true
"apple" > "pineapple" → false
"2" > "12" → true
undefined == null → true
undefined === null → false
null == "\n0\n" → false
null === +"\n0\n" → false
````

Algunas de las razones:

1. Obviamente, `true`.
2. Comparación lexicográfica, por lo tanto `false`. "a" es menor que "p".
3. Una vez más, la comparación lexicográfica, el primer carácter de "2" es mayor que el primer carácter de "1".
4. Los valores `null` y undefined son iguales entre sí solamente.
5. La igualdad estricta es estricta. Diferentes tipos de ambos lados conducen a `false`.
6. Similar a (4), `null` solamente es igual a `undefined`.
7. Igualdad estricta de diferentes tipos.

---
[⬅️ volver](https://github.com/VictorHugoAguilar/javascript-interview-questions-explained/tree/main/theory/first-steps/09_comparison#Revisa-comparaciones)
