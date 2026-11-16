import { Announcement } from '../types';
import { mobileApiClient } from './client';

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  targetAreaId: string;
  channels: string[];
}

export async function fetchMobileFeed(villageId?: string): Promise<Announcement[]> {
  const qs = villageId ? `?villageId=${encodeURIComponent(villageId)}` : '';
  const res = await mobileApiClient<any>(`/announcements/feed${qs}`);

  if (Array.isArray(res)) {
    return res.map(mapToAnnouncement);
  } else if (res && Array.isArray(res.items)) {
    return res.items.map(mapToAnnouncement);
  }
  return [];
}

export async function createMobileAnnouncement(payload: CreateAnnouncementDto): Promise<Announcement> {
  // Step 1: Create announcement on backend
  const created = await mobileApiClient<any>('/announcements', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      content: payload.content,
      category: payload.category,
      priority: payload.priority,
      targetAreaIds: [payload.targetAreaId],
      channels: payload.channels,
    }),
  });

  const announcementId = created.id || created.data?.id;

  // Step 2: Publish announcement
  if (announcementId) {
    await mobileApiClient<any>(`/announcements/${announcementId}/publish`, {
      method: 'POST',
    });
  }

  return mapToAnnouncement(created.data || created);
}

function mapToAnnouncement(raw: any): Announcement {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    category: raw.category,
    priority: raw.priority || 'NORMAL',
    status: raw.status || 'PUBLISHED',
    targetAreaName: raw.targetAreas?.[0]?.area?.name || raw.targets?.[0]?.area?.name || raw.targetAreaName || 'Local Village Scope',
    authorName:
      `${raw.author?.residentProfile?.firstName || ''} ${raw.author?.residentProfile?.lastName || ''}`.trim() ||
      raw.authorName ||
      'Authorized Local Leader',
    publishedAt: raw.publishedAt || raw.createdAt || new Date().toISOString(),
    createdAt: raw.createdAt || new Date().toISOString(),
    imageUrl:
      raw.imageUrl ||
      (raw.category === 'UMUGANDA'
        ? 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80'
        : raw.category === 'HEALTH_INFORMATION'
        ? 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80'
        : raw.category === 'PUBLIC_SERVICES'
        ? 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80'
        : undefined),
  };
}
