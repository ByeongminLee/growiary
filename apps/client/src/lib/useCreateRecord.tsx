'use client';

import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { tracking } from '@/utils/mixPannel';
import { useRouter } from 'next/navigation';
import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import { getDateFromServer } from '@/utils/getDateFormat';

type UseCreateRecordBodyType = {
  to?: 'AI';
  body: {
    content: string;
    template: string;
  };
};
export const useCreateRecord = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setWriteState = useSetRecoilState(recordWriteState);
  const queryClient = useQueryClient();
  const setRecords = useSetRecoilState(recordState);

  const mutation = useMutation({
    mutationKey: ['createRecord'],
    mutationFn: async ({
      body,
      to,
    }: UseCreateRecordBodyType): Promise<ApiSuccess<RecordType>> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}` + `${to ? '/post/ai' : '/post'}`,
        {
          method: 'POST',
          headers: {
            Authorization: session?.id || '',
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(body),
        },
      );
      return response.json();
    },
    onSuccess: ({ data }, { to }) => {
      const date = getDateFromServer(data.createAt);

      to ? tracking('그루미에게 답장받기 클릭') : tracking('일기 작성하기 클릭');
      setWriteState(prev => ({ ...prev, content: '', state: 'SAVE' }));
      queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
        const newData = {
          ...old,
          [date]: [...(old[date] || []), data],
        };

        setRecords(newData);

        return newData;
      });
      router.push(`/calendar/${date}/${data.postId}`);
    },
    onError: () => {
      alert('문제 발생');
    },
  });

  return { mutation };
};
