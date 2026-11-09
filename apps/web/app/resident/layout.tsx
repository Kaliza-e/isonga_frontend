import React, { Suspense } from 'react';
import Link from 'next/link';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ShieldCheck, Wifi, Battery, Signal } from 'lucide-react';

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EAEFEA] py-0 md:py-6 flex flex-col items-center justify-center font-sans antialiased">
      {/* Top Desktop Helper Banner */}
      <aside aria-label="Simulator notice" className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-4 py-2 bg-white/80 backdrop-blur rounded-xl border border-[#E3EEE7] text-xs text-[#172B24]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="font-semibold text-[#087A3E]">Mobile-First Resident Portal</span>
        </div>
        <Link
          href="/admin/login"
          className="flex items-center gap-1 font-semibold text-[#16A34A] hover:underline"
        >
          <span>Super Admin Sign In</span>
        </Link>
      </aside>

      {/* Smartphone Device Frame */}
      <div className="w-full max-w-md min-h-screen md:min-h-[844px] md:max-h-[890px] bg-[#F0FBF5] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(23,43,36,0.2)] md:border-[8px] md:border-[#1E2E26] overflow-hidden flex flex-col relative">
        {/* iOS / Mobile Status Bar */}
        <header className="sticky top-0 z-50 bg-[#F0FBF5]/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-[#172B24]">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-[#172B24]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </header>

        {/* Screen Content Container with scroll */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Resident Bottom Navigation (Suspense enabled for usePathname) */}
        <Suspense fallback={<div className="h-14 bg-white" />}>
          <MobileBottomNav />
        </Suspense>
      </div>
    </div>
  );
}
