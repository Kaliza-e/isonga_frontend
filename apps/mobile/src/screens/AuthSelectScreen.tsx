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
import {
  Users,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';

export function AuthSelectScreen({ navigation }: any) {
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
          Select your verified access portal below
        </Text>
      </View>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CARD 1: COMMUNITY RESIDENT (Abaturage)               */}
      {/* ═══════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.residentIconWrap}>
            <Users size={24} color="#15803D" strokeWidth={2.2} />
          </View>
          <View style={styles.cardHeaderMeta}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.cardTitle}>Community Resident</Text>
              <View style={styles.publicBadge}>
                <Text style={styles.publicBadgeText}>Public Portal</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Stay updated on Umuganda schedules, water &amp; electricity maintenance, and local village notices.
            </Text>
          </View>
        </View>

        {/* Buttons Group: Balanced, centered, full width */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.residentSignInBtn}
            onPress={() => navigation.navigate('Login', { defaultRole: 'RESIDENT' })}
            activeOpacity={0.88}
          >
            <View style={styles.btnContentRow}>
              <LogIn size={19} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.residentSignInBtnText}>Resident Sign In</Text>
            </View>
            <ArrowRight size={19} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={() => navigation.navigate('ResidentRegister')}
            activeOpacity={0.85}
          >
            <UserPlus size={17} color="#15803D" strokeWidth={2.2} />
            <Text style={styles.createAccountBtnText}>Create New Resident Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CARD 2: LOCAL ADMINISTRATOR & CHIEF (Ubuyobozi)     */}
      {/* ═══════════════════════════════════════════════════ */}
      <View style={[styles.card, styles.adminCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.adminIconWrap}>
            <ShieldCheck size={24} color="#B45309" strokeWidth={2.2} />
          </View>
          <View style={styles.cardHeaderMeta}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.cardTitle}>Local Administrator</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Gov-RW Secure</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Umukuru w&apos;Umudugudu, Akagari Executive, and Sector leaders broadcasting verified notices.
            </Text>
          </View>
        </View>

        {/* Buttons Group */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.adminSignInBtn}
            onPress={() => navigation.navigate('Login', { defaultRole: 'ADMIN' })}
            activeOpacity={0.88}
          >
            <View style={styles.btnContentRow}>
              <ShieldCheck size={19} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.adminSignInBtnText}>Local Administrator Sign In</Text>
            </View>
            <ArrowRight size={19} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.adminVerificationNote}>
            <Lock size={13} color="#92400E" strokeWidth={2.2} />
            <Text style={styles.adminVerificationNoteText}>
              Restricted to verified local administrative officials
            </Text>
          </View>
        </View>
      </View>

      {/* Legal & Compliance Footer */}
      <View style={styles.footerNote}>
        <CheckCircle2 size={13} color="#16A34A" strokeWidth={2.2} />
        <Text style={styles.footerNoteText}>
          Law N° 058/2021 Data Protection • Official Gov-RW Civic Node
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
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    shadowColor: '#0F291E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  adminCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  residentIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  publicBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#4B6358',
    lineHeight: 18,
  },
  buttonGroup: {
    gap: 12,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  residentSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16A34A',
    height: 52,
    borderRadius: 15,
    paddingHorizontal: 18,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  residentSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  createAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    height: 48,
    borderRadius: 15,
  },
  createAccountBtnText: {
    color: '#15803D',
    fontSize: 13.5,
    fontWeight: '700',
  },
  adminSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D97706',
    height: 52,
    borderRadius: 15,
    paddingHorizontal: 18,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  adminSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  adminVerificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  adminVerificationNoteText: {
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#64746C',
    fontWeight: '600',
  },
});
