import { Button } from '@/components/ui/shadcn/button';
import { DiaryTemplate } from '@/types';

type DiaryContentProps = {
  template: DiaryTemplate;
  response: any;
};
const DiaryContent = ({ template, response }: DiaryContentProps) => {
  return (
    <>
      <h2 style={{ color: `${template.questionColor}` }} className="font-p-M20 mb-4">
        {template.question}
      </h2>
      <div style={{ color: `${template.answerColor}` }} className="font-p-R17">
        {response.content.split('\n').map((el: string, idx: number) => (
          <p key={idx}>
            {el}
            <br />
          </p>
        ))}
      </div>
    </>
  );
};

export default DiaryContent;