import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '~/utils/style';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputStyle = {
  base: 'flex h-10 w-full rounded-lg border placeholder-muted-foreground border-border bg-card px-3 py-1 text-[15px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-foreground focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50',
};

const inputVariants = cva(InputStyle.base);

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants(), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
