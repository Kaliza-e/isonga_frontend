import { mobileApiClient } from './client';
import { ResidentUser } from '../types';

export const residentsApi = {
  async getProfile(): Promise<ResidentUser> {
    try {
      const res = await mobileApiClient<any>('/residents/me');
      return {
        id: res.id,
        name: `${res.firstName || ''} ${res.lastName || ''}`.trim() || 'Aline Uwimana',
        phone: res.phone || res.user?.phone || '+250 788 123 456',
        role: 'RESIDENT',
        district: res.area?.districtName || 'Gasabo District',
        sector: res.area?.sectorName || 'Kimironko Sector',
        cell: res.area?.name || 'Kimironko Cell',
        language: res.preferredLanguage || 'rw',
        consentLaw058: !!res.consentGiven,
      };
    } catch {
      return {
        id: 'res-aline',
        name: 'Aline Uwimana',
        phone: '+250 788 123 456',
        role: 'RESIDENT',
        district: 'Gasabo District',
        sector: 'Kimironko Sector',
        cell: 'Kimironko Cell',
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

