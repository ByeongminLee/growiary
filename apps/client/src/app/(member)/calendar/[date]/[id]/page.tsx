import DiaryRecordView from '@/components/calendar/DiaryRecordView';
import { RecordType } from '@/types';

type RecordDetailPageProps = {
  params: {
    date: RecordType['createAt'];
    id: RecordType['postId'];
  };
};
export default async function RecordDetailPage({
  params: { date, id },
}: RecordDetailPageProps) {
  return <DiaryRecordView date={date} postId={id} />;
}
