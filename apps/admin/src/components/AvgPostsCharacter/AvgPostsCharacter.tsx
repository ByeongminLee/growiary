import { Card, Flex, Metric, Text } from '@tremor/react';
import { useAvgPostsCharacter } from '.';
import toRounds from '@/utils/toRounds';

// 평균 작성 글자 수
export const AvgPostsCharacter = () => {
  const { avg, max, min } = useAvgPostsCharacter();

  return (
    <Card className="max-w-xs mx-auto">
      <Flex
        flexDirection="col"
        justifyContent="between"
        className="h-full"
        alignItems="start"
      >
        <div>
          <Text>평균 작성 글자 수</Text>
          <Metric>{toRounds(avg)}</Metric>
        </div>
        <Flex flexDirection="col" justifyContent="between">
          <Flex className="mt-4 w-full">
            <Text>최대 글자수</Text>
            <Text>{max}</Text>
          </Flex>
          <Flex className="mt-2">
            <Text>최소 글자수</Text>
            <Text>{min}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
