export * from './ProfileType';
export * from './RecordType';

export type loginType = 'google' | 'naver' | 'kakao';

export type ApiError = {
  status: 500 | 400 | 404;
  message: string;
};

export type ApiSuccess<T> = {
  status: 200;
  data: T;
};

export type ApiResponse<T> = ApiError | ApiSuccess<T>;
