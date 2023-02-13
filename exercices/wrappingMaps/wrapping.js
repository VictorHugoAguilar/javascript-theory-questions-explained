const wrapping = (gifts) => {
  return gifts
    .map((a) => `*${a}*`)
    .map((i) => {
      const s = ''.padStart(i.length, "*");
      return `${s}\n${i}\n${s}`;
    });
};


module.exports = wrapping;