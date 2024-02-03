import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import MainView from '@/components/home/MainView';
import { ApiResponse, ProfileResType, RecordType } from '@/types';
import { redirect } from 'next/navigation';
import { requestApi } from '@/utils/requestApi';
import { getTwoDigitNum, getYMDFromDate } from '@/utils/getDateFormat';
import MainReplyView from '@/components/home/MainReplyView';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 60 * 60 * 24 * 1000);
  const getProfile = async () =>
    await requestApi('/user', {
      id: session?.id,
    });
  const startDate = `${today.getFullYear()}-${getTwoDigitNum(today.getMonth() + 1)}-${getTwoDigitNum(today.getDate())}`;
  const endDate = `${tomorrow.getFullYear()}-${getTwoDigitNum(tomorrow.getMonth() + 1)}-${getTwoDigitNum(tomorrow.getDate())}`;
  const getRecord = async () =>
    await requestApi('/post/filter', {
      method: 'POST',
      id: session?.id,
      body: {
        startDate,
        endDate,
      },
    });
  if (session) {
    const [profileRes, recordRes] = (await Promise.all([getProfile(), getRecord()])) as [
      ApiResponse<ProfileResType>,
      ApiResponse<RecordType[]>,
    ];

    if ('data' in profileRes && profileRes.data.profile.userName) {
      if ('data' in recordRes && recordRes.data[0]?.postId) {
        // 일기 기록이 있으면 답장 화면
        return (
          <Suspense fallback={<div>Loading Main Answer...</div>}>
            <MainReplyView
              userProfile={profileRes.data.profile}
              replyData={recordRes.data}
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
