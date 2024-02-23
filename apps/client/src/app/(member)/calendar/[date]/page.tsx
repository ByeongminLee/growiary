import { RecordType } from '@/types';
import DiaryRecordListView from '@/components/calendar/DiaryRecordListView';

type RecordListPageProps = {
  params: {
    date: RecordType['createAt'];
  };
};
export default async function RecordListPage({ params: { date } }: RecordListPageProps) {
  return <DiaryRecordListView date={date} />;
}
