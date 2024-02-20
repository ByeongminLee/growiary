import { DiaryTemplate, RecordType } from '@/types';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { getDateFromServer, getFullStrDate } from '@/utils/getDateFormat';
import Image from 'next/image';

type DiaryContentProps = {
  response: RecordType;
};
const DiaryContent = ({ response }: DiaryContentProps) => {
  const [year, month, date, day] = getFullStrDate(getDateFromServer(response.createAt));
  const template: DiaryTemplate = response && diaryTemplates[response.template];

  return (
    <>
      <p className="mx-9 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      <section className="px-9 pb-8">
        <div className="flex items-center mb-4">
          <h2
            style={{ color: `${template.questionColor}` }}
            className="font-p-M20 break-keep"
          >
            {template.question}
          </h2>
          {response.answer && (
            <Image
              src="/assets/growmi/bubble.png"
              alt="growmi"
              className="ml-1"
              width={24}
              height={24}
              priority
            />
          )}
        </div>
        <div style={{ color: `${template.answerColor}` }} className="font-p-R18-2">
          {response.content.split('\n').map((el: string, idx: number) => (
            <p key={idx}>
              {el}
              <br />
            </p>
          ))}
        </div>
      </section>
    </>
  );
};

export default DiaryContent;
