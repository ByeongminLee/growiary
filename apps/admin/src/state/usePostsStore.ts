import { PostStoreType, PostType } from '@/types';
import { create } from 'zustand';

export const usePostStore = create<PostStoreType>(set => ({
  posts: [],
  setPost: (posts: PostType[]) => {
    set({ posts });
  },
}));
