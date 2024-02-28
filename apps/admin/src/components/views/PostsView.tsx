'use client';
import { useEffect, useState } from 'react';
import fetcher from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DateRangePicker,
  DateRangePickerValue,
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
} from '@tremor/react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Modal, Navbar, useModal } from '../common';
import { PostType } from '@/types';
import { CgClose } from 'react-icons/cg';
import { LuBadgeCheck } from 'react-icons/lu';

export const PostsView = () => {
  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch,
  } = useQuery({
    queryKey: ['post'],
    queryFn: () =>
      fetcher({ url: 'post' }).then(res => {
        return res.data
          .filter((v: { selectedAt: any }) => {
            if (v.selectedAt) return v;
          })
          .sort(
            (a: { selectedAt: number }, b: { selectedAt: number }) =>
              b.selectedAt - a.selectedAt,
          );
      }),
  });

  const [filterPosts, setFilterPosts] = useState(posts);

  useEffect(() => {
    if (posts) setFilterPosts(posts);
  }, [posts]);

  const { isOpen, onOpen, onClose } = useModal();
  const [setting, setSetting] = useState<PostType | null>();
  const [editAiAnswer, setEditAiAnswer] = useState<string | null>();
  const handleOpenModal = (post: PostType) => {
    setSetting(post);
    onOpen();
  };
  const handleCloseModal = () => {
    setSetting(null);
    setEditAiAnswer(null);
    onClose();
  };
  const onChange = (e: any) => {
    setEditAiAnswer(e.target.value);
  };

  const [datePick, setDatePick] = useState<DateRangePickerValue | undefined>(undefined);
  const dateRangeHandler = (date: any) => {
    setDatePick(date);
  };
  const datePickerReset = () => {
    setDatePick({});
    setFilterPosts(posts);
  };

  const searchHandler = () => {
    if (!datePick) {
      setFilterPosts(posts);
      return;
    }

    const { from, to } = datePick;
    if (from && !to) {
      const filtered = posts.filter((post: any) => {
        const postDate = new Date(post.createAt);
        return (
          postDate.getFullYear() === from.getFullYear() &&
          postDate.getMonth() === from.getMonth() &&
          postDate.getDate() === from.getDate()
        );
      });
      setFilterPosts(filtered);
    } else if (from && to) {
      const filtered = posts.filter((post: any) => {
        const postDate = new Date(post.createAt);
        return (
          postDate.getFullYear() >= from.getFullYear() &&
          postDate.getMonth() >= from.getMonth() &&
          postDate.getDate() >= from.getDate() &&
          postDate.getFullYear() <= to.getFullYear() &&
          postDate.getMonth() <= to.getMonth() &&
          postDate.getDate() <= to.getDate()
        );
      });

      setFilterPosts(filtered);
    }
  };

  if (isLoadingPosts && filterPosts) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-[640px] lg:max-w-[1024px] mx-auto py-24">
        <div className="flex justify-end gap-x-2">
          <DateRangePicker
            className="max-w-sm"
            enableSelect={false}
            enableClear={false}
            onValueChange={dateRangeHandler}
            value={datePick}
          />
          <Button onClick={searchHandler}>검색</Button>
          <Button variant="secondary" onClick={datePickerReset}>
            초기화
          </Button>
        </div>
        <Table>
          <TableHead className="border-b-2">
            <TableHeaderCell className="text-center">옵션</TableHeaderCell>
            <TableHeaderCell className="text-center">유저 아이디</TableHeaderCell>
            <TableHeaderCell className="text-center">postId</TableHeaderCell>
            <TableHeaderCell className="text-center">작성글</TableHeaderCell>
            <TableHeaderCell className="text-center">답장글</TableHeaderCell>
            <TableHeaderCell className="text-center">생성일</TableHeaderCell>
            <TableHeaderCell className="text-center">세팅</TableHeaderCell>
          </TableHead>
          {filterPosts &&
            filterPosts.map((post: any) => (
              <TableRow
                key={post.postId}
                className="even:bg-tremor-background-muted even:dark:bg-dark-tremor-background-muted"
              >
                <TableCell className="flex items-center justify-center h-[80px] max-w-[50px]">
                  {post.answerUpdate ? <LuBadgeCheck className="w-6 h-6" /> : ''}
                </TableCell>
                <TableCell className="text-center text-xs h-[80px]">
                  {post.userId}
                </TableCell>
                <TableCell className="text-center text-xs h-[80px] max-w-[150px] truncate">
                  {post.postId}
                </TableCell>
                <TableCell className="text-center text-xs max-w-[150px] truncate">
                  {post.content}
                </TableCell>
                <TableCell className="text-center text-xs max-w-[150px] truncate">
                  {post.answer}
                </TableCell>
                <TableCell className="text-center">
                  {formatUTCDateKR(post.createAt)}
                </TableCell>
                <TableCell className="flex items-center justify-center h-[80px]">
                  <RxHamburgerMenu
                    className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
                    onClick={() => handleOpenModal(post)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </Table>

        {setting && isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="min-h-[430px] w-full flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-end mb-2">
                <CgClose
                  onClick={handleCloseModal}
                  className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Post ID
                  </label>
                  <Text>{setting.postId}</Text>
                </div>
                <div className="flex justify-between">
                  <div className="w-1/2">
                    <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                      작성일
                    </label>
                    <Text>{formatUTCDateKR(setting.createAt)}</Text>
                  </div>
                  <div className="w-1/2">
                    <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                      수정일
                    </label>
                    <Text>{formatUTCDateKR(setting.updateAt)}</Text>
                  </div>
                </div>
                <div>
                  <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    작성 글
                  </label>
                  <p dangerouslySetInnerHTML={{ __html: setting.content }} />
                </div>
                <div>
                  <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    답변 글
                  </label>
                  <p dangerouslySetInnerHTML={{ __html: setting.answer }} />
                </div>
                <div className="mt-4">
                  <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    변경할 답변
                  </label>
                  <Textarea className="min-h-[150px]" onChange={onChange} />
                  <Button
                    className="mt-2"
                    onClick={async () => {
                      await fetcher({
                        url: 'update-post',
                        body: {
                          userId: setting.userId,
                          postId: setting.postId,
                          update: {
                            ...setting,
                            answer: editAiAnswer,
                          },
                        },
                      });
                      handleCloseModal();
                      refetch();
                    }}
                  >
                    답변 변경하기
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

function formatUTCDateKR(utcDate: string | Date) {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const dateObj = new Date(utcDate);

  const krYear = dateObj.getFullYear();
  const krMonth = months[dateObj.getMonth()];
  const krDate = dateObj.getDate();
  const krHours = dateObj.getHours();
  const krMinutes = dateObj.getMinutes();

  const formattedDate = `${krYear}년 ${krMonth} ${krDate}일 ${krHours}시 ${krMinutes}분`;

  return formattedDate;
}