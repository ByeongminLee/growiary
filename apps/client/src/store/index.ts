import { atom, AtomEffect } from 'recoil';
import { UserProfileDTO } from '@growiary/types';
import { CollectedRecordType } from '@/types';

export type UserProfileStateType = {
  key: string;
  default: UserProfileDTO;
};

export type RecordStateType = {
  key: string;
  default: CollectedRecordType;
};

export type RecordWriteStateType = {
  key: string;
  default: {
    content: string;
    isWaiting: boolean;
  };
};

const sessionStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    if (typeof window !== 'undefined') {
      const savedValue = sessionStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? sessionStorage.removeItem(key)
        : sessionStorage.setItem(key, JSON.stringify(newValue));
    });
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
  effects: [sessionStorageEffect('user_profile')],
});

export const recordState = atom(<RecordStateType>{
  key: 'recordState',
  default: {},
  effects: [sessionStorageEffect('record')],
});

export const recordWriteState = atom(<RecordWriteStateType>{
  key: 'recordWriteState',
  default: {
    content: '',
    isWaiting: false,
  },
});
