import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Users,
  AlertCircle,
  KeyRound,
} from 'lucide-react-native';

export function LoginScreen({ route, navigation }: any) {
  const initialRole = route?.params?.defaultRole || 'RESIDENT';
  const [isAdminMode, setIsAdminMode] = useState(initialRole === 'ADMIN');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useMobileAuth();

  const handleSignIn = async () => {
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both your identifier (phone or email) and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await login(identifier.trim(), password);

      // Route according to the verified backend role
      const adminRoles = ['CELL_ADMIN', 'SECTOR_ADMIN', 'DISTRICT_ADMIN', 'SUPER_ADMIN'];
      if (adminRoles.includes(user.role)) {
        if (navigation?.replace) {
          navigation.replace('ChiefPortal');
        }
      } else {
        if (navigation?.replace) {
          navigation.replace('MainTabs');
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={18} color="#172B24" />
          </TouchableOpacity>

          <View style={styles.nodeBadge}>
            <Text style={styles.nodeBadgeText}>Gov-RW Secure</Text>
          </View>
        </View>

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={[styles.modeIconCircle, isAdminMode ? styles.adminModeCircle : styles.residentModeCircle]}>
            {isAdminMode ? (
              <ShieldCheck size={32} color="#D97706" />
            ) : (
              <Users size={32} color="#16A34A" />
            )}
          </View>

          <Text style={styles.title}>
            {isAdminMode ? 'Administrator Sign In' : 'Resident Sign In'}
          </Text>
          <Text style={styles.subtitle}>
            {isAdminMode
              ? 'Authorized local leaders and municipal authorities'
              : 'Sign in to access your village & community updates'}
          </Text>

          {/* Mode Switcher Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, !isAdminMode && styles.tabButtonActive]}
              onPress={() => {
                setIsAdminMode(false);
                setErrorMessage(null);
              }}
            >
              <Text style={[styles.tabButtonText, !isAdminMode && styles.tabButtonTextActive]}>
                Resident
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, isAdminMode && styles.tabButtonAdminActive]}
              onPress={() => {
                setIsAdminMode(true);
                setErrorMessage(null);
              }}
            >
              <Text style={[styles.tabButtonText, isAdminMode && styles.tabButtonTextAdminActive]}>
                Chief / Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {isAdminMode ? 'Authorized Phone Number or Email' : 'Rwandan Phone Number or Email'}
            </Text>
            <View style={styles.inputWrapper}>
              <User size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder={isAdminMode ? 'e.g., +250788999888' : 'e.g., +250788123456'}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Account Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.textSecondary} />
                ) : (
                  <Eye size={18} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isAdminMode ? styles.submitButtonAdmin : styles.submitButtonResident,
            ]}
            onPress={handleSignIn}
            disabled={isSubmitting}
            activeOpacity={0.88}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isAdminMode ? 'Enter Administrator Console' : 'Access Resident Portal'}
                </Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Register Link for Residents */}
          {!isAdminMode && (
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('ResidentRegister')}
            >
              <Text style={styles.registerLinkText}>
                Don&apos;t have an account?{' '}
                <Text style={styles.registerLinkHighlight}>Create one here</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Security Notice for Administrators */}
          {isAdminMode && (
            <View style={styles.adminSecurityNotice}>
              <KeyRound size={14} color="#92400E" />
              <Text style={styles.adminSecurityNoticeText}>
                Local leadership credentials are cryptographically verified against assigned geographic jurisdiction.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeBadge: {
    backgroundColor: '#F0FBF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDF7E8',
  },
  nodeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#087A3E',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  residentModeCircle: {
    backgroundColor: '#DCFCE7',
  },
  adminModeCircle: {
    backgroundColor: '#FEF3C7',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#172B24',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64746C',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginTop: 18,
    width: '100%',
    maxWidth: 260,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonAdminActive: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  tabButtonTextAdminActive: {
    color: '#FFFFFF',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
    lineHeight: 18,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeButton: {
    padding: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 18,
    marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonResident: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
  },
  submitButtonAdmin: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  registerLinkText: {
    fontSize: 13,
    color: '#64746C',
  },
  registerLinkHighlight: {
    color: '#16A34A',
    fontWeight: '700',
  },
  adminSecurityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 6,
  },
  adminSecurityNoticeText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});

