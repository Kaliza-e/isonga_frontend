import { mobileApiClient, setMobileAuthToken, getMobileAuthToken } from './client';
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

function mapBackendUserToResidentUser(rawUser: any): ResidentUser {
  const primaryArea =
    rawUser?.profile?.area ||
    rawUser?.adminPermissions?.[0]?.area || {
      id: rawUser?.profile?.areaId || 'gasabo-kimironko',
      name: 'Kimironko Cell',
    };

  return {
    id: rawUser?.id || 'user-id',
    name:
      `${rawUser?.profile?.firstName || ''} ${rawUser?.profile?.lastName || ''}`.trim() ||
      rawUser?.phone ||
      'Resident User',
    phone: rawUser?.phone || '',
    email: rawUser?.email,
    role: (rawUser?.role as any) || 'RESIDENT',
    primaryAreaId: primaryArea.id,
    primaryAreaName: primaryArea.name,
    district: 'Gasabo District',
    sector: primaryArea.name?.includes('Sector') ? primaryArea.name : 'Kimironko Sector',
    cell: primaryArea.name?.includes('Cell') ? primaryArea.name : 'Kimironko Cell',
    language: (rawUser?.profile?.preferredLanguage as any) || 'rw',
    consentLaw058: true,
  };
}

export const authApi = {
  async login(identifier: string, password?: string): Promise<{ token: string; user: ResidentUser }> {
    const res = await mobileApiClient<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
        phone: identifier.trim(),
        password: password || '',
      }),
    });

    const token = res.accessToken || res.data?.accessToken;
    const rawUser = res.user || res.data?.user;

    if (!token || !rawUser) {
      throw new Error('Authentication response was invalid.');
    }

    setMobileAuthToken(token);
    const user = mapBackendUserToResidentUser(rawUser);
    return { token, user };
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
    const token = getMobileAuthToken();
    if (!token) {
      return null;
    }

    try {
      const rawUser = await mobileApiClient<any>('/auth/me');
      if (!rawUser) return null;
      return mapBackendUserToResidentUser(rawUser);
    } catch {
      return null;
    }
  },

  logout(): void {
    setMobileAuthToken(null);
  },
};
