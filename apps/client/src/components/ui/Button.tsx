'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface ButtonProps {
  children: ReactNode;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
}

const Button = ({
  children,
  className = '',
  type = 'button',
  onClick = () => {},
}: ButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      type={type}
      className={`${/(btn-secondary)/.test(className) ? className : className + ' btn-primary bg-primary-100 btn-full'}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
