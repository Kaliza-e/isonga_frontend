import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { IsongaLogo } from '../components/Logo';
import { useMobileAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react-native';

export function AuthSelectScreen({ navigation }: any) {
  const { loginSeeded } = useMobileAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <IsongaLogo size={58} />
        </View>

        <Text style={styles.title}>Isonga Connect</Text>
        <Text style={styles.motto}>Guhuza Abaturage n&apos;Ubuyobozi</Text>
        <Text style={styles.tagline}>
          Select your portal access method below
        </Text>
      </View>

      {/* ═══════════════════════════════════════════════════ */}
      {/* OPTION 1: COMMUNITY RESIDENT (Abaturage)             */}
      {/* ═══════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.residentIconWrap}>
            <Users size={22} color="#15803D" />
          </View>
          <View style={styles.cardHeaderMeta}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.cardTitle}>Community Resident</Text>
              <View style={styles.publicBadge}>
                <Text style={styles.publicBadgeText}>Public</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Receive verified village &amp; cell announcements, Umuganda schedules, and health alerts.
            </Text>
          </View>
        </View>

        {/* Buttons Group: Properly aligned & centered */}
        <View style={styles.buttonGroup}>
          {/* Primary: Resident Sign In */}
          <TouchableOpacity
            style={styles.residentSignInBtn}
            onPress={() => navigation.navigate('Login', { defaultRole: 'RESIDENT' })}
            activeOpacity={0.88}
          >
            <LogIn size={18} color="#FFFFFF" />
            <Text style={styles.residentSignInBtnText}>Resident Sign In</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Secondary: Create Account */}
          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={() => navigation.navigate('ResidentRegister')}
            activeOpacity={0.85}
          >
            <UserPlus size={16} color="#15803D" />
            <Text style={styles.createAccountBtnText}>Create New Resident Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════════════════════════════════ */}
      {/* OPTION 2: CHIEF & LOCAL LEADER (Ubuyobozi)         */}
      {/* ═══════════════════════════════════════════════════ */}
      <View style={[styles.card, styles.adminCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.adminIconWrap}>
            <ShieldCheck size={22} color="#B45309" />
          </View>
          <View style={styles.cardHeaderMeta}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.cardTitle}>Chief &amp; Local Leader</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Authorized</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Umukuru w&apos;Umudugudu, Akagari Executive, and Sector leaders publishing community notices.
            </Text>
          </View>
        </View>

        {/* Button: Properly aligned & centered */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.adminSignInBtn}
            onPress={() => navigation.navigate('Login', { defaultRole: 'ADMIN' })}
            activeOpacity={0.88}
          >
            <ShieldCheck size={18} color="#FFFFFF" />
            <Text style={styles.adminSignInBtnText}>Local Administrator Sign In</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.adminVerificationNote}>
            <Lock size={12} color="#92400E" />
            <Text style={styles.adminVerificationNoteText}>
              Verified against assigned village &amp; cell administrative jurisdiction
            </Text>
          </View>
        </View>
      </View>

      {/* ═══════════════════════════════════════════════════ */}
      {/* QUICK 1-TAP DEMO SELECTOR (FOR TESTING)             */}
      {/* ═══════════════════════════════════════════════════ */}
      <View style={styles.demoBox}>
        <View style={styles.demoHeader}>
          <Sparkles size={14} color="#047857" />
          <Text style={styles.demoTitle}>Testing Features? 1-Tap Seeded Login:</Text>
        </View>
        <View style={styles.demoRow}>
          <TouchableOpacity
            style={styles.demoBtnAdmin}
            onPress={() => {
              loginSeeded('ADMIN');
              if (navigation?.replace) {
                navigation.replace('ChiefPortal');
              } else {
                navigation.navigate('ChiefPortal');
              }
            }}
            activeOpacity={0.85}
          >
            <ShieldCheck size={14} color="#B45309" />
            <Text style={styles.demoBtnAdminText}>Chief / Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoBtnResident}
            onPress={() => {
              loginSeeded('RESIDENT');
              if (navigation?.replace) {
                navigation.replace('MainTabs');
              } else {
                navigation.navigate('MainTabs');
              }
            }}
            activeOpacity={0.85}
          >
            <Users size={14} color="#15803D" />
            <Text style={styles.demoBtnResidentText}>Resident</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal & Compliance Footer */}
      <View style={styles.footerNote}>
        <CheckCircle2 size={13} color="#16A34A" />
        <Text style={styles.footerNoteText}>
          Law N° 058/2021 Data Protection • Masked Phone Privacy
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FCF9',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 46,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F291E',
    letterSpacing: -0.6,
    marginBottom: 2,
  },
  motto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: '#64746C',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adminCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  residentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderMeta: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F291E',
  },
  publicBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  publicBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#4B6358',
    lineHeight: 17,
  },
  buttonGroup: {
    gap: 10,
  },
  residentSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    height: 48,
    borderRadius: 14,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  residentSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  createAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    height: 44,
    borderRadius: 14,
  },
  createAccountBtnText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '700',
  },
  adminSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#D97706',
    height: 48,
    borderRadius: 14,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  adminSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  adminVerificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  adminVerificationNoteText: {
    fontSize: 11,
    color: '#92400E',
    textAlign: 'center',
  },
  demoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtnAdmin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    height: 38,
    borderRadius: 10,
  },
  demoBtnAdminText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  demoBtnResident: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    height: 38,
    borderRadius: 10,
  },
  demoBtnResidentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#64746C',
    fontWeight: '600',
  },
});
