'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ChevronRight,
  Search,
  Users,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { areasService } from '@/lib/api/areas.service';
import { AdministrativeArea } from '@/lib/types';

export default function AdministrativeAreasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [areas, setAreas] = useState<AdministrativeArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAreas() {
      try {
        const data = await areasService.getAreas();
        if (isMounted) {
          setAreas(data);
          if (data.length > 0) {
            setSelectedAreaId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load administrative areas', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAreas();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || areas[0];
  const subordinates = selectedArea ? areas.filter((a) => a.parentId === selectedArea.id) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#172B24]">
          Administrative Areas & Geography
        </h1>
        <p className="text-xs text-[#64746C] mt-0.5">
          Rwanda 6-tier administrative hierarchy with materialized path subtree indexing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Administrative Hierarchy Tree */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geographical Tree Explorer</CardTitle>
            <span className="text-xs text-[#64746C]">6 levels: Country &rarr; Village</span>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#64746C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, sector, cell or village..."
                className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-9 pr-4 py-2 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white"
              />
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-[#64746C] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
                <span className="text-xs font-semibold">Loading administrative hierarchy...</span>
              </div>
            ) : areas.length === 0 ? (
              <div className="p-12 text-center text-[#64746C] text-xs">
                No administrative areas configured in database.
              </div>
            ) : (
              <div className="space-y-1.5 pt-2 max-h-[500px] overflow-y-auto">
                {areas.filter((a) =>
                  a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.level.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((area) => {
                  const isSelected = selectedArea?.id === area.id;
                  const indentLevels: Record<string, string> = {
                    COUNTRY: 'pl-2',
                    PROVINCE: 'pl-6',
                    DISTRICT: 'pl-10',
                    SECTOR: 'pl-14',
                    CELL: 'pl-18',
                    VILLAGE: 'pl-22',
                  };

                  return (
                    <div
                      key={area.id}
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        indentLevels[area.level] || 'pl-2'
                      } ${
                        isSelected
                          ? 'bg-[#DDF7E8] text-[#087A3E] font-bold border border-[#CBDCD3]'
                          : 'hover:bg-[#F0FBF5] text-[#172B24]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#16A34A]' : 'text-[#64746C]'}`} />
                        <span className="text-xs">{area.name}</span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-white border border-[#CBDCD3] text-[#64746C]">
                          {area.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#64746C]">
                        {area.residentCount !== undefined && (
                          <span className="text-[11px] font-mono">{area.residentCount.toLocaleString()} res</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Area Details & Subordinate Breakdown */}
        <div className="space-y-4">
          {selectedArea ? (
            <Card>
              <CardHeader>
                <div className="space-y-0.5">
                  <CardTitle>{selectedArea.name}</CardTitle>
                  <span className="text-[11px] font-mono text-[#64746C]">{selectedArea.code}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#DDF7E8] text-[#087A3E]">
                  {selectedArea.level}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64746C]">Hierarchical Path:</span>
                    <span className="font-mono text-[11px] text-[#172B24] font-semibold">{selectedArea.path}</span>
                  </div>
                  {selectedArea.residentCount !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#64746C]">Estimated Population:</span>
                      <span className="font-bold text-[#087A3E]">{selectedArea.residentCount.toLocaleString()} residents</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#172B24] mb-2">Direct Subordinates ({subordinates.length})</h4>
                  {subordinates.length === 0 ? (
                    <p className="text-xs text-[#64746C]">No direct subordinate areas under this level.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {subordinates.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedAreaId(sub.id)}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3EEE7] hover:border-[#16A34A] cursor-pointer text-xs transition-colors"
                        >
                          <span className="font-medium text-[#172B24]">{sub.name}</span>
                          <span className="text-[10px] text-[#64746C] uppercase font-mono">{sub.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-xs text-[#64746C]">
                Select an area to view details
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#172B24] block">Authority Scoping Protocol</span>
                <p className="text-[#64746C] leading-relaxed">
                  Broadcasts targeted to higher levels automatically cascade to subordinate levels when &ldquo;Include Subordinates&rdquo; is checked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
