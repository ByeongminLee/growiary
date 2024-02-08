import { Card, Flex, Metric, ProgressBar, Text } from '@tremor/react';
import { useFeedbackSatisfaction } from '.';
import toRounds from '@/utils/toRounds';

export const FeedbackSatisfaction = () => {
  const { GOOD, BAD, NONE } = useFeedbackSatisfaction();
  const likeOfAll = GOOD / (GOOD + BAD);
  const likeOfAllPer = Number(toRounds(likeOfAll * 100));

  return (
    <Card className="max-w-xs mx-auto">
      <Flex
        flexDirection="col"
        justifyContent="between"
        className="h-full"
        alignItems="start"
      >
        <div>
          <Text>피드백 만족도</Text>
          <Metric className="flex">
            {GOOD} <Text className="flex items-end">/{GOOD + BAD}</Text>
          </Metric>
        </div>
        <Flex flexDirection="col" justifyContent="between">
          <Flex className="mt-4">
            <Text>무응답</Text>
            <Text>{NONE}</Text>
          </Flex>
          <Flex className="mt-2">
            <Text>만족도 비율 (좋아요/전체)</Text>
            <Text>{likeOfAllPer} %</Text>
          </Flex>
          <ProgressBar value={likeOfAllPer} className="mt-2" />
        </Flex>
      </Flex>
    </Card>
  );
};
