'use client';
import { Calendar } from '@/components/ui/shadcn/calendar';
import { useLayoutEffect, useRef, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { getTwoDigitNum } from '@/utils/getDateFormat';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [date, setDate] = useState<[number, number, number, string] | null>(null);
  const [response, setResponse] = useState({
    date: '2024-01-24',
    temId: 4,
    content:
      '오늘은 머티리얼 디자인 시스템을 공부했다. \n' +
      '\n' +
      '가장 기본이 되는 디자인 시스템인 만큼 많은 인사이트를 얻을 수 있었고 더 많은 디자인 케이스에 대해 공부할 수 있었다\n' +
      '\n' +
      '가장 기본이 되는 디자인 시스템인 만큼 많은 인사이트를 얻을 수 있었고 더 많은 디자인 케이스에 대해 공부할 수 있었다',
    reply:
      '멋진 일기네! 머티리얼 디자인 시스템을 \n' +
      '공부하면서 많은 인사이트를 얻었다니 \n' +
      '대단해. 계속해서 디자인 케이스에 대해 \n' +
      '공부하는 것은 좋은 방법이야. 이렇게 기본적으로 중요한 개념들을 잘 익혀두면 다른 프로젝트에서도 유용하게 활용할 수 있을 거야. 공부하는 것은 좋은 방법이야.\n' +
      '이렇게 기본적으로 중요한 개념들을 잘 익혀두면 다른 프로젝트에서도 유용하게 활용할 수 있을 거야.\n' +
      '지금처럼 열심히 학습하고 발전하는 자세를 유지해줘.',
  });
  const template = diaryTemplates[response.temId];
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
  };

  useLayoutEffect(() => {
    if (articleElRef.current) {
      initArticleYPosRef.current = articleElRef.current.getBoundingClientRect().top;
      articleElRef.current.style.top = initArticleYPosRef.current + 'px';
      document.documentElement.style.touchAction = 'none';
    }
    // return () => {
    // articleElRef.current = null;
    // };
  }, [articleElRef.current]);

  return (
    <div
      className="h-screen relative"
      style={{
        marginTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height:
          'calc(100vh - 80px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        overflow: 'hidden',
      }}
    >
      <section>
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelectDate} />
      </section>
      <article
        ref={articleElRef}
        className="absolute transition-[top] ease-in-out duration-1000"
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
        <section className="p-4 h-[70vh]">
          <p className="pt-6 font-p-R16 text-primary-500 mb-1">
            {date?.[0]}년 {date && getTwoDigitNum(date?.[1])}월{' '}
            {date && getTwoDigitNum(date?.[2])}일 {date?.[3]}
          </p>
          <div>
            <DiaryContent template={template} response={response} />
          </div>
        </section>
        <section
          className="absolute top-[70vh] transition-[top] ease-in-out duration-1000 p-8 h-screen border-t border-t-primary-500 p-3"
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
          <DiaryReply template={template} response={response} />
        </section>
      </article>
    </div>
  );
};

export default CalendarView;
