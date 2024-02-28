'use client';

import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { recordState, recordWriteState, waitingRecordsState } from '@/store';
import { tracking } from '@/utils/mixPannel';
import { useRouter } from 'next/navigation';
import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { CreatePostDTO } from '@growiary/types';

type UseCreateRecordBodyType = {
  to?: 'AI';
  body: CreatePostDTO;
};
export const useCreateRecord = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setWriteState = useSetRecoilState(recordWriteState);
  const setWaitingRecords = useSetRecoilState(waitingRecordsState);
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
      const date = getDateFromServer(data.selectedAt || data.createAt);

      to ? tracking('그루미에게 답장받기 클릭') : tracking('일기 작성하기 클릭');
      setWriteState(prev => ({ ...prev, content: '', state: 'SAVE' }));
      setWaitingRecords(prev => ({
        waitingList: [data, ...prev.waitingList],
      }));
      try {
        queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
          const newData = {
            ...old,
            [date]: [...(old?.[date] || []), data],
          };

          setRecords(newData);

          return newData;
        });
        router.push(`/calendar/${date}/${data.postId}`);
      } catch {
        const error = new Error(data.postId);
        error.name = 'Saving error';
        throw error;
      }
    },
    onError: (error, variables, context) => {
      if (error.name === 'Saving error') {
        router.push(
          `/calendar/${getDateFromServer(variables.body.date as string)}/${error.message}`,
        );
      } else {
        alert('일기 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  });

  return { mutation };
};
