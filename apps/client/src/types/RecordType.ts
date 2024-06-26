import { FeedbackType } from '@growiary/types';

export type DiaryTemplate = {
  id: string;
  dateColor: string;
  bgColor: string;
  question: string;
  questionColor: string;
  placeholder: string;
  caretColor: string;
  answerColor: string;
  charSrc: string;
};

export type UsageAiType = {
  id: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type RecordType = {
  postId: string;
  title?: string;
  content: string;
  template: string;
  updateAt: string;
  createAt: string;
  answer?: string;
  selectedAt?: string;
  feedback?: FeedbackType;
  ai?: UsageAiType;
};

export type CollectedRecordType = {
  [key: string]: RecordType[];
};
