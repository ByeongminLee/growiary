import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import MainView from '@/components/home/main/MainView';
import { ApiResponse, ProfileResType, RecordType } from '@/types';
import { redirect } from 'next/navigation';
import { requestApi } from '@/utils/requestApi';
import { getTwoDigitNum } from '@/utils/getDateFormat';
import MainReplyView from '@/components/home/main/MainReplyView';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const today = new Date();
    const todayNoon = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
    const tomorrow = new Date(todayNoon.getTime() + 60 * 60 * 24 * 1000);
    const startDate = `${todayNoon.getUTCFullYear()}-${getTwoDigitNum(todayNoon.getUTCMonth() + 1)}-${getTwoDigitNum(todayNoon.getUTCDate())}`;
    const endDate = `${tomorrow.getUTCFullYear()}-${getTwoDigitNum(tomorrow.getUTCMonth() + 1)}-${getTwoDigitNum(tomorrow.getUTCDate())}`;
    const getProfile = async () =>
      await requestApi('/user', {
        id: session?.id,
      });
    const getRecord = async () =>
      await requestApi('/post/filter', {
        method: 'POST',
        id: session?.id,
        body: {
          startDate,
          endDate,
        },
      });
    const [profileRes, recordRes] = (await Promise.all([getProfile(), getRecord()])) as [
      ApiResponse<ProfileResType>,
      ApiResponse<RecordType[]>,
    ];

    const todayReply =
      'data' in recordRes &&
      recordRes.data.find(record => new Date(record.createAt) >= todayNoon);

    if ('data' in profileRes && profileRes.data.profile.userName) {
      if (todayReply) {
        // 일기 기록이 있으면 답장 화면
        return (
          <Suspense fallback={<div>Loading Main Answer...</div>}>
            <MainReplyView
              userProfile={profileRes.data.profile}
              todayReply={todayReply}
            />
          </Suspense>
        );
      } else {
        // 일기 기록이 없으면 작성 화면
        return (
          <Suspense fallback={<div>Loading Main Record...</div>}>
            <MainView />;
          </Suspense>
        );
      }
    } else {
      // userName 없으면 서비스 동의 화면
      redirect('/signup/agreement');
    }
  }

  // session.id 없으면 온보딩 화면
  redirect('/welcome');
}
