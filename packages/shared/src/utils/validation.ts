/**
 * Isonga Connect Shared Validation Utilities
 */

import { RWANDA_PHONE_REGEX } from '../constants';

export function isValidRwandaPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s-]/g, '');
  return RWANDA_PHONE_REGEX.test(clean);
}

export function formatRwandaPhone(raw: string): string {
  const clean = raw.replace(/[\s-]/g, '');
  if (clean.startsWith('07')) {
    return `+250${clean.substring(1)}`;
  }
  if (clean.startsWith('250')) {
    return `+${clean}`;
  }
  if (clean.startsWith('+250')) {
    return clean;
  }
  return clean;
}

export function maskRwandaPhone(phone: string): string {
  if (!phone) return '';
  const clean = formatRwandaPhone(phone);
  if (clean.length >= 13) {
    // e.g. +250788999888 -> +250 788 ••• 888
    return `${clean.substring(0, 7)}•••${clean.substring(10)}`;
  }
  return phone;
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters
  return typeof password === 'string' && password.length >= 8;
}

