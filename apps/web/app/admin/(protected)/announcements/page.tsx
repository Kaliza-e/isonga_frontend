'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
  Send,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryBadge, StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { AnnouncementStatus, AnnouncementCategory, Announcement } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { announcementsService } from '@/lib/api/announcements.service';

export default function AdminAnnouncementsPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | AnnouncementStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AnnouncementCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await announcementsService.getAnnouncements({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
      });
      setAnnouncements(res.items);
    } catch (err) {
      console.error('Error fetching announcements from backend', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handlePublish = async (id: string) => {
    setActionInProgress(id);
    try {
      await announcementsService.publishAnnouncement(id);
      await fetchAnnouncements();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to publish announcement');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCancel = async (id: string) => {
    const reason = prompt('Enter mandatory cancellation reason for audit log:');
    if (!reason) return;
    setActionInProgress(id);
    try {
      await announcementsService.cancelAnnouncement(id, reason);
      await fetchAnnouncements();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel announcement');
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = announcements.filter((ann) => {
    return (
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ann.targetAreaName && ann.targetAreaName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const statusTabs = [
    { id: 'ALL', label: 'All' },
    { id: 'PUBLISHED', label: 'Published' },
    { id: 'SCHEDULED', label: 'Scheduled' },
    { id: 'DRAFT', label: 'Drafts' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-5">
      {/* Page Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B24]">
            Community Announcements
          </h1>
          <p className="text-xs text-[#64746C] mt-0.5">
            Manage, target, and dispatch verified updates to residents across your jurisdiction
          </p>
        </div>

        <Link href="/admin/announcements/new">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create Announcement
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#16A34A] text-white shadow-sm shadow-green-600/20'
                  : 'bg-white text-[#64746C] border border-[#E3EEE7] hover:border-[#CBDCD3]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Toolbar */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#64746C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keywords, or area..."
              className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-9 pr-4 py-2 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#64746C] shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
              className="bg-[#F0FBF5] border border-[#E3EEE7] rounded-xl px-3 py-2 text-xs text-[#172B24] focus:outline-none focus:border-[#16A34A]"
            >
              <option value="ALL">All Categories</option>
              <option value="UMUGANDA">Umuganda</option>
              <option value="COMMUNITY_MEETINGS">Community Meetings</option>
              <option value="HEALTH_INFORMATION">Health Information</option>
              <option value="PUBLIC_SERVICES">Public Services</option>
              <option value="EDUCATION">Education</option>
              <option value="ADMINISTRATIVE_NOTICES">Administrative Notices</option>
              <option value="EMERGENCY_PUBLIC_INFORMATION">Emergency Public Info</option>
            </select>
          </div>
        </div>

        {/* Announcements Table */}
        {isLoading ? (
          <div className="p-12 text-center text-[#64746C] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
            <span className="text-xs font-semibold">Loading announcements from backend database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-[#E3EEE7]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0FBF5] border-b border-[#E3EEE7] text-[#64746C] font-semibold">
                <tr>
                  <th className="px-5 py-3">Announcement</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Geographical Scope</th>
                  <th className="px-4 py-3">Channels</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EEE7] text-[#172B24]">
                {filtered.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#F0FBF5]/50 transition-colors">
                    <td className="px-5 py-3.5 max-w-sm">
                      <div className="font-bold text-[#172B24] leading-snug">{ann.title}</div>
                      <div className="text-[11px] text-[#64746C] line-clamp-1 mt-0.5">
                        {ann.content}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <CategoryBadge category={ann.category} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-[#172B24]">{ann.targetAreaName || 'Target Jurisdiction'}</div>
                      <div className="text-[10px] text-[#64746C]">
                        {ann.includeSubordinates ? 'Entire Subtree' : 'Exact Area'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {ann.channels?.map((ch) => (
                          <span
                            key={ch}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#DDF7E8] text-[#087A3E]"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAnnouncement(ann)}
                          className="p-1.5 rounded-lg border border-[#E3EEE7] text-[#64746C] hover:text-[#16A34A] hover:bg-[#F0FBF5] transition-colors cursor-pointer"
                          title="Inspect Announcement Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {ann.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(ann.id)}
                            disabled={actionInProgress === ann.id}
                            className="p-1.5 rounded-lg bg-[#DDF7E8] text-[#087A3E] hover:bg-[#C6F0D7] transition-colors cursor-pointer"
                            title="Publish Now"
                          >
                            {actionInProgress === ann.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        {ann.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(ann.id)}
                            disabled={actionInProgress === ann.id}
                            className="p-1.5 rounded-lg border border-[#E3EEE7] text-[#64746C] hover:text-[#E45C5C] hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancel Announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[#64746C]">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-[#F5B942]" />
                      <p className="text-xs font-semibold text-[#172B24]">No announcements found</p>
                      <p className="text-[11px] mt-0.5">Try clearing your filters or creating a new announcement.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Inspection Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E3EEE7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EEE7]">
              <div className="flex items-center gap-2">
                <CategoryBadge category={selectedAnnouncement.category} />
                <PriorityBadge priority={selectedAnnouncement.priority} />
                <StatusBadge status={selectedAnnouncement.status} />
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1 rounded-lg text-[#64746C] hover:bg-[#F0FBF5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#172B24]">{selectedAnnouncement.title}</h2>
              <div className="text-xs text-[#64746C] flex items-center gap-2">
                <span>Scope: {selectedAnnouncement.targetAreaName || 'Jurisdiction'}</span>
                <span>•</span>
                <span>{formatDate(selectedAnnouncement.publishedAt || selectedAnnouncement.createdAt)}</span>
              </div>
              <p className="text-xs text-[#172B24] bg-[#F0FBF5] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">
                {selectedAnnouncement.content}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedAnnouncement(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

