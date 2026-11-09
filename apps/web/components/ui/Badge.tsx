import React from 'react';
import { cn } from '@/lib/utils';
import { CATEGORIES, PRIORITIES } from '@/lib/constants';
import { AnnouncementCategory, AnnouncementPriority, AnnouncementStatus } from '@/lib/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#ddf7e8] text-[#087a3e]',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-rose-100 text-rose-800',
    neutral: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: AnnouncementCategory }) {
  const conf = CATEGORIES[category] || {
    label: category,
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: conf.badgeBg, color: conf.badgeText }}
    >
      {conf.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  const conf = PRIORITIES[priority] || PRIORITIES.NORMAL;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: conf.bg, color: conf.text }}
    >
      {conf.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: AnnouncementStatus }) {
  const styles: Record<AnnouncementStatus, { bg: string; text: string; label: string; dot: string }> = {
    DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft', dot: 'bg-slate-400' },
    SCHEDULED: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'Scheduled', dot: 'bg-amber-500' },
    PUBLISHED: { bg: 'bg-emerald-50', text: 'text-emerald-800', label: 'Published', dot: 'bg-emerald-600' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-800', label: 'Cancelled', dot: 'bg-rose-500' },
  };

  const style = styles[status] || styles.DRAFT;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', style.bg, style.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
      {style.label}
    </span>
  );
}

