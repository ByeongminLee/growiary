'use client';
import { Card, AreaChart, Legend, Text } from '@tremor/react';
import { useByDate } from '.';

export const ByDate = () => {
  const data = useByDate();

  return (
    <Card className="mx-auto max-w-xs sm:max-w-full">
      <Text>유저수 대비 작성 수</Text>
      <AreaChart
        className="h-48 mt-4"
        data={data}
        index="date"
        categories={['profile', 'post']}
        showLegend={false}
        colors={['indigo', 'cyan']}
      />
      <Legend
        className="mt-3"
        categories={['유저수 (profile)', '일기수 (post)']}
        colors={['indigo', 'cyan']}
      />
    </Card>
  );
};
