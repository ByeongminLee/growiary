import { usePostStore } from '@/state';

export const useFeedbackSatisfaction = () => {
  const { posts } = usePostStore();
  const count = {
    GOOD: 0,
    BAD: 0,
    NONE: 0,
  };

  posts.forEach(post => {
    if (post.feedback === 'GOOD') {
      count.GOOD++;
    } else if (post.feedback === 'BAD') {
      count.BAD++;
    } else if (post.feedback === 'NONE') {
      count.NONE++;
    }
  });

  return count;
};
