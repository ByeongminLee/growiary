import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import { RecordType } from '@/types';
import DiaryRecordListView from '@/components/calendar/DiaryRecordListView';

type RecordListPageProps = {
  params: {
    date: RecordType['createAt'];
  };
};
export default async function RecordListPage({ params: { date } }: RecordListPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    return <DiaryRecordListView date={date} />;
  }

  redirect('/');
}
