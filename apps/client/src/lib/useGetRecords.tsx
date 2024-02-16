import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { getRecords } from '@/utils/requestRecord';
import { ApiSuccess, RecordType } from '@/types';

type UseGetRecordProps = {
  onSuccessCb: (value: ApiSuccess<RecordType[]>) => void;
};

type UseGetRecordBodyType = {
  body: { startDate: string; endDate: string };
};

export const useGetRecord = ({ onSuccessCb }: UseGetRecordProps) => {
  const { data: session } = useSession();
  const mutation = useMutation({
    mutationKey: ['records'],
    mutationFn: ({ body }: UseGetRecordBodyType) =>
      getRecords({
        id: session?.id || '',
        body,
      }),
    onSuccess: result => {
      onSuccessCb(result);
    },
  });

  return { mutation };
};
