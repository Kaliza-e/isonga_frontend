import React, { createContext, useContext, useState } from 'react';

export interface LocationState {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village?: string;
  displayText: string;
}

interface LocationContextType {
  currentLocation: LocationState;
  setLocation: (loc: Partial<LocationState>) => void;
}

const DEFAULT_LOCATION: LocationState = {
  province: 'Kigali City',
  district: 'Gasabo District',
  sector: 'Kimironko Sector',
  cell: 'Kimironko Cell',
  displayText: 'Gasabo',
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationState>(DEFAULT_LOCATION);

  const setLocation = (loc: Partial<LocationState>) => {
    setCurrentLocation((prev) => ({
      ...prev,
      ...loc,
      displayText: loc.district?.replace(' District', '') || prev.displayText,
    }));
  };

  return (
    <LocationContext.Provider value={{ currentLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}

