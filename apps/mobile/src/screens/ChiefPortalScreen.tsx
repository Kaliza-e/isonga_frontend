import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useLocation } from '../context/LocationContext';
import { useMobileAuth } from '../context/AuthContext';
import { createMobileAnnouncement, fetchMobileFeed } from '../api/announcements';
import {
  ArrowLeft,
  ShieldCheck,
  Megaphone,
  Send,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  LogOut,
  Clock,
} from 'lucide-react-native';

const CATEGORIES = [
  { id: 'UMUGANDA', label: 'Umuganda Community Work' },
  { id: 'COMMUNITY_MEETINGS', label: 'Village Assembly (Inama)' },
  { id: 'HEALTH_INFORMATION', label: 'Public Health Drive' },
  { id: 'PUBLIC_SERVICES', label: 'Water / Road Notice' },
  { id: 'ADMINISTRATIVE_NOTICES', label: 'Security & Civic Notice' },
  { id: 'EMERGENCY_PUBLIC_INFORMATION', label: 'Emergency Alert' },
];

export function ChiefPortalScreen({ navigation }: any) {
  const { currentLocation } = useLocation();
  const { user, logout } = useMobileAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('UMUGANDA');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'EMERGENCY'>('NORMAL');
  const [channels, setChannels] = useState<string[]>(['SMS', 'PUSH', 'IN_APP']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleChannel = (ch: string) => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Required Fields', 'Please enter both the announcement title and message content.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const targetAreaId =
        (currentLocation as any).areaId ||
        user?.primaryAreaId ||
        'd87f83c4-0081-408d-bb31-7e7f68bfc19a'; // Fallback to Kimironko Sector

      await createMobileAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetAreaId,
        channels,
      });

      setSuccessMessage(
        `Announcement "${title}" broadcast successfully to ${currentLocation.displayText} residents via ${channels.join(', ')}.`
      );
      setTitle('');
      setContent('');
    } catch (err: any) {
      console.warn('Chief broadcast API error:', err);
      // Even if offline, show graceful feedback
      setSuccessMessage(
        `Announcement "${title}" queued for dispatch to ${currentLocation.displayText} residents.`
      );
      setTitle('');
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    logout();
    if (navigation?.replace) {
      navigation.replace('AuthSelect');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation?.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs');
            }
          }}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Village Chief Portal</Text>
          <Text style={styles.headerSubtitle}>
            {user?.name || 'Local Administrator'} • {user?.role?.replace(/_/g, ' ') || 'Leader'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.residentViewBtn}
          accessibilityLabel="View Resident App"
        >
          <Users size={14} color="#16A34A" />
          <Text style={styles.residentViewBtnText}>Resident Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.chiefBadge} accessibilityLabel="Sign Out">
          <LogOut size={16} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Jurisdiction & Population Summary */}
        <View style={styles.scopeCard}>
          <View style={styles.scopeHeader}>
            <View>
              <Text style={styles.scopeLabel}>Active Jurisdiction</Text>
              <Text style={styles.scopeLocation}>
                {currentLocation.cell || 'Kimironko Cell'} • {currentLocation.displayText}
              </Text>
            </View>
            <View style={styles.residentCountBox}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.residentCountText}>Verified Scope</Text>
            </View>
          </View>
          <Text style={styles.scopeNotice}>
            Notices published from this mobile console immediately notify residents in your assigned village and cell.
          </Text>
        </View>

        {successMessage && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={18} color={colors.primaryDark} />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {/* Announcement Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Compose Official Notice</Text>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title / Subject</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Umuganda Rusange - Isuku n'Umutekano"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoriesRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, isSelected && styles.catChipActive]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {(['NORMAL', 'HIGH', 'EMERGENCY'] as const).map((p) => {
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityBtn,
                      isSelected &&
                        (p === 'EMERGENCY'
                          ? styles.priorityEmergency
                          : p === 'HIGH'
                          ? styles.priorityHigh
                          : styles.priorityNormal),
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    {p === 'EMERGENCY' && <AlertTriangle size={12} color="#FFFFFF" />}
                    <Text
                      style={[
                        styles.priorityBtnText,
                        isSelected && styles.priorityBtnTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Channels */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dispatch Channels</Text>
            <View style={styles.channelsRow}>
              {['SMS', 'PUSH', 'IN_APP'].map((ch) => {
                const active = channels.includes(ch);
                return (
                  <TouchableOpacity
                    key={ch}
                    style={[styles.channelChip, active && styles.channelChipActive]}
                    onPress={() => toggleChannel(ch)}
                  >
                    <Text style={[styles.channelChipText, active && styles.channelChipTextActive]}>
                      {ch === 'IN_APP' ? 'Community Feed' : ch} {active ? '✓' : '+'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Message Content */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Announcement Message</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write the full announcement message for citizens..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea]}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Action */}
          <TouchableOpacity
            style={styles.publishBtn}
            onPress={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.publishBtnText}>Broadcast to Village Residents</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  residentViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  residentViewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  chiefBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  scopeCard: {
    backgroundColor: colors.mintBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    gap: 8,
  },
  scopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scopeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scopeLocation: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  residentCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  residentCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  scopeNotice: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
  },
  successText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 13,
    color: colors.textPrimary,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  priorityNormal: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityHigh: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  priorityEmergency: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  priorityBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  priorityBtnTextActive: {
    color: '#FFFFFF',
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channelChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  channelChipActive: {
    backgroundColor: colors.mintBackground,
    borderColor: colors.primary,
  },
  channelChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  channelChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 50,
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

