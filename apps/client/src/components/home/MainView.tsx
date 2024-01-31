'use client';
import withUserProfile from '@/components/hoc/withUserProfile';
import Tab from '@/components/ui/Tab';
import Button from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { getDateArrToStr, getTwoDigitNum } from '@/utils/getDateFormat';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './mainViewCarousel.css';
import { useEffect } from 'react';
import withBottomTab from '@/components/hoc/withBottomTab';

interface MainViewProps {
  userProfile: any;
  maxHeight: string;
}

const MainView = ({ userProfile, maxHeight }: MainViewProps) => {
  const searchParams = useSearchParams();
  const searchDate = searchParams.get('date');
  const [year, month, date, day] = getDateArrToStr(searchDate);

  return (
    <>
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={0}
        grabCursor={true}
        modules={[Pagination]}
        // className={maxHeight}
        style={{ height: maxHeight }}
      >
        <SwiperSlide className="px-6 pt-20">
          {maxHeight}
          <p>오늘 무슨 일이 있었는지 말해줄래요?</p>
          {/* 96 + 36 = 132 */}
          {/*<textarea*/}
          {/*  name=""*/}
          {/*  placeholder="here is textarea"*/}
          {/*  className="px-2 w-full h-[calc(100%-132px)] box-border bg-transparent"*/}
          {/*></textarea>*/}
        </SwiperSlide>
        <SwiperSlide className="px-6 pt-20">
          <p>오늘 무슨 일이 있었는지 말해줄래요?</p>
          <textarea
            name=""
            placeholder="here is textarea"
            className="px-2 w-full h-full box-border bg-transparent"
          ></textarea>
        </SwiperSlide>
        {/*<SwiperSlide className="px-6 pt-20">*/}
        {/*  <p>오늘 무슨 일이 있었는지 말해줄래요?</p>*/}
        {/*  <textarea*/}
        {/*    name=""*/}
        {/*    placeholder="here is textarea"*/}
        {/*    className="px-2 w-full h-full box-border bg-transparent"*/}
        {/*  ></textarea>*/}
        {/*</SwiperSlide>*/}
      </Swiper>
      <p className="absolute top-12 left-6 z-50 font-p-R16 text-primary-500">
        {year}년 {getTwoDigitNum(month)}월 {getTwoDigitNum(date)}일 {day}
      </p>
      <Button className="absolute w-[calc(100%-48px)] bottom-9 left-6 z-50">
        그루미에게 답장받기
      </Button>
    </>
  );
};

export default withUserProfile(withBottomTab(MainView));
