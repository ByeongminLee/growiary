'use client';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { DiaryTemplate, RecordType } from '@/types';

interface MainReplyViewProps {
  todayReply?: RecordType;
}

const MainReplyView = ({ todayReply = {} as RecordType }: MainReplyViewProps) => {
  const template: DiaryTemplate = todayReply && diaryTemplates[todayReply.template];

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
      {todayReply.content && <DiaryContent response={todayReply} />}
      {todayReply.answer && <DiaryReply response={todayReply} />}
    </article>
  );
};

export default MainReplyView;
