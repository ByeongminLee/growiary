'use client';

import Carousel from '@/components/common/carousel/Carousel';
import Button from '@/components/common/Button';
import { useState } from 'react';
import Link from 'next/link';

const TempSlide = ({ text }: { text: string }) => {
  return <div className="w-full h-[440px] bg-temp-img">{text}</div>;
};

const OnboardView = () => {
  const slideContents = ['img1', 'img2', 'img3'];
  const [isLastSlide, setIsLastSlide] = useState(false);

  const onReachEnd = (status: boolean) => {
    setIsLastSlide(status);
  };

  return (
    <section className="w-full h-[calc(80vh-60px)] flex justify-center items-center">
      <Carousel onReachEnd={onReachEnd} width="312px">
        {slideContents.map((content, idx) => (
          <TempSlide key={idx} text={content} />
        ))}
      </Carousel>
      {isLastSlide && (
        <div className="fixed	bottom-[32px] px-[24px] w-full">
          <Link href="/login">
            <Button>시작하기</Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default OnboardView;
