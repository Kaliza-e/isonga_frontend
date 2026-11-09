'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, value, ...props }, ref) => {
    const inputId = id || React.useId();
    const controlledValue = value !== undefined ? (value ?? '') : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#172B24]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64746C]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            value={controlledValue}
            className={cn(
              'w-full rounded-xl border border-[#E3EEE7] bg-white px-3.5 py-2.5 text-sm text-[#172B24] placeholder:text-[#94A39B] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#E45C5C] focus:border-[#E45C5C] focus:ring-[#E45C5C]/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#64746C]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#E45C5C] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64746C]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#172B24]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-[#E3EEE7] bg-white px-3.5 py-2.5 text-sm text-[#172B24] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]',
            error && 'border-[#E45C5C] focus:border-[#E45C5C] focus:ring-[#E45C5C]/20',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[#E45C5C] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64746C]">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#172B24]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-[#E3EEE7] bg-white px-3.5 py-2.5 text-sm text-[#172B24] placeholder:text-[#94A39B] transition-colors resize-y min-h-[90px]',
            'focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]',
            error && 'border-[#E45C5C] focus:border-[#E45C5C] focus:ring-[#E45C5C]/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#E45C5C] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64746C]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

