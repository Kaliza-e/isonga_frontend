'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Phone, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { IsongaLogo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/context/AuthContext';

function SuperAdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';
  const { login } = useAuth();

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phoneOrEmail.trim() || !password) {
      setError('Please enter both your Super Admin identifier and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(phoneOrEmail.trim(), password);

      // Web application is exclusively dedicated to SUPER_ADMIN
      if (res.user.role !== 'SUPER_ADMIN') {
        setError(
          'Access Denied: This web console is strictly reserved for the platform Super Admin. Residents and Local Leaders (Chiefs, Cell, and Sector Admins) must access Isonga Connect via the official mobile application.'
        );
        return;
      }

      router.push(returnUrl);
    } catch (err: any) {
      const message =
        err?.message || 'Authentication failed. Please verify your Super Admin credentials.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF5] bg-pattern-dots-subtle flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#087A3E]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Isonga Connect Super Admin Portal</span>
        </div>
        <span className="text-[11px] font-mono text-[#64746C] bg-white px-2.5 py-0.5 rounded-md border border-[#E3EEE7]">
          Gov-RW Secure Node
        </span>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E3EEE7] shadow-xl shadow-green-950/5 relative overflow-hidden">
          {/* Subtle Top Accent Banner */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#16A34A] via-[#087A3E] to-[#0284C7]" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <IsongaLogo size="lg" showText={true} showTagline={false} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EE] border border-[#C6F0D7] text-[#087A3E] text-xs font-bold mt-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Dedicated Super Admin Portal</span>
            </div>

            <p className="text-xs text-[#64746C] max-w-xs mx-auto">
              Sign in with verified platform owner credentials to monitor platform operations, manage administrators, and review national telemetry.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B24] mb-1.5">
                Super Admin Identifier (Email or Phone)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="kalizaesther5@gmail.com"
                  className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-4 py-2.5 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#172B24]">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64746C]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-4 py-2.5 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#087A3E] text-white text-xs font-semibold shadow-md shadow-green-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Super Admin...</span>
                </>
              ) : (
                <>
                  <span>Enter Super Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Architecture Notice */}
          <div className="mt-8 pt-6 border-t border-[#E3EEE7] text-center">
            <p className="text-[11px] text-[#64746C] leading-relaxed">
              <strong>Mobile-First Architecture:</strong> Residents and Local Administrative Leaders access their dedicated portals via the <strong>Isonga Connect Mobile Application</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center space-y-1">
        <p className="text-[11px] text-[#64746C]">
          &copy; {new Date().getFullYear()} Isonga Connect. Republic of Rwanda Civic Technology Initiative.
        </p>
        <p className="text-[10px] text-[#94A39B]">
          Law N° 058/2021 Data Protection • 256-bit TLS Encrypted Node
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0FBF5] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#16A34A]" />
        </div>
      }
    >
      <SuperAdminLoginForm />
    </Suspense>
  );
}
