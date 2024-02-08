import ServiceTermView from '@/components/home/welcome/ServiceTermView';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { getProfile } from '@/utils/requestProfile';
import { ApiResponse, ProfileResType } from '@/types';

export default async function AgreementPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const initialProfile = (await getProfile({
      id: session?.id,
    })) as ApiResponse<ProfileResType>;

    if ('data' in initialProfile && initialProfile.data.profile.userName) {
      redirect('/');
    }

    return <ServiceTermView />;
  }
  redirect('/login');
}
