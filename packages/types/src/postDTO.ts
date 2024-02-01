export type CreatePostDTO = {
  title?: string;
  content: string;
  template?: string;
};

export type FindPostDTO = {
  type: 'DAY' | 'MONTH' | 'YEAR';
  date: string;
};

export type Post = {
  title: string;
  content: string;
  template: string;
  createAt: string;
  updateAt: string;
};

export type FilterFindPostDTO = {
  startDate: string;
  endDate: string;
};

export type FeedbackType = 'GOOD' | 'BAD';
