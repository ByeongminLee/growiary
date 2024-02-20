import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectedRecordType, RecordType } from '@/types';
import { PostEditDTO } from '@growiary/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordState, recordWriteState } from '@/store';

type UseEditRecordProps = {
  onSuccessCb: () => void;
  postId: RecordType['postId'];
  date: RecordType['createAt'];
};

export const useEditRecord = ({ onSuccessCb, postId, date }: UseEditRecordProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [records, setRecords] = useRecoilState(recordState);
  const setWriteState = useSetRecoilState(recordWriteState);

  const mutation = useMutation({
    mutationKey: ['editRecord'],
    mutationFn: async ({ content, status }: Omit<PostEditDTO, 'postId'>) => {
      const bodyObj = {
        postId,
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
      const key = getDateFromServer(date);
      onSuccessCb();

      const timeoutId = setTimeout(() => {
        queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
          if (!old) {
            old = records;
          }
          const newData = {
            ...old,
            [key]:
              status === 'DELETED'
                ? old[key].filter(v => v.postId !== postId)
                : old[key].map(v =>
                    v.postId !== postId ? v : { ...v, content: content! },
                  ),
          };

          if (!newData[key]?.[0]?.postId) {
            delete newData[key];
          }
          setRecords(newData);

          return newData;
        });
        setWriteState(prev => ({ ...prev, content: '', tempContent: '', state: 'NONE' }));
        router.push(`/calendar/${key}`);
        clearTimeout(timeoutId);
      }, 1500);
    },
  });

  return { mutation };
};
