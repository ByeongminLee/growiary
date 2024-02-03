'use client';

import { ReactNode } from 'react';
import { loginHandler } from '@/utils/loginHandler';
import { loginType } from '@/types';

interface SocialLoginBtnProps {
  type: loginType;
  children: ReactNode;
}
const SocialLoginBtn = ({ type, children }: SocialLoginBtnProps) => {
  const handleLogin = () => {
    loginHandler(type);
  };

  return (
    <button className="rounded-full" onClick={handleLogin}>
      {children}
    </button>
  );
};

export default SocialLoginBtn;
