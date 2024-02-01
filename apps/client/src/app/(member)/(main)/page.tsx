import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import MainView from '@/components/home/MainView';
import { UserProfileDTO } from '@growiary/types';
import { ApiError, ApiSuccess } from '@/types';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

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
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <MainView userProfile={status.data.profile} />
        </Suspense>
      );
    } else {
      redirect('/signup/agreement');
    }
  }
  // redirect('/all');
  redirect('/welcome');
}
