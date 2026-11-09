/**
 * Isonga Connect Shared Constants & Configurations
 */

import { AnnouncementCategory, AnnouncementPriority, NotificationChannel } from '../types';

// Rwandan E.164 phone regex (MTN Rwanda: 078/079, Airtel Rwanda: 072/073)
export const RWANDA_PHONE_REGEX = /^\+250(78|79|72|73)\d{7}$/;

export const RWANDA_COUNTRY_CODE = '+250';

export const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  UMUGANDA: 'Umuganda Community Work',
  COMMUNITY_MEETINGS: 'Village Assembly (Inama)',
  HEALTH_INFORMATION: 'Public Health & Clinics',
  PUBLIC_SERVICES: 'Public Services & Infrastructure',
  ADMINISTRATIVE_NOTICES: 'Administrative & Security Notice',
  EMERGENCY_PUBLIC_INFORMATION: 'Emergency Public Notice',
  EDUCATION: 'Education & Schools',
  AGRICULTURE_ENVIRONMENT: 'Agriculture & Environment',
};

export const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  NORMAL: 'Standard Community Notice',
  HIGH: 'High Priority Alert',
  EMERGENCY: 'National / Municipal Emergency',
};

export const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  SMS: 'SMS Direct Dispatch',
  PUSH: 'Mobile Push Notification',
  IN_APP: 'Resident In-App Feed',
  WHATSAPP: 'WhatsApp Community Broadcast',
};

export const DEFAULT_PAGE_LIMIT = 20;

export const LAW_058_VERSION = 'v1.0';

