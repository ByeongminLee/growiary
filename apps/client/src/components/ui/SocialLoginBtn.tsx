'use client';

import { ReactNode } from 'react';
import { loginHandler } from '@/utils/loginHandler';

interface SocialLoginBtnProps {
  type: 'google' | 'kakao' | 'naver';
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
