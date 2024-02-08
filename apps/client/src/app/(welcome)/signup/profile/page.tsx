import NickNameSettingView from '@/components/home/welcome/NickNameSettingView';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { getProfile } from '@/utils/requestProfile';
import { ApiResponse, ProfileResType } from '@/types';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const initialProfile = (await getProfile({
      id: session?.id,
    })) as ApiResponse<ProfileResType>;

    if ('data' in initialProfile && initialProfile.data.profile.userName) {
      redirect('/');
    }

    return <NickNameSettingView />;
  }
  redirect('/login');
}
