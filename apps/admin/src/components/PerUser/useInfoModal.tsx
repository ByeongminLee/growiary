import { useState } from 'react';
import { useModal } from '../common';
import fetcher from '@/utils/fetcher';
import { useProfileStore } from '@/state';
import { RoleType, UserDataType } from '@/types';

export const useInfoModal = () => {
  const { update } = useProfileStore();
  const {
    isOpen: settingIsOpen,
    onOpen: settingOnOpen,
    onClose: settingOnClose,
  } = useModal();
  const [settingData, setSettingData] = useState<UserDataType>();
  const onOpenSettingHandler = (item: UserDataType) => {
    setSettingData(item);
    settingOnOpen();
  };
  const settingOnCloseHandler = () => {
    setUpdateUserValue(undefined);
    setSettingData(undefined);
    settingOnClose();
  };
  const [updateUserValue, setUpdateUserValue] = useState<{ role: RoleType } | undefined>(
    undefined,
  );
  const updateUserSelectOnChange = (value: any) => {
    if (value === 'ADMIN' || value === 'USER' || value === 'TESTER') {
      setUpdateUserValue({ role: value });
    }
  };
  const updateUserData = () => {
    if (settingData?.role !== updateUserValue) {
      fetcher({
        url: 'update-profile',
        body: {
          origin: settingData,
          update: updateUserValue,
        },
      });
    }

    if (settingData?.userId) update(settingData?.userId, updateUserValue);

    settingOnCloseHandler();
  };

  return {
    updateUserValue,
    onOpenSettingHandler,
    settingIsOpen,
    settingData,
    updateUserSelectOnChange,
    updateUserData,
    settingOnCloseHandler,
  };
};
