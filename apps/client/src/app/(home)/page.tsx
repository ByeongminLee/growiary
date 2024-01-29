import { LogoutView } from '@/components/home/LogoutView';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import OnboardView from '@/components/home/OnboardView';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <LogoutView />;
  }

  return <OnboardView />;
}
