import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  className?: string;
  condition: boolean;
  children: ReactNode;
}
const Toast = ({ className = '', condition, children }: ToastProps) => {
  return (
    <>
      {condition && (
        <div
          className={cn(
            'fixed z-50 bottom-[100px] left-[50%] translate-x-[-50%] py-2 px-3 font-p-M14 font-primary-900 bg-danger-400 rounded',
            className,
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Toast;
