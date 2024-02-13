'use client';
import { Card } from '@tremor/react';
import { Logo } from '../common';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export const AdminGuardView = () => {
  const { push } = useRouter();

  const logoutHandler = () => {
    sessionStorage.clear();
    signOut({ callbackUrl: '/' });
    push('/login');
  };

  return (
    <div className="flex flex-col items-center w-screen min-h-[calc(100vh-30px)] h-full">
      <div className="w-full max-w-[520px] px-8 lg:mt-[100px] mt-[20%]">
        <Logo />
        <Card className="sm:mx-auto sm:max-w-md mt-12">
          <div className="absolute right-0 top-0 pr-3 pt-3"></div>

          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Administrator Page Login Error
          </h4>
          <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            관리자에게 문의하세요
          </p>

          <button
            className="mt-4 w-full whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
            onClick={logoutHandler}
          >
            로그인으로 돌아가기
          </button>
        </Card>
      </div>
    </div>
  );
};
