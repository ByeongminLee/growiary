import Lottie, { LottieOptions, LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';

interface LottieAnimationProps {
  src: unknown;
  width?: string;
  height?: string;
  className?: string;
  options?: Omit<LottieOptions, 'animationData'>;
  speed?: number;
  afterLoaded?: () => void;
}

export const LottieAnimation = ({
  src,
  width,
  height,
  className = '',
  options,
  speed,
  afterLoaded,
}: LottieAnimationProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    speed && lottieRef.current?.setSpeed(speed);
    if (lottieRef.current?.animationLoaded) {
      afterLoaded && afterLoaded();
    }
    width &&
      ((targetRef.current.firstElementChild! as HTMLElement).style.width =
        width || '100px');
    height &&
      ((targetRef.current.firstElementChild! as HTMLElement).style.height =
        height || '100px');

    return () => {};
  }, [width, height, lottieRef.current?.animationLoaded, speed, afterLoaded]);

  return (
    <div ref={targetRef} className={className}>
      <Lottie animationData={src} {...options} lottieRef={lottieRef} />
    </div>
  );
};

export default LottieAnimation;
