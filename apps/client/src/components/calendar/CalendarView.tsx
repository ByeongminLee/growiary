'use client';

import { useEffect, useRef, useState } from 'react';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { RecordType } from '@/types';
import { useSession } from 'next-auth/react';
import { getFullStrDate, getYMDFromDate } from '@/utils/getDateFormat';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import CalendarWithRecords from '@/components/calendar/CalendarWithRecords';

const CalendarView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [response, setResponse] = useState<RecordType[] | undefined>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moveState, setMoveState] = useState<'UP' | 'DOWN' | 'NONE'>('NONE');
  const initPosYRef = useRef<number>(0);
  const articleElRef = useRef<HTMLElement | null>(null);
  const initArticleYPosRef = useRef<number>(0);
  const [year, month, date, day] = getFullStrDate(selectedDate);

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

    if (movedY > 0) {
      setMoveState('UP');

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
    } else {
      setMoveState('DOWN');

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

    if (top > 0 && top < window.innerHeight) {
      setMoveState('UP');

      target.style.top = '0px';
      target.style.overflow = 'scroll';

      if (next) {
        (next as HTMLElement).style.top = height + 'px';
      }
      return;
    }
    if (top === 0) {
      setMoveState('DOWN');

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

  const handleClickRecord = (e: React.MouseEvent, res: RecordType) => {
    e.stopPropagation();

    if (moveState === 'UP') {
      router.push(`/calendar/${year}-${month}-${date}/${res.postId}`);
    }
  };

  const onChangeSelectDate = (selectedDay: Date) => {
    const searchParams = new URLSearchParams();
    const selectedDate = getYMDFromDate(selectedDay);

    searchParams.set('date', selectedDate);

    if (selectedDate === params.get('date')) return;

    history.replaceState(null, '', '/calendar?' + searchParams.toString());
  };

  useEffect(
    function setInitRecordsPosY() {
      if (articleElRef.current) {
        initArticleYPosRef.current =
          articleElRef.current.previousElementSibling?.getBoundingClientRect().bottom ||
          0;
        articleElRef.current.style.top = initArticleYPosRef.current + 'px';
        document.documentElement.style.touchAction = 'none';

        if (params.has('date')) {
          const [year, month, date] = params.get('date')!.split('-');
          setSelectedDate(new Date(+year, +month - 1, +date, 0, 0, 0));
        }
      }
    },
    [session?.id, params],
  );

  return (
    <div>
      <section className="mx-2">
        <CalendarWithRecords
          setResponse={setResponse}
          addedCaptionLabel="의 답장"
          onChangeSelectDate={onChangeSelectDate}
        />
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
              paddingTop: moveState === 'DOWN' ? 0 : '32px',
              top: 'inherit',
            }}
          >
            <ChevronLeft
              className="mx-4 p-4 h-12 w-12 bg-grayscale-100 cursor-pointer transition-[opacity] ease-in-out duration-1000"
              onClick={handleContentClick}
              style={{
                visibility: moveState === 'UP' ? 'visible' : 'hidden',
                opacity: moveState === 'UP' ? 1 : 0,
              }}
            />
            <p className="pb-4 px-6 font-p-R16 text-grayscale-600">
              {parseInt(date, 10)}일 {day}
            </p>
            {response.map(res => (
              <div
                key={res.postId}
                className="py-4 px-6 font-p-M16"
                style={{
                  backgroundColor: diaryTemplates[res.template].bgColor,
                  color: diaryTemplates[res.template].questionColor,
                }}
              >
                <div className="flex items-center">
                  <p
                    className={
                      moveState === 'UP'
                        ? 'cursor-pointer pointer-events-auto'
                        : 'pointer-events-none'
                    }
                    onClick={e => handleClickRecord(e, res)}
                  >
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
    </div>
  );
};

export default CalendarView;
