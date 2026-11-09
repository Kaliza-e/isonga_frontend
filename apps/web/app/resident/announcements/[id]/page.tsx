'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Calendar,
  MapPin,
  Building2,
  Info,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { announcementsService } from '@/lib/api/announcements.service';
import { Announcement } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

function AnnouncementDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAnnouncement() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await announcementsService.getAnnouncement(id);
        if (isMounted) {
          setAnnouncement(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Announcement could not be loaded.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAnnouncement();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    if (!announcement) return;
    if (navigator.share) {
      navigator.share({
        title: `${announcement.title} — Isonga Connect`,
        text: announcement.content,
        url: window.location.href,
      }).catch(() => null);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] bg-white flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#16A34A] mb-2" />
        <span className="text-xs font-semibold text-[#64746C]">Loading verified community update...</span>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-[500px] bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-[#E45C5C]" />
        <h2 className="text-sm font-bold text-[#172B24]">Announcement Not Found</h2>
        <p className="text-xs text-[#64746C] max-w-xs">{error || 'This announcement may have been removed or cancelled.'}</p>
        <button
          onClick={() => router.push('/resident/announcements')}
          className="px-4 py-2 bg-[#16A34A] text-white rounded-xl text-xs font-semibold hover:bg-[#087A3E]"
        >
          Back to Announcements
        </button>
      </div>
    );
  }

  const catMeta = CATEGORIES[announcement.category as keyof typeof CATEGORIES];

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Hero Cover Photo with Floating Buttons */}
      <div className="relative h-60 w-full bg-gradient-to-tr from-emerald-800 via-teal-700 to-green-600 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="text-center z-10 px-4">
          <span className="text-5xl drop-shadow-md">🇷🇼</span>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 mt-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            {catMeta?.label || announcement.category}
          </p>
        </div>

        {/* Floating Back and Share buttons */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#172B24] flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleShare}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#172B24] flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 space-y-4 flex-1">
        {/* Category Pill */}
        <span
          className="inline-block text-xs font-bold px-2.5 py-1 rounded-md"
          style={{
            backgroundColor: catMeta?.badgeBg || '#DDF7E8',
            color: catMeta?.badgeText || '#087A3E',
          }}
        >
          {catMeta?.label || announcement.category}
        </span>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#172B24] leading-tight">
          {announcement.title}
        </h1>

        {/* Body Text */}
        <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
          {announcement.content}
        </p>

        {/* Metadata Details Rows */}
        <div className="space-y-2.5 py-3 border-y border-[#E3EEE7]">
          <div className="flex items-center gap-3 text-xs text-[#172B24]">
            <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-medium">
              {formatDate(announcement.publishedAt || announcement.scheduledAt || announcement.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#172B24]">
            <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="font-medium">
              {announcement.targetAreaName || 'Local Jurisdiction'}
              {announcement.includeSubordinates ? ' & All Subordinate Cells' : ''}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#172B24]">
            <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold block">{announcement.authorName || 'Local Authority'}</span>
              <span className="text-[10px] text-[#64746C] uppercase font-mono">{announcement.authorRole}</span>
            </div>
          </div>
        </div>

        {/* Official Civic Notice Badge */}
        <div className="p-3.5 rounded-xl bg-[#F0FBF5] border border-[#DDF7E8] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#087A3E] leading-relaxed">
            This announcement was officially signed and broadcasted by local Rwandan administration through Isonga Connect.
          </p>
        </div>

        {/* Share Announcement Primary Action */}
        <div className="pt-2">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#087A3E] text-white text-xs font-bold shadow-md shadow-green-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Link Copied to Clipboard!' : 'Share Announcement'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResidentAnnouncementDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] bg-white flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#16A34A] mb-2" />
          <span className="text-xs font-semibold text-[#64746C]">Loading...</span>
        </div>
      }
    >
      <AnnouncementDetailsContent />
    </Suspense>
  );
}
