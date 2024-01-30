import { LogoutView } from '@/components/profile/LogoutView';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import NickNameSettingView from '@/components/home/NickNameSettingView';
import OnboardView from '@/components/home/OnboardView';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <NickNameSettingView />;
  }

  return <OnboardView />;
}
