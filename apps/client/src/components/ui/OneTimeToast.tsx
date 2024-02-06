import { ReactNode, useEffect, useRef } from 'react';

interface CenteredToastProps {
  children: ReactNode;
}
const OneTimeToast = ({ children }: CenteredToastProps) => {
  const toastRef = useRef<HTMLDivElement | null>(null);

  const showToast = () => {
    if (!toastRef.current) return;
    console.log('showtoast');
    toastRef.current.style.display = 'block';
    const timeoutId = setTimeout(() => {
      if (!toastRef.current) return;
      toastRef.current.style.display = 'none';
      clearTimeout(timeoutId);
    }, 3000);
  };

  useEffect(() => {
    if (!toastRef.current) return;
    showToast();
    return;
  }, []);

  return (
    <div
      ref={toastRef}
      className="absolute hidden inset-x-0 top-[40%] translate-[-50%] z-50"
    >
      <div className="flex  justify-center align-center">
        <div className="py-2 px-3 bg-grayscale-300 rounded">{children}</div>
      </div>
    </div>
  );
};

export default OneTimeToast;
