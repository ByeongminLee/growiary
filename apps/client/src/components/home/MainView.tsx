'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../ui/carousel/carousel.css';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import Toast from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { UserProfileDTO } from '@growiary/types';
import { ApiResponse, RecordType } from '@/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { useFetch } from '@/lib/useFetch';
import { useRouter } from 'next/navigation';

interface MainViewProps {
  userProfile?: UserProfileDTO;
  maxHeight?: string;
}

const MainView = ({ userProfile: profile, maxHeight }: MainViewProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const record = useRecoilValue(recordState);
  const [year, month, date, day] = useFullStrDate();
  const [content, setContent] = useRecoilState(recordWriteState);
  const templateRef = useRef(1);
  const toastRef = useRef<HTMLDivElement>(null);
  const [toastContent, setToastContent] = useState('');
  const requestApi = useFetch();

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
      setContent(value);
      return;
    }

    setContent(value);
  };

  const handleFocusInput = (id: number) => {
    templateRef.current = id;
  };

  const handleSubmit = async () => {
    if (content.length <= 10) {
      showToast('그루미에게 답장을 받기 위해서는, 10자 이상의 메시지가 필요해요');
      return;
    }

    if (record[`${year}-${month}-${date}`]?.length) {
      showToast('그루미의 답장은 하루에 한 번만 가능해요');
      return;
    }

    showToast('그루미가 답장을 보내고 있어요');

    const response: ApiResponse<RecordType> | undefined = await requestApi('/post/ai', {
      method: 'POST',
      id: session?.id,
      body: {
        content,
        template: templateRef.current.toString(),
      },
    });

    if (response && 'data' in response) {
      router.refresh();
    } else {
      alert('문제 발생');
    }
  };

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
        {Object.values(diaryTemplates).map((template, i) => (
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
                  value={content}
                ></textarea>
                <div className={`text-right ${content.length ? 'block' : ''}`}>
                  <span className="inline-block bg-opacity-70 font-p-R16 p-1 text-primary-500">
                    <span
                      className={`${content.length >= 1000 ? 'text-danger-500' : ''}`}
                    >
                      {content.length}
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
    </>
  );
};

export default MainView;
