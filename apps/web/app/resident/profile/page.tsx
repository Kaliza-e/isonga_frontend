'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Camera,
  MapPin,
  Megaphone,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { residentsService, ResidentProfileResponse } from '@/lib/api/residents.service';
import { useAuth } from '@/lib/context/AuthContext';

export default function ResidentProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ResidentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'Kinyarwanda' | 'English'>('Kinyarwanda');

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const data = await residentsService.getProfile();
        if (isMounted) {
          setProfile(data);
          if (data.preferredLanguage === 'en') {
            setLanguage('English');
          } else {
            setLanguage('Kinyarwanda');
          }
        }
      } catch (err) {
        console.warn('Could not load resident profile', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleLanguage = async () => {
    const nextLang = language === 'Kinyarwanda' ? 'English' : 'Kinyarwanda';
    setLanguage(nextLang);
    try {
      await residentsService.updateProfile({
        preferredLanguage: nextLang === 'English' ? 'en' : 'rw',
      });
    } catch (err) {
      console.error('Failed to update language', err);
    }
  };

  const handleLogOut = () => {
    logout();
    router.push('/resident/login');
  };

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
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] hover:bg-[#F0FBF5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold text-[#172B24]">My Profile</h1>
        <div className="w-9 h-9" />
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
          <span className="text-xs font-semibold">Loading profile...</span>
        </div>
      ) : (
        <>
          {/* Profile Avatar & Info Card */}
          <div className="flex flex-col items-center justify-center space-y-2 pt-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-[#16A34A] to-[#0284C7] flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#087A3E]">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-base font-bold text-[#172B24]">{profile?.name || 'Resident Citizen'}</h2>
              <p className="text-xs text-[#64746C] font-mono mt-0.5">{profile?.phone || 'Phone Protected'}</p>
            </div>
          </div>

          {/* Navigation Options List */}
          <div className="bg-white rounded-2xl border border-[#E3EEE7] shadow-sm divide-y divide-[#E3EEE7] overflow-hidden">
            {/* My Location */}
            <Link
              href="/resident/location"
              className="flex items-center justify-between p-3.5 hover:bg-[#F0FBF5] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#172B24] block">My Location</span>
                  <span className="text-[11px] text-[#64746C]">{profile?.areaName || 'Select jurisdiction'}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64746C]" />
            </Link>

            {/* Language */}
            <div
              onClick={handleToggleLanguage}
              className="flex items-center justify-between p-3.5 hover:bg-[#F0FBF5] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#172B24] block">Language / Ururimi</span>
                  <span className="text-[11px] text-[#16A34A] font-medium">{language} (Tap to change)</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64746C]" />
            </div>

            {/* Data Protection Notice */}
            <div className="flex items-center justify-between p-3.5 bg-[#F0FBF5]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#DDF7E8] text-[#16A34A] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#172B24] block">Data Privacy Consent</span>
                  <span className="text-[11px] text-[#087A3E]">
                    {profile?.consentGiven ? 'Opted-in (Law N° 058/2021)' : 'Not granted'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Switch to Admin Mode Shortcut */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#DDF7E8] text-[#087A3E] text-xs font-semibold hover:bg-[#C6F0D7] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Local Administrator Dashboard</span>
          </Link>

          {/* Log Out Button */}
          <button
            onClick={handleLogOut}
            className="w-full py-3 rounded-xl border border-[#E3EEE7] bg-white hover:bg-[#FEE2E2] text-[#64746C] hover:text-[#B91C1C] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </>
      )}
    </div>
  );
}
