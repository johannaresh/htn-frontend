'use client';

import type { ButtonHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils/classNames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-white text-black hover:bg-gray-200 focus:ring-white',
    secondary: 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 focus:ring-gray-500',
    ghost: 'text-white hover:bg-gray-800 focus:ring-gray-500',
  };

  return (
    <button
      className={classNames(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
