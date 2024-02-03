type fetchProps<T> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  id?: string;
  body?: T;
};
export const requestApi = async <T, R>(
  url: string,
  { method = 'GET', id = '', body }: fetchProps<T>,
): Promise<R> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
