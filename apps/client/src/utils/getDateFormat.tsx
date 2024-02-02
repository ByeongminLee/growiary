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

export const getYMDFromDate = (givenDate: Date) => {
  return `${givenDate.getFullYear()}-${getTwoDigitNum(givenDate.getMonth() + 1)}-${getTwoDigitNum(givenDate.getDate())}`;
};

export const getTwoDigitNum = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const getFirstAndLastDateFromSpecificDate = (selected: Date) => {
  const year = selected.getFullYear();
  const month = selected.getMonth() + 1;
  const lastDate = new Date(year, month, 0, 0, 0, 0).getDate();
  return {
    firstDate: `${year}-${getTwoDigitNum(month)}-01`,
    lastDate: `${year}-${getTwoDigitNum(month)}-${lastDate}`,
  };
};

export const getDateFromServer = (date: string) => {
  return date.slice(0, 10);
};