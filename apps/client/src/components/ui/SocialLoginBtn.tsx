'use client';

import { ReactNode } from 'react';
import { loginHandler } from '@/utils/loginHandler';
import { loginType } from '@/types';
import { tracking } from '@/utils/mixPannel';

interface SocialLoginBtnProps {
  type: loginType;
  children: ReactNode;
}
const SocialLoginBtn = ({ type, children }: SocialLoginBtnProps) => {
  const handleLogin = () => {
    loginHandler(type);
    tracking(`SNS 로그인 ${type}`);
  };

  return (
    <button className="rounded-full" onClick={handleLogin}>
      {children}
    </button>
  );
};

export default SocialLoginBtn;
