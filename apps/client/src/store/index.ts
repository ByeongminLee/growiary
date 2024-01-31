import { atom } from 'recoil';
import { UserProfileDTO } from '@growiary/types';

export type UserProfileStateType = {
  key: string;
  default: UserProfileDTO;
};
export const userProfileState = atom(<UserProfileStateType>{
  key: 'userProfileState',
  default: {
    userName: '',
    agreeTerms: {
      age: false,
      service: false,
      privacy: false,
    },
  },
});
