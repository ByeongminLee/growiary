'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type TabType = 'home' | 'calendar' | 'profile';
const Tab = () => {
  const pathname = usePathname();
  const tabs = [
    { name: 'home', href: '/' },
    { name: 'calendar', href: '/calendar' },
    { name: 'profile', href: '/profile' },
  ] as { name: TabType; href: string }[];

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
            >
              <Image
                src={
                  pathname === tab.href
                    ? `/assets/icons/${tab.name}_black.svg`
                    : `/assets/icons/${tab.name}.svg`
                }
                alt={tab.name}
                width={24}
                height={24}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Tab;
