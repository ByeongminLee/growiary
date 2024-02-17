import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './carousel.css';
import { ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode;
  width: string;
  onReachEnd: (status: boolean) => void;
}
export default function Carousel({ children, width, onReachEnd }: CarouselProps) {
  const slides = Array.isArray(children) ? children : [children];
  const handleReachEnd = () => {
    onReachEnd(true);
  };

  const handleSlidePrevTransitionStart = () => {
    onReachEnd(false);
  };

  return (
    <Swiper
      className={`w-[${width}]`}
      pagination={{ clickable: true }}
      onSlidePrevTransitionStart={handleSlidePrevTransitionStart}
      onReachEnd={() => {
        handleReachEnd();
      }}
      modules={[Pagination]}
      grabCursor={true}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
}
