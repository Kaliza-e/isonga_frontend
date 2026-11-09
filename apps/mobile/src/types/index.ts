export type AreaLevel =
  | 'COUNTRY'
  | 'PROVINCE'
  | 'DISTRICT'
  | 'SECTOR'
  | 'CELL'
  | 'VILLAGE';

export type AnnouncementCategory =
  | 'COMMUNITY_MEETINGS'
  | 'UMUGANDA'
  | 'PUBLIC_SERVICES'
  | 'HEALTH_INFORMATION'
  | 'EDUCATION'
  | 'ADMINISTRATIVE_NOTICES'
  | 'COMMUNITY_EVENTS'
  | 'EMERGENCY_PUBLIC_INFORMATION';

export type AnnouncementPriority = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export interface AdministrativeArea {
  id: string;
  name: string;
  code: string;
  level: AreaLevel;
  parentId: string | null;
  path: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';
  targetAreaId?: string;
  targetAreaName?: string;
  authorName?: string;
  publishedAt?: string;
  createdAt: string;
  imageUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content?: string;
  timeAgo: string;
  channel: 'SMS' | 'PUSH' | 'IN_APP';
  status: 'DELIVERED' | 'FAILED' | 'SUBMITTED' | 'PENDING';
  announcementId?: string;
  category?: AnnouncementCategory;
}

export interface ResidentUser {
  id: string;
  name: string;
  phone: string;
  role: 'RESIDENT';
  primaryAreaId?: string;
  primaryAreaName?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  avatarUrl?: string;
  language: 'rw' | 'en';
  consentLaw058: boolean;
}

