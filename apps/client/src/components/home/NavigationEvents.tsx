'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recordWriteState } from '@/store';
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
  const router = useRouter();
  const [writingState, setWritingState] = useRecoilState(recordWriteState);
  const stopRecordRef = useRef<HTMLButtonElement | null>(null);
  const handleStopWriting = () => {
    setWritingState(prev => ({ ...prev, content: '', isWaiting: false }));
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

  return (
    <>
      {pathname !== '/' && writingState.content && (
        <AlertDialog>
          <AlertDialogTrigger ref={stopRecordRef} className="hidden">
            일기 작성 중단 팝업
          </AlertDialogTrigger>
          <AlertDialogOverlay>
            <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
              <div className="flex flex-col items-center gap-3">
                <AlertDialogHeader className="font-p-R18 m-2 overflow-y-auto rounded">
                  일기를 그만쓸까요? <br /> 지금까지 입력한 내용이 사라져요
                </AlertDialogHeader>
                <AlertDialogFooter className="flex grow flex-row gap-4 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-0"
                    style={{ flex: 1 }}
                    asChild
                  >
                    <AlertDialogCancel onClick={handleStayWriting}>
                      아니오
                    </AlertDialogCancel>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="grow-2"
                    style={{ flex: 2 }}
                    asChild
                  >
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
