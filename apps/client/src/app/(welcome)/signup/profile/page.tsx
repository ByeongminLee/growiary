import NickNameSettingView from '@/components/home/NickNameSettingView';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <NickNameSettingView />;
  }
  redirect('/login');
}
