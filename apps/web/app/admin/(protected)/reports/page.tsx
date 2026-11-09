'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Send,
  CheckCircle2,
  AlertCircle,
  PieChart,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { analyticsService, ChannelPerformance } from '@/lib/api/analytics.service';
import { announcementsService } from '@/lib/api/announcements.service';
import { DashboardMetrics, Announcement } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

export default function AnalyticsDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [channels, setChannels] = useState<ChannelPerformance[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const [overview, chMetrics, annData] = await Promise.all([
          analyticsService.getOverview().catch(() => null),
          analyticsService.getChannelMetrics().catch(() => []),
          announcementsService.getAnnouncements({ limit: 100 }).catch(() => ({ items: [], total: 0 })),
        ]);

        if (isMounted) {
          if (overview) setMetrics(overview);
          if (chMetrics) setChannels(chMetrics);
          if (annData) setAnnouncements(annData.items);
        }
      } catch (err) {
        console.error('Failed to load analytics data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSubmitted = metrics?.notificationsSubmitted ?? 0;
  const totalDelivered = metrics?.notificationsDelivered ?? 0;
  const totalFailed = Math.max(0, totalSubmitted - totalDelivered);
  const deliveryRate = metrics?.deliverySuccessRate ?? (totalSubmitted > 0 ? Math.round((totalDelivered / totalSubmitted) * 1000) / 10 : 0);

  // Compute category breakdown from real announcements
  const categoryCounts: Record<string, number> = {};
  announcements.forEach((ann) => {
    categoryCounts[ann.category] = (categoryCounts[ann.category] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryCounts).map(([cat, count]) => {
    const meta = CATEGORIES[cat as keyof typeof CATEGORIES];
    const percentage = announcements.length > 0 ? Math.round((count / announcements.length) * 100) : 0;
    return {
      name: meta?.label || cat,
      count,
      percentage,
      color: meta?.color || '#16A34A',
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#172B24]">
          Civic Delivery Analytics & Reports
        </h1>
        <p className="text-xs text-[#64746C] mt-0.5">
          Comprehensive performance evaluation across communication channels and territory sectors
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
          <span className="text-xs font-semibold">Calculating analytics and carrier telemetry...</span>
        </div>
      ) : (
        <>
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#64746C]">Total Submitted</span>
                  <div className="text-2xl font-bold text-[#172B24]">{totalSubmitted.toLocaleString()}</div>
                  <span className="text-[11px] text-[#087A3E]">Across all active delivery channels</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#64746C]">Confirmed Delivered</span>
                  <div className="text-2xl font-bold text-[#087A3E]">{totalDelivered.toLocaleString()}</div>
                  <span className="text-[11px] text-[#087A3E]">{deliveryRate}% overall delivery rate</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#64746C]">Undelivered / Bounced</span>
                  <div className="text-2xl font-bold text-[#E45C5C]">{totalFailed.toLocaleString()}</div>
                  <span className="text-[11px] text-[#64746C]">Awaiting carrier retry or unsubscribed</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-[#E45C5C] flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Comparison & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Rates by Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {channels.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#64746C]">
                    No channel telemetry recorded yet.
                  </div>
                ) : (
                  channels.map((ch) => {
                    const colorMap: Record<string, string> = {
                      SMS: 'bg-[#16A34A]',
                      PUSH: 'bg-[#0284C7]',
                      IN_APP: 'bg-[#9333EA]',
                      WHATSAPP: 'bg-[#25D366]',
                    };
                    const barColor = colorMap[ch.channel] || 'bg-[#16A34A]';

                    return (
                      <div key={ch.channel} className="space-y-1.5 p-3 rounded-xl bg-[#F0FBF5] border border-[#E3EEE7]">
                        <div className="flex items-center justify-between text-xs font-bold text-[#172B24]">
                          <span>{ch.channel}</span>
                          <span className="text-[#087A3E]">{ch.rate}% Success</span>
                        </div>

                        <div className="w-full bg-[#CBDCD3] rounded-full h-2 overflow-hidden">
                          <div className={`${barColor} h-2 rounded-full`} style={{ width: `${ch.rate}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64746C]">
                          <span>Submitted: {ch.submitted.toLocaleString()}</span>
                          <span>Delivered: {ch.delivered.toLocaleString()}</span>
                          <span>Failed: {ch.failed.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Announcement Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {categoryBreakdown.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#64746C]">
                    No announcements published to categorize yet.
                  </div>
                ) : (
                  categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#172B24]">{cat.name}</span>
                        <span className="text-[#64746C]">{cat.count} updates ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#E3EEE7] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
