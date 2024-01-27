'use client';
import { signOut, useSession } from 'next-auth/react';

export const LogoutView = () => {
  const { data: session, status } = useSession();
  console.log('status: ', status);

  return (
    <>
      <div>{session?.user?.name}</div>
      <button onClick={() => signOut()}>로그아웃</button>
    </>
  );
};
