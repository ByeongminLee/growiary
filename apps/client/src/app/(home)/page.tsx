import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import OnboardView from '@/components/home/OnboardView';
import ServiceTermView from '@/components/home/ServiceTermView';
import MainView from '@/components/home/MainView';

const getUserNickName = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: id,
    },
  });
  return await response.json();
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // TODO: UserProfileDTO || { status: number, message: string}
    const status = await getUserNickName(session.id);
    return status?.status === 404 ? <ServiceTermView /> : <MainView />;
  }

  return <OnboardView />;
}
