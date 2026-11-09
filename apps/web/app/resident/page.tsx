'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Bell,
  ChevronDown,
  Megaphone,
  ArrowRight,
  Calendar,
  Loader2,
} from 'lucide-react';
import { announcementsService } from '@/lib/api/announcements.service';
import { residentsService, ResidentProfileResponse } from '@/lib/api/residents.service';
import { Announcement } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

export default function ResidentHomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [profile, setProfile] = useState<ResidentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadResidentData() {
      try {
        const [prof, feed] = await Promise.all([
          residentsService.getProfile().catch(() => null),
          announcementsService.getFeed().catch(() => []),
        ]);
        if (isMounted) {
          if (prof) setProfile(prof);
          if (feed) setAnnouncements(feed);
        }
      } catch (err) {
        console.error('Error loading resident feed', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadResidentData();
    return () => {
      isMounted = false;
    };
  }, []);

  const featured = announcements[0];
  const latestList = announcements.slice(1, 5);
  const residentName = profile?.name || 'Resident';
  const residentArea = profile?.areaName || 'Select Location';

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'RC';

  return (
    <div className="px-5 py-3 space-y-5">
      {/* Top Bar: Location Selector & Profile Avatar */}
      <div className="flex items-center justify-between">
        <Link
          href="/resident/location"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-[#DDF7E8] flex items-center justify-center text-[#16A34A]">
            <MapPin className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-[#172B24] max-w-[120px] truncate">
            {residentArea}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#64746C]" />
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/resident/notifications"
            className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] relative shadow-sm hover:bg-[#F0FBF5]"
          >
            <Bell className="w-4 h-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white" />
            )}
          </Link>
          <Link
            href="/resident/profile"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#16A34A] shadow-sm"
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#16A34A] to-[#0284C7] flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
          </Link>
        </div>
      </div>

      {/* Warm Civic Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#172B24] tracking-tight">
          Hello, {residentName} 👋
        </h1>
        <p className="text-xs text-[#64746C] mt-0.5">Stay informed, stay connected.</p>
      </div>

      {/* Hero Featured Announcement Banner */}
      {isLoading ? (
        <div className="p-8 rounded-2xl bg-white border border-[#E3EEE7] flex items-center justify-center gap-2 text-[#64746C]">
          <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
          <span className="text-xs">Loading latest updates...</span>
        </div>
      ) : featured ? (
        <Link
          href={`/resident/announcements/${featured.id}`}
          className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#109240] to-[#087A3E] p-4 text-white shadow-lg shadow-green-700/20 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/25">
                <Megaphone className="w-5 h-5 text-white" />
              </div>

              <div className="space-y-0.5 min-w-0">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-emerald-100 bg-white/15 px-2 py-0.5 rounded-full">
                  New Announcement
                </span>
                <h3 className="text-sm font-bold text-white leading-tight truncate">
                  {featured.title}
                </h3>
                <p className="text-[11px] text-emerald-100/90 truncate">
                  {formatDate(featured.publishedAt || featured.createdAt)}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </Link>
      ) : (
        <div className="p-5 rounded-2xl bg-[#F0FBF5] border border-[#DDF7E8] text-center space-y-1">
          <p className="text-xs font-bold text-[#087A3E]">No active announcements right now</p>
          <p className="text-[11px] text-[#64746C]">Check back soon for upcoming community meetings, Umuganda, and local notices.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          <Link
            href="/resident/announcements"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-[#172B24] leading-tight">
              View Announcements
            </span>
          </Link>

          <Link
            href="/resident/location"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-[#172B24] leading-tight">
              Update Location
            </span>
          </Link>

          <Link
            href="/resident/notifications"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-[#172B24] leading-tight">
              Manage Notifications
            </span>
          </Link>
        </div>
      </div>

      {/* Latest Announcements Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64746C]">
            Latest Announcements
          </h2>
          <Link
            href="/resident/announcements"
            className="text-xs font-semibold text-[#16A34A] hover:text-[#087A3E] flex items-center gap-0.5"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {latestList.length === 0 ? (
          <div className="p-4 rounded-xl bg-white border border-[#E3EEE7] text-center text-xs text-[#64746C]">
            No further announcements to display.
          </div>
        ) : (
          <div className="space-y-3">
            {latestList.map((ann) => {
              const catMeta = CATEGORIES[ann.category as keyof typeof CATEGORIES];
              return (
                <Link
                  key={ann.id}
                  href={`/resident/announcements/${ann.id}`}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-colors"
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 overflow-hidden shrink-0 relative flex items-center justify-center text-white">
                    <span className="text-2xl font-bold">🇷🇼</span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: catMeta?.badgeBg || '#DDF7E8',
                        color: catMeta?.badgeText || '#087A3E',
                      }}
                    >
                      {catMeta?.label || ann.category}
                    </span>
                    <h3 className="text-xs font-bold text-[#172B24] truncate">
                      {ann.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#64746C]">
                      <Calendar className="w-3 h-3 text-[#94A39B]" />
                      <span>{formatDate(ann.publishedAt || ann.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#64746C]">
                      <MapPin className="w-3 h-3 text-[#94A39B]" />
                      <span>{ann.targetAreaName || 'Local Sector'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
