'use client';
import Image from 'next/image';

export const Logo = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <Image
      src={'/assets/logo.png'}
      width={width ?? 100}
      height={height ?? 100}
      alt="logo"
    />
  );
};
