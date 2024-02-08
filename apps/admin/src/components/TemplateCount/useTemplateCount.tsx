import { usePostStore } from '@/state';

export const useTemplateCount = () => {
  const { posts } = usePostStore();
  const count: { [key: string]: number } = {};

  posts.forEach(post => {
    const template = post.template;

    if (count[template]) {
      count[template]++;
    } else {
      count[template] = 1;
    }
  });

  const templateCount = Object.entries(count).map(([name, value]) => ({
    name,
    value,
  }));

  let max = { name: '', value: -Infinity };
  let min = { name: '', value: Infinity };

  templateCount.forEach(({ name, value }) => {
    if (value > max.value) {
      max = { name, value };
    }
    if (value < min.value) {
      min = { name, value };
    }
  });

  return { templateCount, max, min };
};
