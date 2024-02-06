import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import MainView from '@/components/home/main/MainView';
import { ApiResponse, ProfileResType, RecordType } from '@/types';
import { redirect } from 'next/navigation';
import { getTwoDigitNum } from '@/utils/getDateFormat';
import MainReplyView from '@/components/home/main/MainReplyView';
import { Suspense } from 'react';
import { getRecords } from '@/utils/requestRecord';
import { getProfile } from '@/utils/requestProfile';
import { QueryClient } from '@tanstack/react-query';

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
    const initialProfile = (await getProfile({
      id: session?.id,
    })) as ApiResponse<ProfileResType>;

    const initialRecord = await getRecords({
      id: session?.id,
      body: { startDate, endDate },
    });

    const todayReply =
      'data' in initialRecord &&
      initialRecord.data.find(record => new Date(record.createAt) >= todayNoon);

    if ('data' in initialProfile && initialProfile.data.profile.userName) {
      if (todayReply) {
        // 일기 기록이 있으면 답장 화면
        const queryClient = new QueryClient();

        await queryClient.prefetchQuery({
          queryKey: ['profile', { id: session?.id }],
          queryFn: () => getProfile,
        });

        await queryClient.prefetchQuery({
          queryKey: ['todayRecord', { id: session?.id, body: { startDate, endDate } }],
          queryFn: () => getRecords,
        });

        return (
          <Suspense fallback={<div>Loading Main Answer...</div>}>
            {/*<HydrationBoundary state={dehydrate(queryClient)}>*/}
            <MainReplyView todayReply={todayReply} />
            {/*</HydrationBoundary>*/}
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

  redirect('/welcome');
}
