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

const history: string[] = [];
export function NavigationEvents() {
  const pathname = usePathname();
  const router = useRouter();
  const [writingState, setWritingState] = useRecoilState(recordWriteState);
  const stopRecordRef = useRef<HTMLButtonElement | null>(null);
  const handleStopWriting = () => {
    setWritingState(prev => ({ ...prev, content: '', state: 'NONE' }));
  };

  const handleStayWriting = () => {
    history.pop();
    const writingPage = history.pop();
    // 커서 마지막 위치 이동 위함
    writingState.state === 'EDIT' &&
      setWritingState(prev => ({ ...prev, content: '', tempContent: prev.content }));
    writingPage && router.replace(writingPage);
  };

  // 페이지 떠나기
  useEffect(() => {
    history.push(pathname);

    if (
      writingState.state !== 'EDIT'
        ? pathname !== '/' && writingState.content
        : !pathname.includes('edit')
    ) {
      stopRecordRef.current?.click();
    }
  }, [pathname]);

  return (
    <>
      {(writingState.state !== 'EDIT'
        ? pathname !== '/' && writingState.content
        : !pathname.includes('edit')) && (
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
                  <AlertDialogCancel
                    className="flex-1 border-0"
                    onClick={handleStayWriting}
                  >
                    아니오
                  </AlertDialogCancel>
                  <Button
                    type="button"
                    variant="secondary"
                    compoundVariants="danger"
                    style={{ flex: 2 }}
                    asChild
                  >
                    <AlertDialogAction onClick={handleStopWriting}>
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
