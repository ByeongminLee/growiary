import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';
import { Button } from '@/components/ui/shadcn/button';

interface ConfirmModalProps {
  title: string;
  button: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  height?: string;
}
const ConfirmModal = ({
  title,
  button,
  onClick,
  children,
  height,
}: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="ml-auto md:mr-12">{button}</AlertDialogTrigger>
      <AlertDialogContent
        className="max-h-[70vh] w-[90%] rounded-md"
        style={{
          height: height || 'auto',
        }}
      >
        <div className="flex flex-col gap-3">
          <h2 className="font-p-M24 text-center">{title}</h2>
          <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto rounded">
            {children}
          </AlertDialogDescription>
          <Button variant="secondary" asChild>
            <AlertDialogAction onClick={onClick}>확인했어요</AlertDialogAction>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
