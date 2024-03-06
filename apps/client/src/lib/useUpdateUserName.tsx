'use client';

import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { UserProfileDTO, UserProfileUpdateDTO } from '@growiary/types';
import { SERVER_ERROR } from '@/utils/errorTypes';
import { fetchApi } from '@/utils/fetchApi';
import { ApiSuccess } from '@/types';

export const useUpdateUserName = () => {
  const { data: session } = useSession();
  const setUserProfile = useSetRecoilState(userProfileState);
  const mutation = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: async ({
      userName,
    }: Pick<UserProfileUpdateDTO, 'userName'>): Promise<ApiSuccess<UserProfileDTO>> => {
      return fetchApi('/user/profile', {
        method: 'PATCH',
        id: session?.id,
        body: { userName },
      });
    },
    onSuccess: ({ data }) => {
      setUserProfile(prev => ({ ...prev, userName: data.userName }));
    },
    onError: error => {
      switch (error.name) {
        case SERVER_ERROR:
          alert('닉네임을 수정하는데 실패했습니다. 다시 시도해주세요.');
          break;
      }
    },
  });

  return { mutation };
};
