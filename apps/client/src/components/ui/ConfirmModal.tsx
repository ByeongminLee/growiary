import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';

interface ConfirmModalProps {
  title: string;
  button: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
const ConfirmModal = ({ title, button, onClick, children }: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="ml-auto md:mr-12">{button}</AlertDialogTrigger>
      <AlertDialogOverlay>
        <AlertDialogContent className="max-h-[70%] w-[90%] rounded-md	">
          <div className="flex flex-col gap-3">
            <h2 className="font-p-M24 text-center">{title}</h2>
            <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto rounded">
              {children}
            </AlertDialogDescription>
            <AlertDialogAction className="btn-secondary btn-full" onClick={onClick}>
              확인했어요
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmModal;
