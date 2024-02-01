export * from './ProfileType';
export * from './RecordType';

export type loginType = 'google' | 'naver' | 'kakao';

export type ResponseStatus = 200 | 500 | 400 | 404;

export type ApiError = {
  status: ResponseStatus;
  message: string;
};

export type ApiSuccess<T> = {
  status: ResponseStatus;
  data: T;
};

export type ApiResponse<T> = ApiError | ApiSuccess<T>;
