'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const WholeLandingView = () => {
  const router = useRouter();

  useEffect(() => {
    const isApp = window.matchMedia('(display-mode: standalone)').matches;
    const userAgent = navigator.userAgent.toLowerCase();
    const isiOSApp = userAgent.includes('iphone') && !userAgent.includes('safari');

    const targetURL = isApp || isiOSApp ? '/welcome/app' : '/welcome/web';

    router.replace(targetURL);
  }, [router]);

  return <></>;
};

export default WholeLandingView;
