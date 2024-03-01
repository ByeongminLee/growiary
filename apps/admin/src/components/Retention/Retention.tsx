import {
  Button,
  Card,
  DateRangePicker,
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Tracker,
} from '@tremor/react';
import { useRetention } from './useRetention';
import { LuBadgeCheck } from 'react-icons/lu';

export const Retention = () => {
  const { searchHandler, datePicker, data } = useRetention();
  console.log(data);
  return (
    <Card className="mt-4 mb-20">
      <Text className="italic text-xs">* Only USER</Text>
      <Text className="italic text-xs">
        * 기간 동안 가입한 유저 && 기간별 포스팅 여부
      </Text>
      <div className="flex justify-end gap-x-2">
        <DateRangePicker
          className="max-w-sm"
          enableSelect={false}
          enableClear={false}
          onValueChange={datePicker.setDateRange}
          value={datePicker.datePick}
        />
        <Button onClick={searchHandler}>검색</Button>
      </div>
      {data && (
        <div>
          <Text>검색된 유저 수 : {data.length}</Text>
          <Text>
            연속해서 작성한 유저 수 :{' '}
            {data.filter((item: { sequence: boolean }) => item.sequence).length}
          </Text>
          <Text>
            비율{' '}
            {data.length > 0
              ? (
                  (data.filter((item: { sequence: boolean }) => item.sequence).length /
                    data.length) *
                  100
                ).toFixed(2) + '%'
              : ''}
          </Text>
        </div>
      )}
      <Table>
        <TableHead className="border-b-2">
          <TableHeaderCell className="text-center">유저 아이디</TableHeaderCell>
          <TableHeaderCell className="text-center">가입일</TableHeaderCell>
          <TableHeaderCell className="text-center">기간내 작성수</TableHeaderCell>
          <TableHeaderCell className="text-center">Tracker</TableHeaderCell>
          <TableHeaderCell className="text-center">연속성</TableHeaderCell>
        </TableHead>
        {data &&
          data?.map((data, index) => (
            <TableRow
              key={data.postId}
              className="even:bg-tremor-background-muted even:dark:bg-dark-tremor-background-muted"
            >
              <TableCell className="text-center text-[10px] h-[80px] w-[150px]">
                {data.userId}
                <br />
                <span className="text-xs">{data.userName}</span>
              </TableCell>
              <TableCell className="text-center h-[80px] w-[150px]">
                {formatDateToKoreanTime(data.createAt)}
              </TableCell>
              <TableCell className="text-center h-[80px] w-[30px]">
                {data.posts.length}
              </TableCell>
              <TableCell className="text-center  h-[80px] w-full">
                <p className="text-tremor-default flex items-center justify-between">
                  <span className="text-tremor-content dark:text-dark-tremor-content">
                    작성일 비율 :{' '}
                    {data.hitmap.filter(
                      (item: { color: string }) => item.color === 'emerald',
                    ).length > 0
                      ? `${(
                          (data.hitmap.filter(
                            (item: { color: string }) => item.color === 'emerald',
                          ).length /
                            data.hitmap.length) *
                          100
                        ).toFixed(2)}%`
                      : '0%'}
                  </span>
                </p>
                <Tracker data={data.hitmap} />
              </TableCell>
              <TableCell className="flex items-center justify-center h-[80px] w-[150px]">
                {data.sequence ? <LuBadgeCheck className="w-8 h-8" /> : ''}
              </TableCell>
            </TableRow>
          ))}
      </Table>
    </Card>
  );
};

function formatDateToKoreanTime(utcDate: string | number | Date) {
  const date = new Date(utcDate);

  date.setHours(date.getHours());

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
