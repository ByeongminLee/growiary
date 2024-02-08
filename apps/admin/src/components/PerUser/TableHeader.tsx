import { TableHead, TableHeaderCell } from '@tremor/react';

export const TableHeader = () => {
  return (
    <TableHead className="border-b-2">
      <TableHeaderCell className="text-center">유저 아이디</TableHeaderCell>
      <TableHeaderCell className="text-center">유저명</TableHeaderCell>
      <TableHeaderCell className="text-center">작성한 일기수</TableHeaderCell>
      <TableHeaderCell className="text-center">평균 글자 수</TableHeaderCell>
      <TableHeaderCell className="text-center">평균 작성 시간대</TableHeaderCell>
      <TableHeaderCell className="text-center">만족도</TableHeaderCell>
      <TableHeaderCell className="text-center">가입일</TableHeaderCell>
    </TableHead>
  );
};
