import { apiClient } from './client';
import { AdministrativeArea, AreaLevel } from '../types';

export interface GetAreasQuery {
  parentId?: string;
  level?: AreaLevel;
}

export const areasService = {
  async getAreas(query?: GetAreasQuery): Promise<AdministrativeArea[]> {
    const searchParams = new URLSearchParams();
    if (query?.parentId) searchParams.set('parentId', query.parentId);
    if (query?.level) searchParams.set('level', query.level);

    const qs = searchParams.toString();
    const endpoint = qs ? `/areas?${qs}` : '/areas';
    const areas = await apiClient<AdministrativeArea[]>(endpoint);
    return areas || [];
  },

  async getArea(id: string): Promise<AdministrativeArea> {
    return apiClient<AdministrativeArea>(`/areas/${id}`);
  },

  async getSubordinates(id: string): Promise<AdministrativeArea[]> {
    const subs = await apiClient<AdministrativeArea[]>(`/areas/${id}/subordinates`);
    return subs || [];
  },

  async locateByCoordinates(lat: number, lng: number): Promise<{
    coordinates: { latitude: number; longitude: number };
    matchedLocation: string;
    distanceKm: number;
    area: AdministrativeArea;
    ancestors: AdministrativeArea[];
    totalResidents: number;
    people: Array<{ id: string; name: string; phoneMasked: string; village: string; role: string }>;
  }> {
    return apiClient(`/areas/locate?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
  },

  async getAreaPeople(areaId: string): Promise<{
    areaId: string;
    areaName: string;
    level: string;
    totalResidents: number;
    residents: Array<{ id: string; name: string; phoneMasked: string; areaName: string; role: string }>;
  }> {
    return apiClient(`/areas/${areaId}/people`);
  },
};
