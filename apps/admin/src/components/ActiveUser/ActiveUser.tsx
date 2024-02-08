import { BadgeDelta, Card, Flex, Grid, Metric, Text } from '@tremor/react';
import { useActiveUser } from '.';

export const ActiveUser = () => {
  const { DAU, perDAU, WAU, perWAU, MAU, perMAU, activeUser } = useActiveUser();

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4 mt-4">
      <Card className="max-w-xs mx-auto">
        <Flex justifyContent="between" alignItems="center">
          <Text>DAU</Text>
          <BadgeDelta
            deltaType={perBadgeDelta(perDAU)}
            isIncreasePositive={true}
            size="xs"
          >
            {numberToString(perDAU)}
          </BadgeDelta>
        </Flex>
        <Metric>{DAU}</Metric>
      </Card>
      <Card className="max-w-xs mx-auto">
        <Flex justifyContent="between" alignItems="center">
          <Text>WAU</Text>
          <BadgeDelta
            deltaType={perBadgeDelta(perWAU)}
            isIncreasePositive={true}
            size="xs"
          >
            {numberToString(perWAU)}
          </BadgeDelta>
        </Flex>
        <Metric>{WAU}</Metric>
      </Card>
      <Card className="max-w-xs mx-auto">
        <Flex justifyContent="between" alignItems="center">
          <Text>MAU</Text>
          <BadgeDelta
            deltaType={perBadgeDelta(perMAU)}
            isIncreasePositive={true}
            size="xs"
          >
            {numberToString(perMAU)}
          </BadgeDelta>
        </Flex>
        <Metric>{MAU}</Metric>
      </Card>
      <Card className="max-w-xs mx-auto">
        <Text>Active User</Text>
        <Metric>{activeUser}</Metric>
      </Card>
    </Grid>
  );
};

const perBadgeDelta = (per: number) => {
  if (per > 0) {
    return 'moderateIncrease';
  } else if (per < 0) {
    return 'moderateDecrease';
  } else {
    return 'unchanged';
  }
};

function numberToString(number: number) {
  if (number >= 0) {
    return '+ ' + number;
  } else {
    return '- ' + Math.abs(number);
  }
}
