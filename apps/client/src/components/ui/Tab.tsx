'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { tracking } from '@/utils/mixPannel';

type TabType = 'home' | 'calendar' | 'profile';
const Tab = () => {
  const pathname = usePathname();
  const tabs = [
    { name: 'home', href: '/', ext: 'svg', page: '메인 페이지' },
    { name: 'calendar', href: '/calendar', ext: 'png', page: '캘린더 페이지' },
    { name: 'profile', href: '/profile', ext: 'png', page: '프로필 페이지' },
  ] as { name: TabType; href: string; ext: 'png' | 'svg'; page: string }[];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 h-12 bg-primary-100"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: 'content-box',
      }}
    >
      <ul className="flex h-full">
        {tabs.map(tab => (
          <li key={tab.name} className="grow">
            <Link
              className="w-full h-full flex justify-center items-center"
              href={tab.href}
              onClick={() =>
                tracking(tab.page, {
                  message: '하단 탭 클릭',
                })
              }
            >
              <Image
                src={
                  pathname === tab.href
                    ? `/assets/icons/${tab.name}_black.${tab.ext}`
                    : `/assets/icons/${tab.name}.${tab.ext}`
                }
                alt={tab.name}
                width={24}
                height={24}
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                priority
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Tab;
