export type CreatePostDTO = {
  title?: string;
  content: string;
  template?: string;
  date?: string | Date;
  offset?: string | number;
};

export type FindPostDTO = {
  type: 'DAY' | 'MONTH' | 'YEAR';
  date: string;
};

export type Post = {
  title: string;
  content: string;
  template: string;
  createAt: string | Date;
  updateAt: string | Date;
  feedback?: FeedbackType;
  answer?: string;
  ai?: {
    id: string;
    created: string;
    usage: string;
  };
  status?: PostStatus;
};

export type FilterFindPostDTO = {
  startDate: string;
  endDate: string;
};

export type FeedbackType = 'GOOD' | 'BAD' | 'NONE';
export type PostStatus = 'ACTIVE' | 'DELETED';

export type PostFeedbackDTO = {
  postId: string;
  feedback: FeedbackType;
};
export type PostEditDTO = {
  postId: string;
  content?: string;
  status?: PostStatus;
};
