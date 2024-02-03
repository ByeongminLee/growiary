'use client';

import { ApiError, ApiResponse } from '@/types';

type fetchProps<T> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  id?: string;
  body?: T;
};
export const useFetch =
  () =>
  async <T, R>(url: string, { method = 'GET', id = '', body }: fetchProps<T>) => {
    if (!id) {
      return { status: 400, message: 'id가 없습니다' } as ApiError;
    }

    if (typeof window !== 'undefined') {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: method,
        headers: {
          Authorization: id,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });
      const json: ApiResponse<R> = await response.json();
      return json;
    }
  };
