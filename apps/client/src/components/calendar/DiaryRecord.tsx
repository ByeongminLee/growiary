'use client';
import DiaryContent from '@/components/home/DiaryContent';
import DiaryReply from '@/components/home/DiaryReply';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { CollectedRecordType, RecordType } from '@/types';
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
import { useEffect, useRef, useState } from 'react';
import OneTimeToast from '@/components/ui/OneTimeToast';
import { useEditRecord } from '@/lib/useEditRecord';
import { useRecoilState, useRecoilValue } from 'recoil';
import { initExperienceState, recordState, recordWriteState } from '@/store';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useRouter } from 'next/navigation';

interface MainReplyViewProps {
  date: RecordType['createAt'];
  postId: RecordType['postId'];
}

const DiaryRecord = ({ date, postId }: MainReplyViewProps) => {
  const router = useRouter();
  const [records, setRecords] = useState<CollectedRecordType | null>(null);
  const storedRecords = useRecoilValue(recordState);
  const todayReply = records && records[date]?.find(v => v.postId === postId);
  const template = diaryTemplates[todayReply?.template || '0'];
  const [showMenu, setShowMenu] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const removeModalRef = useRef<HTMLButtonElement | null>(null);
  const modifyModalRef = useRef<HTMLButtonElement | null>(null);
  const [writeState, setWriteState] = useRecoilState(recordWriteState);
  const [initExperience, setInitExperience] = useRecoilState(initExperienceState);

  const onSuccessEditRecord = () => {
    setToastContent('일기가 삭제되었어요');
  };

  const { mutation } = useEditRecord({
    postId,
    date,
    onSuccessCb: onSuccessEditRecord,
  });

  const handleClickPrevPage = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('date', getDateFromServer(date));
    router.push(`/calendar?${searchParams.toString()}`);
  };

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

  const handleMoveToEditPage = async () => {
    setWriteState(prev => ({ ...prev, state: 'EDIT' }));
    router.push(`/calendar/${date}/${postId}/edit`);
  };

  useEffect(() => {
    setRecords(storedRecords);
  }, [storedRecords]);

  useEffect(function ToggleToast() {
    let initExperienceTimeoutId: NodeJS.Timeout;
    let writeStateTimeoutId: NodeJS.Timeout;

    if (writeState.state === 'SAVE') {
      setToastContent(
        todayReply?.answer && initExperience.initSubmit
          ? '그루미와의 첫 대화 축하드려요\n그루어리와 함께 매일 성장해요!'
          : '일기가 저장되었어요',
      );

      writeStateTimeoutId = setTimeout(() => {
        setWriteState(prev => ({ ...prev, state: 'NONE' }));
      }, 3000);
    }

    if (initExperience.initSubmit) {
      initExperienceTimeoutId = setTimeout(() => {
        setInitExperience(prev => ({ ...prev, initSubmit: false }));
      }, 3000);
    }

    return () => {
      initExperienceTimeoutId && clearTimeout(initExperienceTimeoutId);
      writeStateTimeoutId && clearTimeout(writeStateTimeoutId);
    };
  }, []);

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
        <ChevronLeft
          className="p-4 h-12 w-12 cursor-pointer"
          onClick={handleClickPrevPage}
        />
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
      {todayReply?.content && <DiaryContent response={todayReply} />}
      {todayReply?.answer && <DiaryReply response={todayReply} />}

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
                {todayReply?.answer ? (
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
                  <AlertDialogAction onClick={handleMoveToEditPage}>
                    네, 수정할게요
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {toastContent && (
        <OneTimeToast timeout={1500} afterFn={() => setToastContent('')}>
          <div className="flex flex-col items-center justify-center">
            {toastContent.split('\n').map((el: string, idx: number) => (
              <p key={idx}>
                {el}
                <br />
              </p>
            ))}
          </div>
        </OneTimeToast>
      )}
    </article>
  );
};

export default DiaryRecord;
