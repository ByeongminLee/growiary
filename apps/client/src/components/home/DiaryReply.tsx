'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useUserName } from '@/lib/useUserName';
import { Button } from '@/components/ui/shadcn/button';
import { tracking } from '@/utils/mixPannel';
import { ApiResponse, DiaryTemplate, RecordType, ResponseStatus } from '@/types';
import { useFetch } from '@/lib/useFetch';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';
import { useSession } from 'next-auth/react';
import { diaryTemplates } from '@/utils/getDiaryTemplates';

type DiaryReplyProps = {
  response: RecordType;
};

const DiaryReply = ({ response }: DiaryReplyProps) => {
  const { data: session } = useSession();
  const userName = useUserName();
  const requestApi = useFetch();
  const [nickname, setNickname] = useState('');
  const [recordWrite, setRecordWrite] = useRecoilState(recordWriteState);
  const template: DiaryTemplate = response && diaryTemplates[response.template];

  const handleSubmit = async (e: FormEvent) => {
    tracking('답장 피드백 제출');
    const apiResponse = (await requestApi('/post/feedback', {
      method: 'POST',
      id: session?.id,
      body: {
        postId: response.postId,
        feedback: e.currentTarget.getAttribute('data-feedback'),
      },
    })) as ApiResponse<{ status: ResponseStatus; message: string }>;
    const { status } = await apiResponse;
    if (status === 200) {
      setRecordWrite(prev => ({
        ...prev,
        isSubmittedFeedback: true,
      }));
    }
  };

  useEffect(() => {
    setNickname(userName);
  }, [userName]);

  return (
    <>
      <section
        className="px-3 pt-6"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 48px)',
        }}
      >
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-sub-indigo pl-4 font-p-M20">
            To. <span suppressHydrationWarning>{nickname}</span>님
          </h2>
          <Image
            className="mr-4"
            src="/assets/growmi/green.svg"
            width={57}
            height={58}
            alt="growmi"
          />
        </div>
        <div className="text-grayscale-800 font-p-R18-2 bg-opacity-70 p-6 rounded-2xl relative after:content-[''] after:absolute after:top-[-16px] after:right-14 after:w-[18px] after:h-[12px] after:bg-transparent after:border-8 after:border-transparent after:border-r-opacity-70 after:border-r-[11px] after:rounded-tr-[25px] after:border-b-opacity-70">
          {response.answer?.split('\n').map((el: string, idx: number) => (
            <p key={idx}>
              {el}
              <br />
            </p>
          ))}
        </div>
      </section>
      {response.feedback === 'NONE' &&
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
          </section>
        ) : (
          <p className="text-sub-indigo font-p-R18 text-center mb-14">
            감사합니다! <br />
            내일은 저에게 어떤 이야기를 들려줄지 궁금해요
          </p>
        ))}
    </>
  );
};

export default DiaryReply;
