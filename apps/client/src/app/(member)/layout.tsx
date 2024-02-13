import Tab from '@/components/home/Tab';
import { NavigationEvents } from '@/components/home/NavigationEvents';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main
        className="fixed inset-x-0 inset-y-0 bg-grayscale-100"
        style={{
          marginBottom: '48px',
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
