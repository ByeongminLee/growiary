export default function convertUTCtoKST(utcDateTimeString: string | Date) {
  let utcDate = new Date(utcDateTimeString);
  let koreaTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  return koreaTime.toISOString().replace(/Z$/, '');
}
