import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Provinces, Districts, Sectors, Cells, Villages } from 'rwanda';
import { colors } from '../theme/colors';
import { useLocation } from '../context/LocationContext';
import { residentsApi } from '../api/residents';
import { locateByCoordinates } from '../api/areas';
import {
  ArrowLeft,
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Navigation,
  Users,
  Check,
} from 'lucide-react-native';

export function LocationSelectorScreen({ navigation }: any) {
  const { currentLocation, setLocation } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Kigali');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Gasabo');
  const [selectedSector, setSelectedSector] = useState<string>('Kimironko');
  const [selectedCell, setSelectedCell] = useState<string>(currentLocation.cell || 'Kibagabaga');
  const [selectedVillage, setSelectedVillage] = useState<string>(currentLocation.village || 'Ramiro');

  const [expandedSection, setExpandedSection] = useState<'province' | 'district' | 'sector' | 'cell' | 'village'>('cell');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsMatch, setGpsMatch] = useState<string | null>(null);

  // Provinces list from official Rwanda geodata
  const allProvinces = useMemo(() => {
    try {
      return Provinces() || ['Kigali', 'East', 'North', 'South', 'West'];
    } catch {
      return ['Kigali', 'East', 'North', 'South', 'West'];
    }
  }, []);

  // Districts in selected province
  const districtsInProvince = useMemo(() => {
    try {
      return Districts({ provinces: selectedProvince as any }) || [];
    } catch {
      return [];
    }
  }, [selectedProvince]);

  // Sectors in selected district
  const sectorsInDistrict = useMemo(() => {
    try {
      return Sectors({ province: selectedProvince as any, district: selectedDistrict as any }) || [];
    } catch {
      return [];
    }
  }, [selectedProvince, selectedDistrict]);

  // Cells in selected sector
  const cellsInSector = useMemo(() => {
    try {
      return Cells({ province: selectedProvince as any, district: selectedDistrict as any, sector: selectedSector as any }) || [];
    } catch {
      return [];
    }
  }, [selectedProvince, selectedDistrict, selectedSector]);

  // Villages in selected cell
  const villagesInCell = useMemo(() => {
    try {
      return Villages({
        province: selectedProvince as any,
        district: selectedDistrict as any,
        sector: selectedSector as any,
        cell: selectedCell as any,
      }) || [];
    } catch {
      return [];
    }
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell]);

  const handleDetectGPS = async () => {
    setIsLocating(true);
    setGpsMatch(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = -1.936;
      let lng = 30.13;

      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }

      // Query real administrative centroid lookup
      const res = await locateByCoordinates(lat, lng);
      if (res && res.area) {
        const areaName = res.area.name;
        setGpsMatch(`${areaName} (${res.distanceKm ? res.distanceKm + 'km' : 'Identified GPS'})`);

        if (res.ancestors && Array.isArray(res.ancestors)) {
          const prov = res.ancestors.find((a: any) => a.level === 'PROVINCE')?.name || 'Kigali';
          const dist = res.ancestors.find((a: any) => a.level === 'DISTRICT')?.name || 'Gasabo';
          const sect = res.ancestors.find((a: any) => a.level === 'SECTOR')?.name || 'Kimironko';

          setSelectedProvince(prov.replace(' City', '').replace(' Province', ''));
          setSelectedDistrict(dist.replace(' District', ''));
          setSelectedSector(sect.replace(' Sector', ''));
          setSelectedCell(areaName.replace(' Cell', ''));
        }
      }
    } catch (err: any) {
      console.warn('GPS detection notice:', err?.message || err);
    } finally {
      setIsLocating(false);
    }
  };

  const handleConfirm = async () => {
    const provinceDisplay = selectedProvince.includes('Kigali') ? 'Kigali City' : `${selectedProvince} Province`;
    const districtDisplay = `${selectedDistrict} District`;
    const sectorDisplay = `${selectedSector} Sector`;
    const cellDisplay = `${selectedCell} Cell`;
    const villageDisplay = `${selectedVillage} Village`;

    try {
      await residentsApi.updateLocation(cellDisplay);
    } catch {}

    setLocation({
      province: provinceDisplay,
      district: districtDisplay,
      sector: sectorDisplay,
      cell: cellDisplay,
      village: villageDisplay,
      displayText: selectedDistrict,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Select Your Location</Text>
          <Text style={styles.headerSubtitle}>Rwanda Administrative Hierarchy (NISR)</Text>
        </View>
      </View>

      {/* GPS Detector Button */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={handleDetectGPS}
        disabled={isLocating}
        activeOpacity={0.85}
      >
        {isLocating ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Navigation size={16} color={colors.primary} />
        )}
        <Text style={styles.gpsButtonText}>
          {isLocating ? 'Detecting Real GPS Location...' : 'Detect My Real Location (GPS)'}
        </Text>
      </TouchableOpacity>

      {gpsMatch && (
        <View style={styles.gpsBanner}>
          <Users size={14} color={colors.primaryDark} />
          <Text style={styles.gpsBannerText}>GPS Match: {gpsMatch}</Text>
        </View>
      )}

      {/* Current Selection Pill Row */}
      <View style={styles.selectionSummary}>
        <Text style={styles.summaryLabel}>Selected Area:</Text>
        <Text style={styles.summaryValue}>
          {selectedDistrict} &gt; {selectedSector} &gt; {selectedCell} &gt; {selectedVillage}
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Search size={16} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter by cell or village name..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {/* Hierarchy Selector ScrollView */}
      <ScrollView contentContainerStyle={styles.treeContent} showsVerticalScrollIndicator={false}>
        {/* Level 1: Province */}
        <TouchableOpacity
          style={styles.treeHeader}
          onPress={() => setExpandedSection(expandedSection === 'province' ? 'district' : 'province')}
        >
          <View style={styles.treeHeaderLeft}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.treeHeaderText}>Province: {selectedProvince}</Text>
          </View>
          {expandedSection === 'province' ? <ChevronUp size={18} color="#64746C" /> : <ChevronDown size={18} color="#64746C" />}
        </TouchableOpacity>

        {expandedSection === 'province' && (
          <View style={styles.chipsRow}>
            {allProvinces.map((prov: string) => (
              <TouchableOpacity
                key={prov}
                style={[styles.chip, selectedProvince === prov && styles.chipActive]}
                onPress={() => {
                  setSelectedProvince(prov);
                  const firstDist = Districts({ provinces: prov as any })?.[0] || '';
                  setSelectedDistrict(firstDist);
                  setExpandedSection('district');
                }}
              >
                <Text style={[styles.chipText, selectedProvince === prov && styles.chipTextActive]}>
                  {prov}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Level 2: District */}
        <TouchableOpacity
          style={styles.treeHeader}
          onPress={() => setExpandedSection(expandedSection === 'district' ? 'sector' : 'district')}
        >
          <View style={styles.treeHeaderLeft}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.treeHeaderText}>District: {selectedDistrict}</Text>
          </View>
          {expandedSection === 'district' ? <ChevronUp size={18} color="#64746C" /> : <ChevronDown size={18} color="#64746C" />}
        </TouchableOpacity>

        {expandedSection === 'district' && (
          <View style={styles.chipsRow}>
            {districtsInProvince.map((dist: string) => (
              <TouchableOpacity
                key={dist}
                style={[styles.chip, selectedDistrict === dist && styles.chipActive]}
                onPress={() => {
                  setSelectedDistrict(dist);
                  const firstSect = Sectors({ province: selectedProvince as any, district: dist as any })?.[0] || '';
                  setSelectedSector(firstSect);
                  setExpandedSection('sector');
                }}
              >
                <Text style={[styles.chipText, selectedDistrict === dist && styles.chipTextActive]}>
                  {dist}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Level 3: Sector */}
        <TouchableOpacity
          style={styles.treeHeader}
          onPress={() => setExpandedSection(expandedSection === 'sector' ? 'cell' : 'sector')}
        >
          <View style={styles.treeHeaderLeft}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.treeHeaderText}>Sector: {selectedSector}</Text>
          </View>
          {expandedSection === 'sector' ? <ChevronUp size={18} color="#64746C" /> : <ChevronDown size={18} color="#64746C" />}
        </TouchableOpacity>

        {expandedSection === 'sector' && (
          <View style={styles.chipsRow}>
            {sectorsInDistrict.map((sect: string) => (
              <TouchableOpacity
                key={sect}
                style={[styles.chip, selectedSector === sect && styles.chipActive]}
                onPress={() => {
                  setSelectedSector(sect);
                  const firstCell = Cells({ province: selectedProvince as any, district: selectedDistrict as any, sector: sect as any })?.[0] || '';
                  setSelectedCell(firstCell);
                  setExpandedSection('cell');
                }}
              >
                <Text style={[styles.chipText, selectedSector === sect && styles.chipTextActive]}>
                  {sect}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Level 4: Cell (Akagari) */}
        <TouchableOpacity
          style={styles.treeHeader}
          onPress={() => setExpandedSection(expandedSection === 'cell' ? 'village' : 'cell')}
        >
          <View style={styles.treeHeaderLeft}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.treeHeaderText}>Cell (Akagari): {selectedCell}</Text>
          </View>
          {expandedSection === 'cell' ? <ChevronUp size={18} color="#64746C" /> : <ChevronDown size={18} color="#64746C" />}
        </TouchableOpacity>

        {expandedSection === 'cell' && (
          <View style={styles.listBlock}>
            {cellsInSector
              .filter((c: string) => !searchQuery.trim() || c.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((c: string) => {
                const isSelected = selectedCell === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cellListItem, isSelected && styles.cellListItemActive]}
                    onPress={() => {
                      setSelectedCell(c);
                      const v = Villages({
                        province: selectedProvince as any,
                        district: selectedDistrict as any,
                        sector: selectedSector as any,
                        cell: c as any,
                      })?.[0] || 'Center';
                      setSelectedVillage(v);
                      setExpandedSection('village');
                    }}
                  >
                    <Text style={[styles.cellListName, isSelected && styles.cellListNameActive]}>
                      {c} Cell
                    </Text>
                    {isSelected && <Check size={16} color="#16A34A" />}
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* Level 5: Village (Umudugudu) */}
        <TouchableOpacity
          style={styles.treeHeader}
          onPress={() => setExpandedSection(expandedSection === 'village' ? 'cell' : 'village')}
        >
          <View style={styles.treeHeaderLeft}>
            <Users size={16} color={colors.primary} />
            <Text style={styles.treeHeaderText}>Village (Umudugudu): {selectedVillage}</Text>
          </View>
          {expandedSection === 'village' ? <ChevronUp size={18} color="#64746C" /> : <ChevronDown size={18} color="#64746C" />}
        </TouchableOpacity>

        {expandedSection === 'village' && (
          <View style={styles.listBlock}>
            {villagesInCell
              .filter((v: string) => !searchQuery.trim() || v.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((v: string) => {
                const isSelected = selectedVillage === v;
                return (
                  <TouchableOpacity
                    key={v}
                    style={[styles.cellListItem, isSelected && styles.cellListItemActive]}
                    onPress={() => setSelectedVillage(v)}
                  >
                    <Text style={[styles.cellListName, isSelected && styles.cellListNameActive]}>
                      {v} Village
                    </Text>
                    {isSelected && <Check size={16} color="#16A34A" />}
                  </TouchableOpacity>
                );
              })}
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.88}>
          <Text style={styles.confirmBtnText}>Confirm Location Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172B24',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64746C',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 14,
  },
  gpsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
  },
  gpsBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  selectionSummary: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#172B24',
  },
  treeContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 8,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  treeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  treeHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#172B24',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cellListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cellListItemActive: {
    backgroundColor: '#F0FDF4',
  },
  cellListName: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  cellListNameActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
