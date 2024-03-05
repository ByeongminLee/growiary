import { ApiSuccess } from '@/types';
import { NO_USER_ERROR, serverError } from '@/utils/errorTypes';

type fetchProps<T> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  id?: string;
  body?: T;
};
export const fetchApi = async <T, R>(
  url: string,
  { method = 'GET', id = '', body }: fetchProps<T>,
): Promise<ApiSuccess<R>> => {
  if (!id) {
    const error = new Error('id가 없습니다');
    error.name = NO_USER_ERROR;
    throw error;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw serverError();
  }
  return response.json();
};
