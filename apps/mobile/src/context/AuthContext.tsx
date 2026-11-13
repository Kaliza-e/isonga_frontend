import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResidentUser } from '../types';
import { authApi, MobileRegisterDto } from '../api/auth';
import { setMobileAuthToken } from '../api/client';

interface AuthContextType {
  user: ResidentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (val: boolean) => void;
  login: (identifier: string, password?: string) => Promise<{ token: string; user: ResidentUser }>;
  loginSeeded: (roleType: 'ADMIN' | 'RESIDENT') => { token: string; user: ResidentUser };
  register: (data: MobileRegisterDto) => Promise<any>;
  logout: () => void;
  updateConsent: (consent: boolean) => void;
  toggleLanguage: () => void;
  setUserDirectly: (u: ResidentUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ResidentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check initial auth on startup
    async function initAuth() {
      try {
        const me = await authApi.getMe();
        if (me) {
          setUser(me);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (identifier: string, password?: string) => {
    setIsLoading(true);
    try {
      const { token, user: loggedUser } = await authApi.login(identifier, password);
      setUser(loggedUser);
      return { token, user: loggedUser };
    } finally {
      setIsLoading(false);
    }
  };

  const loginSeeded = (roleType: 'ADMIN' | 'RESIDENT') => {
    const { token, user: seededUser } = authApi.loginSeeded(roleType);
    setUser(seededUser);
    return { token, user: seededUser };
  };

  const register = async (data: MobileRegisterDto) => {
    setIsLoading(true);
    try {
      return await authApi.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateConsent = (consent: boolean) => {
    if (user) {
      setUser({ ...user, consentLaw058: consent });
    }
  };

  const toggleLanguage = () => {
    if (user) {
      setUser({ ...user, language: user.language === 'rw' ? 'en' : 'rw' });
    }
  };

  const setUserDirectly = (u: ResidentUser) => {
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasSeenOnboarding,
        setHasSeenOnboarding,
        login,
        loginSeeded,
        register,
        logout,
        updateConsent,
        toggleLanguage,
        setUserDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMobileAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useMobileAuth must be used within an AuthProvider');
  return ctx;
}
