import React, { useState } from 'react';
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
} from 'lucide-react-native';

export function LocationSelectorScreen({ navigation }: any) {
  const { currentLocation, setLocation } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProvince, setExpandedProvince] = useState(true);
  const [expandedDistrict, setExpandedDistrict] = useState(true);
  const [expandedSector, setExpandedSector] = useState(true);
  const [selectedCell, setSelectedCell] = useState(currentLocation.cell || 'Kimironko Cell');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsMatch, setGpsMatch] = useState<string | null>(null);

  const handleDetectGPS = async () => {
    setIsLocating(true);
    setGpsMatch(null);
    try {
      // 1. Request real device geolocation permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      let lat = -1.936;
      let lng = 30.13;

      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } else {
        Alert.alert(
          'Location Permission',
          'Permission not granted. Detecting nearest administrative area using default Rwanda location.'
        );
      }

      // 2. Query Rwanda administrative hierarchy centroid locator with real GPS coords
      const res = await locateByCoordinates(lat, lng);
      if (res && res.area) {
        setSelectedCell(res.area.name);
        const residentCount = typeof res.totalResidents === 'number' ? res.totalResidents : 0;
        setGpsMatch(
          `${res.area.name} (${res.distanceKm ? res.distanceKm + 'km away, ' : ''}${residentCount} registered residents)`
        );

        if (res.ancestors && Array.isArray(res.ancestors)) {
          const provinceName = res.ancestors.find((a: any) => a.level === 'PROVINCE')?.name || currentLocation.province;
          const districtName = res.ancestors.find((a: any) => a.level === 'DISTRICT')?.name || currentLocation.district;
          const sectorName = res.ancestors.find((a: any) => a.level === 'SECTOR')?.name || currentLocation.sector;

          setLocation({
            province: provinceName,
            district: districtName,
            sector: sectorName,
            cell: res.area.name,
            displayText: districtName.replace(' District', ''),
          });
        }
      }
    } catch (err: any) {
      console.warn('Geolocation lookup notice:', err?.message || err);
      Alert.alert(
        'GPS Detection',
        'Could not detect precise satellite coordinates. You can select your village or cell manually below.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await residentsApi.updateLocation(selectedCell);
    } catch {
      // offline/local fallback
    }

    setLocation({
      province: 'Kigali City',
      district: 'Gasabo District',
      sector: 'Kimironko Sector',
      cell: selectedCell,
      displayText: 'Gasabo',
    });
    navigation.goBack();
  };

  const cells = ['Kimironko Cell', 'Gatsata Cell', 'Ndera Cell', 'Kibagabaga Cell'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Select Your Location</Text>
          <Text style={styles.headerSubtitle}>Choose your administrative area</Text>
        </View>
      </View>

      {/* GPS Detector Button */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={handleDetectGPS}
        disabled={isLocating}
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
          <Text style={styles.gpsBannerText}>Matched: {gpsMatch}</Text>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Search size={16} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search area..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {/* Hierarchy Tree */}
      <ScrollView contentContainerStyle={styles.treeContent}>
        {/* Level 1: Kigali City */}
        <TouchableOpacity
          style={styles.treeItem}
          onPress={() => setExpandedProvince(!expandedProvince)}
        >
          <View style={styles.treeItemLeft}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.treeItemText}>Kigali City</Text>
          </View>
          {expandedProvince ? (
            <ChevronDown size={18} color={colors.textSecondary} />
          ) : (
            <ChevronRight size={18} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        {expandedProvince && (
          <View style={styles.indentBlock}>
            {/* Level 2: Gasabo District */}
            <TouchableOpacity
              style={styles.treeItem}
              onPress={() => setExpandedDistrict(!expandedDistrict)}
            >
              <View style={styles.treeItemLeft}>
                <MapPin size={16} color={colors.primary} />
                <Text style={styles.treeItemText}>Gasabo District</Text>
              </View>
              {expandedDistrict ? (
                <ChevronUp size={18} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            {expandedDistrict && (
              <View style={styles.indentBlock}>
                {/* Level 3: Kimironko Sector */}
                <TouchableOpacity
                  style={styles.treeItem}
                  onPress={() => setExpandedSector(!expandedSector)}
                >
                  <View style={styles.treeItemLeft}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.treeItemText}>Kimironko Sector</Text>
                  </View>
                  {expandedSector ? (
                    <ChevronUp size={18} color={colors.textSecondary} />
                  ) : (
                    <ChevronDown size={18} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>

                {expandedSector && (
                  <View style={styles.indentBlock}>
                    {/* Level 4: Cells (with Radio Selectors) */}
                    {cells.map((c) => {
                      const isSelected = selectedCell === c;
                      return (
                        <TouchableOpacity
                          key={c}
                          style={[styles.cellRow, isSelected && styles.cellRowSelected]}
                          onPress={() => setSelectedCell(c)}
                        >
                          <View style={styles.treeItemLeft}>
                            <MapPin
                              size={15}
                              color={isSelected ? colors.primary : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.cellText,
                                isSelected && styles.cellTextSelected,
                              ]}
                            >
                              {c}
                            </Text>
                          </View>

                          {/* Radio Icon */}
                          <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                            {isSelected && <View style={styles.radioDot} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* Other Districts */}
            <TouchableOpacity style={styles.treeItem}>
              <View style={styles.treeItemLeft}>
                <MapPin size={16} color={colors.primary} />
                <Text style={styles.treeItemText}>Kicukiro District</Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.treeItem}>
              <View style={styles.treeItemLeft}>
                <MapPin size={16} color={colors.primary} />
                <Text style={styles.treeItemText}>Nyarugenge District</Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
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
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  treeContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 8,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  treeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  treeItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  indentBlock: {
    paddingLeft: 18,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.border,
    marginLeft: 12,
    gap: 4,
  },
  cellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  cellRowSelected: {
    backgroundColor: colors.mintBackground,
  },
  cellText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  cellTextSelected: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  gpsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  gpsBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

