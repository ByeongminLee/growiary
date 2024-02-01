'use client';
import { UserProfileDTO } from '@growiary/types';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { useFullStrDate } from '@/lib/useFullStrDate';
import { DiaryTemplate, RecordType } from '@/types';

interface MainReplyViewProps {
  userProfile?: UserProfileDTO;
  replyData: RecordType[];
}

const MainReplyView = ({ userProfile, replyData }: MainReplyViewProps) => {
  const [year, month, date, day] = useFullStrDate();
  const temId = +replyData[0]?.postId;
  const template: DiaryTemplate = replyData[0] && diaryTemplates[temId];

  if (!temId) {
    return <div>등록된 글이 없습니다.</div>;
  }
  return (
    <article
      className="h-full p-6 overflow-auto"
      style={{ backgroundColor: `${template.bgColor}` }}
    >
      <p className="pt-6 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      <div>{<DiaryContent template={template} response={replyData} />}</div>
      <section className="mt-14 p-3">
        {<DiaryReply template={template} response={replyData} />}
      </section>
      <section>
        <form className="flex flex-col align-center justify-center">
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

export default MainReplyView;
