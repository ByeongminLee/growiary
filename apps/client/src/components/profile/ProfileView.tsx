'use client';
import { signOut, useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { Input } from '@/components/ui/shadcn/input';
import withUserProfile from '@/components/hoc/withUserProfile';
import { Label } from '@/components/ui/shadcn/label';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Union from '@/components/ui/icon/Union';
import { ApiResponse } from '@/types';
import { UserProfileDTO } from '@growiary/types';
import { Button } from '@/components/ui/shadcn/button';

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

    const json: ApiResponse<{ profile: UserProfileDTO }> = await updateUserName(
      session.id,
      input,
    );

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
        <div className="flex justify-start items-center">
          {isChangeNickname ? (
            <Input
              name="username"
              disabled={!isChangeNickname}
              defaultValue={userProfile?.userName}
            />
          ) : (
            <div className="font-p-M24">
              <span className="text-sub-yellow mr-[5px]">{userProfile?.userName}</span>님
            </div>
          )}
        </div>
        <div>{session?.user?.email}</div>
        <div>
          <div className="flex items-center h-12 space-x-2">
            <div className="grow flex items-center">
              <Label htmlFor="service" className="font-p-R18 text-primary-800">
                (필수) 서비스 이용약관
              </Label>
              <ConfirmModal title="서비스 이용약관" button={<Union />}>
                ContentHere is ContentHere is Content Here is ContentHere is ContentHere
                is ContentHere is ContentHere is ContentHere is Content
              </ConfirmModal>
            </div>
          </div>
          <div className="flex items-center h-12 space-x-2">
            <div className="grow flex items-center">
              <Label htmlFor="privacy" className="font-p-R18 text-primary-800">
                (필수) 개인정보 처리방침
              </Label>
              <ConfirmModal title="개인정보 처리방침" button={<Union />}>
                ContentHere is ContentHere is Content Here is ContentHere is ContentHere
                is ContentHere is ContentHere is ContentHere is Content
              </ConfirmModal>
            </div>
          </div>
        </div>
        {isChangeNickname && <Button type="submit">완료</Button>}
      </form>
      {!isChangeNickname && <Button onClick={handleClickChangeName}>수정</Button>}
      <Button onClick={handleClickLogOut}>로그아웃</Button>
    </>
  );
};

export default withUserProfile(ProfileView);
