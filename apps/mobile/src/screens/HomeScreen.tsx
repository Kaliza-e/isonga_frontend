import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Announcement } from '../types';
import { fetchMobileFeed } from '../api/announcements';
import {
  MapPin,
  Bell,
  ChevronDown,
  Megaphone,
  ArrowRight,
  Calendar,
  ShieldCheck,
} from 'lucide-react-native';

export function HomeScreen({ navigation }: any) {
  const { user } = useMobileAuth();
  const { currentLocation } = useLocation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchMobileFeed().then(setAnnouncements);
  }, []);

  const featured = announcements[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top App Header */}
      <View style={styles.headerRow}>
        {/* Location Dropdown Pill */}
        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => navigation.navigate('LocationSelector')}
        >
          <MapPin size={14} color={colors.primary} />
          <Text style={styles.locationText}>{currentLocation.displayText}</Text>
          <ChevronDown size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Right Actions: Notifications & Avatar */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={18} color={colors.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting Banner */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>
          Hello, {user?.name?.split(' ')[0] || 'Resident'} 👋
        </Text>
        <Text style={styles.greetingSubtitle}>Stay informed, stay connected.</Text>
      </View>

      {/* Village Chief / Local Leader Portal Callout */}
      <TouchableOpacity
        style={styles.chiefCard}
        onPress={() => navigation.navigate('ChiefPortal')}
        activeOpacity={0.85}
      >
        <View style={styles.chiefIconBox}>
          <ShieldCheck size={22} color={colors.primary} />
        </View>
        <View style={styles.chiefTextBox}>
          <Text style={styles.chiefTitle}>Village Chief Portal</Text>
          <Text style={styles.chiefSubtitle}>
            Umukuru w&apos;Umudugudu • Post announcements to {currentLocation.displayText}
          </Text>
        </View>
        <ArrowRight size={16} color={colors.primary} />
      </TouchableOpacity>

      {/* Hero Featured Card */}
      {featured && (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => navigation.navigate('AnnouncementDetail', { announcement: featured })}
          activeOpacity={0.9}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTagRow}>
              <Megaphone size={14} color="#FFFFFF" />
              <Text style={styles.heroTag}>New Announcement</Text>
            </View>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroTime}>2h ago</Text>
          </View>

          <View style={styles.heroArrowCircle}>
            <ArrowRight size={16} color={colors.primaryDark} />
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {/* Action 1: View Announcements */}
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Announcements')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: colors.mintBackground }]}>
              <Megaphone size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>View{'\n'}Announcements</Text>
          </TouchableOpacity>

          {/* Action 2: Update Location */}
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('LocationSelector')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: colors.infoLight }]}>
              <MapPin size={20} color={colors.info} />
            </View>
            <Text style={styles.quickActionLabel}>Update{'\n'}Location</Text>
          </TouchableOpacity>

          {/* Action 3: Manage Notifications */}
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <Bell size={20} color="#9333EA" />
            </View>
            <Text style={styles.quickActionLabel}>Manage{'\n'}Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Latest Announcements Section */}
      <View style={styles.latestSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
            <Text style={styles.seeAllText}>See all &rarr;</Text>
          </TouchableOpacity>
        </View>

        {announcements.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.announcementCard}
            onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
            activeOpacity={0.85}
          >
            <View style={styles.announcementInfo}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {item.category === 'UMUGANDA' ? 'Community Event' : item.category.replace(/_/g, ' ')}
                </Text>
              </View>

              <Text style={styles.announcementTitle} numberOfLines={2}>
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
              <Image source={{ uri: item.imageUrl }} style={styles.announcementThumbnail} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.mintBackground,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notifBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute',
    top: 6,
    right: 7,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  greetingSection: {
    marginBottom: 18,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chiefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  chiefIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chiefTextBox: {
    flex: 1,
  },
  chiefTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  chiefSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 24,
  },
  heroContent: {
    flex: 1,
    gap: 4,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTag: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.9,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 2,
  },
  heroTime: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.75,
  },
  heroArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
  latestSection: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'center',
  },
  announcementInfo: {
    flex: 1,
    gap: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.info,
    textTransform: 'uppercase',
  },
  announcementTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  announcementThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
});

