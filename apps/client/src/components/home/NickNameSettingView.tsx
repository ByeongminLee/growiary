'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/shadcn/input';
import { useRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { ApiResponse, RequiredAgreements } from '@/types';
import { UserProfileDTO } from '@growiary/types';
import { Button } from '@/components/ui/shadcn/button';

const NickNameSettingView = () => {
  const router = useRouter();
  const modalButtonRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [caution, setCaution] = useState('');
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);

  const handleChange = (e: React.ChangeEvent) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    setUserProfile(prev => ({
      ...prev,
      userName: value,
    }));
    const isValidLength = value.length >= 2 && value.length <= 8;
    let isNotValidChar = /[^A-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|1-9]|\\/g.test(value);

    if (!isValidLength) {
      setCaution('닉네임은 2자~8자로 입력해 주세요');
    } else if (isNotValidChar) {
      setCaution('닉네임은 한글, 영문, 숫자로만 입력해 주세요');
    } else {
      setCaution('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (caution) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: 'POST',
      headers: {
        Authorization: session ? session.id : '',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        userName: 'testing',
        agreeTerms: {
          age: true,
          service: true,
          privacy: true,
        },
      }),
    })
      .then(res => res.json())
      .then(({ status }: Pick<ApiResponse<{ profile: UserProfileDTO }>, 'status'>) => {
        if (status === 200) {
          modalButtonRef.current?.click();
        } else {
          alert('닉네임 설정에 실패했습니다. 오류 문의를 넣어주세요.');
        }
      });
  };

  const handleLeavePage = () => {
    router.push('/');
  };

  // 오류 발생
  useEffect(() => {
    for (let agreement of RequiredAgreements) {
      if (!userProfile.agreeTerms?.[agreement]) {
        router.push('/signup/agreement');
        return;
      }
    }
  }, [router, userProfile.agreeTerms]);

  return (
    <section className="layout-full">
      <h1 className="font-p-M24 text-primary-900">어떻게 불러드릴까요?</h1>
      <p className="font-p-R16 text-primary-500 mt-[6px]">
        이름을 한글/영문/숫자 2자~8자내로 지어주세요
      </p>
      <form
        className="h-full flex flex-col justify-between mt-[26px]"
        onSubmit={handleSubmit}
      >
        <div>
          <Input
            type="text"
            placeholder="반가운 오월"
            value={userProfile.userName}
            onChange={handleChange}
            maxLength={8}
          />
          {caution && (
            <p className="flex text-danger-600 text-sm leading-[17px] mt-[10px]">
              <Image
                className="w-4 h-4 mr-[6px]"
                width={16}
                height={16}
                src="/assets/icons/caution.png"
                alt="invalid nickname value"
              />
              {caution}
            </p>
          )}
        </div>
        <Button type="submit">시작하기</Button>
      </form>
      <ConfirmModal
        title={`${userProfile.userName}님 반가워요`}
        button={
          <div className="hidden" ref={modalButtonRef}>
            confirm modal btn
          </div>
        }
        onClick={handleLeavePage}
      >
        그루어리와 함께 매일 성장해요!
      </ConfirmModal>
    </section>
  );
};

export default NickNameSettingView;
