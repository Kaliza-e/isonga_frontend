export type UserRole =
  | 'SUPER_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'SECTOR_ADMIN'
  | 'CELL_ADMIN'
  | 'RESIDENT';

export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';

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

export type AnnouncementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';

export type DeliveryChannel = 'SMS' | 'PUSH' | 'IN_APP' | 'WHATSAPP';

export type NotificationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUBMITTED'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface AdministrativeArea {
  id: string;
  name: string;
  code: string;
  level: AreaLevel;
  parentId: string | null;
  path: string;
  residentCount?: number;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  primaryAreaId?: string;
  primaryAreaName?: string;
  permissions?: {
    areaId: string;
    areaName: string;
    level: AreaLevel;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  channels: DeliveryChannel[];
  targetAreaId: string;
  targetAreaName: string;
  targetAreaPath: string;
  includeSubordinates: boolean;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  scheduledAt: string | null;
  publishedAt: string | null;
  cancelledAt: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  metrics?: {
    totalEligible: number;
    submitted: number;
    delivered: number;
    failed: number;
  };
}

export interface RecipientPreview {
  totalEligible: number;
  channelBreakdown: {
    sms: number;
    push: number;
    inApp: number;
    whatsapp: number;
  };
  areaSummary: {
    areaName: string;
    level: AreaLevel;
    subordinateCount: number;
  };
}

export interface DashboardMetrics {
  totalResidents: number;
  totalAnnouncements: number;
  publishedAnnouncements: number;
  scheduledAnnouncements: number;
  notificationsSubmitted: number;
  notificationsDelivered: number;
  deliverySuccessRate: number;
  activeVillages: number;
}

