'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';
import { Button } from '@/components/ui/shadcn/button';

export function NavigationEvents() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [writingState, setWritingState] = useRecoilState(recordWriteState);
  const stopRecordRef = useRef<HTMLButtonElement | null>(null);
  const handleStopWriting = () => {
    setWritingState({ content: '', isWaiting: false });
  };

  const handleStayWriting = () => {
    router.replace('/');
  };

  // 페이지 떠나기
  useEffect(() => {
    if (pathname !== '/' && writingState.content) {
      stopRecordRef.current?.click();
    }
  }, [pathname, writingState.content]);

  // 답변 도착
  useEffect(() => {
    const searchParams = new URLSearchParams(params.toString());
    // 답변도착 && 메인 화면
    if (pathname === '/' && searchParams.get('replied') === 'true') {
      router.refresh();
    }
  }, [pathname, params, router]);

  return (
    <>
      {/*답변도착 && 다른 화면 */}
      {pathname !== '/' && params.get('replied') === 'true' && (
        <Image
          className="fixed bottom-[24px] left-[5%] z-[999]"
          src="/assets/growmi/green_letter.svg"
          alt="replied"
          width={64}
          height={64}
        />
      )}
      {pathname !== '/' && writingState.content && (
        <AlertDialog>
          <AlertDialogTrigger ref={stopRecordRef} className="hidden">
            일기 작성 중단 팝업
          </AlertDialogTrigger>
          <AlertDialogOverlay>
            <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
              <div className="flex flex-col items-center gap-3">
                <AlertDialogHeader className="font-p-R18 m-2 overflow-y-auto rounded">
                  일기를 그만쓸까요? 지금까지 입력한 내용이 사라져요
                </AlertDialogHeader>
                <AlertDialogFooter className="grow flex flex-row gap-4 w-full">
                  <Button type="button" variant="secondary" className="mt-0 grow" asChild>
                    <AlertDialogCancel onClick={handleStayWriting}>
                      아니오
                    </AlertDialogCancel>
                  </Button>
                  <Button type="button" variant="secondary" className="grow" asChild>
                    <AlertDialogAction
                      className="bg-danger-600 text-primary-300"
                      onClick={handleStopWriting}
                    >
                      네, 그만 쓸래요
                    </AlertDialogAction>
                  </Button>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
}
