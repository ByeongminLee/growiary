import { Card, Metric, Text } from '@tremor/react';
import { useAllPostsCount } from './useAllPostsCount';

// 전체 일기 수
export const AllPostsCount = () => {
  const value = useAllPostsCount();

  return (
    <Card className="max-w-xs mx-auto">
      <Text>전체 포스팅 수</Text>
      <Metric>{value}</Metric>
    </Card>
  );
};
