'use client';

import {
  Badge,
  Button,
  Callout,
  Card,
  Divider,
  DonutChart,
  Flex,
  List,
  ListItem,
  Select,
  SelectItem,
  Table,
  TableCell,
  TableRow,
  Text,
  TextInput,
  Title,
} from '@tremor/react';
import { usePerUser } from '.';
import { HiOutlineSearch } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { TableHeader } from './TableHeader';
import { Modal, useModal } from '../common';
import { CgClose } from 'react-icons/cg';
import { cn } from '@/utils/cn';
import { usePagination } from './usePagination';
import { Pagination } from './Pagenation';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaArrowRight } from 'react-icons/fa';
import { LuFileText } from 'react-icons/lu';
import { useInfoModal } from './useInfoModal';
import { FeedbackItemType, UserDataType } from '@/types';
import { useWritingsModal } from './useWritingsModal';

export const UserTable = () => {
  const [searchText, setSearchText] = useState('');
  const data = usePerUser();
  const [filteredData, setFilteredData] = useState(data);
  const { allPage, startIndex, endIndex, paginationHandler } = usePagination({
    dataLength: filteredData.length,
  });

  // test

  useEffect(() => {
    if (data) setFilteredData(data);
  }, [data]);

  const dataHandler = () => {
    const result = data
      .filter(item => {
        return (
          item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.userId.toLowerCase().includes(searchText.toLowerCase())
        );
      })
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    setFilteredData(result);
  };

  const { isOpen, onOpen, onClose } = useModal();
  const [feedbackItem, setFeedbackItem] = useState<FeedbackItemType>({
    values: [
      {
        name: 'Good',
        value: 0,
      },
      {
        name: 'Bad',
        value: 0,
      },
      {
        name: 'None',
        value: 0,
      },
    ],
    colors: [],
  });
  const onOpenHandler = (feedbackItem: FeedbackItemType) => {
    setFeedbackItem(feedbackItem);
    onOpen();
  };

  const {
    updateUserValue,
    onOpenSettingHandler,
    settingIsOpen,
    settingData,
    updateUserSelectOnChange,
    updateUserData,
    settingOnCloseHandler,
  } = useInfoModal();

  const { writingsData, writingIsOpen, onOpenWritingsHandler, writingsOnCloseHandler } =
    useWritingsModal();

  return (
    <>
      <Card className="mt-4">
        <div className="py-2 mb-8">
          <Title>검색</Title>
          <Flex className="gap-4">
            <TextInput
              icon={() => (
                <div className="p-2">
                  <HiOutlineSearch className="w-5 h-5 " />
                </div>
              )}
              placeholder="Search..."
              value={searchText}
              onValueChange={setSearchText}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  dataHandler();
                }
              }}
            />
            <Button size="md" className="min-w-20" onClick={() => dataHandler()}>
              확인
            </Button>
          </Flex>
        </div>

        <Table>
          <TableHeader />
          {filteredData.slice(startIndex, endIndex).map((item: UserDataType) => (
            <TableRow
              key={item.userId}
              className='even:bg-tremor-background-muted even:dark:bg-dark-tremor-background-muted"'
            >
              <TableCell className="text-center text-xs h-[80px]">
                {item.userId}
              </TableCell>
              <TableCell className="text-center  h-[80px]">{item.userName}</TableCell>
              <TableCell className="text-center h-[80px]">{item.postCount}</TableCell>
              <TableCell className="text-center h-[80px]">
                {item.avgPostsCharacter}
              </TableCell>
              <TableCell className="text-center h-[80px]">
                {item.avgPostTimeOfDay}
              </TableCell>
              <TableCell className="text-center h-[80px]">
                {item && item.feedback ? (
                  <div
                    onClick={() =>
                      onOpenHandler({
                        values: [
                          {
                            name: 'Good',
                            value: item.feedback.GOOD,
                          },
                          {
                            name: 'Bad',
                            value: item.feedback.BAD,
                          },
                          {
                            name: 'None',
                            value: item.feedback.NONE,
                          },
                        ],
                        colors: ['blue', 'red', 'violet'],
                      })
                    }
                  >
                    <DonutChart
                      data={[
                        {
                          name: 'Good',
                          value: item.feedback.GOOD,
                        },
                        {
                          name: 'Bad',
                          value: item.feedback.BAD,
                        },
                        {
                          name: 'None',
                          value: item.feedback.NONE,
                        },
                      ]}
                      colors={['blue', 'red', 'violet']}
                      variant="donut"
                      className="w-10 h-10 cursor-pointer"
                    />
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-center h-[80px]">
                {/* 작성글 */}
                <LuFileText
                  className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
                  onClick={() => onOpenWritingsHandler(item)}
                />
              </TableCell>
              <TableCell className="text-center h-[80px]">
                {isToday(item.createdAt) && (
                  <Badge size={'xs'} color={'lime'}>
                    오늘
                  </Badge>
                )}
                <Text>{item.createdAt}</Text>
              </TableCell>
              <TableCell className="text-center h-[80px]">
                <RoleBadge role={item.role} />
              </TableCell>
              <TableCell className="flex items-center justify-center  h-[80px]">
                <RxHamburgerMenu
                  className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
                  onClick={() => onOpenSettingHandler(item)}
                />
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <div className="flex justify-end mt-4">
          <Pagination allPage={allPage} handler={paginationHandler} />
        </div>
      </Card>

      {isOpen && feedbackItem && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="flex justify-end mb-2">
            <CgClose
              onClick={onClose}
              className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
            />
          </div>
          <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            피드백 만족도
          </h3>

          <DonutChart
            data={feedbackItem.values}
            colors={feedbackItem.colors}
            variant="donut"
          />
          <List className="mt-2">
            {feedbackItem.values.map((item, idx: number) => (
              <ListItem key={item.name} className="space-x-6">
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-sm',
                      feedbackItem.colors[idx] === 'blue' && 'bg-blue-500',
                      feedbackItem.colors[idx] === 'red' && 'bg-red-500',
                      feedbackItem.colors[idx] === 'violet' && 'bg-violet-500',
                    )}
                    aria-hidden={true}
                  />
                  <span className="truncate dark:text-dark-tremor-content-emphasis">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {item.value}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </Modal>
      )}

      {settingIsOpen && settingData && (
        <Modal
          isOpen={settingIsOpen}
          onClose={settingOnCloseHandler}
          className="min-h-[430px] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-end mb-2">
              <CgClose
                onClick={settingOnCloseHandler}
                className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
              />
            </div>

            <div className="h-full">
              <Text>유저아이디 : {settingData.userId}</Text>
              <Text>유저명 : {settingData.userName}</Text>

              <Select
                defaultValue={settingData.role}
                className=" mt-4"
                onChange={e => updateUserSelectOnChange(e)}
              >
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="TESTER">TESTER</SelectItem>
              </Select>
            </div>
          </div>

          <div>
            {updateUserValue?.role && (
              <>
                <Divider />
                {settingData?.role === updateUserValue.role ? (
                  <Callout title="ERROR" color="red" className="mb-4">
                    변경할 권한이 현재 권한과 같습니다.
                  </Callout>
                ) : (
                  ''
                )}
                <div className="flex justify-between px-8 mb-4">
                  <RoleBadge role={settingData.role} />
                  <FaArrowRight className="mx-2" />
                  <RoleBadge role={updateUserValue.role} />
                </div>
              </>
            )}
            <Button
              className="w-full"
              onClick={updateUserData}
              disabled={settingData?.role === updateUserValue?.role ? true : false}
            >
              변경
            </Button>
          </div>
        </Modal>
      )}

      {writingIsOpen && writingsData && (
        <Modal
          isOpen={writingIsOpen}
          onClose={writingsOnCloseHandler}
          className="min-h-[430px] w-full flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-end mb-2">
              <CgClose
                onClick={writingsOnCloseHandler}
                className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full p-2"
              />
            </div>
            <div className="overflow-y-auto max-h-[500px] flex flex-col gap-4">
              {writingsData.length > 0 ? (
                <>
                  {writingsData.map(item => {
                    return (
                      <div key={item.postId} className="flex flex-col gap-3">
                        <div>
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Post ID
                          </label>
                          <Text>{item.postId}</Text>
                        </div>
                        <div>
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            작성 글
                          </label>
                          <p dangerouslySetInnerHTML={{ __html: item.content }} />
                        </div>
                        <div>
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            답변 글
                          </label>
                          <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </div>

                        <div className="flex gap-2">
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            작성일
                          </label>
                          <Text>{dateKoFormat(item.createAt)}</Text>
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            수정일
                          </label>
                          <Text>{dateKoFormat(item.updateAt)}</Text>
                        </div>

                        <div>
                          <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            만족도
                          </label>
                          <Text>{item.feedback}</Text>
                        </div>
                        <Divider />
                      </div>
                    );
                  })}
                </>
              ) : (
                <>값이 없습니다.</>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const RoleBadge = ({ role }: { role: 'ADMIN' | 'USER' | 'TESTER' }) => {
  return (
    <Badge color={role === 'ADMIN' ? 'red' : role === 'TESTER' ? 'orange' : 'blue'}>
      {role}
    </Badge>
  );
};

function isToday(date: string) {
  const propsDateFormatted = new Date(date).toISOString().slice(0, 10);
  const todayFormatted = new Date().toISOString().slice(0, 10);
  return propsDateFormatted === todayFormatted;
}

function dateKoFormat(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  };

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', options);
  return dateFormatter.format(date);
}
