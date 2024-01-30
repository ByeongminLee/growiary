'use client';
import Link from 'next/link';
import withUserProfile from '@/components/hoc/withUserProfile';

interface MainViewProps {
  userProfile: any;
}
const MainView = ({ userProfile }: MainViewProps) => {
  return (
    <section className="layout-full h-[calc(85vh-72px)]">
      This is main
      <Link href="/profile">프로필</Link>
    </section>
  );
};

export default withUserProfile(MainView);
