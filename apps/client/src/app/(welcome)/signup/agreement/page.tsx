import ServiceTermView from '@/components/home/welcome/ServiceTermView';
import NickNameSettingView from '@/components/home/welcome/NickNameSettingView';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export default async function AgreementPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <ServiceTermView />;
  }
  redirect('/login');
}
