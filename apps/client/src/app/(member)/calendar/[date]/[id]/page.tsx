import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
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
  const session = await getServerSession(authOptions);

  if (session) {
    return <DiaryRecordView date={date} postId={id} />;
  }

  redirect('/');
}
