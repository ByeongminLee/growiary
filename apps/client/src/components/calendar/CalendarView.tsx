'use client';
import { Calendar } from '@/components/ui/shadcn/calendar';
import { useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSelectDate: SelectSingleEventHandler = (
    day,
    selectedDay,
    activeModifiers,
    e,
  ) => {
    setSelectedDate(selectedDay);
  };
  return (
    <>
      <section>
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelectDate} />
      </section>
    </>
  );
};

export default CalendarView;
