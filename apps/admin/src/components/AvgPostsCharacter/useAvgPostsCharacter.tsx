import { usePostStore } from '@/state';

export const useAvgPostsCharacter = () => {
  const { posts } = usePostStore();
  let totalCharacters = 0;
  let max = 0;
  let min = Infinity;

  posts.forEach(post => {
    if (post.content) {
      const contentLength = post.content.length;
      totalCharacters += contentLength;

      if (contentLength > max) {
        max = contentLength;
      }
      if (contentLength > 0 && contentLength < min) {
        min = contentLength;
      }
    }
  });

  const averageCharacters = totalCharacters / posts.length;

  return { avg: averageCharacters, max, min };
};
