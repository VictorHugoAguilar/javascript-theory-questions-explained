const calcula = require('./calculadora.js')

describe('Check function suma de conjuntos', () => {
  test('calcula la multiplicacion', () => {
    expect(calcula(3, 4, "*")).toBe(12)
  })
  test('calcula la division', () => {
    expect(calcula(8, 4, "/")).toBe(2)
  })
  test('calcula suma', () => {
    expect(calcula(3, 4, "+")).toBe(7)
  })
  test('calcula resta', () => {
    expect(calcula(10, 4, "-")).toBe(6)
  })
  test('calcula modulo', () => {
    expect(calcula(7, 4, "%")).toBe(3)
  })
})