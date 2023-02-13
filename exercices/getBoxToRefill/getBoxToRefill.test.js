const getBoxToRefill = require('./getBoxToRefill');

describe('Check function', () => {
  const a1 = ['bici', 'coche', 'bici', 'bici']
  const a2 = ['coche', 'bici', 'muñeca', 'coche']
  const a3 = ['bici', 'pc', 'pc']

  it('check if type is arrays', () => {
    const result = getBoxToRefill(a1, a2, a3);
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('check any result', () => {
    expect(getBoxToRefill(a1, a2, a3)).toMatchObject([
      "muñeca",
      "pc"
    ])
  })

  it('check result empty', () => {
    expect(getBoxToRefill([], [], [])).toMatchObject([])
  })

  it('check empty result when send equals box', () => {
    expect(getBoxToRefill(['a', 'a'], ['a', 'a'], ['a', 'a'])).toMatchObject([])
  })

  it('check empty result when send diferent box', () => {
    expect(getBoxToRefill(['a', 'a'], ['b', 'b'], ['c', 'c'])).toMatchObject([
      'a', 'b', 'c'
    ])
  })

  it('check empty result when send all diferent box', () => {
    expect(getBoxToRefill(['a', 'b'], ['c', 'd'], ['e', 'f'])).toMatchObject([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f"
    ])
  })

});