import { Card, Metric, Text } from '@tremor/react';
import { useAllUserCount } from './useAllUserCount';

// 총 가입자 수
export const AllUserCount = () => {
  const value = useAllUserCount();

  return (
    <Card className="max-w-xs mx-auto">
      <Text>전체 유저 수</Text>
      <Metric>{value}</Metric>
    </Card>
  );
};
