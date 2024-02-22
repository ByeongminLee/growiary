'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '@/components/ui/carousel/carousel.css';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import Toast from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { initExperienceState, recordState, recordWriteState } from '@/store';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';
import OneTimeToast from '@/components/ui/OneTimeToast';
import {
  getFirstAndLastDateFromSpecificDate,
  getFullStrDate,
  getYMDFromDate,
  setTimeZero,
} from '@/utils/getDateFormat';
import LottieAnimation from '@/components/ui/LottieAnimation';
import airplane from '@/../public/assets/airplane.json';
import { useCreateRecord } from '@/lib/useCreateRecord';
import { useGetRecords } from '@/lib/useGetRecords';
import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import CalendarWithRecords from '@/components/calendar/CalendarWithRecords';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

const bottomArea = 80;

const MainView = () => {
  const { data: session } = useSession();
  const templateRef = useRef('0');
  const toastRef = useRef<HTMLDivElement>(null);
  const replyPopupRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLButtonElement | null>(null);
  const calendarCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const records = useRecoilValue(recordState);
  const [writeState, setWriteState] = useRecoilState(recordWriteState);
  const [initExperience, setInitExperience] = useRecoilState(initExperienceState);
  const [toastContent, setToastContent] = useState('');
  const [scrollHeight, setScrollHeight] = useState('100%');
  const [repliedCount, setRepliedCount] = useState(-1);
  const [checkInitUser, setCheckInitUser] = useState(false);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [year, month, date] = getFullStrDate(selectedDate);
  const refsArray = useRef<{ [id: string]: HTMLTextAreaElement }>({});
  const { mutation: createRecordMutation } = useCreateRecord();
  const selectedTime = setTimeZero(selectedDate).getTime();
  const todayTime = setTimeZero(today).getTime();

  const onSuccessGetRecordsMutation = (
    result: ApiSuccess<RecordType[]>,
    storedObj?: CollectedRecordType,
  ) => {
    const repliedCount =
      storedObj?.[`${year}-${month}-${date}`]?.findIndex(
        record => record.answer && record.answer.length > 0,
      ) ?? -1;
    setRepliedCount(repliedCount + 1);
  };

  const { mutation: getRecordsMutation } = useGetRecords({
    onSuccessCb: onSuccessGetRecordsMutation,
  });

  const assignRef = (index: string) => (element: HTMLTextAreaElement) => {
    refsArray.current[index] = element;
  };

  const showToast = (content: string) => {
    if (!toastRef.current) return;

    const target = toastRef.current;

    target.style.display = 'block';
    setToastContent(content);

    const timeoutId = setTimeout(() => {
      target.style.display = 'none';
      clearTimeout(timeoutId);
    }, 3000);
  };

  const handleChangeContent = (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLTextAreaElement).value;

    if (value.length === 1000) {
      showToast(
        repliedCount > 0
          ? '아쉽지만 1000자 이하의 메시지만 작성할 수 있어요'
          : '아쉽지만 1000자 이하의 메시지만 그루미에게 전달할 수 있어요',
      );
    }

    setWriteState(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleFocusInput = (id: string) => {
    templateRef.current = id;
  };

  const handleBlurInput = () => {
    setScrollHeight('100%');
  };

  const handleSubmit = async (to?: 'AI') => {
    if (writeState.content.length < 10) {
      showToast(
        to
          ? '답장을 받기 위해서는 10자 이상의 메시지가 필요해요'
          : '10자 이상의 메시지만 작성할 수 있어요',
      );
      return;
    }

    if (to) {
      replyPopupRef.current?.click();
      setWriteState(prev => ({ ...prev, content: '', state: 'WAIT' }));
    }

    await createRecordMutation.mutateAsync({
      to,
      body: {
        content: writeState.content,
        template: templateRef.current.toString(),
        date: selectedDate,
      },
    });
  };

  const onChangeSelectDate = (selectedDay: Date) => {
    const repliedCount =
      records[getYMDFromDate(selectedDay)]?.findIndex(
        record => record.answer && record.answer.length > 0,
      ) ?? -1;

    setSelectedDate(selectedDay);
    setRepliedCount(repliedCount + 1);
    calendarCloseBtnRef.current?.click();
  };

  const onClickPrevDate = () => {
    onChangeSelectDate(new Date(+year, +month - 1, +date - 1, 0, 0, 0));
  };

  const onClickNextDate = () => {
    const nextDate = new Date(+year, +month - 1, +date + 1, 0, 0, 0);
    nextDate <= today && onChangeSelectDate(nextDate);
  };
  const onClickToday = () => {
    onChangeSelectDate(today);
  };

  useEffect(
    function checkIsInitUser() {
      setCheckInitUser(initExperience.initUser);

      if (!initExperience.initUser) return;

      const timeoutId = setTimeout(() => {
        setInitExperience(prev => ({
          ...prev,
          initUser: false,
        }));
        setCheckInitUser(false);
      }, 4000);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [initExperience.initUser, setInitExperience, setCheckInitUser],
  );

  useEffect(function setTextareaHeight() {
    const refHeight = refsArray.current[templateRef.current].clientHeight;
    const totalBottomArea =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-margin'),
        10,
      ) + bottomArea;
    const handleScroll = () => {
      const sub =
        window.visualViewport &&
        document.documentElement.clientHeight -
          window.visualViewport.height -
          totalBottomArea;
      sub && setScrollHeight(refHeight - Math.abs(sub) + 'px');
      window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', handleScroll);
  }, []);

  useEffect(
    function getRecords() {
      if (!session?.id) return;
      const { firstDate: startDate, lastDate: endDate } =
        getFirstAndLastDateFromSpecificDate(selectedDate);

      (async () => {
        await getRecordsMutation.mutateAsync({
          body: {
            startDate,
            endDate,
          },
        });
      })();
    },
    [session?.id, month],
  );

  return (
    <>
      <Swiper
        className="mainCarousel"
        focusableElements="textarea"
        slidesPerView={'auto'}
        spaceBetween={0}
        modules={[Pagination]}
        grabCursor
        loop
      >
        {Object.values(diaryTemplates).map(template => (
          <SwiperSlide
            key={template.id}
            className={`px-6 slide${template.id}`}
            style={{
              backgroundColor: template.bgColor,
            }}
          >
            <div className="flex justify-between items-center font-p-R18-2 text-primary-900 mb-4">
              <ChevronLeft className="h-4 w-4" onClick={onClickPrevDate} />
              <div className="flex items-center gap-x-1.5">
                <Image
                  src="/assets/icons/calendar_no_number.png"
                  width={16}
                  height={16}
                  alt="calendar"
                  priority
                  onClick={() => calendarRef.current?.click()}
                />
                {+month}월 {+date}일
                {selectedTime < todayTime && (
                  <Image
                    src="/assets/icons/reload.png"
                    width={16}
                    height={16}
                    alt="today"
                    priority
                    className="ml-[14px]"
                    onClick={onClickToday}
                  />
                )}
              </div>
              {selectedTime < todayTime ? (
                <ChevronRight className="h-4 w-4" onClick={onClickNextDate} />
              ) : (
                <div></div>
              )}
            </div>
            <div className="flex flex-col gap-3 h-full">
              <div className="flex justify-between">
                <p
                  className={`font-p-M20 whitespace-pre-wrap`}
                  style={{ color: template.questionColor }}
                >
                  {template.question}
                </p>
                <Image
                  src={template.charSrc}
                  alt="growmi"
                  width={64}
                  height={64}
                  className="mr-4"
                />
              </div>
              <div
                className="h-full"
                style={{
                  marginBottom: 'calc(env(safe-area-inset-bottom) + 48px + 124px)',
                }}
              >
                <textarea
                  ref={assignRef(template.id)}
                  className={`diary-text p-2 placeholder:font-p-R18-2 placeholder:text-primary-600 font-p-R18-2 block bg-transparent w-full mb-1 resize-none focus-visible:border-0 focus-visible:outline-0 focus:outline-0 focus:outline-none focus:border-0`}
                  style={{
                    color: template.answerColor,
                    pointerEvents: 'initial',
                    height: scrollHeight,
                    caretColor: template.caretColor,
                  }}
                  placeholder={
                    template.id === '0' && repliedCount === 0
                      ? '일기 작성 횟수는 자유롭지만, 그루미는 하루에 한 번만 답장을 드릴 수 있어요.'
                      : template.placeholder
                  }
                  onChange={handleChangeContent}
                  onFocus={() => handleFocusInput(template.id)}
                  onBlur={handleBlurInput}
                  maxLength={1000}
                  minLength={10}
                  value={writeState.content}
                ></textarea>
                <div className={`text-right ${writeState.content.length ? 'block' : ''}`}>
                  <span className="inline-block bg-opacity-70 font-p-R16 p-1 text-primary-500">
                    <span
                      className={`${writeState.content.length >= 1000 ? 'text-danger-500' : ''}`}
                    >
                      {writeState.content.length}
                    </span>{' '}
                    / 1000
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <AlertDialog>
        <AlertDialogTrigger className="hidden" ref={calendarRef}>
          달력 팝업
        </AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="top-0 top-0 left-0 transform-none rounded-b-2xl bg-grayscale-100">
            <CalendarWithRecords
              initSelectDate={selectedDate}
              showOverDate={false}
              onChangeSelectDate={onChangeSelectDate}
            />
            <AlertDialogCancel ref={calendarCloseBtnRef} className="hidden">
              취소
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {repliedCount > 0 && (
        <Button
          className="absolute w-[calc(100%-48px)] bottom-0 left-6 z-50 mb-6"
          onClick={() => handleSubmit()}
        >
          일기 작성하기
        </Button>
      )}
      {repliedCount === 0 && (
        <Button
          className="absolute w-[calc(100%-48px)] bottom-0 left-6 z-50 mb-6"
          onClick={() => handleSubmit('AI')}
        >
          그루미에게 답장받기
        </Button>
      )}
      <Toast ref={toastRef}>{toastContent}</Toast>
      {checkInitUser && (
        <OneTimeToast>
          <div className="flex flex-col items-center justify-center">
            <p>오른쪽, 왼쪽으로 넘겨보세요</p>
            <Image src="/assets/icons/swipe.png" alt="swipe" width={96} height={88} />
          </div>
        </OneTimeToast>
      )}
      <AlertDialog>
        <AlertDialogTrigger className="hidden" ref={replyPopupRef}>
          그루미 답장중 팝업
        </AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="flex justify-center p-0 m-0 rounded-md bg-tranparent border-0">
            <div className="px-3 py-2 bg-grayscale-300 flex flex-col items-center jusitfy-center rounded">
              <p className="pb-2 font-p-M14 text-grayscale-700">
                그루미가 답장을 쓰고 있어요
              </p>
              <LottieAnimation src={airplane} width="100px" height="100px" />
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MainView;
