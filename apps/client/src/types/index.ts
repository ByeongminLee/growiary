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
