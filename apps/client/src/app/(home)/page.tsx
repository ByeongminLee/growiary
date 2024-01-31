import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import OnboardView from '@/components/home/OnboardView';
import ServiceTermView from '@/components/home/ServiceTermView';
import MainView from '@/components/home/MainView';
import { UserProfileDTO } from '@growiary/types';
import { ApiError, ApiSuccess } from '@/types';

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
    const status: ApiSuccess<{ profile: UserProfileDTO }> | ApiError =
      await getUserNickName(session.id);

    if ('data' in status) {
      return <MainView userProfile={status.data.profile} />;
    } else {
      return <ServiceTermView />;
    }
  }

  return <OnboardView />;
}
