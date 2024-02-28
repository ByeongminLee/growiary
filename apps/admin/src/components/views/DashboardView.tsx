'use client';

import { usePostStore, useProfileStore } from '@/state';

import { useEffect } from 'react';
import { TemplateCount } from '../TemplateCount';
import { Col, Grid, Metric } from '@tremor/react';
import {
  ActiveUser,
  AllPostsCount,
  AllUserCount,
  AvgPostsCharacter,
  ByDate,
  FeedbackSatisfaction,
  UserTable,
} from '..';
import { Navbar } from '../common';
import { useQuery } from '@tanstack/react-query';
import fetcher from '@/utils/fetcher';

export const DashboardView = () => {
  const { setProfile } = useProfileStore();
  const { setPost } = usePostStore();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetcher({ url: 'profile' }).then(res => res.data),
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['post'],
    queryFn: () => fetcher({ url: 'post' }).then(res => res.data),
  });

  useEffect(() => {
    if (posts && !isLoadingPosts) {
      setPost(posts);
    }
  }, [isLoadingPosts, posts, setPost]);

  useEffect(() => {
    if (!isLoadingProfiles && profiles) {
      setProfile(profiles);
    }
  }, [isLoadingProfiles, profiles, setProfile]);

  return (
    <>
      <Navbar />
      <div className="max-w-[640px] lg:max-w-[1024px] mx-auto py-24">
        <div className="sm:text-left text-center">
          <Metric>전체 유저 데이터</Metric>
        </div>
        <Grid
          numItems={1}
          numItemsSm={2}
          numItemsLg={3}
          className="gap-4 max-w-[640px] lg:max-w-[1024px] mx-auto mt-4"
        >
          <Col className="flex flex-col gap-2">
            <AllUserCount />
            <AllPostsCount />
          </Col>
          <AvgPostsCharacter />
          <FeedbackSatisfaction />
          <TemplateCount />
          <Col numColSpan={1} numColSpanSm={2} numColSpanMd={2} numColSpanLg={2}>
            <ByDate />
          </Col>
        </Grid>

        <div className="mt-8 max-w-[640px] lg:max-w-[1024px] mx-auto">
          <div className="sm:text-left text-center">
            <Metric>유저 유입량</Metric>
          </div>
          <ActiveUser />
        </div>

        <div className="mt-8 sm:max-w-[640px] lg:max-w-[1024px] mx-auto max-w-xs">
          <div className="sm:text-left text-center">
            <Metric>유저 정보</Metric>
          </div>
          <UserTable />
        </div>
      </div>
    </>
  );
};
