import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { Announcement } from '../types';
import { fetchMobileFeed } from '../api/announcements';
import { ArrowLeft, SlidersHorizontal, Calendar, MapPin } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'HEALTH_INFORMATION', label: 'Health' },
  { id: 'COMMUNITY_EVENTS', label: 'Events' },
  { id: 'ADMINISTRATIVE_NOTICES', label: 'Notices' },
  { id: 'EDUCATION', label: 'Education' },
  { id: 'UMUGANDA', label: 'Umuganda' },
];

export function AnnouncementsScreen({ navigation }: any) {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchMobileFeed().then(setAnnouncements);
  }, []);

  const filtered = announcements.filter((item) => {
    if (selectedCat === 'ALL') return true;
    if (selectedCat === 'COMMUNITY_EVENTS' && item.category === 'UMUGANDA') return true;
    return item.category === selectedCat;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {navigation?.canGoBack && navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Announcements</Text>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Categories Filter Bar */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCat(cat.id)}
              >
                <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Announcements List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
            activeOpacity={0.85}
          >
            <View style={styles.info}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.category === 'UMUGANDA'
                    ? 'Community Event'
                    : item.category.replace(/_/g, ' ')}
                </Text>
              </View>

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <View style={styles.metaRow}>
                <Calendar size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>Mar 15, 2025 • 8:00 AM</Text>
              </View>

              <View style={styles.metaRow}>
                <MapPin size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{item.targetAreaName || 'Gasabo Sector'}</Text>
              </View>
            </View>

            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  filterButton: {
    padding: 6,
  },
  categoriesWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 5,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },
});

