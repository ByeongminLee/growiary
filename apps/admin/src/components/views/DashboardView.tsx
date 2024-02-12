'use client';

import { usePostStore, useProfileStore } from '@/state';
import { PostType, ProfileType } from '@/types';
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
  PerUser,
} from '..';

export const DashboardView = ({
  profiles,
  posts,
}: {
  profiles: ProfileType[];
  posts: PostType[];
}) => {
  const { setProfile } = useProfileStore();
  const { setPost } = usePostStore();

  useEffect(() => {
    setPost(posts);
  }, [posts]);

  useEffect(() => {
    setProfile(profiles);
  }, [profiles]);

  return (
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
        <PerUser />
      </div>
    </div>
  );
};
