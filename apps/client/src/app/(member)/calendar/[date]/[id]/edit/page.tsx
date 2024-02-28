import { RecordType } from '@/types';
import EditRecordView from '@/components/calendar/EditRecordView';

type RecordDetailPageProps = {
  params: {
    date: RecordType['createAt'];
    id: RecordType['postId'];
  };
};
export default async function RecordDetailPage({
  params: { date, id },
}: RecordDetailPageProps) {
  return <EditRecordView date={date} postId={id} />;
}
