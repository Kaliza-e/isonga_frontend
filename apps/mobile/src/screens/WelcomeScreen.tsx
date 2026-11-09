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
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { IsongaLogo } from '../components/Logo';
import { User, Lock, Eye, EyeOff, Check } from 'lucide-react-native';

export function WelcomeScreen({ navigation }: any) {
  const { login } = useMobileAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your phone number and password');
      return;
    }
    setErrorMsg(null);
    try {
      await login(identifier.trim(), password);
      if (navigation?.replace) {
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please check your credentials.');
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <IsongaLogo size={56} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          {errorMsg ? (
            <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ color: '#B91C1C', fontSize: 13, fontWeight: '600' }}>{errorMsg}</Text>
            </View>
          ) : null}
          <View style={styles.inputWrapper}>
            <User size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Phone number or email"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
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

          {/* Remember me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social SSO Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGuestBrowse}>
              <Text style={styles.socialTextGoogle}>G Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleGuestBrowse}>
              <Text style={styles.socialTextMs}>⊞ Microsoft</Text>
            </TouchableOpacity>
          </View>

          {/* Guest / Register Links */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={handleGuestBrowse}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.guestLink} onPress={handleGuestBrowse}>
            <Text style={styles.guestLinkText}>Continue as Guest Resident &rarr;</Text>
          </TouchableOpacity>
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
    paddingTop: 48,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    gap: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoCircleBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.info,
  },
  logoCircleGreen: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  logoCircleYellow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.warning,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  primaryButton: {
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
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: colors.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialTextGoogle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  socialTextMs: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: 6,
  },
  guestLinkText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

