'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { useAuth } from '@/lib/context/AuthContext';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';

const ADMIN_ROLES = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SECTOR_ADMIN', 'CELL_ADMIN'];

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/admin/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0FBF5] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
        <span className="text-xs font-semibold text-[#64746C]">Verifying Administrator Credentials...</span>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Authenticated but not a Super Admin
  if (user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-[#F0FBF5] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E3EEE7] shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#172B24]">Super Admin Portal Access Only</h2>
          <p className="text-xs text-[#64746C] leading-relaxed">
            Your account ({user.name || user.phone}) is registered as a <span className="font-semibold text-[#172B24]">{user.role}</span>.
            This web application is exclusively dedicated to the platform Super Admin for nationwide monitoring and management.
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 leading-relaxed">
            <strong>Mobile-First Civic Architecture:</strong> Local Administrators (Chiefs, Cell, and Sector Admins) and Community Residents manage communications directly through the <strong>Isonga Connect Mobile Application</strong>.
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#087A3E] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch to Super Admin Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F0FBF5]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            <AppSidebar />
          </div>
        </div>
      )}

      {/* Main Administrative Console Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

