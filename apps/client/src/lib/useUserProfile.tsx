'use client';

import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { useSession } from 'next-auth/react';
import { ApiResponse, ProfileResType } from '@/types';
import { UserProfileDTO } from '@growiary/types';
import { useFetch } from '@/lib/useFetch';

export const useUserProfile = (userProfile?: UserProfileDTO) => {
  const [profile, setProfile] = useRecoilState(userProfileState);
  // const requestApi = useFetch();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    // 스토리지 X & 기본 값 X => 정보가져와서 스토리지 업데이트
    if (!userProfile?.userName && !profile?.userName) {
      (async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: session.id,
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        const json = await res.json();

        'data' in json && setProfile(await json.data.profile);
      })();
      // 스토리지 X & 기본 값 O => 기본 값으로 스토리지 업데이트
    } else if (userProfile?.userName && !profile?.userName) {
      setProfile(userProfile);
    }
  }, [session]);

  return profile;
};
