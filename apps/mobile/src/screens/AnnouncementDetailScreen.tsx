import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { colors } from '../theme/colors';
import { Announcement } from '../types';
import {
  ArrowLeft,
  Share2,
  Calendar,
  MapPin,
  User,
  Info,
} from 'lucide-react-native';

export function AnnouncementDetailScreen({ route, navigation }: any) {
  const announcement: Announcement = route?.params?.announcement || {
    id: '',
    title: 'Announcement Details',
    content: 'No content available for this notice.',
    category: 'ADMINISTRATIVE_NOTICES',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    targetAreaName: 'Community Scope',
    authorName: 'Authorized Local Authority',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: announcement.title,
        message: `${announcement.title}\n\n${announcement.content}\n\nFrom: ${announcement.authorName || 'Local Authority'}\nIsonga Connect (Isonga C)`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
          <Share2 size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cover Photo */}
        {announcement.imageUrl && (
          <Image source={{ uri: announcement.imageUrl }} style={styles.coverImage} />
        )}

        <View style={styles.body}>
          {/* Category Tag */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {announcement.category === 'UMUGANDA'
                ? 'Community Event'
                : announcement.category.replace(/_/g, ' ')}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{announcement.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{announcement.content}</Text>

          {/* Metadata Section */}
          <View style={styles.metadataCard}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.metaItemText}>Mar 15, 2025 • 8:00 AM</Text>
            </View>

            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.metaItemText}>
                {announcement.targetAreaName || 'Kimironko Sector'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <User size={16} color={colors.primary} />
              <Text style={styles.metaItemText}>
                From: {announcement.authorName || 'Gasabo District (Local Authority)'}
              </Text>
            </View>
          </View>

          {/* Info Callout Box */}
          <View style={styles.callout}>
            <Info size={18} color={colors.primaryDark} style={styles.calloutIcon} />
            <Text style={styles.calloutText}>
              Bring your tools and let&apos;s make our community cleaner together!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share Announcement</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerBtn: {
    padding: 6,
  },
  content: {
    paddingBottom: 100,
  },
  coverImage: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: 20,
    gap: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  metadataCard: {
    gap: 10,
    marginVertical: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  calloutIcon: {
    marginRight: 10,
  },
  calloutText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
    lineHeight: 18,
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
  shareButton: {
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
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

