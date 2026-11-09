'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IsongaLogo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Users,
  MapPin,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Map,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const adminScope = user?.primaryAreaName || 'National Administration';
  const adminRole = user?.role ? user.role.replace(/_/g, ' ') : 'Administrator';

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { label: 'New Announcement', href: '/admin/announcements/new', icon: PlusCircle },
    { label: 'Residents Directory', href: '/admin/residents', icon: Users },
    { label: 'Administrative Locations', href: '/admin/locations', icon: MapPin },
    { label: 'Notification Logs', href: '/admin/notifications', icon: Bell },
    { label: 'Analytics & Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Profile & Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E3EEE7] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
      <div className="p-5 space-y-6">
        {/* Isonga Connect Brand */}
        <Link href="/admin/dashboard" className="block focus:outline-none">
          <IsongaLogo size="md" showText={true} showTagline={true} />
        </Link>

        {/* Administrator Jurisdiction Scope Badge */}
        <div className="p-3 bg-[#F0FBF5] rounded-xl border border-[#DDF7E8]">
          <div className="flex items-center gap-2 text-[#087A3E]">
            <Map className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Assigned Jurisdiction
            </span>
          </div>
          <p className="text-xs font-semibold text-[#172B24] mt-1 truncate">
            {adminScope}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
            <span className="text-[10px] text-[#64746C] block uppercase font-mono font-medium">
              {adminRole}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-sm shadow-green-600/20'
                    : 'text-[#64746C] hover:bg-[#F0FBF5] hover:text-[#172B24]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#64746C]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Shortcuts */}
      <div className="p-5 border-t border-[#E3EEE7] space-y-2">
        <div className="p-2.5 rounded-xl bg-[#F0FBF5] text-[#172B24] text-xs font-semibold border border-[#CBDCD3]/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64746C]">Platform Scope</span>
            <span className="text-[10px] text-[#087A3E] font-bold">Nationwide</span>
          </div>
          <div className="text-[10px] text-[#64746C] mt-0.5">Mobile-First App Active</div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#64746C] hover:text-[#B91C1C] hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
