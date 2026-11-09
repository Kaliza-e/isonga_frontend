'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { maskPhone } from '@/lib/utils';
import { residentsService, ResidentListItem } from '@/lib/api/residents.service';
import { areasService } from '@/lib/api/areas.service';
import { AdministrativeArea } from '@/lib/types';

export default function ResidentsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [villages, setVillages] = useState<AdministrativeArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [resList, areaList] = await Promise.all([
          residentsService.getResidents().catch(() => ({ items: [], total: 0 })),
          areasService.getAreas({ level: 'VILLAGE' }).catch(() => []),
        ]);
        if (isMounted) {
          setResidents(resList.items);
          setVillages(areaList);
        }
      } catch (err) {
        console.error('Failed to load residents from backend API', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = residents.filter((r) => {
    const matchesVillage = selectedVillage === 'ALL' || r.village === selectedVillage;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.village && r.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.cell && r.cell.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesVillage && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B24]">
            Resident Directory
          </h1>
          <p className="text-xs text-[#64746C] mt-0.5">
            Registered residents within your authorized jurisdiction • Privacy protected per Rwanda Law N° 058/2021
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-[#DDF7E8] text-[#087A3E] rounded-xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Phone numbers masked for data privacy</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#64746C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by resident name or village..."
              className="w-full bg-[#F0FBF5] rounded-xl border border-[#E3EEE7] pl-9 pr-4 py-2 text-xs text-[#172B24] placeholder:text-[#94A39B] focus:outline-none focus:border-[#16A34A] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#64746C] shrink-0" />
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="bg-[#F0FBF5] border border-[#E3EEE7] rounded-xl px-3 py-2 text-xs text-[#172B24] focus:outline-none focus:border-[#16A34A]"
            >
              <option value="ALL">All Villages (Imidugudu)</option>
              {villages.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Table */}
        {isLoading ? (
          <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
            <span className="text-xs font-semibold">Loading residents from backend database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-[#64746C]">
            <Users className="w-8 h-8 text-[#94A39B] mx-auto mb-2" />
            <div className="font-semibold text-sm text-[#172B24]">No residents found</div>
            <p className="text-xs text-[#64746C] mt-1">
              No registered residents found matching your filter in this administrative jurisdiction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-[#E3EEE7]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0FBF5] border-b border-[#E3EEE7] text-[#64746C] font-semibold">
                <tr>
                  <th className="px-5 py-3">Resident</th>
                  <th className="px-4 py-3">Masked Contact</th>
                  <th className="px-4 py-3">Administrative Location</th>
                  <th className="px-4 py-3">OTP Verification</th>
                  <th className="px-4 py-3">Data Consent</th>
                  <th className="px-4 py-3">Active Channels</th>
                  <th className="px-5 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EEE7] text-[#172B24]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F0FBF5]/50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-[#172B24]">{r.name}</div>
                      <div className="text-[10px] text-[#64746C]">{r.id}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-[#172B24]">
                      {maskPhone(r.phone)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-[#172B24]">
                        <MapPin className="w-3 h-3 text-[#16A34A]" />
                        <span>{r.village}</span>
                      </div>
                      <div className="text-[10px] text-[#64746C]">
                        {r.cell} Cell • {r.sector} Sector
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {r.phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#087A3E]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B91C1C]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {r.consentGiven ? (
                        <Badge variant="success">Consent Given</Badge>
                      ) : (
                        <Badge variant="error">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {r.channels?.map((ch) => (
                          <span
                            key={ch}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F0FBF5] border border-[#CBDCD3] text-[#087A3E]"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => alert(`Inspecting resident ${r.name} (${maskPhone(r.phone)}). Location: ${r.village}.`)}
                        className="p-1.5 rounded-lg border border-[#E3EEE7] text-[#64746C] hover:text-[#16A34A] hover:bg-[#F0FBF5] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
