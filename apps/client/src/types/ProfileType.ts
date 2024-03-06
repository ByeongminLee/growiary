import { UserProfileDTO } from '@growiary/types';

export type UserType = {
  image: string;
  emailVerified: null;
  name: string;
  email: string;
};

export type ProfileResType = {
  user: UserType;
  profile: UserProfileDTO;
};

export const RequiredAgreements = ['privacy', 'service'] as const;
