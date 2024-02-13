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
import { ApiResponse, RecordType } from '@/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { useFetch } from '@/lib/useFetch';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';
import { useRouter } from 'next/navigation';
import OneTimeToast from '@/components/ui/OneTimeToast';
import { tracking } from '@/utils/mixPannel';
import { getFullStrDate, getYMDFromDate } from '@/utils/getDateFormat';
import LottieAnimation from '@/components/ui/LottieAnimation';
import airplane from '@/../public/assets/airplane.json';
import { useMutation } from '@tanstack/react-query';
import { getRecords } from '@/utils/requestRecord';

const MainView = () => {
  const { data: session } = useSession();
  const record = useRecoilValue(recordState);
  const [year, month, date, day] = getFullStrDate();
  const [writeState, setWriteState] = useRecoilState(recordWriteState);
  const templateRef = useRef('0');
  const toastRef = useRef<HTMLDivElement>(null);
  const replyPopupRef = useRef<HTMLButtonElement | null>(null);
  const [toastContent, setToastContent] = useState('');
  const [scrollHeight, setScrollHeight] = useState('100%');
  const [hasExperience, setHasExperience] = useState(true);
  const requestApi = useFetch();
  const params = new URLSearchParams();
  const router = useRouter();
  const refsArray = useRef<{ [id: string]: HTMLTextAreaElement }>({});
  const [repliedCount, setRepliedCount] = useState(-1);
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
      setRepliedCount(
        result.data.findIndex(record => record.answer && record.answer.length > 0) + 1,
      );
    },
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
      setWriteState(prev => ({
        ...prev,
        content: value,
      }));
      return;
    }

    setWriteState(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleFocusInput = (id: string) => {
    templateRef.current = id;
  };

  const handleBlurInput = (id: string) => {
    setScrollHeight('100%');
  };

  const handleSubmit = async () => {
    if (writeState.content.length <= 10) {
      showToast('10자 이상의 메시지만 작성할 수 있어요');
      return;
    }

    const response: ApiResponse<RecordType> | undefined = await requestApi('/post', {
      method: 'POST',
      id: session?.id,
      body: {
        content: writeState.content,
        template: templateRef.current.toString(),
      },
    });

    if (response && 'data' in response) {
      setWriteState(prev => ({ ...prev, content: '' }));
      // tracking('그루미에게 답장받기 클릭');
      router.push(`/calendar`);
    } else {
      alert('문제 발생');
    }
  };

  const handleSubmitAI = async () => {
    if (writeState.content.length <= 10) {
      showToast('그루미에게 답장을 받기 위해서는 10자 이상의 메시지가 필요해요');
      return;
    }

    replyPopupRef.current?.click();
    setWriteState(prev => ({ ...prev, content: '', isWaiting: true }));

    const response: ApiResponse<RecordType> | undefined = await requestApi('/post/ai', {
      method: 'POST',
      id: session?.id,
      body: {
        content: writeState.content,
        template: templateRef.current.toString(),
      },
    });

    if (response && 'data' in response) {
      params.set('replied', 'true');
      setWriteState(prev => ({ ...prev, content: '', isWaiting: false }));
      tracking('그루미에게 답장받기 클릭');
      router.push(`/calendar?${params}`);
    } else {
      alert('문제 발생');
    }
  };

  useEffect(() => {
    const isExperiencedUser = window.localStorage.getItem('hasExperience');
    if (!isExperiencedUser) {
      setHasExperience(false);
      window.localStorage.setItem('hasExperience', 'true');
    }
  }, [hasExperience]);

  useEffect(() => {
    const refHeight = refsArray.current[templateRef.current].clientHeight;
    const handleScroll = () => {
      const sub = document.documentElement.scrollHeight - window.innerHeight;
      if (sub === 0) return;
      setScrollHeight(refHeight - Math.abs(sub) + 'px');
      window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (!session?.id) return;
    (async () => {
      await mutation.mutateAsync({
        id: session.id,
        body: {
          startDate: `${year}-${month}-${date}`,
          endDate: `${getYMDFromDate(new Date(new Date().getTime() + 60 * 60 * 24 * 1000))}`,
        },
      });
    })();
  }, [session?.id]);

  return (
    <>
      <Swiper
        className="mainCarousel"
        focusableElements="textarea"
        allowTouchMove={!writeState.content}
        slidesPerView={'auto'}
        spaceBetween={0}
        modules={[Pagination]}
        style={{
          pointerEvents: writeState.content ? 'none' : 'initial',
        }}
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
            <p className="font-p-R16 mb-1" style={{ color: template.dateColor }}>
              {year}년 {month}월 {date}일 {day}
            </p>
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
                  className={`diary-text caret-branding-600 p-2 placeholder:font-p-R18-2 placeholder:text-primary-600 font-p-R18-2 block bg-transparent w-full mb-1 resize-none focus-visible:border-0 focus-visible:outline-0 focus:outline-0 focus:outline-none focus:border-0`}
                  style={{
                    color: template.answerColor,
                    pointerEvents: 'initial',
                    height: scrollHeight,
                  }}
                  placeholder={template.placeholder}
                  onChange={handleChangeContent}
                  onFocus={() => handleFocusInput(template.id)}
                  onBlur={() => handleBlurInput(template.id)}
                  maxLength={1000}
                  minLength={11}
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
      {repliedCount > 0 && (
        <Button
          className="absolute w-[calc(100%-48px)] bottom-0 left-6 z-50 mb-6"
          onClick={handleSubmit}
        >
          일기 작성하기
        </Button>
      )}
      {repliedCount === 0 && (
        <Button
          className="absolute w-[calc(100%-48px)] bottom-0 left-6 z-50 mb-6"
          onClick={handleSubmitAI}
        >
          그루미에게 답장받기
        </Button>
      )}
      <Toast ref={toastRef}>{toastContent}</Toast>
      {!hasExperience && (
        <OneTimeToast>
          <div className="flex flex-col items-center justify-center">
            <p>오른쪽, 왼쪽으로 넘겨보세요</p>
            <Image src="/assets/icons/swipe.png" alt="swipe" width={96} height={88} />
          </div>
        </OneTimeToast>
      )}
      <AlertDialog>
        <AlertDialogTrigger ref={replyPopupRef}>구르미 답장중 팝업</AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="flex justify-center p-0 m-0 rounded-md bg-tranparent border-0">
            <div className="px-3 py-2 bg-grayscale-300 flex flex-col items-center jusitfy-center rounded">
              <p className="pb-2 font-p-M14 text-grayscale-700">
                그루미가 답장을 쓰고 있어요
              </p>
              <LottieAnimation src={airplane} className="bg-primary-100" />
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MainView;
