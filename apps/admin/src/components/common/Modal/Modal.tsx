import { Dialog, DialogPanel } from '@tremor/react';

export type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="z-[200000]">
      <DialogPanel>{children}</DialogPanel>
    </Dialog>
  );
};
