import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outlineinline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  'rounded-md text-center cursor-pointer hover:shadow-[none] hover:bg-branding-300 disabled:cursor-default border disabled:border-primary-300  p-3.5 block',
  {
    variants: {
      variant: {
        default:
          'shadow-[2px_2px_0px_0px_#101010] font-semibold text-xl bg-primary-100 text-primary-900 font-p-M20 border-primary-900 transition-colors transition-shadow duration-300 disabled:text-primary-200 disabled:bg-primary-200 ',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'font-normal text-xl bg-primary-100 text-primary-900 font-p-R18 border-primary-300 transition-colors transition-shadow duration-300 disabled:text-primary-300 disabled:bg-primary-100',
        third:
          'flex items-center justify-center border-0 flex p-2.5 rounded-lg font-p-R18-2 text-primary-900',
        third_icon: 'border-0 p-3 rounded-lg',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      compoundVariants: {
        danger: 'text-primary-100 bg-danger-600 hover:bg-danger-700',
      },
      size: {
        default: 'w-full',
        sm: 'px-[23px] py-2.5',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, compoundVariants, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, compoundVariants, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
