import { apiClient } from './client';
import { DashboardMetrics } from '../types';

export interface ChannelPerformance {
  channel: string;
  submitted: number;
  delivered: number;
  failed: number;
  rate: number;
}

export const analyticsService = {
  async getOverview(): Promise<DashboardMetrics> {
    const raw = await apiClient<any>('/analytics/overview');
    const channelPerf = await apiClient<any[]>('/analytics/channels').catch(() => []);

    const totalSubmitted = channelPerf.reduce((acc, c) => acc + (c.total ?? c.submitted ?? 0), 0);
    const totalDelivered = channelPerf.reduce((acc, c) => acc + (c.confirmedDelivered ?? c.delivered ?? 0), 0);
    const overallRate = totalSubmitted > 0 ? Math.round((totalDelivered / totalSubmitted) * 1000) / 10 : 0;

    return {
      totalResidents: raw?.residents?.totalRegistered ?? 0,
      totalAnnouncements: raw?.announcements?.total ?? 0,
      publishedAnnouncements: raw?.announcements?.published ?? 0,
      scheduledAnnouncements: raw?.announcements?.scheduled ?? 0,
      notificationsSubmitted: totalSubmitted || raw?.notifications?.totalDispatched || 0,
      notificationsDelivered: totalDelivered,
      deliverySuccessRate: overallRate,
      activeVillages: raw?.residents?.activeAndVerified ?? 0,
    };
  },

  async getChannelMetrics(): Promise<ChannelPerformance[]> {
    const raw = await apiClient<any[]>('/analytics/channels');
    if (!Array.isArray(raw)) return [];

    return raw.map((c) => ({
      channel: c.channel,
      submitted: c.total ?? c.submitted ?? 0,
      delivered: c.confirmedDelivered ?? c.delivered ?? 0,
      failed: c.failed ?? 0,
      rate: c.deliveryRatePercentage ?? 0,
    }));
  },
};
