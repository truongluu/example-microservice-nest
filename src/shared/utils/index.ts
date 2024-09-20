export function getAlphabet(type: 'upper' | 'lower'): string[] {
  const alpha =
    type === 'upper'
      ? Array.from(Array(26)).map((e, i) => i + 65)
      : Array.from(Array(26)).map((e, i) => i);
  return alpha.map((x) => String.fromCharCode(x));
}

export function genUserCode(alphaLength = 5, numberLength = 5) {
  const alphaArr = getAlphabet('upper');
  const numberArr = [...Array(10).keys()];
  const alphaSort = alphaArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
  const numberSort = numberArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
  return `${alphaSort.slice(0, alphaLength).join('')}${numberSort
    .slice(0, numberLength)
    .join('')}`;
}

export function genPhoneNumber() {
  const prefixRandom = [
    '032',
    '033',
    '034',
    '035',
    '036',
    '037',
    '038',
    '039',
    '070',
    '079',
    '077',
    '076',
    '078',
    '083',
    '084',
    '085',
    '081',
    '082',
    '056',
    '058',
    '059',
  ].sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
  const sevenNumberFollow = Array.from({ length: 10 })
    .map((_v, index) => index)
    .sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
    .splice(0, 7)
    .join('');

  return `${prefixRandom.splice(0, 1)}${sevenNumberFollow}`;
}
