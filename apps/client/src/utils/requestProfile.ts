import { ProfileResType } from '@/types';
import { serverError } from '@/utils/errorTypes';

type FetchProfileProps = {
  id?: string;
};
export const getProfile = async ({
  id = '',
}: FetchProfileProps): Promise<{ data: ProfileResType }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    method: 'GET',
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  if (!response.ok) {
    throw serverError();
  }
  return response.json();
};
