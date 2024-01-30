import { atom } from 'recoil';

type TempState = {};
export const userProfileState = atom({
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
