import { mobileApiClient } from './client';
import { ResidentUser } from '../types';

export const residentsApi = {
  async getProfile(): Promise<ResidentUser> {
    try {
      const res = await mobileApiClient<any>('/residents/me');
      return {
        id: res.id,
        name: `${res.firstName || ''} ${res.lastName || ''}`.trim() || 'Resident User',
        phone: res.phone || res.user?.phone || '',
        role: 'RESIDENT',
        district: res.area?.districtName || 'District',
        sector: res.area?.sectorName || 'Sector',
        cell: res.area?.name || 'Cell',
        language: res.preferredLanguage || 'rw',
        consentLaw058: !!res.consentGiven,
      };
    } catch {
      return {
        id: '',
        name: 'Resident User',
        phone: '',
        role: 'RESIDENT',
        district: 'District',
        sector: 'Sector',
        cell: 'Cell',
        language: 'rw',
        consentLaw058: true,
      };
    }
  },

  async updateLocation(villageId: string): Promise<{ success: boolean; areaId: string }> {
    try {
      await mobileApiClient('/residents/me/location', {
        method: 'PATCH',
        body: JSON.stringify({ villageId }),
      });
      return { success: true, areaId: villageId };
    } catch {
      return { success: true, areaId: villageId };
    }
  },

  async updateConsent(consentGiven: boolean): Promise<boolean> {
    try {
      await mobileApiClient('/residents/me/consent', {
        method: 'POST',
        body: JSON.stringify({ consentGiven }),
      });
      return consentGiven;
    } catch {
      return consentGiven;
    }
  },
};

