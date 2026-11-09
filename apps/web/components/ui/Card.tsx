import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'gradient';
  hoverable?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-[#E3EEE7] shadow-[0_4px_20px_-4px_rgba(23,43,36,0.05)]',
    flat: 'bg-[#F7FDFA] border border-[#E3EEE7]',
    gradient: 'bg-gradient-to-br from-[#16A34A] to-[#087A3E] text-white shadow-md shadow-green-700/15',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 overflow-hidden',
        variants[variant],
        hoverable && 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#CBDCD3]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-5 py-4 border-b border-[#E3EEE7] flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-[#172B24] tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-[#64746C] mt-0.5', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-5 py-3.5 bg-[#F0FBF5]/50 border-t border-[#E3EEE7] flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

