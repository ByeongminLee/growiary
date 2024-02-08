import { ProfileStoreType, ProfileType } from '@/types';
import { create } from 'zustand';

export const useProfileStore = create<ProfileStoreType>(set => ({
  profiles: [],
  setProfile: (profiles: ProfileType[]) => {
    set({ profiles });
  },
}));
