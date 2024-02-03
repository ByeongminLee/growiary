'use client';

import { Button } from '@/components/ui/shadcn/button';
import Image from 'next/image';
import Link from 'next/link';

export const DesktopLandingView = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-32 justify-center items-center">
        <div className="flex flex-col gap-2">
          <Image
            src="/assets/app/logo2.png"
            width="208"
            height="113"
            alt="logo"
            className="mx-auto"
          />
          <p className="font-p-M24 p-4">AI와 함께하는 회고 다이어리</p>
        </div>
        <div className="flex flex-col p-4">
          <p className="font-p-R18 text-primary-800">
            하루에 딱 한 번, 일기를 쓰면 AI가 정성스런 답장을 보내줘요.
          </p>
          <p className="font-p-R18 text-primary-800">
            이제 친구같은, 나와 함께 성장하는 AI 다이어리를 만나보세요.
          </p>
        </div>
        <Button className="w-[232px]" asChild>
          <Link href="/">다이어리 작성하러 가기</Link>
        </Button>
      </div>
      <div className="mt-[56px] w-full max-w-[1250px] flex-wrap flex justify-center mx-auto">
        {contents.map(content => (
          <div
            key={content.label}
            className="flex flex-col gap-[30px] max-w-[312px] h-[460px] px-[30px]"
          >
            <div className="w-[200px] h-[150px] mx-auto">
              <Image
                className="mx-auto"
                src={content.img}
                width={content.width}
                height={content.height}
                alt={content.label}
              />
            </div>
            <div>
              <p className="text-branding-600 font-bold text-[20px] leading-[24px] tracking-[-1.2px] mb-[11px]">
                {content.label}
              </p>
              <p className="font-p-M24">{content.title}</p>
              <p className="font-p-R18 text-primary-700">{content.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
type ContentsType = {
  img: string;
  width: number;
  height: number;
  label: string;
  title: string;
  description: string;
};

const contents: ContentsType[] = [
  {
    img: '/assets/images/landing_write.png',
    width: 146,
    height: 115,
    label: 'Write',
    title: '일기 쓰기',
    description:
      '오늘 하루를 기록합니다.\n무엇을 써야할 지 모르겠다면\n하루를 돌아볼 수 있는 질문을 드려요',
  },
  {
    img: '/assets/images/landing_feedback.png',
    width: 111,
    height: 125,
    label: 'Feedback',
    title: '답장 받기',
    description: '내가 작성한 일기를 읽고\n그루미가 정성스런 답장을 보내줘요',
  },
  {
    img: '/assets/images/landing_open.png',
    width: 183,
    height: 103,
    label: 'Open',
    title: '솔직한 이야기',
    description:
      '누구에게도 말하지 못한 속마음,\n그루미에게 꺼내어 보세요.\n솔직한 내 모습을 들여다볼 수 있어요',
  },
  {
    img: '/assets/images/landing_growingUp.png',
    width: 137,
    height: 113,
    label: 'Growing Up',
    title: '매일 성장하기',
    description:
      '하루에 한번씩,\n달력을 채울수록 성취감을 느껴요.\n기록을 통한 성장을 확인할 수 있어요',
  },
];
