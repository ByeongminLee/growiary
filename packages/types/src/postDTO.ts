import { FeedbackType } from './feedbackDTO';

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
  selectedAt?: string | Date;
  feedback?: FeedbackType;
  feedbackDetail?: FeedbackDetailType;
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
  offset?: string | number;
};

export type FeedbackDetailType = {
  content?: string;
  select?: {
    speed: boolean; // 답변 속도
    quality: boolean; // 답변 퀄리티
    amount: boolean; // 답변 양
    count: boolean; // 답변 횟수
    topic: boolean; // 템플릿 주제
  };
};

export type PostStatus = 'ACTIVE' | 'DELETED';

export type PostFeedbackDTO = {
  postId: string;
  feedback: FeedbackType;
  feedbackDetail?: FeedbackDetailType;
};
export type PostEditDTO = {
  postId: string;
  content?: string;
  status?: PostStatus;
};
