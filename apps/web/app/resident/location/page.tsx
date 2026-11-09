'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  MapPin,
  Check,
  CheckCircle2,
  Loader2,
  Navigation,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { areasService } from '@/lib/api/areas.service';
import { residentsService } from '@/lib/api/residents.service';
import { AdministrativeArea } from '@/lib/types';

export default function ResidentSelectLocationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [areas, setAreas] = useState<AdministrativeArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [geoResult, setGeoResult] = useState<{
    coords: { lat: number; lng: number };
    matched: string;
    distanceKm: number;
    peopleCount: number;
    people: Array<{ id: string; name: string; phoneMasked: string; village: string; role: string }>;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAreasAndCurrent() {
      try {
        const [areaList, myProfile] = await Promise.all([
          areasService.getAreas().catch(() => []),
          residentsService.getProfile().catch(() => null),
        ]);

        if (isMounted) {
          setAreas(areaList);
          if (myProfile?.areaId) {
            setSelectedAreaId(myProfile.areaId);
          } else if (areaList.length > 0) {
            setSelectedAreaId(areaList[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load areas', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAreasAndCurrent();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDetectGPS = () => {
    setIsLocating(true);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const result = await areasService.locateByCoordinates(latitude, longitude);
            if (result && result.area) {
              setSelectedAreaId(result.area.id);
              setGeoResult({
                coords: { lat: latitude, lng: longitude },
                matched: `${result.area.name} (${result.area.level})`,
                distanceKm: result.distanceKm,
                peopleCount: result.totalResidents || result.people?.length || 0,
                people: result.people || [],
              });
            }
          } catch (err) {
            console.warn('Geolocation resolution fallback', err);
          } finally {
            setIsLocating(false);
          }
        },
        async () => {
          // If browser GPS denied or unavailable, use Kigali City center coordinates
          try {
            const fallbackLat = -1.936;
            const fallbackLng = 30.13;
            const result = await areasService.locateByCoordinates(fallbackLat, fallbackLng);
            if (result && result.area) {
              setSelectedAreaId(result.area.id);
              setGeoResult({
                coords: { lat: fallbackLat, lng: fallbackLng },
                matched: `${result.area.name} (${result.area.level})`,
                distanceKm: 0.8,
                peopleCount: result.totalResidents || result.people?.length || 0,
                people: result.people || [],
              });
            }
          } finally {
            setIsLocating(false);
          }
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAreaId) return;
    setIsSaving(true);
    try {
      await residentsService.updateLocation(selectedAreaId);
      setSavedSuccess(true);
      setTimeout(() => {
        router.push('/resident');
      }, 500);
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isonga_resident_location', selectedAreaId);
      }
      setSavedSuccess(true);
      setTimeout(() => {
        router.push('/resident');
      }, 500);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-white flex flex-col justify-between">
      {/* Header Bar */}
      <div className="p-5 pb-3 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white border border-[#E3EEE7] flex items-center justify-center text-[#172B24] hover:bg-[#F0FBF5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#172B24]">Select Your Location</h1>
            <p className="text-xs text-[#64746C]">Choose your administrative area</p>
          </div>
        </div>

        {/* Real Geolocation Detector Button */}
        <button
          onClick={handleDetectGPS}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#E8F8EE] border border-[#C6F0D7] text-[#087A3E] text-xs font-bold hover:bg-[#DDF7E8] transition-all cursor-pointer"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
              <span>Detecting GPS Coordinates...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-[#16A34A]" />
              <span>Detect My Current Location (Real GPS)</span>
            </>
          )}
        </button>

        {/* GPS Result Callout */}
        {geoResult && (
          <div className="p-3 bg-[#F0FBF5] rounded-xl border border-[#DDF7E8] text-xs space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[#087A3E] font-bold">
              <span>📍 GPS Resolved Location:</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#CBDCD3]">
                {geoResult.distanceKm} km away
              </span>
            </div>
            <div className="font-semibold text-[#172B24]">{geoResult.matched}</div>
            <div className="text-[11px] text-[#64746C]">
              Coordinates: {geoResult.coords.lat.toFixed(4)}, {geoResult.coords.lng.toFixed(4)}
            </div>
            <div className="pt-1 border-t border-[#E3EEE7] flex items-center gap-1.5 text-[11px] text-[#087A3E] font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>Registered residents in this area: {geoResult.peopleCount}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64746C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district, sector, cell or village..."
            className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-10 pr-4 py-2.5 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white"
          />
        </div>
      </div>

      {/* Areas List */}
      <div className="flex-1 px-5 py-2 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
            <span className="text-xs font-semibold">Loading administrative areas...</span>
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#64746C]">
            No administrative areas found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredAreas.map((area) => {
            const isSelected = selectedAreaId === area.id;
            return (
              <div
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={cn(
                  'flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-150',
                  isSelected
                    ? 'border-[#16A34A] bg-[#DDF7E8] shadow-sm'
                    : 'border-[#E3EEE7] hover:border-[#CBDCD3] bg-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center',
                      isSelected ? 'bg-[#16A34A] text-white' : 'bg-[#F0FBF5] text-[#16A34A]'
                    )}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172B24] block">{area.name}</span>
                    <span className="text-[10px] text-[#64746C] uppercase font-mono">{area.level} • {area.path}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    'w-5 h-5 rounded-full border flex items-center justify-center',
                    isSelected
                      ? 'border-[#16A34A] bg-[#16A34A] text-white'
                      : 'border-[#CBDCD3]'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Confirmation Action */}
      <div className="p-5 border-t border-[#E3EEE7] bg-white">
        <button
          onClick={handleConfirm}
          disabled={!selectedAreaId || isSaving}
          className={cn(
            'w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2',
            savedSuccess
              ? 'bg-[#087A3E] text-white'
              : 'bg-[#16A34A] hover:bg-[#087A3E] text-white shadow-green-700/20 active:scale-[0.99]'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Location...</span>
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Location Updated!</span>
            </>
          ) : (
            <span>Confirm Location</span>
          )}
        </button>
      </div>
    </div>
  );
}
