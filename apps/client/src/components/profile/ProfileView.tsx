'use client';
import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { redirect, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { Input } from '@/components/ui/shadcn/input';

export const ProfileView = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [input, setInput] = useState(userProfile?.userName);
  const [isChangeNickname, setIsChangeNickname] = useState(false);
  const handleClickChangeName = async () => {
    if (!isChangeNickname) {
      setIsChangeNickname(true);
      return;
    }
  };

  const handleChange = (e: ChangeEvent) => {
    setInput((e.currentTarget as HTMLInputElement).value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session || !input) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: session.id,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ userName: input }),
    });
    const json = await response.json();
    json.status === 200 &&
      setUserProfile(prev => ({
        ...prev,
        userName: input,
      }));

    setIsChangeNickname(false);
  };

  const handleClickLogOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input disabled={!isChangeNickname} value={input} onChange={handleChange} />
        <div>{session?.user?.email}</div>
        <Button
          type={isChangeNickname ? 'submit' : 'button'}
          className="btn-full"
          onClick={handleClickChangeName}
        >
          수정
        </Button>
      </form>
      <Button className="btn-full" onClick={handleClickLogOut}>
        로그아웃
      </Button>
    </>
  );
};
