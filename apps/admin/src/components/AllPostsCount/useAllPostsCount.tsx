import { usePostStore } from '@/state';

export const useAllPostsCount = () => {
  const { posts } = usePostStore();
  return posts.length;
};
