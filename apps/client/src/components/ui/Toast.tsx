import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  className?: string;
  children: ReactNode;
}
const Toast = ({ className = '', children }: ToastProps) => {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [setIsTimeout]);

  return (
    <>
      {!isTimeout && (
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
