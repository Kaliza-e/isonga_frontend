import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
}

export function IsongaLogo({
  className,
  size = 'md',
  showText = true,
  showTagline = true,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      {/* Authentic Isonga Connect Emblem: Connected Community Figures & Radio Waves */}
      <div className={cn('relative shrink-0 flex items-center justify-center', iconSizes[size])}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer circular badge frame */}
          <circle cx="50" cy="50" r="46" fill="#F0FBF5" stroke="#DDF7E8" strokeWidth="2.5" />
          
          {/* Top-right Radio Broadcast Signal Waves */}
          <path
            d="M 68 28 A 20 20 0 0 1 82 42"
            stroke="#0284C7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 72 20 A 30 30 0 0 1 90 38"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Green rolling hill base */}
          <path
            d="M 16 75 C 32 64 68 64 84 75 C 76 86 64 92 50 92 C 36 92 24 86 16 75 Z"
            fill="#16A34A"
          />

          {/* Left Community Figure (Teal / Blue) */}
          <circle cx="34" cy="46" r="7" fill="#0284C7" />
          <path
            d="M 23 68 C 23 58 31 56 34 56 C 37 56 45 58 45 68 Z"
            fill="#0284C7"
          />

          {/* Center Community Figure (Prominent Deep Blue / Slate) */}
          <circle cx="50" cy="40" r="8.5" fill="#0C4A6E" />
          <path
            d="M 37 66 C 37 54 46 51 50 51 C 54 51 63 54 63 66 Z"
            fill="#0C4A6E"
          />

          {/* Right Community Figure (Warm Yellow / Gold) */}
          <circle cx="66" cy="46" r="7" fill="#F59E0B" />
          <path
            d="M 55 68 C 55 58 63 56 66 56 C 69 56 77 58 77 68 Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold tracking-tight text-[#172B24] leading-tight',
              textSizes[size]
            )}
          >
            Isonga <span className="text-[#16A34A]">Connect</span>
          </span>
          {showTagline && (
            <span className="text-xs text-[#64746C] font-medium tracking-normal mt-0.5">
              Your community. Your updates.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

