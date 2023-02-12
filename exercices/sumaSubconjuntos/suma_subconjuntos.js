// En este reto partimos de un conjunto de enteros positivos (le llamaremos lista) y un entero (le llamaremos suma).
// Se trata de encontar esi existe algún subconjunto de lista suyos componentes sumen el valor de suma
// La idea es resolverlo mediante una función recursiva. Echa un vistazo a la solución dinámica si necesitas orientarte.

//Ejemplos de la función:

//existeSuma([3,4,2,8,7], 6)   -> true

//existeSuma([3,4,2,8,7], 26)   -> false

//existeSuma([4],  4)   -> true

const existeSuma = (arr, item) => {
	if(arr.includes(item)) return true;
	let exist;
	arr.forEach( (i, index) => {
		arr.forEach( (j, jindex) => {
			if( (index !== jindex) && ( i + j === item )){
				exist = true;
				return;
			}
		})
		if(exist) {
			return;
		}
	})
	return !!exist;
}

module.exports = existeSuma;