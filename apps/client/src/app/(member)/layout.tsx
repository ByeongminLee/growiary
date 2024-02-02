'use client';
import Tab from '@/components/ui/Tab';
import { NavigationEvents } from '@/components/home/NavigationEvents';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main
        className="fixed inset-x-0 inset-y-0"
        style={{
          marginBottom: 'calc(env(safe-area-inset-bottom) + 48px)',
          marginTop: 'env(safe-area-inset-top)',
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
