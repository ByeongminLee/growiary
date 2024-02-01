'use client';
import withUserProfile from '@/components/hoc/withUserProfile';
import { useSearchParams } from 'next/navigation';
import { getDateArrToStr, getTwoDigitNum } from '@/utils/getDateFormat';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../ui/carousel/carousel.css';
import withBottomTab from '@/components/hoc/withBottomTab';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';

interface MainViewProps {
  userProfile: any;
  maxHeight: string;
}

const MainView = ({ userProfile, maxHeight }: MainViewProps) => {
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const searchDate = searchParams.get('date');
  const [year, month, date, day] = getDateArrToStr(searchDate);

  const handleChangeContent = (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLTextAreaElement).value;

    if (value.length > 1000) return;
    setContent(value);
  };

  return (
    <>
      <p className="absolute top-12 left-6 z-50 font-p-R16 text-primary-500">
        {year}년 {getTwoDigitNum(month)}월 {getTwoDigitNum(date)}일 {day}
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
        {diaryTemplates.map((template, i) => (
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
                  maxLength={1000}
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
      <Button className="absolute w-[calc(100%-48px)] bottom-9 left-6 z-50">
        그루미에게 답장받기
      </Button>
    </>
  );
};

export default withUserProfile(withBottomTab(MainView));
