'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Megaphone, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { announcementsService } from '@/lib/api/announcements.service';
import { Announcement } from '@/lib/types';

export default function ResidentNotificationsPage() {
  const [filter, setFilter] = useState<'ALL' | 'DELIVERED' | 'FAILED'>('ALL');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        const feed = await announcementsService.getFeed();
        if (isMounted) {
          setAnnouncements(feed);
        }
      } catch (err) {
        console.warn('Could not load resident notifications', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const notifications = announcements.map((ann) => ({
    id: ann.id,
    announcementId: ann.id,
    title: ann.title,
    time: formatDate(ann.publishedAt || ann.createdAt),
    status: 'DELIVERED',
    dotColor: 'bg-[#16A34A]',
  }));

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.status === filter;
  });

  return (
    <div className="px-5 py-3 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <h1 className="text-base font-bold text-[#172B24]">Notifications</h1>
        </div>

        <div className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] relative shadow-sm">
          <Bell className="w-4 h-4" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white" />
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'DELIVERED', 'FAILED'] as const).map((tab) => {
          const isActive = filter === tab;
          const labels = {
            ALL: 'All',
            DELIVERED: 'Delivered',
            FAILED: 'Failed',
          };

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#16A34A] text-white shadow-sm shadow-green-600/20'
                  : 'bg-white text-[#64746C] border border-[#E3EEE7] hover:border-[#CBDCD3]'
              )}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
          <span className="text-xs font-semibold">Checking community updates...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center text-[#64746C]">
          <Bell className="w-8 h-8 text-[#94A39B] mx-auto mb-2" />
          <div className="font-semibold text-sm text-[#172B24]">No notifications yet</div>
          <p className="text-xs text-[#64746C] mt-1">
            New community announcements and urgent alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {filtered.map((item) => {
            const isDelivered = item.status === 'DELIVERED';
            return (
              <Link
                key={item.id}
                href={`/resident/announcements/${item.announcementId}`}
                className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`} />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#172B24] truncate">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-[#64746C] block mt-0.5">{item.time}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-md inline-block',
                      isDelivered
                        ? 'bg-[#DDF7E8] text-[#087A3E]'
                        : 'bg-[#FEE2E2] text-[#B91C1C]'
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
