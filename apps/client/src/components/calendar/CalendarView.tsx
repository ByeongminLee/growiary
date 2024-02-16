'use client';
import { Calendar } from '@/components/ui/shadcn/calendar';
import React, { useEffect, useRef, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { CollectedRecordType, RecordType } from '@/types';
import { useSession } from 'next-auth/react';
import {
  getDateFromServer,
  getFirstAndLastDateFromSpecificDate,
  getFullStrDate,
  getTwoDigitNum,
  getYMDFromDate,
} from '@/utils/getDateFormat';
import { useRecoilState } from 'recoil';
import { initExperienceState, recordState, recordWriteState } from '@/store';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { getRecords } from '@/utils/requestRecord';
import { useSearchParams } from 'next/navigation';
import DiaryRecord from '@/components/calendar/DiaryRecord';
import OneTimeToast from '@/components/ui/OneTimeToast';
import Image from 'next/image';

const CalendarView = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRecord, setSelectedRecord] = useState<RecordType>();
  const [response, setResponse] = useState<RecordType[] | undefined>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [records, setRecords] = useRecoilState(recordState);
  const [writeState, setWriteState] = useRecoilState(recordWriteState);
  const [initExperience, setInitExperience] = useRecoilState(initExperienceState);
  const initPosYRef = useRef<number>(0);
  const articleElRef = useRef<HTMLElement | null>(null);
  const initArticleYPosRef = useRef<number>(0);
  const [year, month, date, day] = getFullStrDate(selectedDate);
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationKey: ['records'],
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { startDate: string; endDate: string };
    }) =>
      getRecords({
        id,
        body,
      }),
    onSuccess: result => {
      queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
        const collectedData = [...(result.data || [])].reduce(
          (f: CollectedRecordType, v: RecordType) => {
            const key = getDateFromServer(v.createAt);
            return {
              ...f,
              [key]: [...(f[key] || []), v],
            };
          },
          {} as CollectedRecordType,
        );
        setRecords(collectedData);
        setResponse(collectedData?.[`${year}-${month}-${date}`] || []);

        const searchParams = new URLSearchParams(params.toString());

        if (searchParams.has('id')) {
          setSelectedRecord(
            collectedData[`${year}-${month}-${date}`].find(
              v => v.postId === searchParams.get('id'),
            ),
          );
        }

        // 답변도착
        // if (searchParams.get('replied') === 'true') {
        //   (articleElRef.current?.firstElementChild as HTMLDivElement)?.click();
        // }
        return {
          ...old,
          ...collectedData,
        };
      });
    },
  });

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
    const { top, height } = target.getBoundingClientRect();
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
        target.style.top = initArticleYPosRef.current + 'px';
        target.style.overflow = 'hidden';
        if (next) {
          next.style.top = '100vh';
          next.style.overflow = 'hidden';
        }
      }
    }
  };

  const handleContentClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    const { height } = target.getBoundingClientRect();
    const top = isNaN(parseInt(target.style.top, 10))
      ? initArticleYPosRef.current
      : parseInt(target.style.top, 10);
    const prev = target.previousElementSibling;
    const next = target.nextElementSibling as HTMLElement;
    // up
    if (top > 0 && top < window.innerHeight) {
      target.style.top = '0px';
      target.style.overflow = 'scroll';
      if (next) {
        (next as HTMLElement).style.top = height + 'px';
      }
      return;
    }
    // down
    if (top === 0) {
      target.style.top = prev ? '70vh' : initArticleYPosRef.current + 'px';
      target.style.overflow = 'hidden';
      if (next) {
        next.style.top = '100vh';
        next.style.overflow = 'hidden';
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsMouseDown(false);
  };

  const handleSelectDate: SelectSingleEventHandler = (day, selectedDay) => {
    setSelectedDate(selectedDay);
    setResponse(records[getYMDFromDate(selectedDay)]);
  };
  const handleMonthChange = async (month: Date) => {
    const { firstDate, lastDate } = getFirstAndLastDateFromSpecificDate(month);
    await mutation.mutateAsync({
      id: session!.id,
      body: { startDate: firstDate, endDate: lastDate },
    });
  };

  const handleClickRecord = (e: React.MouseEvent, res: RecordType) => {
    e.stopPropagation();
    setSelectedRecord(res);
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
    if (!session?.id) return;
    const { firstDate, lastDate } = getFirstAndLastDateFromSpecificDate(selectedDate);
    (async () => {
      await mutation.mutateAsync({
        id: session.id,
        body: { startDate: firstDate, endDate: lastDate },
      });
    })();
  }, [session?.id]);

  useEffect(() => {
    let initExperienceTimeoutId: NodeJS.Timeout;
    let writeStateTimeoutId: NodeJS.Timeout;

    if (initExperience.initSubmit) {
      initExperienceTimeoutId = setTimeout(() => {
        setInitExperience(prev => ({ ...prev, initSubmit: false }));
      }, 3000);
    }

    if (writeState.state === 'SAVE') {
      writeStateTimeoutId = setTimeout(() => {
        setWriteState(prev => ({ ...prev, state: 'NONE' }));
      }, 3000);
    }
    return () => {
      initExperienceTimeoutId && clearTimeout(initExperienceTimeoutId);
      writeStateTimeoutId && clearTimeout(writeStateTimeoutId);
    };
  }, [writeState.state, setWriteState, initExperience.initSubmit, setInitExperience]);

  return (
    <div>
      <section className="mx-2">
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
      <article ref={articleElRef}>
        {response && response.length > 1 && (
          <div
            className="absolute h-full inset-x-0 transition-[top] ease-in-out duration-1000 bg-grayscale-100"
            onClick={handleContentClick}
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
              marginTop: 'env(safe-area-inset-top)',
              paddingTop: '32px',
              top: 'inherit',
            }}
          >
            <p className="pb-4 px-6 font-p-R16 text-grayscale-600">
              {parseInt(date, 10)}일 {day}
            </p>
            {records[`${year}-${month}-${date}`].map(res => (
              <div
                key={res.postId}
                className="py-4 px-6 font-p-M16"
                style={{
                  backgroundColor: diaryTemplates[res.template].bgColor,
                  color: diaryTemplates[res.template].questionColor,
                }}
              >
                <div className="flex items-center">
                  <p className="cursor-pointer" onClick={e => handleClickRecord(e, res)}>
                    {diaryTemplates[res.template].question}
                  </p>
                  {res.answer && (
                    <Image
                      src="/assets/growmi/bubble.png"
                      alt="growmi"
                      className="ml-1 h-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {response?.length === 1 && response[0].content && (
          <div
            className="absolute h-[70vh] inset-x-0 transition-[top] ease-in-out duration-1000"
            onClick={handleContentClick}
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
              marginTop: 'env(safe-area-inset-top)',
              paddingTop: '32px',
              backgroundColor: `${diaryTemplates[response[0].template].bgColor}`,
              top: 'inherit',
            }}
          >
            <DiaryContent response={response[0]} />
          </div>
        )}
        {response?.length === 1 && response?.[0]?.answer && (
          <div
            className="absolute w-full h-[100%] top-[100vh] transition-[top] ease-in-out duration-1000"
            style={{
              backgroundColor: `${diaryTemplates[response[0].template].bgColor}`,
              marginTop: 'env(safe-area-inset-top)',
            }}
            onClick={handleContentClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchCancel={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <div className="border-t border-t-primary-500"></div>
            <DiaryReply response={response[0]} />
          </div>
        )}
      </article>
      {selectedRecord && (
        <div className="absolute h-full inset-x-0 inset-y-0 bg-grayscale-800">
          <DiaryRecord
            todayReply={selectedRecord}
            onClose={() => setSelectedRecord(undefined)}
          />
        </div>
      )}
      {selectedRecord && writeState.state === 'SAVE' && (
        <OneTimeToast>
          <div className="flex flex-col items-center justify-center">
            {selectedRecord.answer && initExperience.initSubmit ? (
              <p>
                그루미와의 첫 대화 축하드려요
                <br />
                그루어리와 함께 매일 성장해요!
              </p>
            ) : (
              <p>일기가 저장되었어요</p>
            )}
          </div>
        </OneTimeToast>
      )}
    </div>
  );
};

export default CalendarView;
