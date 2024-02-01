'use client';
import { useSearchParams } from 'next/navigation';
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
import { requestApi } from '@/utils/requestApi';
import { useSession } from 'next-auth/react';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { UserProfileDTO } from '@growiary/types';
import { ApiResponse } from '@/types';

interface MainViewProps {
  userProfile?: UserProfileDTO;
  maxHeight?: string;
}

const MainView = ({ userProfile: profile, maxHeight }: MainViewProps) => {
  const searchParams = useSearchParams();
  const searchDate = searchParams.get('date');
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [year, month, date, day] = useFullStrDate(searchDate);
  // const userProfile = useUserProfile(profile);
  const [isSubmitWithUnderTen, setIsSubmitWithUnderTen] = useState(false);
  const templateRef = useRef(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChangeContent = (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLTextAreaElement).value;

    if (value.length > 1000) return;
    setContent(value);
  };

  const handleFocusInput = (id: number) => {
    templateRef.current = id;
  };

  const handleSubmit = async () => {
    if (content.length <= 10) {
      setIsSubmitWithUnderTen(true);
      return;
    }
    setIsSubmitted(true);

    const response: ApiResponse<{ postId: string }> = await requestApi('/post/ai', {
      method: 'POST',
      id: session?.id,
      body: {
        title: 'tempTitle',
        content,
        template: templateRef.current.toString(),
      },
    });

    if (response.status === 200) {
      location.href = `/record/${response.data.postId}`;
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
      {content.length >= 1000 && (
        <Toast>아쉽지만, 1000자 이하의 메시지만 그루미에게 전달할 수 있어요</Toast>
      )}
      {isSubmitWithUnderTen && (
        <Toast>그루미에게 답장을 받기 위해서는, 10자 이상의 메시지가 필요해요</Toast>
      )}
      {isSubmitted && <Toast>그루미가 답장을 보내고 있어요</Toast>}
    </>
  );
};

export default MainView;
