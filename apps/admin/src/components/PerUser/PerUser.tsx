'use client';

import {
  Button,
  Card,
  Dialog,
  DialogPanel,
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

type FeedbackItemType = {
  values: ValuesType[];
  colors: string[];
};

type ValuesType = {
  name: string;
  value: number;
};

export const PerUser = () => {
  const [searchText, setSearchText] = useState('');
  const data = usePerUser();
  const [filteredData, setFilteredData] = useState(data);
  const { allPage, startIndex, endIndex, paginationHandler } = usePagination({
    dataLength: filteredData.length,
  });

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

  useEffect(() => {
    if (data && filteredData.length === 0) setFilteredData(data);
  }, [data]);

  const dataHandler = () => {
    const result = data.filter(item => {
      return (
        item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userId.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredData(result);
  };

  const onOpenHandler = (feedbackItem: FeedbackItemType) => {
    setFeedbackItem(feedbackItem);
    onOpen();
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
          {filteredData.slice(startIndex, endIndex).map(item => (
            <TableRow
              key={item.userId}
              className='even:bg-tremor-background-muted even:dark:bg-dark-tremor-background-muted"'
            >
              <TableCell className="text-center">{item.userId}</TableCell>
              <TableCell className="text-center">{item.userName}</TableCell>
              <TableCell className="text-center">{item.postCount}</TableCell>
              <TableCell className="text-center">{item.avgPostsCharacter}</TableCell>
              <TableCell className="text-center">{item.avgPostTimeOfDay}</TableCell>
              <TableCell className="text-center">
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
                      className="w-10 h-10"
                    />
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-center">{item.createdAt}</TableCell>
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
            <CgClose onClick={onClose} className="w-6 h-6 cursor-pointer" />
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
    </>
  );
};
