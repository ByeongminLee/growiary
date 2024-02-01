'use client';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { useEffect, useState } from 'react';
import { UserProfileDTO } from '@growiary/types';
import { getDateArrToStr, getTwoDigitNum } from '@/utils/getDateFormat';
import Image from 'next/image';
import withUserProfile from '@/components/hoc/withUserProfile';
import withBottomTab from '@/components/hoc/withBottomTab';
import { Button } from '@/components/ui/shadcn/button';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
interface MainReplyViewProps {
  userProfile?: UserProfileDTO;
}

const MainReplyView = ({ userProfile }: MainReplyViewProps) => {
  const [date, setDate] = useState<[number, number, number, string] | null>(null);
  const [response, setResponse] = useState({
    date: '2024-01-24',
    temId: 4,
    content:
      '오늘은 머티리얼 디자인 시스템을 공부했다. \n' +
      '\n' +
      '가장 기본이 되는 디자인 시스템인 만큼 많은 인사이트를 얻을 수 있었고 더 많은 디자인 케이스에 대해 공부할 수 있었다\n' +
      '\n' +
      '가장 기본이 되는 디자인 시스템인 만큼 많은 인사이트를 얻을 수 있었고 더 많은 디자인 케이스에 대해 공부할 수 있었다',
    reply:
      '멋진 일기네! 머티리얼 디자인 시스템을 \n' +
      '공부하면서 많은 인사이트를 얻었다니 \n' +
      '대단해. 계속해서 디자인 케이스에 대해 \n' +
      '공부하는 것은 좋은 방법이야. 이렇게 기본적으로 중요한 개념들을 잘 익혀두면 다른 프로젝트에서도 유용하게 활용할 수 있을 거야. 공부하는 것은 좋은 방법이야.\n' +
      '이렇게 기본적으로 중요한 개념들을 잘 익혀두면 다른 프로젝트에서도 유용하게 활용할 수 있을 거야.\n' +
      '지금처럼 열심히 학습하고 발전하는 자세를 유지해줘.',
  });
  const template = diaryTemplates[response.temId];

  useEffect(() => {
    setDate(getDateArrToStr(response.date));
    return () => {};
  }, []);

  return (
    <article
      className="h-full p-6 overflow-auto"
      style={{ backgroundColor: `${template.bgColor}` }}
    >
      <p className="pt-6 font-p-R16 text-primary-500 mb-1">
        {date?.[0]}년 {date && getTwoDigitNum(date?.[1])}월{' '}
        {date && getTwoDigitNum(date?.[2])}일 {date?.[3]}
      </p>
      <div>
        <DiaryContent template={template} response={response} />
      </div>
      <section className="mt-14 p-3">
        <DiaryReply template={template} response={response} />
      </section>
      <section>
        <form className="flex flex-col align-center justify-center">
          <div className="flex justify-center items-center">
            <Image src="/assets/growmi/pink.svg" width={48} height={48} alt="growmi" />
            <p className="ml-2 font-p-M20" style={{ color: template.answerColor }}>
              이 답변이 마음에 들었나요?
            </p>
          </div>
          <div className="flex gap-2 justify-center h-12">
            <Button variant="secondary" size="sm" type="submit">
              O
            </Button>
            <Button variant="secondary" size="sm" type="submit">
              X
            </Button>
          </div>
        </form>
        <p className="text-sub-indigo font-p-R18 text-center mb-14">감사합니다!</p>
      </section>
    </article>
  );
};

export default withUserProfile(withBottomTab(MainReplyView));
