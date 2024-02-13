import { useState } from 'react';

export const usePagination = ({ dataLength }: { dataLength: number }) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const paginationHandler = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const allPage = Math.ceil(dataLength / pagination.limit);

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  return { allPage, startIndex, endIndex, paginationHandler };
};
