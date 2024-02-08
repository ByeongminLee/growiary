import { Card, DonutChart, Flex, Metric, Text } from '@tremor/react';
import { useTemplateCount } from '.';

export const TemplateCount = () => {
  const { templateCount, max, min } = useTemplateCount();

  return (
    <Card className="max-w-xs mx-auto">
      <Text>템플릿</Text>
      <Metric>
        <DonutChart className="mt-6" data={templateCount} category="value" index="name" />
      </Metric>
      <Flex className="mt-4">
        <Text>가장 많은 템플릿 (개수)</Text>
        <Text>
          Template{max.name} ({max.value})
        </Text>
      </Flex>
      <Flex className="mt-2">
        <Text>가장 적은 템플릿 (개수)</Text>
        <Text>
          Template{min.name} ({min.value})
        </Text>
      </Flex>
    </Card>
  );
};
