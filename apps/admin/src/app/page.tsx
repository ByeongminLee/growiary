import { AdminGuardView, DashboardView } from '@/components';
import { authOptions } from '@/utils/authOptions';
import fetcher from '@/utils/fetcher';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function adminGuard(userId: string) {
  const result = await fetcher({
    url: 'admin-guard',
    body: { userId: userId },
  });

  return result.result;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  let checkAdmin = false;

  if (!session || !session.id) redirect('/login');

  checkAdmin = await adminGuard(session.id);

  if (!checkAdmin) {
    return <AdminGuardView />;
  }

  return <DashboardView />;
}
