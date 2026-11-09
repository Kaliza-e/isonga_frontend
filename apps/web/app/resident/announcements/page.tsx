'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Search,
  Loader2,
  Megaphone,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { announcementsService } from '@/lib/api/announcements.service';
import { Announcement } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

export default function ResidentAnnouncementsFeedPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      try {
        const feed = await announcementsService.getFeed();
        if (isMounted) {
          setAnnouncements(feed);
        }
      } catch (err) {
        console.error('Failed to load announcements feed', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterTabs = [
    { id: 'ALL', label: 'All' },
    { id: 'UMUGANDA', label: 'Umuganda' },
    { id: 'HEALTH_INFORMATION', label: 'Health' },
    { id: 'COMMUNITY_MEETINGS', label: 'Meetings' },
    { id: 'PUBLIC_SERVICES', label: 'Services' },
    { id: 'EMERGENCY_PUBLIC_INFORMATION', label: 'Urgent' },
  ];

  const filtered = announcements.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-5 py-3 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] hover:bg-[#F0FBF5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold text-[#172B24]">Announcements</h1>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] hover:bg-[#F0FBF5] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64746C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search announcements..."
          className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-4 py-2.5 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150',
                isActive
                  ? 'bg-[#16A34A] text-white shadow-sm shadow-green-600/20'
                  : 'bg-white text-[#64746C] border border-[#E3EEE7] hover:border-[#CBDCD3]'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      {isLoading ? (
        <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
          <span className="text-xs font-semibold">Loading announcements feed...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center text-[#64746C]">
          <Megaphone className="w-8 h-8 text-[#94A39B] mx-auto mb-2" />
          <div className="font-semibold text-sm text-[#172B24]">No announcements found</div>
          <p className="text-xs text-[#64746C] mt-1">
            There are no updates published in this category for your area right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {filtered.map((item) => {
            const catMeta = CATEGORIES[item.category as keyof typeof CATEGORIES];
            return (
              <Link
                key={item.id}
                href={`/resident/announcements/${item.id}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E3EEE7] shadow-sm hover:border-[#CBDCD3] transition-all duration-150 active:scale-[0.99]"
              >
                {/* Visual Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 overflow-hidden shrink-0 relative flex items-center justify-center text-white">
                  <span className="text-2xl drop-shadow">🇷🇼</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: catMeta?.badgeBg || '#DDF7E8',
                      color: catMeta?.badgeText || '#087A3E',
                    }}
                  >
                    {catMeta?.label || item.category}
                  </span>

                  <h3 className="text-xs font-bold text-[#172B24] truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-[#64746C]">
                    <Calendar className="w-3 h-3 text-[#94A39B]" />
                    <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#64746C]">
                    <MapPin className="w-3 h-3 text-[#94A39B]" />
                    <span>{item.targetAreaName || 'Local Community'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
