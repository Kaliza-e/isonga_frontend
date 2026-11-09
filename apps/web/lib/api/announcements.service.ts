import { apiClient } from './client';
import {
  Announcement,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementStatus,
  DeliveryChannel,
  RecipientPreview,
} from '../types';

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  targetAreaId: string;
  includeSubordinates: boolean;
  channels: DeliveryChannel[];
  scheduledAt?: string | null;
}

export interface PreviewRecipientsPayload {
  targetAreaId: string;
  includeSubordinates: boolean;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  channels: DeliveryChannel[];
}

export interface QueryAnnouncementsParams {
  status?: AnnouncementStatus;
  category?: AnnouncementCategory;
  page?: number;
  limit?: number;
}

function mapBackendAnnouncement(raw: any): Announcement {
  if (!raw) return raw;

  const firstTarget = raw.targets?.[0];
  const targetAreaName = firstTarget?.area?.name || raw.targetAreaName || 'Jurisdiction';
  const targetAreaId = firstTarget?.areaId || raw.targetAreaId || '';
  const targetAreaPath = firstTarget?.area?.path || raw.targetAreaPath || '';
  const includeSubordinates = firstTarget?.includeSubordinates ?? raw.includeSubordinates ?? true;

  const authorFirstName = raw.author?.residentProfile?.firstName || '';
  const authorLastName = raw.author?.residentProfile?.lastName || '';
  const authorFullName = `${authorFirstName} ${authorLastName}`.trim();

  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    category: raw.category,
    priority: raw.priority,
    status: raw.status,
    channels: raw.channels || [],
    targetAreaId,
    targetAreaName,
    targetAreaPath,
    includeSubordinates,
    authorId: raw.authorId || raw.author?.id || '',
    authorName: authorFullName || raw.authorName || 'Local Authority',
    authorRole: raw.author?.role || raw.authorRole || 'SECTOR_ADMIN',
    scheduledAt: raw.scheduledAt || null,
    publishedAt: raw.publishedAt || null,
    cancelledAt: raw.cancelledAt || null,
    cancellationReason: raw.cancelledReason || raw.cancellationReason || null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    metrics: raw.metrics,
  };
}

export const announcementsService = {
  async getAnnouncements(params?: QueryAnnouncementsParams): Promise<{ items: Announcement[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const qs = searchParams.toString();
    const endpoint = qs ? `/announcements?${qs}` : '/announcements';
    const data = await apiClient<any>(endpoint);

    if (Array.isArray(data)) {
      return {
        items: data.map(mapBackendAnnouncement),
        total: data.length,
      };
    }
    if (data && Array.isArray(data.items)) {
      return {
        items: data.items.map(mapBackendAnnouncement),
        total: data.total ?? data.items.length,
      };
    }
    return { items: [], total: 0 };
  },

  async getFeed(villageId?: string): Promise<Announcement[]> {
    try {
      const qs = villageId ? `?villageId=${encodeURIComponent(villageId)}` : '';
      const res = await apiClient<any[]>(`/announcements/feed${qs}`);
      return Array.isArray(res) ? res.map(mapBackendAnnouncement) : [];
    } catch {
      return [];
    }
  },

  async getAnnouncement(id: string): Promise<Announcement> {
    const res = await apiClient<any>(`/announcements/${id}`);
    return mapBackendAnnouncement(res);
  },

  async createAnnouncement(payload: CreateAnnouncementPayload): Promise<Announcement> {
    const res = await apiClient<any>('/announcements', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        category: payload.category,
        priority: payload.priority,
        targetAreaIds: [payload.targetAreaId],
        includeSubordinates: payload.includeSubordinates,
        channels: payload.channels,
        scheduledAt: payload.scheduledAt || undefined,
      }),
    });
    return mapBackendAnnouncement(res);
  },

  async publishAnnouncement(id: string): Promise<Announcement> {
    const res = await apiClient<any>(`/announcements/${id}/publish`, {
      method: 'POST',
    });
    return mapBackendAnnouncement(res);
  },

  async cancelAnnouncement(id: string, reason: string): Promise<Announcement> {
    const res = await apiClient<any>(`/announcements/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return mapBackendAnnouncement(res.announcement || res);
  },

  async previewRecipients(payload: PreviewRecipientsPayload): Promise<RecipientPreview> {
    const areaId = payload.targetAreaId;
    return apiClient<RecipientPreview>('/announcements/preview', {
      method: 'POST',
      body: JSON.stringify({
        areaIds: [areaId],
        targetAreaIds: [areaId],
        includeSubordinates: payload.includeSubordinates ?? true,
        category: payload.category,
        priority: payload.priority || 'NORMAL',
        channels: payload.channels,
      }),
    });
  },
};
