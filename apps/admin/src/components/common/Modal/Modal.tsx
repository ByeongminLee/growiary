'use client';
import { cn } from '@/utils/cn';
import { Dialog, DialogPanel } from '@tremor/react';

export type ModalProps = {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ className, children, isOpen, onClose }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className={'z-[200000]'}>
      <DialogPanel className={cn(className)}>{children}</DialogPanel>
    </Dialog>
  );
};
