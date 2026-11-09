'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Home',
      href: '/resident',
      icon: Home,
      exact: true,
    },
    {
      label: 'Notifications',
      href: '/resident/notifications',
      icon: Bell,
      badge: 2,
    },
    {
      label: 'Profile',
      href: '/resident/profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E3EEE7] px-6 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 relative transition-colors duration-150',
                isActive ? 'text-[#16A34A]' : 'text-[#64746C] hover:text-[#172B24]'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-1 text-[10px] font-bold text-white bg-[#E45C5C] rounded-full ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={cn('text-[11px] mt-1 font-medium', isActive && 'font-semibold')}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

