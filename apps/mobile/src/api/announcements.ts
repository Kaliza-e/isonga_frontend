import { Announcement } from '../types';
import { mobileApiClient } from './client';
import { SEEDED_ANNOUNCEMENTS } from '../data/seededData';

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  targetAreaId: string;
  channels: string[];
}

let locallyCreatedAnnouncements: Announcement[] = [];

export async function fetchMobileFeed(villageId?: string): Promise<Announcement[]> {
  try {
    const qs = villageId ? `?villageId=${encodeURIComponent(villageId)}` : '';
    const res = await mobileApiClient<any>(`/announcements/feed${qs}`);

    let remoteItems: Announcement[] = [];
    if (Array.isArray(res) && res.length > 0) {
      remoteItems = res.map(mapToAnnouncement);
    } else if (res && Array.isArray(res.items) && res.items.length > 0) {
      remoteItems = res.items.map(mapToAnnouncement);
    }

    if (remoteItems.length > 0) {
      return [...locallyCreatedAnnouncements, ...remoteItems];
    }
    // When remote database is empty, seed with authentic Rwanda community announcements
    return [...locallyCreatedAnnouncements, ...SEEDED_ANNOUNCEMENTS];
  } catch (err) {
    console.warn('fetchMobileFeed using seeded announcements:', err);
    return [...locallyCreatedAnnouncements, ...SEEDED_ANNOUNCEMENTS];
  }
}

export async function createMobileAnnouncement(payload: CreateAnnouncementDto): Promise<Announcement> {
  const newAnn: Announcement = {
    id: `local-ann-${Date.now()}`,
    title: payload.title,
    content: payload.content,
    category: payload.category as any,
    priority: payload.priority,
    status: 'PUBLISHED',
    targetAreaName: 'Kimironko Cell, Gasabo',
    authorName: 'Esther Kaliza (Local Leader)',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    imageUrl:
      payload.category === 'UMUGANDA'
        ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80'
        : payload.category === 'HEALTH_INFORMATION'
        ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80'
        : payload.category === 'PUBLIC_SERVICES'
        ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'
        : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
  };

  // Prepend to local memory feed so publisher sees it immediately
  locallyCreatedAnnouncements = [newAnn, ...locallyCreatedAnnouncements];

  try {
    // Step 1: Create draft announcement on backend
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

    // Step 2: Publish immediately to community
    if (announcementId) {
      try {
        await mobileApiClient<any>(`/announcements/${announcementId}/publish`, {
          method: 'POST',
        });
      } catch (pubErr) {
        console.warn('Publish warning, created as draft:', pubErr);
      }
    }
    return mapToAnnouncement(created);
  } catch (err) {
    console.warn('Created announcement in local test feed:', err);
    return newAnn;
  }
}

function mapToAnnouncement(raw: any): Announcement {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    category: raw.category,
    priority: raw.priority || 'NORMAL',
    status: raw.status || 'PUBLISHED',
    targetAreaName: raw.targetAreas?.[0]?.area?.name || raw.targetAreaName || 'Local Village Scope',
    authorName:
      `${raw.author?.residentProfile?.firstName || ''} ${raw.author?.residentProfile?.lastName || ''}`.trim() ||
      raw.authorName ||
      'Authorized Local Leader',
    publishedAt: raw.publishedAt || raw.createdAt || new Date().toISOString(),
    createdAt: raw.createdAt || new Date().toISOString(),
    imageUrl:
      raw.imageUrl ||
      (raw.category === 'UMUGANDA'
        ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80'
        : raw.category === 'HEALTH_INFORMATION'
        ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80'
        : raw.category === 'PUBLIC_SERVICES'
        ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80'
        : undefined),
  };
}
