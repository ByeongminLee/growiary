import { DiaryTemplate } from '@/types';

type DiaryContentProps = {
  template: DiaryTemplate;
  response: any;
};
const DiaryContent = ({ template, response }: DiaryContentProps) => {
  return (
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
  );
};

export default DiaryContent;
