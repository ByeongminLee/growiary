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
};

export type ProfileType = {
  createdAt: string;
  agreeTerms: any;
  userName: string;
  updatedAt: string;
  userId: string;
};

export type PostStoreType = {
  posts: PostType[] | [];
  setPost: (posts: PostType[]) => void;
};

export type ProfileStoreType = {
  profiles: ProfileType[] | [];
  setProfile: (profiles: ProfileType[]) => void;
};
