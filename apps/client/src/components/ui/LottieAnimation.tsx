import Lottie from 'lottie-react';
import { useEffect, useRef } from 'react';

interface LottieAnimationProps {
  src: unknown;
  width?: number;
  height?: number;
  className?: string;
}

export const LottieAnimation = ({
  src,
  width = 100,
  height = 100,
  className = '',
}: LottieAnimationProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    (targetRef.current.firstElementChild! as HTMLElement).style.width = width + 'px';
    (targetRef.current.firstElementChild! as HTMLElement).style.height = height + 'px';

    return () => {};
  }, [width, height]);

  return (
    <div ref={targetRef} className={className}>
      <Lottie
        animationData={src}
        // Other optional props like loop, autoplay, speed, etc.
      />
    </div>
  );
};

export default LottieAnimation;
