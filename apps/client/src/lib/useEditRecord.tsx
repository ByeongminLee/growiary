import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectedRecordType, RecordType } from '@/types';
import { PostEditDTO } from '@growiary/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { fetchApi } from '@/utils/fetchApi';

type UseEditRecordProps = {
  onSuccessCb: () => void;
  postId: RecordType['postId'];
  date: RecordType['selectedAt'] & RecordType['createAt'];
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
      return fetchApi('/post/edit', {
        method: 'POST',
        id: session?.id,
        body: status ? { ...bodyObj, status } : { ...bodyObj, content },
      });
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
