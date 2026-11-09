import {
  AnnouncementCategory,
  AnnouncementPriority,
  AdministrativeArea,
  Announcement,
  DashboardMetrics,
} from './types';

export const CATEGORIES: Record<
  AnnouncementCategory,
  { label: string; kinyarwanda: string; color: string; badgeBg: string; badgeText: string }
> = {
  COMMUNITY_MEETINGS: {
    label: 'Community Meetings',
    kinyarwanda: 'Inama z\'Abaturage',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
  },
  UMUGANDA: {
    label: 'Umuganda',
    kinyarwanda: 'Umuganda Rusange',
    color: '#16a34a',
    badgeBg: '#ddf7e8',
    badgeText: '#087a3e',
  },
  PUBLIC_SERVICES: {
    label: 'Public Services',
    kinyarwanda: 'Imirimo Rusange',
    color: '#9333ea',
    badgeBg: '#f3e8ff',
    badgeText: '#7e22ce',
  },
  HEALTH_INFORMATION: {
    label: 'Health Information',
    kinyarwanda: 'Ubuzima',
    color: '#059669',
    badgeBg: '#d1fae5',
    badgeText: '#047857',
  },
  EDUCATION: {
    label: 'Education',
    kinyarwanda: 'Uburezi',
    color: '#d97706',
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
  },
  ADMINISTRATIVE_NOTICES: {
    label: 'Administrative Notices',
    kinyarwanda: 'Amatangazo y\'Ubuyobozi',
    color: '#475569',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
  },
  COMMUNITY_EVENTS: {
    label: 'Community Events',
    kinyarwanda: 'Ibirori n\'Imikino',
    color: '#ea580c',
    badgeBg: '#ffedd5',
    badgeText: '#c2410c',
  },
  EMERGENCY_PUBLIC_INFORMATION: {
    label: 'Emergency Public Info',
    kinyarwanda: 'Ubutumwa bw\'Ubuzima n\'Umutekano',
    color: '#dc2626',
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
  },
};

export const PRIORITIES: Record<
  AnnouncementPriority,
  { label: string; color: string; bg: string; text: string }
> = {
  NORMAL: {
    label: 'Normal',
    color: '#64746c',
    bg: '#f1f5f9',
    text: '#475569',
  },
  HIGH: {
    label: 'High Priority',
    color: '#f59e0b',
    bg: '#fef3c7',
    text: '#b45309',
  },
  EMERGENCY: {
    label: 'Emergency / Urgente',
    color: '#e11d48',
    bg: '#ffe4e6',
    text: '#9f1239',
  },
};

// NOTE: All live mock datasets have been completely removed.
// Real records are fetched directly from PostgreSQL through NestJS backend APIs.
export const RWANDA_AREAS: AdministrativeArea[] = [];
export const DEMO_METRICS: DashboardMetrics = {
  totalResidents: 0,
  totalAnnouncements: 0,
  publishedAnnouncements: 0,
  scheduledAnnouncements: 0,
  notificationsSubmitted: 0,
  notificationsDelivered: 0,
  deliverySuccessRate: 0,
  activeVillages: 0,
};
export const DEMO_ANNOUNCEMENTS: Announcement[] = [];
