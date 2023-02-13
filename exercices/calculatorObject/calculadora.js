const calcula = (a, b, operador) => {
  if ((operador === '/') && (a === 0 && b > 0)) return 0;
  const calculate = {
    "+": a + b,
    "-": a - b,
    "*": a * b,
    "/": a / b,
    "%": a % b
  } [operador];
  return calculate || 0;
}

module.exports = calcula;