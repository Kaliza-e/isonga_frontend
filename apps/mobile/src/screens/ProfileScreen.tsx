import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { SEEDED_ACCOUNTS } from '../data/seededData';
import {
  ArrowLeft,
  Settings,
  Camera,
  MapPin,
  Megaphone,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  ShieldCheck,
  Users,
  Sparkles,
  RefreshCw,
} from 'lucide-react-native';

export function ProfileScreen({ navigation }: any) {
  const { user, logout, updateConsent, toggleLanguage, loginSeeded } = useMobileAuth();
  const { currentLocation } = useLocation();

  const isAdmin = user?.role && ['CELL_ADMIN', 'SECTOR_ADMIN', 'DISTRICT_ADMIN', 'SUPER_ADMIN'].includes(user.role);

  const handleSwitchAccount = () => {
    if (isAdmin) {
      // Switch to Resident
      loginSeeded('RESIDENT');
      Alert.alert('Account Switched', 'Switched to Community Resident (Jean-Luc Mugisha).');
    } else {
      // Switch to Administrator
      loginSeeded('ADMIN');
      Alert.alert('Account Switched', 'Switched to Local Administrator (Esther Kaliza).');
      navigation.navigate('ChiefPortal');
    }
  };

  const handleLogout = () => {
    logout();
    if (navigation?.replace) {
      navigation.replace('AuthSelect');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {navigation?.canGoBack && navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Settings size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar & Personal Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Camera size={14} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'Resident User'}</Text>
          <Text style={styles.userPhone}>{user?.phone || 'Verified Resident'}</Text>

          {/* Active Role Badge */}
          <View style={[styles.activeRoleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeResident]}>
            {isAdmin ? (
              <>
                <ShieldCheck size={12} color="#D97706" />
                <Text style={styles.roleBadgeAdminText}>Authorized Local Administrator</Text>
              </>
            ) : (
              <>
                <Users size={12} color="#16A34A" />
                <Text style={styles.roleBadgeResidentText}>Verified Community Resident</Text>
              </>
            )}
          </View>

          {/* Quick Seeded Switcher */}
          <TouchableOpacity
            style={styles.switchAccountCard}
            onPress={handleSwitchAccount}
            activeOpacity={0.85}
          >
            <View style={styles.switchAccountLeft}>
              <View style={styles.switchIconWrap}>
                <Sparkles size={14} color="#047857" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchAccountTitle}>
                  {isAdmin ? 'Switch to Resident (Test Mode)' : 'Switch to Administrator (Chief)'}
                </Text>
                <Text style={styles.switchAccountSub}>
                  {isAdmin
                    ? `Test as ${SEEDED_ACCOUNTS.RESIDENT.name} (Citizen)`
                    : `Test as ${SEEDED_ACCOUNTS.ADMIN.name} (Broadcasting Leader)`}
                </Text>
              </View>
            </View>
            <RefreshCw size={15} color="#047857" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {/* Village Chief Portal */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 }]}
            onPress={() => navigation.navigate('ChiefPortal')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <ShieldCheck size={18} color="#15803D" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: '#166534', fontWeight: '800' }]}>Village Chief Portal</Text>
                <Text style={styles.menuSubtitle}>
                  Umukuru w&apos;Umudugudu broadcasting console
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#15803D" />
          </TouchableOpacity>

          {/* My Location */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LocationSelector')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: colors.mintBackground }]}>
                <MapPin size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuTitle}>My Location</Text>
                <Text style={styles.menuSubtitle}>
                  {currentLocation.displayText}, {currentLocation.sector.replace(' Sector', '')}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Notification Preferences */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F0F9FF' }]}>
                <Megaphone size={18} color={colors.info} />
              </View>
              <Text style={styles.menuTitle}>Notification Preferences</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Language Toggle */}
          <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <Globe size={18} color={colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Language</Text>
                <Text style={styles.menuSubtitle}>
                  {user?.language === 'rw' ? 'Kinyarwanda' : 'English'}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Privacy Consent (Law N° 058/2021) */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: colors.mintBackground }]}>
                <ShieldCheck size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.menuTitle}>Law N° 058/2021 Privacy</Text>
                <Text style={styles.menuSubtitle}>Masked phone & opt-in updates</Text>
              </View>
            </View>
            <Switch
              value={user?.consentLaw058 ?? true}
              onValueChange={updateConsent}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'Isonga Connect Support\nEmail: support@isonga.gov.rw\nHotline: 114 (Emergency Free Dial)'
              )
            }
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#FAF5FF' }]}>
                <HelpCircle size={18} color="#A855F7" />
              </View>
              <Text style={styles.menuTitle}>Help & Support</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* About Isonga Connect */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'About Isonga Connect',
                'Isonga Connect (Isonga C) v1.0.0\nYour community. Your updates.\nRepublic of Rwanda Civic Communication Network.'
              )
            }
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Info size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>About Isonga Connect</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingBottom: 12,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 8,
  },
  roleBadgeAdmin: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  roleBadgeAdminText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  roleBadgeResident: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  roleBadgeResidentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  switchAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    width: '100%',
  },
  switchAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  switchIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchAccountTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  switchAccountSub: {
    fontSize: 10,
    color: '#15803D',
    marginTop: 1,
  },
  menuList: {
    gap: 8,
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  logoutButton: {
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});

