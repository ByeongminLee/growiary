import { LoginView } from '@/components/LoginView';
import { LogoutView } from '@/components/LogoutView';
import { authOptions } from '@/utils/authOptions';
import { Initialization } from '@growiary/types';
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
      <LoginView />
    </div>
  );
}
