import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { LogoutView } from '@/components/profile/LogoutView';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return <LogoutView />;
}
