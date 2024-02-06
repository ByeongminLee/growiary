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
    const { top, bottom, height } = target.getBoundingClientRect();
    const next = target.nextElementSibling as HTMLElement;
    // up
    if (movedY > 0) {
      if (top > 0 && top < window.innerHeight) {
        target.style.top = '0px';
        target.style.overflow = 'scroll';
        if (next) {
          (next as HTMLElement).style.top = height + 'px';
        }
        return;
      }

      const end = target.scrollHeight - target.clientHeight === target.scrollTop;
      if (target.getBoundingClientRect().bottom <= window.innerHeight && next && end) {
        (next as HTMLElement).style.top = '0px';
        (next as HTMLElement).style.overflow = 'scroll';
        target.scrollTo(0, 0);
      }
      // down
    } else {
      const prev = target.previousElementSibling;
      if (target.scrollTop === 0 && prev) {
        (prev as HTMLElement).style.top = '0px';
        (prev as HTMLElement).style.overflow = 'scroll';
        target.style.overflow = 'hidden';
        if (prev.clientHeight < window.innerHeight) {
          target.style.top = prev.clientHeight + 'px';
        } else {
          target.style.top = '100vh';
        }
        target.scrollTo(0, 0);
        return;
      }
      if (target.scrollTop === 0) {
        target.style.top = '70vh';
        target.style.overflow = 'hidden';
        if (next) {
          next.style.top = '100vh';
          next.style.overflow = 'hidden';
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsMouseDown(false);
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
        style={{
          marginTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          // backgroundColor: `${template.bgColor}`,
        }}
      >
        {response?.[0]?.content && (
          <div
            className="absolute top-[70vh] h-[70vh] inset-x-0 transition-[top] ease-in-out duration-1000"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchCancel={handleMouseUp}
            onTouchEnd={handleMouseUp}
            style={{
              marginBottom: 'env(safe-area-inset-bottom)',
              backgroundColor: `${template.bgColor}`,
            }}
          >
            <p className="mx-9 mt-16 font-p-R16 text-primary-500 mb-1">
              {year}년 {month}월 {date}일 {day}
            </p>
            <DiaryContent template={template} response={response[0]} />
          </div>
        )}
        {response?.[0]?.answer && (
          <div
            className="absolute w-full h-[100%] top-[100vh] transition-[top] ease-in-out duration-1000 border-t border-t-primary-500"
            style={{
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
            <DiaryReply response={response[0]} />
          </div>
        )}
      </article>
    </div>
  );
};

export default CalendarView;
