import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import OnboardView from '@/components/home/OnboardView';
import ServiceTermView from '@/components/home/ServiceTermView';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // TODO: 닉네임 여부 확인
    return <ServiceTermView />;
    // return <LogoutView />;
  }

  return <ServiceTermView />;
  // return <OnboardView />;
}
