import React, { ComponentType, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { useSession } from 'next-auth/react';
import { ApiResponse } from '@/types';
import { UserProfileDTO } from '@growiary/types';

interface WithUserProfileProps {
  userProfile?: any;
}

const getUserInfo = async (
  id: string,
): Promise<ApiResponse<{ profile: UserProfileDTO }>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: id,
    },
  });
  return await response.json();
};

const withUserProfile = <T extends WithUserProfileProps>(Component: ComponentType<T>) => {
  return function HocComponent(
    { userProfile }: WithUserProfileProps,
    props: T & Omit<T, keyof WithUserProfileProps>,
  ) {
    const [profile, setProfile] = useRecoilState(userProfileState);
    const { data: session, status } = useSession();

    useEffect(() => {
      if (!session) return;
      if (!userProfile?.userName && !profile?.userName) {
        (async () => {
          const res = session && (await getUserInfo(session.id));
          'data' in res && setProfile(await res.data.profile);
        })();
      } else if (userProfile?.userName && !profile?.userName) {
        setProfile(userProfile);
      }
    }, [session]);

    return <Component {...props} />;
  };
};

export default withUserProfile;
