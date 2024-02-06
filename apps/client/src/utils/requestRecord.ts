type FetchRecordProps<T> = {
  id?: string;
  body?: T;
};
export const getRecords = async <T, R>({
  id = '',
  body,
}: FetchRecordProps<T>): Promise<R> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/filter`, {
    method: 'POST',
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
