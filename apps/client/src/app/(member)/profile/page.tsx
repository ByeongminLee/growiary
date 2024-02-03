import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import ProfileView from '@/components/profile/ProfileView';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <ProfileView />;
  }
  redirect('/');
}
