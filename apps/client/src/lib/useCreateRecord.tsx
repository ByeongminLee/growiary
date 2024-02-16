'use client';

import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { recordState, recordWriteState } from '@/store';
import { tracking } from '@/utils/mixPannel';
import { useRouter } from 'next/navigation';
import { ApiSuccess, RecordType } from '@/types';
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
  const params = new URLSearchParams();
  const setWriteState = useSetRecoilState(recordWriteState);
  const setRecordState = useSetRecoilState(recordState);
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
    onSuccess: (result, { to }) => {
      const date = getDateFromServer(result.data.createAt);
      moveToDiaryRecord(result.data.postId, to);
      setRecordState(prev => ({ ...prev, [date]: [...(prev[date] || []), result.data] }));
    },
    onError: () => {
      alert('문제 발생');
    },
  });

  const moveToDiaryRecord = (postId: string, to?: 'AI') => {
    if (to) {
      tracking('그루미에게 답장받기 클릭');
    } else {
      tracking('일기 작성하기 클릭');
    }
    setWriteState(prev => ({ ...prev, content: '', state: 'SAVE' }));
    params.set('id', postId);
    router.push(`/calendar?${params}`);
  };

  return { mutation };
};
