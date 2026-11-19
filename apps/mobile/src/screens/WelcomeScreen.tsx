
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
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { IsongaLogo } from '../components/Logo';

import {
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Users,
  ChevronRight,
} from 'lucide-react-native';

export function WelcomeScreen({ navigation }: any) {
  const { login } = useMobileAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your phone number and password.');
      return;
    }

    if (loading) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      await login(identifier.trim(), password);

      if (navigation?.replace) {
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    if (navigation?.navigate) {
      navigation.navigate('AuthSelect');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <IsongaLogo size={54} />
          </View>

          <View style={styles.brandLabel}>
            <Text style={styles.brandName}>ISONGA CONNECT</Text>
            <View style={styles.brandDot} />
            <Text style={styles.brandCaption}>COMMUNITY PLATFORM</Text>
          </View>

          <Text style={styles.title}>
            Welcome back.
          </Text>

          <Text style={styles.subtitle}>
            Your community. Your updates.
            {'\n'}
            Sign in to stay connected.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Error Message */}
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {errorMsg}
              </Text>
            </View>
          ) : null}

          {/* Identifier */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              PHONE NUMBER OR EMAIL
            </Text>

            <View style={styles.inputWrapper}>
              <User
                size={19}
                color={colors.textSecondary}
              />

              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter your phone or email"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              PASSWORD
            </Text>

            <View style={styles.inputWrapper}>
              <Lock
                size={19}
                color={colors.textSecondary}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.input}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={19} color={colors.textSecondary} />
                ) : (
                  <Eye size={19} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked,
                ]}
              >
                {rememberMe && (
                  <Check
                    size={12}
                    color="#FFFFFF"
                    strokeWidth={3}
                  />
                )}
              </View>

              <Text style={styles.rememberText}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Sign In
                </Text>

                <ArrowRight
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              OR CONTINUE WITH
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGuestBrowse}
              activeOpacity={0.8}
            >
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGuestBrowse}
              activeOpacity={0.8}
            >
              <Text style={styles.microsoftIcon}>⊞</Text>
              <Text style={styles.socialText}>Microsoft</Text>
            </TouchableOpacity>
          </View>

          {/* Registration */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              New to Isonga Connect?
            </Text>

            <TouchableOpacity
              onPress={handleGuestBrowse}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Access */}
          <View style={styles.guestContainer}>
            <View style={styles.guestIcon}>
              <Users size={21} color={colors.primary} />
            </View>

            <View style={styles.guestContent}>
              <Text style={styles.guestTitle}>
                Just exploring?
              </Text>

              <Text style={styles.guestDescription}>
                Browse your community without signing in.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleGuestBrowse}
              style={styles.guestArrow}
              activeOpacity={0.7}
            >
              <ChevronRight
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.bottomFooter}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>
            YOUR COMMUNITY. YOUR UPDATES.
          </Text>

          <Text style={styles.footerCopyright}>
            ISONGA CONNECT © 2026
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 38 : 55,
    paddingBottom: 28,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },

  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
    borderWidth: 1,
    borderColor: colors.border,
  },

  brandLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    gap: 6,
  },

  brandName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: colors.primary,
  },

  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.warning,
  },

  brandCaption: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textMuted,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 9,
  },

  // Form
  form: {
    gap: 19,
  },

  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  fieldContainer: {
    gap: 9,
  },

  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 57,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 7,
  },

  // Options
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -3,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  rememberText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: 13,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textMuted,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },

  socialButton: {
    flex: 1,
    height: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    backgroundColor: '#FFFFFF',
  },

  googleG: {
    fontSize: 19,
    fontWeight: '800',
    color: '#4285F4',
  },

  microsoftIcon: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  socialText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Registration
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },

  registerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  registerLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  // Guest Access
  guestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBackground,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    gap: 12,
    marginTop: 3,
  },

  guestIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  guestContent: {
    flex: 1,
    gap: 4,
  },

  guestTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  guestDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  guestArrow: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  bottomFooter: {
    alignItems: 'center',
    marginTop: 35,
    gap: 9,
  },

  footerLine: {
    width: 40,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginBottom: 5,
  },

  footerBrand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
  },

  footerCopyright: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
});
