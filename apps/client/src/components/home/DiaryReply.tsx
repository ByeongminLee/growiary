'use client';

import Image from 'next/image';
import { DiaryTemplate } from '@/types';
import { useEffect, useState } from 'react';
import { UserProfileDTO } from '@growiary/types';
import { useUserProfile } from '@/lib/useUserProfile';

type DiaryReplyProps = {
  template: DiaryTemplate;
  response: any;
};

const DiaryReply = ({ template, response }: DiaryReplyProps) => {
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const userProfile = useUserProfile();

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  return (
    <section
      className="px-3 pt-6"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 48px)',
      }}
    >
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-sub-indigo pl-4 font-p-M20">
          To. <span>{profile?.userName || '그루리'}</span>님
        </h2>
        <Image
          className="mr-4"
          src="/assets/growmi/green.svg"
          width={57}
          height={58}
          alt="growmi"
        />
      </div>
      <div className="text-grayscale-800 font-p-R17 bg-opacity-70 p-6 rounded-2xl relative after:content-[''] after:absolute after:top-[-16px] after:right-14 after:w-[18px] after:h-[12px] after:bg-transparent after:border-8 after:border-transparent after:border-r-opacity-70 after:border-r-[11px] after:rounded-tr-[25px] after:border-b-opacity-70">
        {response.answer.split('\n').map((el: string, idx: number) => (
          <p key={idx}>
            {el}
            <br />
          </p>
        ))}
      </div>
    </section>
  );
};

export default DiaryReply;
