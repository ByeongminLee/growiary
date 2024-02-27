'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useUserName } from '@/lib/useUserName';
import { tracking } from '@/utils/mixPannel';
import { ApiResponse, DiaryTemplate, RecordType, ResponseStatus } from '@/types';
import { useFetch } from '@/lib/useFetch';
import { useSetRecoilState } from 'recoil';
import { recordState } from '@/store';
import { useSession } from 'next-auth/react';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import Star from '@/components/ui/icon/Star';
import config from '../../../tailwind.config';
import { FeedbackType } from '@growiary/types';
import { getDateFromServer } from '@/utils/getDateFormat';

type DiaryReplyProps = {
  response: RecordType;
};

const colors = config?.theme?.extend?.colors as {
  [key: string]: {
    [key: string]: string;
  };
};

const FeedbackArr: FeedbackType[] = ['NONE', 'BAD', 'NOTBAD', 'AVERAGE', 'FINE', 'GOOD'];

const DiaryReply = ({ response }: DiaryReplyProps) => {
  const { data: session } = useSession();
  const userName = useUserName();
  const requestApi = useFetch();
  const [nickname, setNickname] = useState('');
  const [starPoint, setStarPoint] = useState(-1);
  const [initSubmittedFeedback, setInitSubmittedFeedback] = useState(true);
  const setRecords = useSetRecoilState(recordState);
  const template: DiaryTemplate = response && diaryTemplates[response.template];

  const handleSubmit = async (e: FormEvent, point: number) => {
    e.stopPropagation();
    setStarPoint(point);
    tracking('답장 피드백 제출');

    const apiResponse = (await requestApi('/post/feedback', {
      method: 'POST',
      id: session?.id,
      body: {
        postId: response.postId,
        feedback: FeedbackArr[point],
      },
    })) as ApiResponse<{ status: ResponseStatus; message: string }>;
    const { status } = await apiResponse;

    if (status === 200) {
      setRecords(prev => {
        const date = getDateFromServer(response.selectedAt || response.createAt);
        return {
          ...prev,
          [date]: prev[date].map(v =>
            v.postId === response.postId ? { ...v, feedback: FeedbackArr[point] } : v,
          ),
        };
      });
    }
  };

  useEffect(() => {
    setStarPoint(FeedbackArr.findIndex(v => v === response.feedback));
    setInitSubmittedFeedback(response.feedback !== 'NONE');
  }, []);

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
      {!initSubmittedFeedback && (
        <section className="mb-12">
          {starPoint === 0 ? (
            <div className="flex flex-col items-center justify-center gap-y-2">
              <Image
                src="/assets/growmi/lightpink.svg"
                width={48}
                height={48}
                alt="growmi"
              />
              <p className="font-p-M20" style={{ color: template.questionColor }}>
                이 답장이 마음에 들었나요?
              </p>
              <div className="flex gap-2 justify-center h-12">
                {[...new Array(5)].map((v, i) => (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={e => handleSubmit(e, i + 1)}
                  >
                    <Star
                      width={48}
                      height={48}
                      fill={
                        i + 1 > starPoint
                          ? colors?.grayscale?.[400]
                          : +response.template !== 6
                            ? colors?.sub?.yellow
                            : colors?.branding?.[800]
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p
              className="font-p-R18 text-center mb-1"
              style={{ color: template.questionColor }}
            >
              답장을 드릴 수 있어서 기뻐요
              <br />
              앞으로도 더 많은 이야기 들려주세요!
            </p>
          )}
        </section>
      )}
    </>
  );
};

export default DiaryReply;
