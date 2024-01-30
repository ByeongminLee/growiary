'use client';
import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { Input } from '@/components/ui/shadcn/input';
import withUserProfile from '@/components/hoc/withUserProfile';

const updateUserName = async (id: string, userName: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: id,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ userName: userName }),
  });
  return await response.json();
};

const ProfileView = () => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [isChangeNickname, setIsChangeNickname] = useState(false);

  const handleClickChangeName = async () => {
    setIsChangeNickname(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const input = (e.target as HTMLFormElement).username.value;
    if (!session || !input) return;

    const json = await updateUserName(session.id, input);

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
        <Input
          name="username"
          disabled={!isChangeNickname}
          defaultValue={userProfile?.userName}
        />
        <div>{session?.user?.email}</div>
        {isChangeNickname && (
          <Button type="submit" className="btn-full">
            완료
          </Button>
        )}
      </form>
      {!isChangeNickname && (
        <Button className="btn-full" onClick={handleClickChangeName}>
          수정
        </Button>
      )}
      <Button className="btn-full" onClick={handleClickLogOut}>
        로그아웃
      </Button>
    </>
  );
};

export default withUserProfile(ProfileView);
