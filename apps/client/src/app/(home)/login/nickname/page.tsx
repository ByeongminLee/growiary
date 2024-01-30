import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import NickNameSettingView from '@/components/home/NickNameSettingView';
import ServiceTermView from '@/components/home/ServiceTermView';

export default async function NickNamePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <NickNameSettingView />;
  }

  return <ServiceTermView />;
}
