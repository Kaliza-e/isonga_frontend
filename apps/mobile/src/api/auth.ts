import { mobileApiClient, setMobileAuthToken } from './client';
import { ResidentUser } from '../types';

export interface MobileLoginResponse {
  accessToken: string;
  tokenType?: string;
  user: {
    id: string;
    phone: string;
    email?: string;
    role: string;
    status: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      areaId?: string;
      preferredLanguage?: string;
      area?: {
        id: string;
        name: string;
        level: string;
        parentId?: string;
      };
    };
    adminPermissions?: Array<{
      areaId: string;
      canPublish: boolean;
      canSchedule: boolean;
      canManageAdmins: boolean;
      area?: {
        id: string;
        name: string;
        level: string;
      };
    }>;
  };
}

export interface MobileRegisterDto {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  areaId: string;
  email?: string;
  preferredLanguage?: string;
  consentGiven: boolean;
}

export const authApi = {
  async login(identifier: string, password?: string): Promise<{ token: string; user: ResidentUser }> {
    const res = await mobileApiClient<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
        phone: identifier.trim(),
        password: password || 'Password123!',
      }),
    });

    const token = res.accessToken || res.data?.accessToken;
    const rawUser = res.user || res.data?.user;

    if (token) {
      setMobileAuthToken(token);
    }

    // Extract area details from profile or permissions
    const primaryArea =
      rawUser?.profile?.area ||
      rawUser?.adminPermissions?.[0]?.area || {
        id: rawUser?.profile?.areaId || 'gasabo-kimironko',
        name: 'Kimironko Sector',
      };

    const residentUser: ResidentUser = {
      id: rawUser?.id || 'res-user',
      name:
        `${rawUser?.profile?.firstName || ''} ${rawUser?.profile?.lastName || ''}`.trim() ||
        rawUser?.phone ||
        'Resident User',
      phone: rawUser?.phone || identifier,
      role: (rawUser?.role as any) || 'RESIDENT',
      primaryAreaId: primaryArea.id,
      primaryAreaName: primaryArea.name,
      district: 'Gasabo District',
      sector: primaryArea.name?.includes('Sector') ? primaryArea.name : 'Kimironko Sector',
      cell: primaryArea.name?.includes('Cell') ? primaryArea.name : 'Kimironko Cell',
      language: (rawUser?.profile?.preferredLanguage as any) || 'rw',
      consentLaw058: true,
    };

    return { token, user: residentUser };
  },

  async register(data: MobileRegisterDto): Promise<any> {
    return await mobileApiClient<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        phone: data.phone.trim(),
        password: data.password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        areaId: data.areaId,
        email: data.email?.trim() || undefined,
        preferredLanguage: data.preferredLanguage || 'rw',
        consentGiven: data.consentGiven,
      }),
    });
  },

  async verifyOtp(phone: string, otp: string): Promise<any> {
    return await mobileApiClient<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phone.trim(), otp: otp.trim() }),
    });
  },

  async getMe(): Promise<ResidentUser | null> {
    try {
      const rawUser = await mobileApiClient<any>('/auth/me');
      if (!rawUser) return null;

      const primaryArea =
        rawUser.profile?.area ||
        rawUser.adminPermissions?.[0]?.area || {
          id: rawUser.profile?.areaId || 'gasabo-kimironko',
          name: 'Kimironko Sector',
        };

      return {
        id: rawUser.id,
        name:
          `${rawUser.profile?.firstName || ''} ${rawUser.profile?.lastName || ''}`.trim() ||
          rawUser.phone ||
          'Resident User',
        phone: rawUser.phone,
        role: rawUser.role || 'RESIDENT',
        primaryAreaId: primaryArea.id,
        primaryAreaName: primaryArea.name,
        district: 'Gasabo District',
        sector: primaryArea.name,
        cell: primaryArea.name,
        language: rawUser.profile?.preferredLanguage || 'rw',
        consentLaw058: true,
      };
    } catch {
      return null;
    }
  },

  logout(): void {
    setMobileAuthToken(null);
  },
};
