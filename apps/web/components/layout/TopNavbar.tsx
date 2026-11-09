'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  PlusCircle,
  MapPin,
  Menu,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();

  const adminName = user?.name || 'Administrator';
  const adminScope = user?.primaryAreaName || 'National Administration';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  return (
    <header className="h-16 bg-white border-b border-[#E3EEE7] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#64746C] hover:bg-[#F0FBF5]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Territory Scope Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FBF5] border border-[#E3EEE7] text-xs">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="font-semibold text-[#172B24]">
            {adminScope}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative w-64">
          <Search className="w-4 h-4 absolute left-3 text-[#64746C]" />
          <input
            type="text"
            placeholder="Search announcements, areas..."
            className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-9 pr-3 py-1.5 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
          />
        </div>

        {/* Admin Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F8EE] text-[#087A3E] text-[11px] font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Console</span>
        </div>

        {/* Quick Create Action */}
        <Link href="/admin/announcements/new">
          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Announcement
          </Button>
        </Link>

        {/* Notification Bell */}
        <Link
          href="/admin/notifications"
          className="w-9 h-9 rounded-xl border border-[#E3EEE7] flex items-center justify-center text-[#172B24] relative hover:bg-[#F0FBF5] transition-colors"
          title="Notification Dispatch Logs"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white" />
        </Link>

        {/* Administrator Profile Link */}
        <Link href="/admin/settings" className="flex items-center gap-2 pl-2 border-l border-[#E3EEE7] hover:opacity-85 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#087A3E] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {initials}
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-[#172B24] block leading-tight">
              {adminName}
            </span>
            <span className="text-[10px] text-[#64746C] uppercase font-mono font-medium">
              {user?.role ? user.role.replace(/_/g, ' ') : 'AUTHORIZED ADMIN'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
