'use client';
import { useEffect, useRef, useState } from 'react';
import { diaryTemplates } from '@/utils/getDiaryTemplates';
import { RecordType } from '@/types';
import { getFullStrDate } from '@/utils/getDateFormat';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { recordState } from '@/store';
import { ChevronLeft } from 'lucide-react';

interface MainReplyRecordViewProps {
  date: RecordType['selectedAt'] & RecordType['createAt'];
}
const DiaryRecordListView = ({ date: selectedAt }: MainReplyRecordViewProps) => {
  const router = useRouter();
  const [response, setResponse] = useState<RecordType[] | undefined>([]);
  const articleElRef = useRef<HTMLElement | null>(null);
  const [, , date, day] = getFullStrDate(selectedAt);
  const storedRecords = useRecoilValue(recordState);

  const handleClickPrevPage = () => {
    const searchParams = new URLSearchParams();

    (articleElRef.current as HTMLElement).style.transform = 'translateY(70%)';
    searchParams.set('date', selectedAt);
    router.push(`/calendar?${searchParams.toString()}`);
  };
  const handleClickRecord = (e: React.MouseEvent, res: RecordType) => {
    e.stopPropagation();
    router.push(`/calendar/${selectedAt}/${res.postId}`);
  };

  useEffect(() => {
    setResponse(storedRecords[selectedAt] || []);
  }, [storedRecords, selectedAt]);

  return (
    <section
      ref={articleElRef}
      className="mt-[-4px] h-full transition-[transform] ease-in-out duration-2000"
    >
      <ChevronLeft
        className="mx-4 p-4 h-12 w-12 bg-grayscale-100 cursor-pointer"
        onClick={handleClickPrevPage}
      />
      <div className="mt-4">
        <p className="pb-4 px-6 font-p-R16 text-grayscale-600">
          {parseInt(date, 10)}일 {day}
        </p>
        {response &&
          response.map(res => (
            <div
              key={res.postId}
              className="py-4 px-6 font-p-M16"
              style={{
                backgroundColor: diaryTemplates[res.template].bgColor,
                color: diaryTemplates[res.template].questionColor,
              }}
            >
              <div className="flex items-center">
                <p className="cursor-pointer" onClick={e => handleClickRecord(e, res)}>
                  {diaryTemplates[res.template].question}
                </p>
                {res.answer && (
                  <Image
                    src="/assets/growmi/bubble.png"
                    alt="growmi"
                    className="ml-1 h-[24px]"
                    width={24}
                    height={24}
                    priority
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default DiaryRecordListView;
