import { LoginView } from '@/components/home/LoginView';
import { LogoutView } from '@/components/profile/LogoutView';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <LogoutView />;
  }

  return <LoginView />;
}
