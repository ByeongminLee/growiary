import { PostType, UserDataType } from '@/types';
import { useModal } from '../common';
import { useState } from 'react';
import { usePostStore } from '@/state';

export const useWritingsModal = () => {
  const { posts } = usePostStore();
  const {
    isOpen: writingIsOpen,
    onOpen: writingOnOpen,
    onClose: writingOnClose,
  } = useModal();

  const [writingsData, setWritingsData] = useState<PostType[]>([]);

  const onOpenWritingsHandler = (item: UserDataType) => {
    const userPosts = posts
      .filter(profile => profile.userId === item.userId)
      .sort((a, b) => {
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
      });

    setWritingsData(userPosts);
    writingOnOpen();
  };

  const writingsOnCloseHandler = () => {
    writingOnClose();
  };

  return {
    writingsData,
    writingIsOpen,
    onOpenWritingsHandler,
    writingsOnCloseHandler,
  };
};
