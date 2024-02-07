'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/utils/requestProfile';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';

export const useUserName = () => {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const { isSuccess, isError, data } = useQuery({
    queryKey: ['profile', { id: session?.id }],
    queryFn: () => getProfile({ id: session?.id }),
    enabled: !!session?.id && !userProfile.userName,
  });

  if (userProfile.userName) {
    return userProfile.userName;
  }

  if (isError) {
    return '프로필을 가져오는데 실패했습니다';
  }

  if (isSuccess) {
    setUserProfile(prev => ({ ...prev, userName: data.data.profile.userName }));
    return data.data.profile.userName;
  }
  return '';
};
