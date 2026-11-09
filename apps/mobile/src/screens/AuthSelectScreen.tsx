import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  CheckCircle2,
} from 'lucide-react-native';

export function AuthSelectScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <View style={styles.logoCircleBlue} />
          <View style={styles.logoCircleGreen} />
          <View style={styles.logoCircleYellow} />
        </View>

        <Text style={styles.title}>Welcome to{'\n'}Isonga Connect</Text>
        <Text style={styles.tagline}>Your community. Your updates.</Text>

        <View style={styles.roleInstructionPill}>
          <Text style={styles.roleInstructionText}>
            Select your account access method below
          </Text>
        </View>
      </View>

      {/* ═══ OPTION 1: COMMUNITY RESIDENT ═══ */}
      <View style={styles.roleCard}>
        <View style={styles.roleCardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#DCFCE7' }]}>
            <Users size={24} color="#16A34A" />
          </View>
          <View style={styles.roleTextGroup}>
            <View style={styles.roleTitleRow}>
              <Text style={styles.roleTitle}>Community Resident</Text>
              <View style={styles.citizenBadge}>
                <Text style={styles.citizenBadgeText}>Public</Text>
              </View>
            </View>
            <Text style={styles.roleSubtitle}>
              Receive verified village & cell announcements, Umuganda notices, and health updates.
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => navigation.navigate('Login', { defaultRole: 'RESIDENT' })}
            activeOpacity={0.88}
          >
            <LogIn size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Resident Sign In</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => navigation.navigate('ResidentRegister')}
            activeOpacity={0.8}
          >
            <UserPlus size={16} color="#087A3E" />
            <Text style={styles.secondaryActionText}>Create New Resident Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══ OPTION 2: CHIEF / LOCAL ADMINISTRATOR ═══ */}
      <View style={[styles.roleCard, styles.adminRoleCard]}>
        <View style={styles.roleCardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
            <ShieldCheck size={24} color="#D97706" />
          </View>
          <View style={styles.roleTextGroup}>
            <View style={styles.roleTitleRow}>
              <Text style={styles.roleTitle}>Chief & Local Leader</Text>
              <View style={styles.authBadge}>
                <Text style={styles.authBadgeText}>Authorized</Text>
              </View>
            </View>
            <Text style={styles.roleSubtitle}>
              Umukuru w&apos;Umudugudu, Akagari, and Umurenge administrators authorized to publish community updates.
            </Text>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.noticeBox}>
          <KeyRound size={14} color="#B45309" />
          <Text style={styles.noticeText}>
            Administrative accounts and jurisdiction scopes are provisioned through official local government structures.
          </Text>
        </View>

        <View style={styles.cardDivider} />

        <TouchableOpacity
          style={styles.adminActionButton}
          onPress={() => navigation.navigate('Login', { defaultRole: 'ADMIN' })}
          activeOpacity={0.88}
        >
          <ShieldCheck size={16} color="#FFFFFF" />
          <Text style={styles.adminActionText}>Local Administrator Sign In</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Legal & Compliance Notice */}
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
    backgroundColor: '#F0FBF5',
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  logoCircleBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0284C7',
  },
  logoCircleGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#16A34A',
  },
  logoCircleYellow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#172B24',
    textAlign: 'center',
    lineHeight: 32,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#087A3E',
    marginTop: 4,
  },
  roleInstructionPill: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDF7E8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleInstructionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64746C',
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E3EEE7',
    shadowColor: '#172B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  adminRoleCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFEFA',
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextGroup: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172B24',
  },
  citizenBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  citizenBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  authBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  authBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  roleSubtitle: {
    fontSize: 12,
    color: '#64746C',
    lineHeight: 18,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 12,
  },
  noticeText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  buttonGroup: {
    gap: 10,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginLeft: 16,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FBF5',
    borderWidth: 1.5,
    borderColor: '#C6F0D7',
    paddingVertical: 12,
    borderRadius: 16,
  },
  secondaryActionText: {
    color: '#087A3E',
    fontSize: 13,
    fontWeight: '700',
  },
  adminActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  adminActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginLeft: 16,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#64746C',
    fontWeight: '500',
  },
});

