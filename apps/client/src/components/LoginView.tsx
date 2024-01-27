'use client';
import { loginHandler } from '@/utils/loginHandler';

export const LoginView = () => {
  return (
    <>
      <button onClick={() => loginHandler('google')}>로그인</button>
    </>
  );
};
