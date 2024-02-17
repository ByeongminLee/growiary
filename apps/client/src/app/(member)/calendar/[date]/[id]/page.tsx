import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import DiaryRecord from '@/components/calendar/DiaryRecord';
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
    return <DiaryRecord date={date} postId={id} />;
  }

  redirect('/');
}
