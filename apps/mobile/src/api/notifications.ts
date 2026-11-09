import { mobileApiClient } from './client';
import { NotificationItem } from '../types';

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Umuganda this Saturday',
    content: 'Community cleanliness in Kimironko starts at 8:00 AM.',
    timeAgo: '2h ago',
    channel: 'SMS',
    status: 'DELIVERED',
  },
  {
    id: 'notif-2',
    title: 'Prevent Malaria',
    content: 'Treated bed net distribution in progress across all villages.',
    timeAgo: '1d ago',
    channel: 'PUSH',
    status: 'DELIVERED',
  },
  {
    id: 'notif-3',
    title: 'Roadworks on Avenue de la Paix',
    content: 'Traffic detour via KG 11 Ave due to paving.',
    timeAgo: '2d ago',
    channel: 'SMS',
    status: 'FAILED',
  },
  {
    id: 'notif-4',
    title: 'School Registration Now Open',
    content: 'Register children at local sector education office.',
    timeAgo: '3d ago',
    channel: 'PUSH',
    status: 'DELIVERED',
  },
];

export const notificationsApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await mobileApiClient<any>('/notifications');
      if (Array.isArray(res) && res.length > 0) {
        return res.map((item: any) => ({
          id: item.id,
          title: item.title || item.announcement?.title || 'Civic Announcement',
          content: item.content || item.announcement?.content || '',
          timeAgo: 'Just now',
          channel: item.channel || 'SMS',
          status: item.status || 'DELIVERED',
        }));
      }
      return FALLBACK_NOTIFICATIONS;
    } catch {
      return FALLBACK_NOTIFICATIONS;
    }
  },
};

