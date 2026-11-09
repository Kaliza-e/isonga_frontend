import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { NotificationItem } from '../types';
import { notificationsApi, FALLBACK_NOTIFICATIONS } from '../api/notifications';
import { Bell, ArrowLeft } from 'lucide-react-native';

export function NotificationsScreen({ navigation }: any) {
  const [filter, setFilter] = useState<'ALL' | 'DELIVERED' | 'FAILED'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>(FALLBACK_NOTIFICATIONS);

  useEffect(() => {
    notificationsApi.getNotifications().then((data) => {
      if (data && data.length > 0) {
        setNotifications(data);
      }
    });
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.status === filter;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {navigation?.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.iconWrap}>
            <Bell size={18} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Bell size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'DELIVERED', 'FAILED'] as const).map((tab) => {
          const isActive = filter === tab;
          const label = tab === 'ALL' ? 'All' : tab === 'DELIVERED' ? 'Delivered' : 'Failed';
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setFilter(tab)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.filterPillTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((item) => {
          const isDelivered = item.status === 'DELIVERED';
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                {/* Dot indicator */}
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isDelivered ? colors.primary : colors.danger },
                  ]}
                />
                <View style={styles.itemTexts}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemTime}>{item.timeAgo}</Text>
                </View>
              </View>

              {/* Status Badge */}
              <View
                style={[
                  styles.statusBadge,
                  isDelivered ? styles.badgeDelivered : styles.badgeFailed,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isDelivered ? styles.badgeTextDelivered : styles.badgeTextFailed,
                  ]}
                >
                  {isDelivered ? 'Delivered' : 'Failed'}
                </Text>
              </View>
            </View>
          );
        })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bellBtn: {
    padding: 6,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemTexts: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDelivered: {
    backgroundColor: colors.primaryLight,
  },
  badgeFailed: {
    backgroundColor: colors.dangerLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextDelivered: {
    color: colors.primaryDark,
  },
  badgeTextFailed: {
    color: colors.danger,
  },
});

