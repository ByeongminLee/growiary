export type UserFeedbackDTO = {
  feedback: FeedbackType;
  content: string;
};

export type FeedbackType = 'GOOD' | 'FINE' | 'AVERAGE' | 'NOTBAD' | 'BAD' | 'NONE';
