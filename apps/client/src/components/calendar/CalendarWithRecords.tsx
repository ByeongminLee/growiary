import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import {
  getFirstAndLastDateFromSpecificDate,
  getTwoDigitNum,
  getYMDFromDate,
} from '@/utils/getDateFormat';
import { useGetRecords } from '@/lib/useGetRecords';
import { SelectSingleEventHandler } from 'react-day-picker';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/shadcn/calendar';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

type CalendarWithRecordsProps = {
  initSelectDate?: Date;
  setResponse?: (data: RecordType[]) => void;
  addedCaptionLabel?: string;
  onChangeSelectDate: (date: Date) => void;
  showOverDate?: boolean;
};

const CalendarWithRecords = ({
  initSelectDate,
  setResponse,
  addedCaptionLabel,
  onChangeSelectDate,
  showOverDate = true,
}: CalendarWithRecordsProps) => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const [records, setRecords] = useState<CollectedRecordType>({});
  const [selectedDate, setSelectedDate] = useState<Date>(initSelectDate || new Date());

  const onSuccessGetRecords = (
    result: ApiSuccess<RecordType[]>,
    storedObj?: CollectedRecordType,
  ) => {
    if (storedObj) {
      setRecords(storedObj);
      setResponse && setResponse(storedObj[getYMDFromDate(selectedDate)]);
    }
  };

  const { mutation } = useGetRecords({
    onSuccessCb: onSuccessGetRecords,
  });

  const handleSelectDate: SelectSingleEventHandler = (day, selectedDay) => {
    const selectedDate = getYMDFromDate(selectedDay);

    setSelectedDate(selectedDay);
    onChangeSelectDate(selectedDay);
    setResponse && setResponse(records[selectedDate]);
  };

  const handleMonthChange = async (month: Date) => {
    // if (!showOverDate && month > today) return;

    const { firstDate, lastDate } = getFirstAndLastDateFromSpecificDate(month);

    setSelectedDate(
      new Date(month.getFullYear(), month.getMonth(), selectedDate.getDate(), 0, 0, 0),
    );
    await mutation.mutateAsync({
      body: { startDate: firstDate, endDate: lastDate },
    });
  };

  useEffect(
    function getInitRecords() {
      if (!session?.id) return;

      let paramDate;
      const { firstDate: startDate, lastDate: endDate } =
        getFirstAndLastDateFromSpecificDate(paramDate || selectedDate);

      if (params.has('date')) {
        const [year, month, date] = params.get('date')!.split('-');
        paramDate = new Date(+year, +month - 1, +date, 0, 0, 0);
        setSelectedDate(paramDate);
      }

      (async () => {
        await mutation.mutateAsync({
          body: { startDate, endDate },
        });
      })();
    },
    [session?.id],
  );

  return (
    <Calendar
      mode="single"
      repliedDays={Object.keys(records).filter(
        date =>
          date.slice(5, 7) === getTwoDigitNum(new Date(selectedDate).getMonth() + 1),
      )}
      defaultMonth={selectedDate}
      selected={selectedDate}
      onSelect={handleSelectDate}
      onMonthChange={handleMonthChange}
      addedCaptionLabel={addedCaptionLabel}
      showOverDate={showOverDate}
      disabled={date => (showOverDate ? false : date > new Date())}
    />
  );
};

export default CalendarWithRecords;
