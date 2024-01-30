'use client';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { useEffect } from 'react';

interface MainViewProps {
  userProfile: any;
}
const MainView = ({ userProfile }: MainViewProps) => {
  const setUserProfile = useSetRecoilState(userProfileState);

  useEffect(() => {
    setUserProfile(userProfile);
  }, []);

  return (
    <section className="layout-full h-[calc(85vh-72px)]">
      This is main
      <Link href="/profile">프로필</Link>
    </section>
  );
};

export default MainView;
