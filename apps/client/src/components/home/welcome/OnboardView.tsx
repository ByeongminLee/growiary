'use client';

import Carousel from '@/components/ui/carousel/Carousel';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/shadcn/button';
import Image from 'next/image';
import { tracking } from '@/utils/mixPannel';

const Slide = ({ text }: { text: string }) => {
  return <div className="w-full h-[440px] bg-temp-img">{text}</div>;
};

const OnboardView = () => {
  const slideContents = ['img1', 'img2', 'img3'];
  const [isLastSlide, setIsLastSlide] = useState(false);

  const onReachEnd = (status: boolean) => {
    setIsLastSlide(status);
  };

  return (
    <section className="layout-full h-[calc(85vh-72px)]">
      <div className="grow flex items-center">
        <Carousel onReachEnd={onReachEnd} width="312px">
          {[...new Array(4)].map((v, i) => (
            <Image
              style={{
                margin: '0 auto',
              }}
              key={i + 1}
              src={`/assets/images/onboarding${i + 1}.png`}
              alt={`onboarding${i + 1}`}
              width={312}
              height={440}
              priority
            />
          ))}
        </Carousel>
      </div>
      <div className="grow-0 shrink-0 min-h-[60px]">
        {isLastSlide && (
          <Button asChild onClick={() => tracking('로그인 페이지 이동')}>
            <Link href="/login">시작하기</Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default OnboardView;
