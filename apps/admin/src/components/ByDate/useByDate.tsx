'use client';
import { usePostStore, useProfileStore } from '@/state';
import { useEffect, useState } from 'react';

interface ProfileCountsType {
  [key: string]: number;
}

interface PostCountsType {
  [key: string]: number;
}

interface DataType {
  [key: string]: {
    date: string;
    profile: number;
    post: number;
  };
}

export const useByDate = () => {
  const { profiles } = useProfileStore();
  const { posts } = usePostStore();

  const [data, setData] = useState<DataType[] | any>([]);

  useEffect(() => {
    const profileCounts: ProfileCountsType = {};
    const postCounts: PostCountsType = {};

    // Count profiles and posts by date
    profiles.forEach(profile => {
      const date = new Date(profile.createdAt).toISOString().split('T')[0];

      profileCounts[date] = (profileCounts[date] || 0) + 1;
    });

    posts.forEach(post => {
      const date = new Date(post.createAt).toISOString().split('T')[0];
      postCounts[date] = (postCounts[date] || 0) + 1;
    });

    // Combine profile and post counts by date
    const combinedData: DataType = {};
    Object.keys(profileCounts).forEach(date => {
      combinedData[date] = {
        date,
        profile: profileCounts[date],
        post: postCounts[date] || 0,
      };
    });

    // Convert combined data to an array
    const dataArray = Object.values(combinedData);

    // Sort the array by date
    dataArray.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    setData(dataArray);
  }, [profiles, posts]);

  return data;
};
