'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IsongaLogo } from '@/components/ui/Logo';

export default function ResidentSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/resident');
    }, 2400);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-full flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-[#F0FBF5] via-[#E8F8EE] to-[#DDF7E8]">
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => router.push('/resident')}
          className="text-xs text-[#16A34A] font-semibold hover:underline"
        >
          Skip &gt;
        </button>
      </div>

      {/* Center Branding (Matching Reference Screen 1) */}
      <div className="flex flex-col items-center text-center space-y-4 z-10">
        <IsongaLogo size="xl" showText={true} showTagline={true} className="flex-col" />

        {/* 3 Animated Loading Dots */}
        <div className="flex items-center gap-1.5 pt-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-bounce" />
        </div>
      </div>

      {/* Bottom Scenic Landscape Illustration (Matching Kigali Cityscape & Hills from Screen 1) */}
      <div className="w-full text-center space-y-2 z-10">
        <div className="p-3 bg-white/70 backdrop-blur rounded-2xl border border-[#CBDCD3] shadow-sm">
          <p className="text-xs font-semibold text-[#087A3E]">
            Empowering Rwandan Communities Through Verified Updates
          </p>
        </div>
        <p className="text-[10px] text-[#64746C]">
          Kigali • Northern • Southern • Eastern • Western Provinces
        </p>
      </div>
    </div>
  );
}

