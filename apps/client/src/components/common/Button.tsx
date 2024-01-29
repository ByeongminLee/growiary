'use client';

import React, { ReactNode } from 'react';
interface ButtonProps {
  children: ReactNode;
  size?: string;
  onClick?: () => void;
}

const Button = ({ children, size, onClick = () => {} }: ButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="btn-primary" onClick={handleClick}>
      {children}
    </div>
  );
};

export default Button;
