import { atom, AtomEffect } from 'recoil';
import { UserProfileDTO } from '@growiary/types';
import { CollectedRecordType } from '@/types';

export type UserProfileStateType = {
  key: 'userProfileState';
  default: UserProfileDTO;
};

export type RecordStateType = {
  key: 'recordState';
  default: CollectedRecordType;
};

export type RecordWriteStateType = {
  key: 'recordWriteState';
  default: {
    content: string;
    tempContent?: string;
    state: 'SAVE' | 'EDIT' | 'WAIT' | 'NONE';
  };
};

export type InitExperienceType = {
  key: 'initExperience';
  default: {
    initUser: boolean;
    initSubmit: boolean;
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

const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
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
    state: 'NONE',
  },
});

export const initExperienceState = atom(<InitExperienceType>{
  key: 'initExperience',
  default: {
    initUser: true,
    initSubmit: true,
  },
  effects: [localStorageEffect('initExperience')],
});
