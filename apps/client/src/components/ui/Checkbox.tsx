'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checkState?: 'check' | 'minus';
}

const CheckboxOrigin = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded bg-grayscale-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    {props.children}
  </CheckboxPrimitive.Root>
));

CheckboxOrigin.displayName = CheckboxPrimitive.Root.displayName;

export const Checkbox = ({
  checkState = 'check',
  ...props
}: CheckboxProps & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxOrigin {...props}>
      <CheckboxPrimitive.Indicator
        className={cn(
          'flex items-center h-5 w-5 rounded bg-branding-600 justify-center text-current',
        )}
      >
        {checkState === 'check' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 4L4.46371 7L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="2"
            viewBox="0 0 10 2"
            fill="none"
          >
            <path
              d="M1 1H9.00016"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxOrigin>
  );
};
export default Checkbox;
