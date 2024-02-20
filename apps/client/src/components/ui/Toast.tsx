import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  className?: string;
  children: ReactNode;
}
const Toast = (
  { className = '', children }: ToastProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const toastRef = useRef(null);
  useImperativeHandle(ref, () => toastRef.current!, []);

  return (
    <div
      ref={toastRef}
      className={cn(
        'fixed hidden break-keep text-center z-50 bottom-[100px] w-[58%] left-[50%] translate-x-[-50%] py-2 px-3 font-primary-900 bg-danger-400 rounded',
        'font-p-M14',
      )}
    >
      {children}
    </div>
  );
};

export default forwardRef(Toast);
