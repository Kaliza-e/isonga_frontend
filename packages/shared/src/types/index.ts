/**
 * Isonga Connect Shared Types & API Contracts
 */

// User and Auth Roles
export type UserRole =
  | 'SUPER_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'SECTOR_ADMIN'
  | 'CELL_ADMIN'
  | 'RESIDENT';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DEACTIVATED';

export type LanguageCode = 'rw' | 'en' | 'fr';

// Administrative Area Levels in Rwanda
export type AreaLevel = 'COUNTRY' | 'PROVINCE' | 'DISTRICT' | 'SECTOR' | 'CELL' | 'VILLAGE';

export interface AdministrativeArea {
  id: string;
  code: string;
  name: string;
  level: AreaLevel;
  parentId?: string | null;
  path: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  parent?: AdministrativeArea | null;
  children?: AdministrativeArea[];
}

export interface ResidentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredLanguage: LanguageCode;
  areaId: string;
  consentGiven: boolean;
  consentTimestamp?: string;
  consentVersion?: string;
  area?: AdministrativeArea;
}

export interface AdministratorPermission {
  id: string;
  userId: string;
  areaId: string;
  canPublish: boolean;
  canSchedule: boolean;
  canBroadcastEmergency: boolean;
  area?: AdministrativeArea;
}

export interface User {
  id: string;
  phone: string;
  phoneVerified: boolean;
  email?: string | null;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  residentProfile?: ResidentProfile | null;
  adminPermissions?: AdministratorPermission[];
}

// Announcements
export type AnnouncementCategory =
  | 'UMUGANDA'
  | 'COMMUNITY_MEETINGS'
  | 'HEALTH_INFORMATION'
  | 'PUBLIC_SERVICES'
  | 'ADMINISTRATIVE_NOTICES'
  | 'EMERGENCY_PUBLIC_INFORMATION'
  | 'EDUCATION'
  | 'AGRICULTURE_ENVIRONMENT';

export type AnnouncementPriority = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export type AnnouncementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';

export interface AnnouncementTarget {
  id: string;
  announcementId: string;
  areaId: string;
  includeSubordinates: boolean;
  area?: AdministrativeArea;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  authorId?: string;
  author?: {
    id: string;
    role: UserRole;
    residentProfile?: {
      firstName: string;
      lastName: string;
    } | null;
  };
  scheduledAt?: string | null;
  publishedAt?: string | null;
  cancelledAt?: string | null;
  cancelledReason?: string | null;
  recipientCount?: number;
  channels?: string[];
  targets?: AnnouncementTarget[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

// Notifications
export type NotificationChannel = 'SMS' | 'PUSH' | 'IN_APP' | 'WHATSAPP';

export type NotificationDeliveryStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'DELIVERED'
  | 'FAILED'
  | 'OPTED_OUT';

export interface NotificationLog {
  id: string;
  announcementId: string;
  userId?: string | null;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  recipient: string;
  providerRef?: string | null;
  providerResponse?: string | null;
  errorMessage?: string | null;
  retryCount: number;
  submittedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  announcement?: {
    id: string;
    title: string;
    category: AnnouncementCategory;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  timeAgo: string;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  createdAt?: string;
}

// Auth Request & Response DTOs
export interface LoginRequest {
  identifier: string; // phone (+250...) or email
  phone?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType?: string;
  user: User;
}

export interface RegisterResidentRequest {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  areaId: string;
  email?: string;
  preferredLanguage?: LanguageCode;
  consentGiven: boolean;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority?: AnnouncementPriority;
  targetAreaIds: string[];
  channels?: string[];
  includeSubordinates?: boolean;
  scheduledAt?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

