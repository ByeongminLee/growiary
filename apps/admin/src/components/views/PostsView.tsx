'use client';
import { use, useEffect, useState } from 'react';
import fetcher from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DateRangePicker,
  DateRangePickerValue,
  Switch,
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
          .filter((post: { status: string }) => post.status !== 'DELETED')
          .filter((v: { selectedAt: any }) => {
            if (v.selectedAt) return v;
          })
          .sort(
            (a: { selectedAt: number }, b: { selectedAt: number }) =>
              b.selectedAt - a.selectedAt,
          );
      }),
  });

  const { data: profilesIdArr, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      fetcher({ url: 'profile' }).then(res =>
        res.data
          .filter(
            (v: { role: 'ADMIN' | 'USER' | 'TESTER' }) =>
              v.role === 'ADMIN' || v.role === 'TESTER',
          )
          .map((v: { userId: string }) => v.userId),
      ),
  });

  const [filterPosts, setFilterPosts] = useState(posts);

  useEffect(() => {
    if (posts) setFilterPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (profilesIdArr) console.log(profilesIdArr);
  }, [profilesIdArr]);

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

  const [datePick, setDatePick] = useState<DateRangePickerValue | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 1)),
    to: new Date(),
  });
  const dateRangeHandler = (date: any) => {
    setDatePick(date);
  };
  const datePickerReset = () => {
    setDatePick({});
    setFilterPosts(posts);
  };

  useEffect(() => {
    if (!datePick) return;
    if (posts) searchHandler();
  }, [posts]);

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

  const [isSwitch, setIsSwitch] = useState(true);
  const handleSwitchChange = () => {
    setIsSwitch(!isSwitch);
  };

  const [isAnswerSwitch, setIsAnswerSwitch] = useState(true);
  const handleAnswerSwitchChange = () => {
    setIsAnswerSwitch(!isAnswerSwitch);
  };

  if (isLoadingPosts && isLoadingProfiles && filterPosts) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-[640px] lg:max-w-[1024px] mx-auto py-24">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-end gap-x-2 items-center">
            <label className="text-tremor-default text-tremor-content ">
              답장이 있는 글만 보기
            </label>
            <Switch
              id="switch"
              name="switch"
              checked={isAnswerSwitch}
              onChange={handleAnswerSwitchChange}
            />
          </div>
          <div className="flex justify-end gap-x-2 items-center">
            <label className="text-tremor-default text-tremor-content ">
              선택시 테스트와 관리자 계정 제외
            </label>
            <Switch
              id="switch"
              name="switch"
              checked={isSwitch}
              onChange={handleSwitchChange}
            />
          </div>
          <div className="flex justify-end gap-x-2 items-center">
            <DateRangePicker
              className="max-w-sm"
              enableSelect={false}
              enableClear={false}
              onValueChange={dateRangeHandler}
              defaultValue={{
                from: new Date(),
              }}
              value={datePick}
            />
            <Button onClick={searchHandler}>검색</Button>
            <Button variant="secondary" onClick={datePickerReset}>
              초기화
            </Button>
          </div>
        </div>

        <Table>
          <TableHead className="border-b-2">
            <TableHeaderCell className="text-center">옵션</TableHeaderCell>
            <TableHeaderCell className="text-center">아이디</TableHeaderCell>
            <TableHeaderCell className="text-center">작성글</TableHeaderCell>
            <TableHeaderCell className="text-center">답장글</TableHeaderCell>
            <TableHeaderCell className="text-center">생성일</TableHeaderCell>
            <TableHeaderCell className="text-center">작성선택일</TableHeaderCell>
            <TableHeaderCell className="text-center">세팅</TableHeaderCell>
          </TableHead>
          {filterPosts &&
            filterPosts
              .filter((post: any) => {
                if (isSwitch) return !profilesIdArr.includes(post.userId);
                else return post;
              })
              .filter((post: any) => {
                if (isAnswerSwitch) {
                  if (post.answer) return post;
                } else return post;
              })
              .map((post: any) => (
                <TableRow
                  key={post.postId}
                  className="even:bg-tremor-background-muted even:dark:bg-dark-tremor-background-muted"
                >
                  <TableCell className="flex items-center justify-center h-[80px] max-w-[50px]">
                    {post.answerUpdate ? <LuBadgeCheck className="w-6 h-6" /> : ''}
                  </TableCell>
                  <TableCell className="text-center text-[10px] h-[80px]">
                    {post.userId}
                    <br />
                    {post.postId}
                  </TableCell>
                  <TableCell className="text-center text-xs max-w-[120px] truncate">
                    {post.content}
                  </TableCell>
                  <TableCell className="text-center text-xs max-w-[120px] truncate">
                    {post.answer ? post.answer : 'X'}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatUTCDateKR(post.createAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatUTCDateKR(post.selectedAt)}
                  </TableCell>
                  <TableCell className="flex items-center justify-center h-[105px]">
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
                <div className="">
                  <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    작성 선택일
                  </label>
                  <Text>{formatUTCDateKR(setting.selectedAt)}</Text>
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
                  {setting.answer ? (
                    <p dangerouslySetInnerHTML={{ __html: setting.answer }} />
                  ) : (
                    '답변된 글이 없습니다.'
                  )}
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
