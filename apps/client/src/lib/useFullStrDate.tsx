import { getTwoDigitNum, isValidDate, Weekdays } from '@/utils/getDateFormat';

export const useFullStrDate = (
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
