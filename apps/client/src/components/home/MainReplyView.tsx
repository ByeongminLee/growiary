'use client';
import { UserProfileDTO } from '@growiary/types';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { ApiResponse, DiaryTemplate, RecordType, ResponseStatus } from '@/types';
import { FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/lib/useFetch';

interface MainReplyViewProps {
  userProfile?: UserProfileDTO;
  replyData?: RecordType[];
}

const MainReplyView = ({ userProfile, replyData = [] }: MainReplyViewProps) => {
  const { data: session, status } = useSession();
  const [year, month, date, day] = useFullStrDate();
  const requestApi = useFetch();
  const todayData = replyData[0];
  const template: DiaryTemplate = todayData && diaryTemplates[todayData.template];
  const [isSubmittedFeedBack, setIsSubmittedFeedBack] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    const response = (await requestApi('/post/feedback', {
      method: 'POST',
      id: session?.id,
      body: {
        postId: todayData.postId,
        feedback: e.currentTarget.getAttribute('data-feedback'),
      },
    })) as ApiResponse<{ status: ResponseStatus; message: string }>;
    const { status } = await response;
    if (status === 200) {
      setIsSubmittedFeedBack(true);
    }
  };

  return (
    <article
      className="h-full p-6 overflow-auto pb-24"
      style={{ backgroundColor: `${template.bgColor}` }}
    >
      <p className="pt-6 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      {todayData.content && (
        <section>
          <DiaryContent template={template} response={todayData} />
        </section>
      )}
      {todayData.answer && (
        <>
          <section className="mt-14 p-3">
            <DiaryReply template={template} response={todayData} />
          </section>
          <section>
            {!isSubmittedFeedBack ? (
              <div className="flex flex-col align-center justify-center">
                <div className="flex justify-center items-center">
                  <Image
                    src="/assets/growmi/lightpink.svg"
                    width={48}
                    height={48}
                    alt="growmi"
                  />
                  <p className="ml-2 font-p-M20" style={{ color: template.answerColor }}>
                    이 답장이 마음에 들었나요?
                  </p>
                </div>
                <div className="flex gap-2 justify-center h-12">
                  <Button
                    variant="secondary"
                    size="sm"
                    data-feedback="GOOD"
                    type="button"
                    onClick={handleSubmit}
                  >
                    O
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    data-feedback="BAD"
                    type="button"
                    onClick={handleSubmit}
                  >
                    X
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sub-indigo font-p-R18 text-center mb-14">감사합니다!</p>
            )}
          </section>
        </>
      )}
    </article>
  );
};

export default MainReplyView;
