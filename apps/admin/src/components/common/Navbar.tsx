'use client';
import { Button } from '@tremor/react';
import { Logo } from '.';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export const Navbar = () => {
  const logoutHandler = () => {
    sessionStorage.clear();
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="w-full h-[70px] sticky top-0 bg-white border-b z-[9999]">
      <div className="flex items-center justify-between max-w-[640px] lg:max-w-[1024px] px-4 h-full mx-auto">
        <Link href={'/'}>
          <Logo />
        </Link>
        <div className="flex gap-2">
          <Link href="/post">
            <Button>Post</Button>
          </Link>
          <Button variant="secondary" onClick={logoutHandler}>
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};
