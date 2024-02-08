'use client';

import {
  Button,
  Card,
  Flex,
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

export const PerUser = () => {
  const [searchText, setSearchText] = useState('');
  const data = usePerUser();
  const [filteredData, setFilteredData] = useState(data);

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

  return (
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
        {filteredData.map(item => (
          <TableRow key={item.userId}>
            <TableCell className="text-center">{item.userId}</TableCell>
            <TableCell className="text-center">{item.userName}</TableCell>
            <TableCell className="text-center">{item.postCount}</TableCell>
            <TableCell className="text-center">{item.avgPostsCharacter}</TableCell>
            <TableCell className="text-center">{item.avgPostTimeOfDay}</TableCell>
            <TableCell className="text-center">
              <Flex flexDirection="col">
                <Text>GOOD : {item.feedback.GOOD}</Text>
                <Text>BAD : {item.feedback.BAD}</Text>
                <Text>NONE : {item.feedback.NONE}</Text>
              </Flex>
            </TableCell>
            <TableCell className="text-center">{item.createdAt}</TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
};
