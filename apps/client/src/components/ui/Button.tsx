'use client';

import React, { ReactNode } from 'react';
interface ButtonProps {
  children: ReactNode;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
}

const Button = ({
  children,
  className = 'btn-primary',
  type = 'button',
  onClick = () => {},
}: ButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button type={type} className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
