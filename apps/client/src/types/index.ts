export type loginType = 'google' | 'naver' | 'kakao';

export type ApiError = {
  status: number;
  message: string;
};

export type ApiSuccess<T> = {
  status: number;
  data: T;
};

export type ApiResponse<T> = ApiError | ApiSuccess<T>;

export type DiaryTemplate = {
  id: number;
  bgColor: string;
  question: string;
  questionColor: string;
  placeholder: string;
  answerColor: string;
  charSrc: string;
};
