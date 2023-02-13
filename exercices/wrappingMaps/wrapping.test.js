const wrapping = require('./wrapping');



describe('Check function', () => {

  it('check if type is arrays', () => {
    const w = wrapping(['a', 'b']);
    expect(Array.isArray(w)).toBeTruthy();
  })

  it('check if is not null result', () => {
    expect(wrapping(['cat', 'game', 'stocks'])).not.toBeNull();
  })

  it('check result correct 3 element', () => {
    const array_expect = [
      '*****\n*cat*\n*****',
      '******\n*game*\n******',
      '********\n*stocks*\n********'
    ];
    expect(wrapping(['cat', 'game', 'stocks'])).toMatchObject(array_expect);
  })

  it('check result correct one element', () => {
    const array_expect = [
      '********\n*victor*\n********',
    ];
    expect(wrapping(['victor'])).toMatchObject(array_expect);
  })

  it('check result correct one element, one character', () => {
    const array_expect = [
      '***\n*a*\n***',
    ];
    expect(wrapping(['a'])).toMatchObject(array_expect);
  })

  it('check result [] empty', () => {
    const array_expect = [];
    expect(wrapping([])).toMatchObject(array_expect);
  })

});