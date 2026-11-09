'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IsongaLogo } from '@/components/ui/Logo';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function ResidentLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.user.role === 'RESIDENT') {
        router.push('/resident');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Invalid login credentials. Please verify your phone number and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white px-6 py-6 flex flex-col justify-between">
      {/* Top Branding */}
      <div className="flex flex-col items-center text-center space-y-2 pt-2">
        <IsongaLogo size="lg" showText={false} />
        <h1 className="text-xl font-bold text-[#172B24] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-[#64746C]">Sign in to continue</p>
      </div>

      {errorMessage && (
        <div className="p-3 my-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E45C5C]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSignIn} className="space-y-3.5 my-4">
        {/* Phone / Email Input */}
        <div className="relative">
          <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64746C]" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Phone number (+250788...)"
            required
            className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-4 py-3 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64746C]" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-10 py-3 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-[#64746C] hover:text-[#172B24]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#172B24] font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="font-semibold text-[#16A34A] hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#087A3E] text-white font-semibold text-sm shadow-md shadow-green-600/20 active:scale-[0.99] transition-all cursor-pointer mt-2"
        >
          {isLoading ? 'Signing in with Backend...' : 'Sign In'}
        </button>
      </form>

      {/* Footer Register Link */}
      <div className="text-center text-xs text-[#64746C] pb-2">
        <span>Don&apos;t have an account? </span>
        <Link href="/resident/location" className="font-bold text-[#16A34A] hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
