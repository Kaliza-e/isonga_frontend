import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRwandanPhone(phone: string): string {
  if (!phone) return '';
  // Normalize +250 788 123 456
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('250') && clean.length === 12) {
    return `+250 ${clean.substring(3, 6)} ${clean.substring(6, 9)} ${clean.substring(9)}`;
  }
  return phone;
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  if (phone.length >= 10) {
    return `${phone.slice(0, 7)}***${phone.slice(-3)}`;
  }
  return phone;
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-RW', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

