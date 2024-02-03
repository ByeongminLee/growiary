'use client';
import { signOut, useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Union from '@/components/ui/icon/Union';
import { Button } from '@/components/ui/shadcn/button';
import { useUserProfile } from '@/lib/useUserProfile';
import { UserProfileDTO } from '@growiary/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';

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
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const userProfile = useUserProfile();
  const [isChangeNickname, setIsChangeNickname] = useState(false);

  const handleClickChangeName = async () => {
    setIsChangeNickname(true);
  };

  useEffect(() => {
    setProfile(userProfile);
    return () => {};
  }, [session?.id]);

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   const input = (e.target as HTMLFormElement).username.value;
  //   if (!session || !input) return;
  //
  //   const json: ApiResponse<{ profile: UserProfileDTO }> = await updateUserName(
  //     session.id,
  //     input,
  //   );
  //
  //   json.status === 200 &&
  //     setUserProfile(prev => ({
  //       ...prev,
  //       userName: input,
  //     }));
  //
  //   setIsChangeNickname(false);
  // };

  const handleClickLogOut = () => {
    sessionStorage.clear();
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/*<form onSubmit={handleSubmit}>*/}
      <section className="mt-8">
        <div className="mb-1.5 flex justify-start items-center">
          {isChangeNickname ? (
            <Input
              name="username"
              disabled={!isChangeNickname}
              defaultValue={profile?.userName}
            />
          ) : (
            <div className="font-p-M24">
              <span className="text-branding-600 mr-[5px]">{profile?.userName}</span>님
            </div>
          )}
        </div>
        <div className="text-primary-400">{session?.user?.email}</div>
      </section>
      <section className="border-t-[1px] mt-5 border-t-primary-300 border-solid">
        <div className="flex items-center h-12 space-x-2">
          <div className="grow flex items-center">
            <AlertDialog>
              <AlertDialogTrigger className="grow flex items-center justify-between">
                <Label
                  htmlFor="service"
                  className="font-p-M16 py-3 text-primary-800 cursor-pointer"
                >
                  (필수) 서비스 이용약관
                </Label>
                <div className="ml-auto md:mr-12">
                  <Union />
                </div>
              </AlertDialogTrigger>
              <AlertDialogOverlay>
                <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md	">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-p-M24 text-center">서비스 이용약관</h2>
                    <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto rounded">
                      ContentHere is ContentHere is Content Here is ContentHere is
                      ContentHere is ContentHere is ContentHere is ContentHere is Content
                    </AlertDialogDescription>
                    <AlertDialogAction className="btn-secondary btn-full">
                      확인했어요
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </div>
        </div>
        <div className="flex items-center h-12 space-x-2">
          <div className="grow flex items-center">
            <AlertDialog>
              <AlertDialogTrigger className="grow flex items-center justify-between">
                <Label
                  htmlFor="privacy"
                  className="font-p-M16  py-3 text-primary-800 cursor-pointer"
                >
                  (필수) 개인정보 처리방침
                </Label>
                <div className="ml-auto md:mr-12">
                  <Union />
                </div>
              </AlertDialogTrigger>
              <AlertDialogOverlay>
                <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md	">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-p-M24 text-center">개인정보 처리방침</h2>
                    <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto rounded">
                      ContentHere is ContentHere is Content Here is ContentHere is
                      ContentHere is ContentHere is ContentHere is ContentHere is Content
                    </AlertDialogDescription>
                    <AlertDialogAction className="btn-secondary btn-full">
                      확인했어요
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </div>
        </div>
        <div className="flex justify-space  py-3 ">
          <span className="font-p-M16 text-primary-800">앱 버전 정보</span>
          <span className="ml-auto md:mr-12 font-p-M14 text-primary-400">
            V1.0.0 최신버전
          </span>
        </div>
      </section>

      <div className="justify-end mt-auto">
        <AlertDialog>
          <Button type="button" variant="secondary" className="w-auto" asChild>
            <AlertDialogTrigger>로그아웃</AlertDialogTrigger>
          </Button>

          <AlertDialogOverlay>
            <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md bg-[#F6F6F6]	">
              <div className="flex flex-col items-center gap-3">
                <AlertDialogHeader className="font-p-R18 overflow-y-auto rounded">
                  로그아웃 하시겠어요?
                </AlertDialogHeader>
                <AlertDialogFooter className="grow w-full">
                  <Button type="button" variant="secondary" className=" grow" asChild>
                    <AlertDialogCancel>아니오</AlertDialogCancel>
                  </Button>
                  <Button type="button" variant="secondary" className="grow" asChild>
                    <AlertDialogAction
                      className="bg-danger-600 text-primary-300"
                      onClick={handleClickLogOut}
                    >
                      확인했어요
                    </AlertDialogAction>
                  </Button>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProfileView;
