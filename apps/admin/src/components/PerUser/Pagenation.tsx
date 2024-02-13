import { Button } from '@tremor/react';

export const Pagination = ({
  allPage,
  handler,
}: {
  allPage: number;
  handler: (item: number) => void;
}) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: allPage }, (_, index) => index + 1).map(item => (
        <Button
          key={item}
          variant="secondary"
          className="px-3 py-1.5"
          onClick={() => handler(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
};
