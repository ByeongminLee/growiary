export const Weekdays = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];
export const isValidDate = (givenDate: string, sep: string = '-') => {
  const [year, month, date] = givenDate.split(sep).map(v => +v);
  const isValidMonth = month >= 1 && month <= 12;
  if (!isValidMonth) {
    return false;
  }
  return date >= 1 && date <= new Date(year, month - 1, 0, 0, 0, 0).getDate();
};

export const getDateArrToStr = (
  givenDate: string | null,
  sep?: string,
): [number, number, number, string] => {
  if (givenDate && isValidDate(givenDate)) {
    const [year, month, date] = givenDate.split(sep || '-').map(v => +v);
    const day = Weekdays[new Date(year, month, date, 0, 0, 0).getDay()];
    return [year, month, date, day];
  }
  const fullDate = new Date();
  const day = Weekdays[fullDate.getDay()];
  return [fullDate.getFullYear(), fullDate.getMonth() + 1, fullDate.getDate(), day];
};

export const getTwoDigitNum = (num: number) => {
  return num.toString().padStart(2, '0');
};
