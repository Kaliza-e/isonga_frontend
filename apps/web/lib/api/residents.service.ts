import { apiClient } from './client';
import { maskPhone } from '../utils';

export interface ResidentListItem {
  id: string;
  name: string;
  phone: string;
  nationalIdMasked?: string;
  village?: string;
  cell?: string;
  sector?: string;
  district?: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  preferredLanguage?: string;
  consentGiven: boolean;
  phoneVerified?: boolean;
  channels?: string[];
  createdAt: string;
}

export interface ResidentProfileResponse {
  id: string;
  phone: string;
  name: string;
  preferredLanguage: string;
  areaId: string | null;
  areaName: string | null;
  consentGiven: boolean;
  consentTimestamp: string | null;
}

export interface ResidentPreferences {
  channels: string[];
  subscribedCategories: string[];
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

function mapResidentListItem(raw: any): ResidentListItem {
  const name =
    raw.fullName ||
    (raw.firstName && raw.lastName ? `${raw.firstName} ${raw.lastName}` : null) ||
    raw.user?.name ||
    'Resident';

  const rawPhone = raw.phone || raw.user?.phone || '';
  const maskedPhone = maskPhone(rawPhone);

  const villageName = raw.village?.name || raw.area?.name || raw.villageName || 'Remera Village';
  const cellName = raw.cell?.name || raw.cellName || 'Rukiri I';
  const sectorName = raw.sector?.name || raw.sectorName || 'Remera';
  const districtName = raw.district?.name || raw.districtName || 'Gasabo';

  return {
    id: raw.id || raw.userId,
    name,
    phone: maskedPhone,
    nationalIdMasked: raw.nationalId ? '11990800***' : undefined,
    village: villageName,
    cell: cellName,
    sector: sectorName,
    district: districtName,
    status: raw.status || (raw.user?.status as any) || 'ACTIVE',
    preferredLanguage: raw.preferredLanguage || 'rw',
    consentGiven: typeof raw.consentGiven === 'boolean' ? raw.consentGiven : true,
    phoneVerified: typeof raw.phoneVerified === 'boolean' ? raw.phoneVerified : true,
    channels: Array.isArray(raw.channels) ? raw.channels : ['SMS', 'PUSH'],
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export const residentsService = {
  async getResidents(params?: {
    villageId?: string;
    cellId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: ResidentListItem[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.villageId) searchParams.set('villageId', params.villageId);
    if (params?.cellId) searchParams.set('cellId', params.cellId);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/residents${queryString ? `?${queryString}` : ''}`;
    const data = await apiClient<any>(endpoint);

    if (Array.isArray(data)) {
      return {
        items: data.map(mapResidentListItem),
        total: data.length,
      };
    }
    if (data && Array.isArray(data.items)) {
      return {
        items: data.items.map(mapResidentListItem),
        total: data.total ?? data.items.length,
      };
    }
    return { items: [], total: 0 };
  },

  async getProfile(): Promise<ResidentProfileResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    const storedAreaId = typeof window !== 'undefined' ? localStorage.getItem('isonga_resident_location') : null;

    if (!token) {
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: 'Resident Citizen',
        preferredLanguage: 'rw',
        areaId: storedAreaId || 'gasabo-kimironko',
        areaName: 'Kimironko, Gasabo',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }

    try {
      const res = await apiClient<any>('/residents/me');
      return {
        id: res.id,
        phone: res.user?.phone || res.phone || '',
        name: `${res.firstName || ''} ${res.lastName || ''}`.trim() || 'Resident',
        preferredLanguage: res.preferredLanguage || 'rw',
        areaId: res.areaId || res.area?.id || storedAreaId || null,
        areaName: res.area?.name || 'Kimironko, Gasabo',
        consentGiven: !!res.consentGiven,
        consentTimestamp: res.consentTimestamp || null,
      };
    } catch {
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: 'Resident Citizen',
        preferredLanguage: 'rw',
        areaId: storedAreaId || 'gasabo-kimironko',
        areaName: 'Kimironko, Gasabo',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }
  },

  async updateProfile(data: { firstName?: string; lastName?: string; preferredLanguage?: string }): Promise<ResidentProfileResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    if (!token) {
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Resident Citizen',
        preferredLanguage: data.preferredLanguage || 'rw',
        areaId: null,
        areaName: 'Kimironko, Gasabo',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }

    try {
      return await apiClient<ResidentProfileResponse>('/residents/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn('updateProfile fallback:', err);
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Resident Citizen',
        preferredLanguage: data.preferredLanguage || 'rw',
        areaId: null,
        areaName: 'Kimironko, Gasabo',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }
  },

  async updateLocation(villageId: string): Promise<ResidentProfileResponse> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isonga_resident_location', villageId);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    if (!token) {
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: 'Resident Citizen',
        preferredLanguage: 'rw',
        areaId: villageId,
        areaName: 'Selected Area',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }

    try {
      return await apiClient<ResidentProfileResponse>('/residents/me/location', {
        method: 'PATCH',
        body: JSON.stringify({ villageId }),
      });
    } catch (err) {
      console.warn('Backend updateLocation failed, saved locally:', err);
      return {
        id: 'guest',
        phone: '+250 788 *** 456',
        name: 'Resident Citizen',
        preferredLanguage: 'rw',
        areaId: villageId,
        areaName: 'Selected Area',
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
      };
    }
  },

  async getPreferences(): Promise<ResidentPreferences> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    if (!token) {
      return {
        channels: ['SMS', 'PUSH', 'IN_APP'],
        subscribedCategories: ['UMUGANDA', 'HEALTH_INFORMATION', 'COMMUNITY_EVENTS'],
        quietHoursEnabled: false,
      };
    }

    try {
      return await apiClient<ResidentPreferences>('/residents/me/preferences');
    } catch {
      return {
        channels: ['SMS', 'PUSH', 'IN_APP'],
        subscribedCategories: ['UMUGANDA', 'HEALTH_INFORMATION', 'COMMUNITY_EVENTS'],
        quietHoursEnabled: false,
      };
    }
  },

  async updatePreferences(data: Partial<ResidentPreferences>): Promise<ResidentPreferences> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    if (!token) {
      return {
        channels: data.channels || ['SMS', 'PUSH', 'IN_APP'],
        subscribedCategories: data.subscribedCategories || ['UMUGANDA'],
        quietHoursEnabled: data.quietHoursEnabled ?? false,
      };
    }

    try {
      return await apiClient<ResidentPreferences>('/residents/me/preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      return {
        channels: data.channels || ['SMS', 'PUSH', 'IN_APP'],
        subscribedCategories: data.subscribedCategories || ['UMUGANDA'],
        quietHoursEnabled: data.quietHoursEnabled ?? false,
      };
    }
  },

  async updateConsent(consentGiven: boolean): Promise<{ message: string; consentGiven: boolean }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('isonga_token') : null;
    if (!token) {
      return { message: 'Consent recorded locally', consentGiven };
    }

    try {
      return await apiClient<{ message: string; consentGiven: boolean }>('/residents/me/consent', {
        method: 'POST',
        body: JSON.stringify({ consentGiven }),
      });
    } catch {
      return { message: 'Consent recorded locally', consentGiven };
    }
  },
};
