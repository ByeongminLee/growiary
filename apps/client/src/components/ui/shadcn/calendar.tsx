'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, MonthChangeEventHandler } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/shadcn/button';
import { getDate, getMonth } from 'date-fns';
import { getTwoDigitNum, getYMDFromDate, Weekdays } from '@/utils/getDateFormat';
import Image from 'next/image';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  repliedDays?: string[];
  onMonthChange: MonthChangeEventHandler;
};

function Calendar({
  className,
  classNames,
  repliedDays = [],
  showOutsideDays = false,
  onMonthChange,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      onMonthChange={onMonthChange}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'grow space-y-4',
        caption: 'flex justify-center pt-1 relative items-baseline',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-end',
        nav_button: cn(
          // buttonVariants({ variant: 'ghost' }),
          'h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 flex ',
        ),
        nav_button_previous: 'absolute left-1 h-4 w-4',
        nav_button_next: 'absolute right-1 h-4 w-4',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'grow flex justify-center text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'grow flex justify-center h-10 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-0',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'relative leading-[40px] rounded-full border-0 w-10 p-0 h-10 font-normal aria-selected:opacity-100',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'w-10 h-10 text-primary-foreground relative after:content-[""] after:absolute after:block after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:z-[-1] after:rounded-full after:w-7 after:h-7 after:bg-grayscale-300 after:rounded=full hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ ...props }) => {
          const month = getTwoDigitNum(props.displayMonth.getMonth() + 1);

          return (
            <div className="font-p-R18 text-grayscale-800">
              {getMonth(props.displayMonth) + 1}월의 답장
              <div className="relative flex justify-center">
                <Image
                  className="relative"
                  src="/assets/images/green_no_face.png"
                  alt="횟수"
                  width={74}
                  height={76}
                  priority
                />
                <span className="absolute top-[27px] left-0 right-0 transform- text-center font-p-M20 text-primary-900">
                  {repliedDays.filter(date => date.slice(5, 7) === month).length}회
                </span>
              </div>
            </div>
          );
        },
        Head: () => {
          return (
            <thead className="rdp-head">
              <tr className="flex w-full mt-2">
                {Weekdays.map(v => (
                  <th
                    scope="col"
                    key={v}
                    className="grow font-p-M14 text-grayscale-500 text-muted-foreground rounded-md"
                  >
                    {v[0]}
                  </th>
                ))}
              </tr>
            </thead>
          );
        },
        DayContent: ({ ...props }) => {
          return (
            <>
              <div>
                {getDate(props.date).toString()}
                {repliedDays?.includes(getYMDFromDate(props.date)) && (
                  <div className="block absolute top-0 left-[50%] translate-x-[-50%]	w-1.5 h-1.5 rounded-full bg-[#16E25B]"></div>
                )}
              </div>
              {props.activeModifiers.today && (
                <Image
                  width={21}
                  height={9}
                  alt="today"
                  src="/assets/icons/today.svg"
                  className="w-auto h-auto block absolute bottom-0 left-[50%] translate-x-[-50%]"
                  priority
                />
              )}
            </>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
