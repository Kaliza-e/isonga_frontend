'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Megaphone,
  Send,
  CheckCircle2,
  Calendar,
  MapPin,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CategoryBadge, StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { analyticsService, ChannelPerformance } from '@/lib/api/analytics.service';
import { announcementsService } from '@/lib/api/announcements.service';
import { Announcement, DashboardMetrics } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [channels, setChannels] = useState<ChannelPerformance[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        const [overviewData, channelData, annData] = await Promise.all([
          analyticsService.getOverview().catch(() => null),
          analyticsService.getChannelMetrics().catch(() => []),
          announcementsService.getAnnouncements({ limit: 5 }).catch(() => ({ items: [], total: 0 })),
        ]);

        if (isMounted) {
          if (overviewData) setMetrics(overviewData);
          if (channelData) setChannels(channelData);
          if (annData) setRecentAnnouncements(annData.items);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics from backend API', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const adminName = user?.name || 'Administrator';
  const adminScope = user?.primaryAreaName || 'National Administration';

  const summaryCards = [
    {
      title: 'Targeted Residents',
      value: (metrics?.totalResidents ?? 0).toLocaleString(),
      change: `${metrics?.activeVillages ?? 0} active & verified`,
      trend: 'up',
      icon: Users,
      color: 'text-[#16A34A]',
      bg: 'bg-[#DDF7E8]',
    },
    {
      title: 'Published Updates',
      value: metrics?.publishedAnnouncements ?? 0,
      change: `${metrics?.scheduledAnnouncements ?? 0} scheduled upcoming`,
      trend: 'neutral',
      icon: Megaphone,
      color: 'text-[#0284C7]',
      bg: 'bg-[#E0F2FE]',
    },
    {
      title: 'Dispatched Messages',
      value: (metrics?.notificationsSubmitted ?? 0).toLocaleString(),
      change: 'Across all active channels',
      trend: 'neutral',
      icon: Send,
      color: 'text-[#9333EA]',
      bg: 'bg-[#F3E8FF]',
    },
    {
      title: 'Confirmed Deliveries',
      value: `${metrics?.deliverySuccessRate ?? 0}%`,
      change: `${(metrics?.notificationsDelivered ?? 0).toLocaleString()} carrier confirmed`,
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-[#087A3E]',
      bg: 'bg-[#D1FAE5]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E3EEE7] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#172B24]">
              Mwaramutse, {adminName}
            </span>
            <span className="text-xl">🇷🇼</span>
          </div>
          <p className="text-xs text-[#64746C]">
            Local Administration Console • <span className="font-semibold text-[#087A3E]">{adminScope}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/announcements/new">
            <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Publish Announcement
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} hoverable>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#64746C]">
                    {card.title}
                  </span>
                  <div className="text-2xl font-bold text-[#172B24] tracking-tight">
                    {card.value}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#087A3E] font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>{card.change}</span>
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Channel Performance & Geographical Scope Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Channel Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Performance by Channel</CardTitle>
            <span className="text-xs text-[#64746C] font-medium">Live Telemetry</span>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.length === 0 ? (
              <div className="p-6 text-center text-[#64746C] text-xs">
                No notification delivery events recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {channels.map((ch) => {
                  const colorMap: Record<string, string> = {
                    SMS: 'bg-[#16A34A]',
                    PUSH: 'bg-[#0284C7]',
                    IN_APP: 'bg-[#9333EA]',
                    WHATSAPP: 'bg-[#25D366]',
                  };
                  const barColor = colorMap[ch.channel] || 'bg-[#16A34A]';

                  return (
                    <div key={ch.channel} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-2 text-[#172B24]">
                          <span className={`w-2.5 h-2.5 rounded-full ${barColor}`} />
                          <span>{ch.channel} Channel</span>
                        </span>
                        <span className="font-bold text-[#172B24]">
                          {ch.submitted.toLocaleString()} messages ({ch.rate}% delivered)
                        </span>
                      </div>
                      <div className="w-full bg-[#E3EEE7] rounded-full h-2.5 overflow-hidden">
                        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${ch.rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-[#E3EEE7] flex items-center justify-between text-xs text-[#64746C]">
              <span>Real-time DLR carrier receipt webhook integration active</span>
              <Link href="/admin/reports" className="font-semibold text-[#16A34A] hover:underline">
                View Detailed Analytics &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Territory Authority Scope Card */}
        <Card>
          <CardHeader>
            <CardTitle>Geographical Jurisdiction</CardTitle>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#F0FBF5] border border-[#DDF7E8] space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16A34A]" />
                <span className="text-xs font-bold text-[#087A3E]">
                  Authorized Scope: {adminScope}
                </span>
              </div>
              <p className="text-xs text-[#64746C] leading-relaxed">
                Your administrative credentials permit authoring, scheduling, and targeting announcements across your assigned territory and subordinate jurisdictions.
              </p>
            </div>

            <Link href="/admin/locations" className="block">
              <Button variant="outline" size="sm" className="w-full">
                Explore Rwanda Hierarchy
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements Table */}
      <Card>
        <CardHeader>
          <div className="space-y-0.5">
            <CardTitle>Recent Community Announcements</CardTitle>
            <span className="text-xs text-[#64746C]">
              Announcements published or drafted in your administrative scope
            </span>
          </div>
          <Link href="/admin/announcements">
            <Button variant="outline" size="sm">
              View All Announcements
            </Button>
          </Link>
        </CardHeader>

        {isLoading ? (
          <div className="p-12 text-center text-[#64746C] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
            <span className="text-xs font-semibold">Loading announcements from backend...</span>
          </div>
        ) : recentAnnouncements.length === 0 ? (
          <div className="p-12 text-center text-[#64746C]">
            <Megaphone className="w-8 h-8 text-[#94A39B] mx-auto mb-2" />
            <div className="font-semibold text-sm text-[#172B24]">No announcements created yet</div>
            <p className="text-xs text-[#64746C] mt-1">Publish an announcement to communicate with residents in your jurisdiction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0FBF5] border-b border-[#E3EEE7] text-[#64746C] font-semibold">
                <tr>
                  <th className="px-5 py-3">Announcement</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Target Scope</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EEE7] text-[#172B24]">
                {recentAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#F0FBF5]/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium max-w-xs truncate">
                      <div className="font-bold text-[#172B24] truncate">{ann.title}</div>
                      <div className="text-[11px] text-[#64746C] truncate mt-0.5">{ann.content}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <CategoryBadge category={ann.category} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-[#172B24]">{ann.targetAreaName || 'Jurisdiction'}</span>
                      <span className="text-[10px] text-[#64746C] block">
                        {ann.includeSubordinates ? '+ Subordinates' : 'Direct Area'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={ann.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <PriorityBadge priority={ann.priority} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#64746C]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(ann.publishedAt || ann.scheduledAt || ann.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/announcements`}
                        className="text-xs font-semibold text-[#16A34A] hover:underline"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

