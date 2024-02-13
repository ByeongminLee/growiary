'use client';
import { Divider, TextInput } from '@tremor/react';
import { Logo } from '../common';
import { GrGoogle } from 'react-icons/gr';
import { loginHandler } from '@/utils/loginHandler';

export const LoginView = () => {
  return (
    <div className="flex flex-col items-center w-screen min-h-[calc(100vh-30px)] h-full">
      <div className="w-full max-w-[520px] px-8 lg:mt-[100px] mt-[20%]">
        <Logo />

        <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-10 lg:px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h3 className="text-center text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              관리자 페이지 로그인
            </h3>
            <form action="#" method="post" className="mt-6">
              <label
                htmlFor="email"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Email
              </label>
              <TextInput
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="john@company.com"
                className="my-2"
              />

              <label
                htmlFor="email"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Password
              </label>
              <TextInput
                type="password"
                id="password"
                name="password"
                autoComplete="password"
                placeholder="password"
                className="mt-2"
              />
              <button
                type="submit"
                className="mt-4 w-full whitespace-nowrap rounded-tremor-default bg-tremor-brand py-2 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
              >
                Sign in
              </button>
            </form>
            <Divider>or with</Divider>
            <button
              className="inline-flex w-full items-center justify-center space-x-2 rounded-tremor-default border border-tremor-border bg-tremor-background py-2 text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-subtle dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-subtle"
              onClick={() => loginHandler('google')}
            >
              <GrGoogle className="h-5 w-5" aria-hidden={true} />
              <span className="text-tremor-default font-medium">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
