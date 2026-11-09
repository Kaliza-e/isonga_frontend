import { apiClient } from './client';

export interface NotificationLogItem {
  id: string;
  announcementTitle: string;
  recipientMasked: string;
  channel: string;
  provider: string;
  status: string;
  cost?: string;
  timestamp: string;
  failureReason?: string;
}

function mapNotificationLog(raw: any): NotificationLogItem {
  return {
    id: raw.id,
    announcementTitle: raw.announcement?.title || raw.announcementTitle || 'Announcement Broadcast',
    recipientMasked: raw.recipientMasked || raw.recipient || '+250788***',
    channel: raw.channel || 'SMS',
    provider: raw.providerRef?.startsWith('FCM') ? 'FCM_GOOGLE' : 'MTN_RW',
    status: raw.status || 'SUBMITTED',
    cost: raw.channel === 'SMS' ? '15 RWF' : '0 RWF',
    timestamp: raw.deliveredAt || raw.createdAt || new Date().toISOString(),
    failureReason: raw.errorMessage,
  };
}

export const notificationsService = {
  async getLogs(announcementId?: string): Promise<NotificationLogItem[]> {
    const endpoint = announcementId
      ? `/notifications/announcements/${announcementId}`
      : '/notifications';

    const res = await apiClient<any>(endpoint);
    if (Array.isArray(res)) {
      return res.map(mapNotificationLog);
    }
    if (res && Array.isArray(res.data)) {
      return res.data.map(mapNotificationLog);
    }
    return [];
  },
};
