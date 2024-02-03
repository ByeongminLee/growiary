'use client';

import Image from 'next/image';
import { Button } from '../ui/shadcn/button';

export const MobileLandingView = () => {
  return (
    <div className="layout-full">
      <section className="self-start mt-18">
        <Image src="/assets/app/logo.png" alt="growiary" width={312} height={113} />
        <h1 className="font-p-M24 text-primary-900 mt-2">AI와 함께하는 회고 다이어리</h1>
        <Image
          src="/assets/app/line.svg"
          alt="line"
          width={587}
          height={5}
          className="absolute top-[806px] inset-x-0 w-screen"
        />
        <Image
          src="/assets/app/growmi_with_person.png"
          alt="grwomi_with_person"
          width={128}
          height={128}
          className="absolute top-[736px] right-[20px]"
        />
      </section>
      <section className="flex flex-col items-center">
        <Button>다이어리 작성하러 가기</Button>
      </section>
    </div>
  );
};
