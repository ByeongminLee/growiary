import { loginType } from '@/types';
import { signIn } from 'next-auth/react';

export const loginHandler = (variant: loginType) => {
  signIn(variant, { callbackUrl: '/' });
};
