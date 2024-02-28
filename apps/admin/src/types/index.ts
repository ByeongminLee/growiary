export type PostType = {
  userId: string;
  postId: string;
  feedback: 'GOOD' | 'NONE' | 'BAD';
  template: string;
  answer: string;
  ai: any;
  updateAt: string;
  content: string;
  createAt: string;
  selectedAt: string;
  answerUpdate?: boolean;
};

export type ProfileType = {
  createdAt: string;
  agreeTerms: any;
  userName: string;
  updatedAt: string;
  userId: string;
  role: 'ADMIN' | 'USER' | 'TESTER';
};

export type PostStoreType = {
  posts: PostType[] | [];
  setPost: (posts: PostType[]) => void;
};

export type ProfileStoreType = {
  profiles: ProfileType[] | [];
  setProfile: (profiles: ProfileType[]) => void;
  update: (userId: string, update: any) => void;
};

export type FeedbackItemType = {
  values: ValuesType[];
  colors: string[];
};

export type ValuesType = {
  name: string;
  value: number;
};

export type UserDataType = {
  userId: string;
  createdAt: string;
  userName: string;
  feedback: {
    GOOD: number;
    BAD: number;
    NONE: number;
  };
  postCount: number;
  avgPostsCharacter: number;
  avgPostTimeOfDay: number;
  role: RoleType;
};

export type RoleType = 'ADMIN' | 'USER' | 'TESTER';
