const toRounds = (number: number) => {
  if (number === 0) return 0;
  return Math.round(number * 100) / 100;
};

export default toRounds;
