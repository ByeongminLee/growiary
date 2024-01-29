import { LoginView } from '@/components/LoginView';
import { LogoutView } from '@/components/LogoutView';
import { authOptions } from '@/utils/authOptions';
import { Initialization } from '../../../../../packages/types/src';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const initialization: Initialization = 'Hello World';

  if (session) {
    return <LogoutView />;
  }

  return (
    <div>
      {initialization}
      <h1 className="text-sub-yellow font-pretendard">Pretendard 적용</h1>
      <h1 className="bg-sub-yellow font-nanum">Nanum Myeongjo 적용</h1>
      <LoginView />
    </div>
  );
}
