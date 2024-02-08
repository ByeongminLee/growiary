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

export const getYMDFromDate = (date: Date) => {
  const givenDate = new Date(date);
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
  const newDate = new Date(date);
  return `${newDate.getFullYear()}-${getTwoDigitNum(newDate.getMonth() + 1)}-${getTwoDigitNum(newDate.getDate())}`;
};

export const getFullStrDate = (
  givenDate?: string | Date | null,
  sep?: string,
): [string, string, string, string] => {
  if (!givenDate || (typeof givenDate === 'string' && !isValidDate(givenDate))) {
    givenDate = new Date();
  }

  if (typeof givenDate === 'string') {
    const [year, month, date] = givenDate.split(sep || '-').map(v => +v);
    const day = Weekdays[new Date(year, month, date, 0, 0, 0).getDay()];

    return [year.toString(), month.toString(), date.toString(), day];
  }

  const day = Weekdays[givenDate.getDay()];

  return [
    givenDate.getFullYear().toString(),
    getTwoDigitNum(givenDate.getMonth() + 1).toString(),
    getTwoDigitNum(givenDate.getDate()).toString(),
    day,
  ];
};
