import Tab from '@/components/home/Tab';
import { NavigationEvents } from '@/components/home/NavigationEvents';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';

export default async function asLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // 로그인이 되어있지않으면 랜딩화면
  if (!session) {
    redirect('/welcome');
  }

  return (
    <div className="h-screen">
      <main
        className="fixed inset-x-0 inset-y-0 bg-grayscale-100"
        style={{
          marginBottom: 'calc(env(safe-area-inset-bottom) + 48px)',
        }}
      >
        {children}
      </main>
      <Tab />
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </div>
  );
}
