'use client';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { DiaryTemplate, RecordType } from '@/types';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
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
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { PostEditDTO } from '@growiary/types';
import OneTimeToast from '@/components/ui/OneTimeToast';
import { useSetRecoilState } from 'recoil';
import { recordState } from '@/store';
import { getDateFromServer } from '@/utils/getDateFormat';

interface MainReplyViewProps {
  todayReply: RecordType;
  onClose: () => void;
}

const DiaryRecord = ({ todayReply, onClose }: MainReplyViewProps) => {
  const { data: session } = useSession();
  const template: DiaryTemplate = todayReply && diaryTemplates[todayReply.template];
  const [showMenu, setShowMenu] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const removeModalRef = useRef<HTMLButtonElement | null>(null);
  const modifyModalRef = useRef<HTMLButtonElement | null>(null);
  const setRecords = useSetRecoilState(recordState);
  const date = getDateFromServer(todayReply.createAt);
  const mutation = useMutation({
    mutationKey: ['editRecord'],
    mutationFn: async ({ content, status }: Omit<PostEditDTO, 'postId'>) => {
      const bodyObj = {
        postId: todayReply.postId,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/edit`, {
        method: 'POST',
        headers: {
          Authorization: session?.id || '',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(status ? { ...bodyObj, status } : { ...bodyObj, content }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: (result, { content, status }) => {
      if (status === 'DELETED') {
        setRecords(prev => ({
          ...prev,
          [date]: prev[date].filter(v => v.postId !== todayReply.postId),
        }));
        setToastContent('일기가 삭제되었어요');
      }
    },
  });

  const handleClickRemoveModal = () => {
    setShowMenu(false);
    removeModalRef.current?.click();
  };

  const handleClickModifyModal = () => {
    setShowMenu(false);
    modifyModalRef.current?.click();
  };

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  const handleClickRemove = async () => {
    await mutation.mutateAsync({ status: 'DELETED' });
  };

  const afterRemoveFn = () => {
    onClose();
  };

  return (
    <article
      className="h-full overflow-auto pb-[22px]"
      style={{
        backgroundColor: `${template.bgColor}`,
        paddingTop: '32px',
        marginTop: 'env(safe-area-inset-top)',
        height: 'calc(100% - env(safe-area-inset-top))',
      }}
    >
      <div className="relative flex items-center justify-between mx-4">
        <ChevronLeft className="p-4 h-12 w-12 cursor-pointer" onClick={onClose} />
        <Image
          src="/assets/icons/hamburger.png"
          alt="menu"
          width={24}
          height={24}
          className="p-4 h-12 w-12 cursor-pointer"
          onClick={toggleMenu}
        />
        {showMenu && (
          <div className="absolute top-full right-0 flex flex-col items-center w-[120px] bg-primary-100 border border-primary-900 rounded-lg">
            <Button
              variant="third"
              className="text-danger-500"
              onClick={handleClickRemoveModal}
            >
              <Image
                src="/assets/icons/trash.png"
                alt="trash"
                width={16}
                height={16}
                className="mr-2"
              />
              삭제
            </Button>
            <Button variant="third" onClick={handleClickModifyModal}>
              <Image
                src="/assets/icons/pencil.png"
                alt="pencil"
                width={16}
                height={16}
                className="mr-2"
              />
              수정
            </Button>
          </div>
        )}
      </div>
      {todayReply.content && <DiaryContent response={todayReply} />}
      {todayReply.answer && <DiaryReply response={todayReply} />}

      <AlertDialog>
        <AlertDialogTrigger ref={removeModalRef} className="hidden">
          일기 삭제 팝업
        </AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
            <div className="flex flex-col items-center gap-3">
              <AlertDialogHeader className="font-p-R18 m-2 overflow-y-auto rounded">
                일기를 삭제할까요? <br />
                삭제된 글은 복원할 수 없어요
              </AlertDialogHeader>
              <AlertDialogFooter className="flex grow flex-row gap-4 w-full">
                <AlertDialogCancel className="flex-1 border-0">아니오</AlertDialogCancel>
                <Button
                  type="button"
                  variant="secondary"
                  compoundVariants="danger"
                  style={{ flex: 2 }}
                  asChild
                >
                  <AlertDialogAction onClick={handleClickRemove}>
                    네, 삭제할래요
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger ref={modifyModalRef} className="hidden">
          일기 수정 팝업
        </AlertDialogTrigger>
        <AlertDialogOverlay>
          <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
            <div className="flex flex-col items-center gap-3">
              <AlertDialogHeader className="font-p-R18 m-2 overflow-y-auto rounded">
                {todayReply.answer ? (
                  <p>
                    일기를 수정할까요? <br />
                    그루미의 답장 내용은 일기를 수정해도 바뀌지 않아요.
                  </p>
                ) : (
                  '일기를 수정할까요?'
                )}
              </AlertDialogHeader>
              <AlertDialogFooter className="flex grow flex-row gap-4 w-full">
                <AlertDialogCancel className="flex-1 border-0">아니오</AlertDialogCancel>
                <Button
                  type="button"
                  className="font-p-R18 font-normal"
                  style={{ flex: 2 }}
                  asChild
                >
                  <AlertDialogAction
                  // onClick={handleStopWriting}
                  >
                    네, 수정할게요
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {toastContent && (
        <OneTimeToast timeout={1500} afterFn={afterRemoveFn}>
          <div className="flex flex-col items-center justify-center">
            <p>{toastContent}</p>
          </div>
        </OneTimeToast>
      )}
    </article>
  );
};

export default DiaryRecord;
