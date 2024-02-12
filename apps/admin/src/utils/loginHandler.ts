import { signIn } from 'next-auth/react';

export const loginHandler = (variant: 'google') => {
  signIn(variant, { callbackUrl: '/' });
};
