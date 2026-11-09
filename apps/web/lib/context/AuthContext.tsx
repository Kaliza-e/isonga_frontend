'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService, LoginResponse } from '../api/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<LoginResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUserProfile(raw: any): UserProfile | null {
  if (!raw) return null;
  const firstName = raw.profile?.firstName || raw.residentProfile?.firstName || '';
  const lastName = raw.profile?.lastName || raw.residentProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const primaryArea =
    raw.profile?.area ||
    raw.residentProfile?.area ||
    raw.adminPermissions?.[0]?.area;

  return {
    id: raw.id || '',
    phone: raw.phone || '',
    name: raw.name || fullName || raw.email || raw.phone || 'Administrator',
    role: raw.role || 'SUPER_ADMIN',
    status: raw.status || 'ACTIVE',
    primaryAreaId: raw.primaryAreaId || primaryArea?.id,
    primaryAreaName: raw.primaryAreaName || primaryArea?.name || 'National Administration',
    permissions:
      raw.permissions ||
      raw.adminPermissions?.map((p: any) => ({
        areaId: p.areaId,
        areaName: p.area?.name || 'Territory',
        level: p.area?.level || 'DISTRICT',
      })) ||
      [],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
      if (!storedToken) {
        setUser(null);
        setToken(null);
        return;
      }
      setToken(storedToken);
      const me = await authService.getMe();
      if (me) {
        setUser(normalizeUserProfile(me));
      } else {
        setUser(null);
      }
    } catch {
      // Token is invalid, expired, or server unreachable
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isonga_token');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (phone: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(phone, pass);
      setToken(res.accessToken);
      setUser(normalizeUserProfile(res.user));
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const role = user?.role || 'RESIDENT';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        role,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
