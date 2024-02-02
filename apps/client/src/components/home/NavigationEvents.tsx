'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';
import Image from 'next/image';

export function NavigationEvents() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [isWriting, setIsWriting] = useRecoilState(recordWriteState);

  useEffect(() => {
    if (pathname !== '/' && isWriting) {
      if (confirm('이 페이지를 떠나겠습니까?')) {
        setIsWriting('');
      } else {
        router.replace('/');
      }
    }
    const searchParams = new URLSearchParams(params.toString());
    console.log(searchParams, searchParams.has('state'));
    if (pathname !== '/' && searchParams.has('state')) {
      console.log('답변 도착!');
    } else if (pathname === '/' && searchParams.has('state')) {
      router.refresh();
    }
  }, [pathname, params, isWriting]);

  return (
    <>
      {params.has('state') && (
        <Image
          className="fixed bottom-[24px] left-[calc(50%-65px)] z-[999]"
          src="/assets/growmi/green_letter.svg"
          alt="replied"
          width={64}
          height={64}
        />
      )}
    </>
  );
}
