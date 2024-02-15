'use client';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { DiaryTemplate, RecordType } from '@/types';
import { ChevronLeft } from 'lucide-react';

interface MainReplyViewProps {
  todayReply: RecordType;
  onClose: () => void;
}

const DiaryRecord = ({ todayReply, onClose }: MainReplyViewProps) => {
  const template: DiaryTemplate = todayReply && diaryTemplates[todayReply.template];

  return (
    <article
      className="h-full overflow-auto pb-[22px]"
      style={{
        backgroundColor: `${template.bgColor}`,
        paddingTop: '32px',
        marginTop: 'env(safe-area-inset-top)',
        height: 'calc(100% - env(safe-area-inset-top))',
      }}
    >
      <ChevronLeft className="ml-4 p-4 h-12 w-12 cursor-pointer" onClick={onClose} />
      {todayReply.content && <DiaryContent response={todayReply} />}
      {todayReply.answer && <DiaryReply response={todayReply} />}
    </article>
  );
};

export default DiaryRecord;
