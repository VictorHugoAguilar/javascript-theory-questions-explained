const getNumerOfItertions = require('./constantOfKaprekar');

describe('Check function obtain iteration of constant of kaprekar (6174)', () => {

    test('check if number containt more of fourth digit', () => {
        expect(() => getNumerOfItertions(123123)).toThrow();
    })

    test('check if number not zero', () => {
        expect(() => getNumerOfItertions(0)).toThrow();
    })

    test('check number 1111 itinerations 0', () => {
        expect(getNumerOfItertions(1111)).toBe(0);
    })

    test('check number 9999 itinerations 0', () => {
        expect(getNumerOfItertions(9999)).toBe(0);
    })

    test('check number 5 itinerations 6', () => {
        expect(getNumerOfItertions(5)).toBe(6);
    })

    test('check number 3524 itinerations 3', () => {
        expect(getNumerOfItertions(3524)).toBe(3);
    })

    test('check number 1111 itinerations 0', () => {
        expect(getNumerOfItertions(1111)).toBe(0);
    })

    test('check number 1121 itinerations 5', () => {
        expect(getNumerOfItertions(1121)).toBe(5);
    })
    test('check number 6174 itinerations 0', () => {
        expect(getNumerOfItertions(6174)).toBe(0);
    })

    test('check number 1893 itinerations 7', () => {
        expect(getNumerOfItertions(1893)).toBe(7);
    })

});