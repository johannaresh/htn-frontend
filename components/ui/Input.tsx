'use client';

import type { InputHTMLAttributes } from 'react';
import { classNames } from '@/lib/utils/classNames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, id, ...props }: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={classNames(
          'w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white',
          'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent',
          className
        )}
        {...props}
      />
    </div>
  );
};
