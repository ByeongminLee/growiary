'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../ui/carousel/carousel.css';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import Toast from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { UserProfileDTO } from '@growiary/types';
import { ApiResponse, RecordType } from '@/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { useFetch } from '@/lib/useFetch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';

interface MainViewProps {
  userProfile?: UserProfileDTO;
  maxHeight?: string;
}

const MainView = ({ maxHeight }: MainViewProps) => {
  const { data: session } = useSession();
  const record = useRecoilValue(recordState);
  const [year, month, date, day] = useFullStrDate();
  const [content, setContent] = useRecoilState(recordWriteState);
  const templateRef = useRef(1);
  const toastRef = useRef<HTMLDivElement>(null);
  const [toastContent, setToastContent] = useState('');
  const replyPopupRef = useRef<HTMLButtonElement | null>(null);
  const requestApi = useFetch();
  const params = new URLSearchParams();

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
      showToast('아쉽지만, 1000자 이하의 메시지만 그루미에게 전달할 수 있어요');
      setContent(prev => ({
        ...prev,
        content: value,
      }));
      return;
    }

    setContent(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleFocusInput = (id: number) => {
    templateRef.current = id;
  };

  const handleSubmit = async () => {
    if (content.content.length <= 10) {
      showToast('그루미에게 답장을 받기 위해서는, 10자 이상의 메시지가 필요해요');
      return;
    }

    if (record[`${year}-${month}-${date}`]?.length) {
      showToast('그루미의 답장은 하루에 한 번만 가능해요');
      return;
    }

    replyPopupRef.current?.click();
    setContent({ content: '', isWaiting: true });
    params.set('replied', 'waiting');
    history.pushState(null, '', `?${params}`);

    const response: ApiResponse<RecordType> | undefined = await requestApi('/post/ai', {
      method: 'POST',
      id: session?.id,
      body: {
        content: content.content,
        template: templateRef.current.toString(),
      },
    });

    if (response && 'data' in response) {
      params.set('replied', 'true');
      setContent({ content: '', isWaiting: false });
      history.pushState(null, '', `?${params}`);
    } else {
      alert('문제 발생');
    }
  };

  useEffect(() => {
    if (content.isWaiting && replyPopupRef.current) {
      replyPopupRef.current?.click();
    }
    return () => {
      replyPopupRef.current && (replyPopupRef.current = null);
    };
  }, [content.isWaiting]);

  return (
    <>
      <p className="absolute top-12 left-6 z-50 font-p-R16 text-primary-500">
        {year}년 {month}월 {date}일 {day}
      </p>
      <Swiper
        className="mainCarousel"
        focusableElements="textarea"
        allowTouchMove={!content}
        slidesPerView={'auto'}
        spaceBetween={0}
        modules={[Pagination]}
        style={{ height: maxHeight, pointerEvents: content ? 'none' : 'initial' }}
        grabCursor
        loop
      >
        {Object.values(diaryTemplates).map(template => (
          <SwiperSlide
            key={template.id}
            className={`px-6 pt-20 slide${template.id}`}
            style={{
              backgroundColor: template.bgColor,
            }}
          >
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
              <div className="grow mb-[140px] ">
                <textarea
                  className={`diary-text caret-branding-600 p-2 placeholder:currentcolor font-p-R17 block bg-transparent w-full h-full mb-1 resize-none`}
                  style={{ color: template.answerColor, pointerEvents: 'initial' }}
                  placeholder={template.placeholder}
                  onChange={handleChangeContent}
                  onFocus={() => handleFocusInput(template.id)}
                  maxLength={1000}
                  minLength={11}
                  value={content.content}
                ></textarea>
                <div className={`text-right ${content.content.length ? 'block' : ''}`}>
                  <span className="inline-block bg-opacity-70 font-p-R16 p-1 text-primary-500">
                    <span
                      className={`${content.content.length >= 1000 ? 'text-danger-500' : ''}`}
                    >
                      {content.content.length}
                    </span>{' '}
                    / 1000
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        className="absolute w-[calc(100%-48px)] bottom-9 left-6 z-50"
        onClick={handleSubmit}
      >
        그루미에게 답장받기
      </Button>
      <Toast ref={toastRef}>{toastContent}</Toast>
      <AlertDialog>
        <AlertDialogTrigger ref={replyPopupRef} className="hidden">
          구르미 답장중 팝업
        </AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
            <div className="flex flex-col items-center gap-3">
              <AlertDialogHeader className="font-p-R18 overflow-y-auto rounded">
                <div className="flex flex-col justify-content items-center">
                  <Image
                    src="/assets/growmi/green_letter.svg"
                    alt="growmi"
                    width={64}
                    height={64}
                    className="mb-2"
                  />
                  <p>그루미가 답장을 쓰고 있어요</p>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="grow w-full">
                <Button type="button" variant="secondary" asChild>
                  <AlertDialogAction>확인했어요</AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MainView;
