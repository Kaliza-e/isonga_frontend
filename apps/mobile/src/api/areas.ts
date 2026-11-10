import { AdministrativeArea } from '../types';
import { mobileApiClient } from './client';

export const HIERARCHY_DATA: {
  provinces: {
    id: string;
    name: string;
    districts: {
      id: string;
      name: string;
      sectors: {
        id: string;
        name: string;
        cells: string[];
      }[];
    }[];
  }[];
} = {
  provinces: [
    {
      id: 'kigali',
      name: 'Kigali City',
      districts: [
        {
          id: 'gasabo',
          name: 'Gasabo District',
          sectors: [
            {
              id: 'kimironko',
              name: 'Kimironko Sector',
              cells: ['Kimironko Cell', 'Gatsata Cell', 'Ndera Cell', 'Kibagabaga Cell'],
            },
            {
              id: 'remera',
              name: 'Remera Sector',
              cells: ['Rukiri I', 'Rukiri II', 'Nyabisindu'],
            },
            {
              id: 'kacyiru',
              name: 'Kacyiru Sector',
              cells: ['Kamatamu', 'Kibaza', 'Mukarange'],
            },
          ],
        },
        {
          id: 'kicukiro',
          name: 'Kicukiro District',
          sectors: [
            {
              id: 'kanombe',
              name: 'Kanombe Sector',
              cells: ['Busanza', 'Rubirizi', 'Karama'],
            },
            {
              id: 'niboye',
              name: 'Niboye Sector',
              cells: ['Gatare', 'Niboye', 'Nyakabanda'],
            },
          ],
        },
        {
          id: 'nyarugenge',
          name: 'Nyarugenge District',
          sectors: [
            {
              id: 'nyamirambo',
              name: 'Nyamirambo Sector',
              cells: ['Mumena', 'Rugarama', 'Cyivugiza'],
            },
          ],
        },
      ],
    },
    {
      id: 'northern',
      name: 'Northern Province',
      districts: [
        {
          id: 'musanze',
          name: 'Musanze District',
          sectors: [
            {
              id: 'muhoza',
              name: 'Muhoza Sector',
              cells: ['Ruhengeri', 'Mpenge', 'Kigombe'],
            },
          ],
        },
      ],
    },
  ],
};

export async function fetchAreas(): Promise<AdministrativeArea[]> {
  try {
    const res = await mobileApiClient<AdministrativeArea[]>('/areas');
    if (Array.isArray(res) && res.length > 0) return res;
    return [];
  } catch {
    return [];
  }
}

export async function locateByCoordinates(lat: number, lng: number): Promise<any> {
  try {
    return await mobileApiClient(`/areas/locate?lat=${lat}&lng=${lng}`);
  } catch {
    return {
      coordinates: { latitude: lat, longitude: lng },
      matchedLocation: 'Detected Area',
      distanceKm: 0,
      area: null,
      totalResidents: 0,
      people: [],
    };
  }
}

export async function getAreaPeople(areaId: string): Promise<any> {
  try {
    return await mobileApiClient(`/areas/${areaId}/people`);
  } catch {
    return {
      totalResidents: 0,
      residents: [],
    };
  }
}

export type AreaItem = AdministrativeArea;

export const areasApi = {
  getAreas: fetchAreas,
  locateByCoordinates,
  getAreaPeople,
};

