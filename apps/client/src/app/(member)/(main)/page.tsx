import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import MainView from '@/components/home/main/MainView';
import { redirect } from 'next/navigation';
import { getProfile } from '@/utils/requestProfile';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const initialProfile = await getProfile({
    id: session?.id,
  });

  if ('data' in initialProfile && initialProfile.data.profile.userName) {
    // 일기 기록이 없으면 작성 화면
    return <MainView />;
  } else {
    // userName 없으면 서비스 동의 화면
    redirect('/signup/agreement');
  }
}
