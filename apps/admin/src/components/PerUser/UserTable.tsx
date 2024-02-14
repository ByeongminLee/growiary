'use client';

import {
  Badge,
  Button,
  Callout,
  Card,
  Dialog,
  DialogPanel,
  Divider,
  DonutChart,
  Flex,
  List,
  ListItem,
  Metric,
  Select,
  SelectItem,
  Tab,
  TabGroup,
  TabList,
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
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
import fetcher from '@/utils/fetcher';
import { useProfileStore } from '@/state';

type FeedbackItemType = {
  values: ValuesType[];
  colors: string[];
};

type ValuesType = {
  name: string;
  value: number;
};

type UserDataType = {
  userId: string;
  createdAt: string;
  userName: string;
  feedback: {
    GOOD: number;
    BAD: number;
    NONE: number;
  };
  postCount: number;
  avgPostsCharacter: number;
  avgPostTimeOfDay: number;
  role: RoleType;
};

type RoleType = 'ADMIN' | 'USER' | 'TESTER';

export const UserTable = () => {
  const [searchText, setSearchText] = useState('');
  const data = usePerUser();
  const [filteredData, setFilteredData] = useState(data);
  const { allPage, startIndex, endIndex, paginationHandler } = usePagination({
    dataLength: filteredData.length,
  });
  const { update } = useProfileStore();

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
    isOpen: settingIsOpen,
    onOpen: settingOnOpen,
    onClose: settingOnClose,
  } = useModal();
  const [settingData, setSettingData] = useState<UserDataType>();
  const onOpenSettingHandler = (item: UserDataType) => {
    setSettingData(item);
    settingOnOpen();
  };
  const settingOnCloseHandler = () => {
    setUpdateUserValue(undefined);
    setSettingData(undefined);
    settingOnClose();
  };
  const [updateUserValue, setUpdateUserValue] = useState<{ role: RoleType } | undefined>(
    undefined,
  );
  const updateUserSelectOnChange = (value: any) => {
    if (value === 'ADMIN' || value === 'USER' || value === 'TESTER') {
      setUpdateUserValue({ role: value });
    }
  };
  const updateUserData = () => {
    if (settingData?.role !== updateUserValue) {
      fetcher({
        url: 'update-profile',
        body: {
          origin: settingData,
          update: updateUserValue,
        },
      });
    }

    if (settingData?.userId) update(settingData?.userId, updateUserValue);

    settingOnCloseHandler();
  };

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
        {/* <Flex flexDirection="col" className="gap-4">
        <Flex>
          <TextInput
            icon={SearchIcon}
            placeholder="Search..."
            value={searchText}
            onValueChange={setSearchText}
          />
        </Flex>
        <Flex justifyContent="between">
          <Flex justifyContent="start">
            <Select>
              <SelectItem value={'createAt'}>가입일</SelectItem>
              <SelectItem value={'postCount'}>작성한 일기수</SelectItem>
              <SelectItem value={'avgChar'}>평균글자수</SelectItem>
            </Select>
            <TabGroup>
              <TabList variant="solid">
                <Tab value={0}>내림차순</Tab>
                <Tab value={1}>오름차순</Tab>
              </TabList>
            </TabGroup>
          </Flex>
          <Button size="md" className="min-w-20">
            확인
          </Button>
        </Flex>
      </Flex> */}
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