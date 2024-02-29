import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecords } from '@/utils/requestRecord';
import { ApiSuccess, CollectedRecordType, RecordType } from '@/types';
import { getDateFromServer } from '@/utils/getDateFormat';
import { useSetRecoilState } from 'recoil';
import { recordState } from '@/store';
import { FilterFindPostDTO } from '@growiary/types';

type UseGetRecordProps = {
  onSuccessCb?: (
    value: ApiSuccess<RecordType[]>,
    storedObj?: CollectedRecordType,
  ) => void;
};

type UseGetRecordBodyType = {
  body: FilterFindPostDTO;
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
        body: { ...body, offset: new Date().getTimezoneOffset() },
      }),
    onSuccess: result => {
      queryClient.setQueryData(['records'], (old: CollectedRecordType) => {
        const collectedData = [...(result.data || [])].reduce(
          (f: CollectedRecordType, v: RecordType) => {
            const key = getDateFromServer(v.selectedAt || v.createAt);
            return {
              ...f,
              [key]: [...(f[key] || []), v],
            };
          },
          {},
        );
        setRecords(collectedData);
        onSuccessCb && onSuccessCb(result, collectedData);

        return {
          ...old,
          ...collectedData,
        };
      });
    },
  });

  return { mutation };
};
