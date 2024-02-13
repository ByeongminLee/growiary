'use client';
import { usePostStore, useProfileStore } from '@/state';
import { useEffect, useState } from 'react';

export const usePerUser = () => {
  const { profiles } = useProfileStore();
  const { posts } = usePostStore();
  const [data, setData] = useState<
    {
      userId: string;
      createdAt: string;
      userName: string;
      feedback: { GOOD: number; BAD: number; NONE: number };
      postCount: number;
      avgPostsCharacter: number;
      avgPostTimeOfDay: number;
      role: 'ADMIN' | 'USER' | 'TESTER';
    }[]
  >([]);

  useEffect(() => {
    const newData = profiles.map(profile => {
      const userPosts = posts.filter(post => post.userId === profile.userId);
      const feedbackCount = {
        GOOD: 0,
        BAD: 0,
        NONE: 0,
      };
      let totalCharacters = 0;
      let totalPostTime = 0;
      let postTimes: number[] = []; // 배열에 유저가 작성한 모든 일기의 작성 시간을 저장

      userPosts.forEach(post => {
        feedbackCount[post.feedback]++;
        totalCharacters += post.content.length;
        const postTime = new Date(post.createAt).getHours(); // 시간만 추출하여 저장
        totalPostTime += postTime;
        postTimes.push(postTime);
      });

      const avgPostsCharacter =
        userPosts.length > 0 ? totalCharacters / userPosts.length : 0;
      const avgPostTime =
        userPosts.length > 0 ? Math.round(totalPostTime / userPosts.length) : 0; // 평균값을 반올림하여 계산

      // postTimes 배열에서 평균값 계산
      const totalPostTimes = postTimes.reduce((acc, cur) => acc + cur, 0);
      const avgPostTimeOfDay =
        postTimes.length > 0 ? Math.round(totalPostTimes / postTimes.length) : 0;

      return {
        userId: profile.userId,
        createdAt: customDate(profile.createdAt),
        userName: profile.userName,
        feedback: feedbackCount,
        postCount: userPosts.length,
        avgPostsCharacter,
        avgPostTimeOfDay,
        role: profile.role,
      };
    });

    setData(newData);
  }, [profiles, posts]);

  return data;
};

function customDate(originDate: string) {
  const date = new Date(originDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
