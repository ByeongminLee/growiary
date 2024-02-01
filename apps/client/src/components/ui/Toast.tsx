import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
        'fixed hidden z-50 bottom-[100px] left-[50%] translate-x-[-50%] py-2 px-3 font-p-M14 font-primary-900 bg-danger-400 rounded',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default forwardRef(Toast);
