import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
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
  const session = await getServerSession(authOptions);

  if (session) {
    return <EditRecordView date={date} postId={id} />;
  }

  redirect('/');
}
