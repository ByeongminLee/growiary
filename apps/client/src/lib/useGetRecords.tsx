import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecords } from '@/utils/requestRecord';
import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useSetRecoilState } from 'recoil';
import { recordState } from '@/store';

type UseGetRecordProps = {
  onSuccessCb?: (value: ApiSuccess<RecordType[]>) => void;
};

type UseGetRecordBodyType = {
  body: { startDate: string; endDate: string };
};

export const useGetRecords = ({ onSuccessCb }: UseGetRecordProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const setRecords = useSetRecoilState(recordState);

  const mutation = useMutation({
    mutationKey: ['records'],
    mutationFn: ({ body }: UseGetRecordBodyType) =>
      getRecords({
        id: session?.id || '',
        body,
      }),
    onSuccess: result => {
      queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
        const collectedData = [...(result.data || [])].reduce(
          (f: CollectedRecordType, v: RecordType) => {
            const key = getDateFromServer(v.createAt);
            return {
              ...f,
              [key]: [...(f[key] || []), v],
            };
          },
          {} as CollectedRecordType,
        );
        setRecords(collectedData);

        return {
          ...old,
          ...collectedData,
        };
      });
      onSuccessCb && onSuccessCb(result);
    },
  });

  return { mutation, queryClient };
};
