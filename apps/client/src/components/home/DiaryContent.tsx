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
        {response.content}
      </div>
      <Button>그루미에게 답장받기</Button>
    </>
  );
};

export default DiaryContent;
