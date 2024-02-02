'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';

export function NavigationEvents() {
  const pathname = usePathname();
  const router = useRouter();
  const [isWriting, setIsWriting] = useRecoilState(recordWriteState);

  useEffect(() => {
    if (pathname !== '/' && isWriting) {
      if (confirm('이 페이지를 떠나겠습니까?')) {
        setIsWriting('');
      } else {
        router.replace('/');
        setIsWriting(isWriting);
      }
    }
  }, [pathname, isWriting]);

  return null;
}
