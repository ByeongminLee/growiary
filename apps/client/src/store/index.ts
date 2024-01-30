import { atom } from 'recoil';
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
