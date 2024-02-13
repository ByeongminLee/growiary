import { ProfileStoreType, ProfileType } from '@/types';
import fetcher from '@/utils/fetcher';
import { create } from 'zustand';

export const useProfileStore = create<ProfileStoreType>((set, get) => ({
  profiles: [],
  setProfile: (profiles: ProfileType[]) => {
    set({ profiles });
  },
  update: (userId, update) => {
    const data = get().profiles.map(profile => {
      if (profile.userId === userId) {
        profile = { ...profile, ...update };
        return profile;
      }
      return profile;
    });

    console.log(data);

    set({ profiles: data });
  },
}));
