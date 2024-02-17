import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectedRecordType, RecordType } from '@/types';
import { PostEditDTO } from '@growiary/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { recordState } from '@/store';

type UseEditRecordProps = {
  onSuccessCb: () => void;
  postId: RecordType['postId'];
  date: RecordType['createAt'];
};

export const useEditRecord = ({ onSuccessCb, postId, date }: UseEditRecordProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const setRecords = useSetRecoilState(recordState);

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
    onSuccess: (result, { status }) => {
      if (status === 'DELETED') {
        const key = getDateFromServer(date);
        const searchParams = new URLSearchParams();

        searchParams.set('date', date);
        onSuccessCb();
        const timeoutId = setTimeout(() => {
          queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
            const newData = {
              ...old,
              [key]: old[key].filter(v => v.postId !== postId),
            };

            setRecords(newData);

            return newData;
          });
          router.push(`/calendar?${searchParams.toString()}`);
          clearTimeout(timeoutId);
        }, 1500);
      }
    },
  });

  return { mutation };
};
