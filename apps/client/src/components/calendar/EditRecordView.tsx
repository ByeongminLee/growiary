'use client';
import { DiaryTemplate, RecordType } from '@/types';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { getFullStrDate } from '@/utils/getDateFormat';
import { useRecoilState, useRecoilValue } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import Toast from '@/components/ui/Toast';
import { useEditRecord } from '@/lib/useEditRecord';
import OneTimeToast from '@/components/ui/OneTimeToast';
import { X } from 'lucide-react';
import Link from 'next/link';

type EditRecordViewProps = {
  postId: RecordType['postId'];
  date: RecordType['selectedAt'] & RecordType['createAt'];
};

const bottomArea = 80;

const EditRecordView = ({ postId, date: selectedAt }: EditRecordViewProps) => {
  const storedRecord = useRecoilValue(recordState);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const [toastContent, setToastContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [record, setRecord] = useState<RecordType | null>(null);
  const [writeState, setWriteState] = useRecoilState(recordWriteState);
  const [scrollHeight, setScrollHeight] = useState('100%');
  const [year, month, date, day] = getFullStrDate(selectedAt);
  const template: DiaryTemplate = diaryTemplates[record?.template || '0'];

  const onSuccessEditRecord = () => {
    setIsSubmitted(true);
  };

  const { mutation } = useEditRecord({
    postId,
    date: selectedAt,
    onSuccessCb: onSuccessEditRecord,
  });

  useEffect(() => {
    // textareaRef.current?.focus();
    const targetRecord = storedRecord[selectedAt]?.find(v => v.postId === postId);
    if (targetRecord) {
      setRecord(targetRecord);
      setWriteState(prev => ({
        ...prev,
        content: prev.tempContent || targetRecord.content,
      }));
    }
  }, []);

  const showToast = (content: string) => {
    if (!toastRef.current) return;

    const target = toastRef.current;

    target.style.display = 'block';
    setToastContent(content);

    const timeoutId = setTimeout(() => {
      target.style.display = 'none';
      clearTimeout(timeoutId);
    }, 3000);
  };

  const handleFocusInput = () => {
    const timeoutId = setTimeout(() => {
      const textarea = textareaRef.current as HTMLTextAreaElement;
      const totalBottomArea =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--safe-margin'),
          10,
        ) + bottomArea;
      const sub =
        window.visualViewport &&
        document.documentElement.clientHeight -
          window.visualViewport.height -
          totalBottomArea;
      document.documentElement.clientHeight !== window.visualViewport?.height &&
        sub &&
        setScrollHeight(textarea.clientHeight - sub + 'px');
      clearTimeout(timeoutId);
    }, 200);
  };
  const handleBlurInput = () => {
    setScrollHeight('100%');
  };

  const handleChangeContent = (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLTextAreaElement).value;

    if (value.length === 1000) {
      showToast('아쉽지만 1000자 이하의 메시지만 작성할 수 있어요');
    }

    setWriteState(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async () => {
    if (writeState.content.length < 10) {
      showToast('10자 이상의 메시지만 작성할 수 있어요');
      return;
    }
    await mutation.mutateAsync({ content: writeState.content });
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: `${template.bgColor}` }}
    >
      <Link href={`/calendar/${selectedAt}/${postId}`}>
        <X className="mt-[-4px] mx-4 p-4 h-12 w-12 cursor-pointer" />
      </Link>
      <p className="mx-9 font-p-R16 text-primary-500 mb-1">
        {year}년 {month}월 {date}일 {day}
      </p>
      <section
        className="flex-1 flex flex-col px-9 pb-8"
        style={{ marginBottom: bottomArea + 12 + 'px' }}
      >
        <div className="flex items-center mb-4">
          <h2
            style={{ color: `${template.questionColor}` }}
            className="font-p-M20 break-keep"
          >
            {template.question}
          </h2>
        </div>
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            style={{
              color: template.answerColor,
              pointerEvents: 'initial',
              height: scrollHeight,
              caretColor: template.caretColor,
            }}
            className={`diary-text p-2 placeholder:font-p-R18-2 placeholder:text-primary-600 font-p-R18-2 block bg-transparent w-full mb-1 resize-none focus-visible:border-0 focus-visible:outline-0 focus:outline-0 focus:outline-none focus:border-0`}
            placeholder={template.placeholder}
            maxLength={1000}
            minLength={10}
            value={writeState?.content}
            onFocus={handleFocusInput}
            onBlur={handleBlurInput}
            onChange={handleChangeContent}
          ></textarea>
          <div className={`text-right ${writeState.content.length ? 'block' : ''}`}>
            <span className="inline-block bg-opacity-70 font-p-R16 p-1 text-primary-500">
              <span
                className={`${writeState.content.length >= 1000 ? 'text-danger-500' : ''}`}
              >
                {writeState.content.length}
              </span>{' '}
              / 1000
            </span>
          </div>
        </div>
        <Button
          className="absolute w-[calc(100%-48px)] bottom-0 left-6 z-50 mb-6"
          onClick={handleSubmit}
        >
          수정하기
        </Button>
      </section>
      <Toast ref={toastRef}>{toastContent}</Toast>
      {isSubmitted && (
        <OneTimeToast timeout={1500}>
          <div className="flex flex-col items-center justify-center">
            <p>일기가 수정되었어요</p>
          </div>
        </OneTimeToast>
      )}
    </div>
  );
};

export default EditRecordView;
