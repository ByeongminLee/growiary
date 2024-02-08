'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { ApiResponse, DiaryTemplate, RecordType, ResponseStatus } from '@/types';
import { FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/lib/useFetch';
import { tracking } from '@/utils/mixPannel';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';
import { getFullStrDate } from '@/utils/getDateFormat';

interface MainReplyViewProps {
  todayReply?: RecordType;
  showFeedbackQues?: boolean;
}

const MainReplyView = ({
  todayReply = {} as RecordType,
  showFeedbackQues = true,
}: MainReplyViewProps) => {
  const { data: session } = useSession();
  const [year, month, date, day] = getFullStrDate();
  const requestApi = useFetch();
  const template: DiaryTemplate = todayReply && diaryTemplates[todayReply.template];
  const [recordWrite, setRecordWrite] = useRecoilState(recordWriteState);

  const handleSubmit = async (e: FormEvent) => {
    tracking('답장 피드백 제출');
    const response = (await requestApi('/post/feedback', {
      method: 'POST',
      id: session?.id,
      body: {
        postId: todayReply.postId,
        feedback: e.currentTarget.getAttribute('data-feedback'),
      },
    })) as ApiResponse<{ status: ResponseStatus; message: string }>;
    const { status } = await response;
    if (status === 200) {
      setRecordWrite(prev => ({
        ...prev,
        isSubmittedFeedback: true,
      }));
    }
  };

  return (
    <article
      className="h-full overflow-auto pb-[22px]"
      style={{
        backgroundColor: `${template.bgColor}`,
        paddingTop: '64px',
        marginTop: 'env(safe-area-inset-top)',
        height: 'calc(100% - env(safe-area-inset-top))',
      }}
    >
      <p className="mx-9 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      {todayReply.content && <DiaryContent template={template} response={todayReply} />}
      {todayReply.answer && (
        <>
          <DiaryReply response={todayReply} />

          {showFeedbackQues &&
            todayReply.feedback === 'NONE' &&
            (!recordWrite.isSubmittedFeedback ? (
              <section>
                <div className="flex flex-col align-center justify-center">
                  <div className="flex justify-center items-center">
                    <Image
                      src="/assets/growmi/lightpink.svg"
                      width={48}
                      height={48}
                      alt="growmi"
                    />
                    <p
                      className="ml-2 font-p-M20"
                      style={{ color: template.answerColor }}
                    >
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
              </section>
            ) : (
              <p className="text-sub-indigo font-p-R18 text-center mb-14">감사합니다!</p>
            ))}
        </>
      )}
    </article>
  );
};

export default MainReplyView;
