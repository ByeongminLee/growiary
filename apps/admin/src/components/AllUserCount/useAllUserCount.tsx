'use client';

import { useProfileStore } from '@/state';

export const useAllUserCount = () => {
  const { profiles } = useProfileStore();

  return profiles.length;
};
