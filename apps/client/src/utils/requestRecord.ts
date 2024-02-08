import { RecordType } from '@/types';

type FetchRecordProps = {
  id: string;
  body: {
    startDate: string;
    endDate: string;
  };
};
export const getRecords = async ({
  id = '',
  body,
}: FetchRecordProps): Promise<{ data: RecordType[] }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/filter`, {
    method: 'POST',
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    // throw new Error('Network response was not ok');
  }
  return response.json();
};
