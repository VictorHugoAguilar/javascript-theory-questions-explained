const existeSuma = require('./suma_subconjuntos.js')

describe('Check function suma de conjuntos', () => {
    test('check return true', () => {
        expect(existeSuma([3, 4, 2, 8, 7], 6)).toBeTruthy()
    })
    test('check return false', () => {
        expect(existeSuma([3, 4, 2, 8, 7], 26)).toBeFalsy()
    })
    test('check return true', () => {
        expect(existeSuma([4], 4)).toBeTruthy()
    })
})