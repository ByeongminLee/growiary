'use client';
import { Calendar } from '@/components/ui/shadcn/calendar';
import { useEffect, useRef, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { ApiResponse, CollectedRecordType, RecordType } from '@/types';
import { useSession } from 'next-auth/react';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { useFetch } from '@/lib/useFetch';
import {
  getDateFromServer,
  getFirstAndLastDateFromSpecificDate,
  getTwoDigitNum,
  getYMDFromDate,
} from '@/utils/getDateFormat';
import { useRecoilState } from 'recoil';
import { recordState } from '@/store';

const CalendarView = () => {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const requestApi = useFetch();
  const [year, month, date, day] = useFullStrDate(selectedDate);
  const [records, setRecords] = useRecoilState(recordState);
  const [response, setResponse] = useState<RecordType[] | undefined>([]);

  const template = diaryTemplates[response?.[0]?.template || '1'];

  const [isMouseDown, setIsMouseDown] = useState(false);
  const initPosYRef = useRef<number>(0);
  const articleElRef = useRef<HTMLElement | null>(null);
  const initArticleYPosRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsMouseDown(true);
    initPosYRef.current = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isMouseDown) return;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    const movedY = initPosYRef.current - clientY;
    const target = e.currentTarget as HTMLElement;
    // up
    if (movedY > 0) {
      target.style.top = '0px';
    } else {
      if (target === articleElRef.current) {
        target.style.top = initArticleYPosRef.current + 'px';
      } else {
        target.style.top = '70vh';
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsMouseDown(false);
    // initPosRef.current = null;
  };

  const handleSelectDate: SelectSingleEventHandler = (
    day,
    selectedDay,
    activeModifiers,
    e,
  ) => {
    setSelectedDate(selectedDay);
    setResponse(records[getYMDFromDate(selectedDay)]);
  };
  const handleMonthChange = async (month: Date) => {
    const { firstDate, lastDate } = getFirstAndLastDateFromSpecificDate(selectedDate);
    const response = (await requestApi('/post/filter', {
      method: 'POST',
      id: session?.id,
      body: {
        startDate: firstDate,
        endDate: lastDate,
      },
    })) as ApiResponse<RecordType[]>;
    if ('data' in response) {
      const collectedData = response.data.reduce((f: CollectedRecordType, v) => {
        const key = getDateFromServer(v.createAt);
        return {
          ...f,
          [key]: [...(f[key] || []), v],
        };
      }, {} as CollectedRecordType);
      setRecords(collectedData);
      setResponse(collectedData?.[`${year}-${month}-${date}`] || []);
    }
  };

  useEffect(() => {
    if (articleElRef.current) {
      initArticleYPosRef.current =
        articleElRef.current?.previousElementSibling?.getBoundingClientRect().bottom || 0;
      articleElRef.current.style.top = initArticleYPosRef.current + 'px';
      document.documentElement.style.touchAction = 'none';
    }
  }, [session?.id]);

  useEffect(() => {
    (async () => {
      const { firstDate, lastDate } = getFirstAndLastDateFromSpecificDate(selectedDate);
      const response = (await requestApi('/post/filter', {
        method: 'POST',
        id: session?.id,
        body: {
          startDate: firstDate,
          endDate: lastDate,
        },
      })) as ApiResponse<RecordType[]>;
      if ('data' in response) {
        const collectedData = response.data.reduce((f: CollectedRecordType, v) => {
          const key = getDateFromServer(v.createAt);
          return {
            ...f,
            [key]: [...(f[key] || []), v],
          };
        }, {} as CollectedRecordType);

        setRecords(collectedData);

        setResponse(collectedData?.[`${year}-${month}-${date}`] || []);
      }
    })();
  }, [session?.id]);

  return (
    <div>
      <section>
        {session?.id && (
          <Calendar
            mode="single"
            repliedDays={Object.keys(records).filter(
              date =>
                date.slice(5, 7) ===
                getTwoDigitNum(new Date(selectedDate).getMonth() + 1),
            )}
            selected={selectedDate}
            onSelect={handleSelectDate}
            onMonthChange={handleMonthChange}
          />
        )}
      </section>
      <article
        ref={articleElRef}
        className="absolute inset-x-0 transition-[top] ease-in-out duration-1000"
        style={{
          marginTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          backgroundColor: `${template.bgColor}`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchCancel={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        {response?.[0]?.content && (
          <section className="p-4 h-[70vh]">
            <p className="pt-6 font-p-R16 text-primary-500 mb-1">
              {year}년 {month}월 {date}일 {day}
            </p>
            <div>
              <DiaryContent template={template} response={response[0]} />
            </div>
          </section>
        )}
        {response?.[0]?.answer && (
          <section
            className="absolute w-full top-[70vh] transition-[top] ease-in-out duration-1000 p-8 h-screen border-t border-t-primary-500 p-3"
            style={{
              marginBottom: 'env(safe-area-inset-bottom)',
              backgroundColor: `${template.bgColor}`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchCancel={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <DiaryReply template={template} response={response[0]} />
          </section>
        )}
      </article>
    </div>
  );
};

export default CalendarView;
