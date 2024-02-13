import { DiaryTemplate, RecordType } from '@/types';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { getFullStrDate } from '@/utils/getDateFormat';

type DiaryContentProps = {
  response: RecordType;
};
const DiaryContent = ({ response }: DiaryContentProps) => {
  const [year, month, date, day] = getFullStrDate();
  const template: DiaryTemplate = response && diaryTemplates[response.template];

  return (
    <>
      <p className="mx-9 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      <section className="px-9 pb-8">
        <h2 style={{ color: `${template.questionColor}` }} className="font-p-M20 mb-4">
          {template.question}
        </h2>
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
