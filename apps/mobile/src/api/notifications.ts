import { mobileApiClient } from './client';
import { NotificationItem } from '../types';

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [];

export const notificationsApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await mobileApiClient<any>('/notifications');
      if (Array.isArray(res) && res.length > 0) {
        return res.map((item: any) => ({
          id: item.id,
          title: item.title || item.announcement?.title || 'Civic Announcement',
          content: item.content || item.announcement?.content || '',
          timeAgo: item.deliveredAt || item.submittedAt || item.createdAt ? 'Recently' : 'Just now',
          channel: item.channel || 'SMS',
          status: item.status || 'DELIVERED',
        }));
      }
      return [];
    } catch {
      return [];
    }
  },
};

