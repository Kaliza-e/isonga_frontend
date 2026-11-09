import React, { useState, useEffect } from 'react';
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
import { areasApi, AreaItem } from '../api/areas';
import { authApi } from '../api/auth';
import {
  User,
  Phone,
  Lock,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Navigation,
} from 'lucide-react-native';

export function ResidentRegisterScreen({ navigation }: any) {
  const { login } = useMobileAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+250788');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);

  // Geographic Areas
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedAreaName, setSelectedAreaName] = useState<string>('');
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  // OTP Verification Step
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadAreas() {
      try {
        const areaList = await areasApi.getAreas();
        setAreas(areaList);
        if (areaList.length > 0) {
          // Select Kimironko or first available area
          const defaultArea = areaList.find((a: AreaItem) => a.name.includes('Kimironko')) || areaList[0];
          setSelectedAreaId(defaultArea.id);
          setSelectedAreaName(defaultArea.name);
        }
      } catch (err) {
        console.warn('Failed to load areas for registration', err);
      } finally {
        setIsLoadingAreas(false);
      }
    }
    loadAreas();
  }, []);

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter your first and last name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid Rwandan phone number (+250...).');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (!selectedAreaId) {
      setErrorMessage('Please select your village or administrative area.');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('Consent under Rwandan Data Protection Law N° 058/2021 is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phoneNumber.trim(),
        password,
        areaId: selectedAreaId,
        consentGiven: true,
        preferredLanguage: 'rw',
      });

      // Show OTP verification modal
      setShowOtpModal(true);
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. The phone number may already be registered.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await authApi.verifyOtp(phoneNumber.trim(), otpCode.trim());

      // Auto login
      await login(phoneNumber.trim(), password);

      Alert.alert('Account Verified!', 'Welcome to Isonga Connect.', [
        {
          text: 'Continue',
          onPress: () => {
            if (navigation?.replace) {
              navigation.replace('MainTabs');
            }
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Verification Failed', err?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={18} color="#172B24" />
          </TouchableOpacity>

          <View style={styles.residentBadge}>
            <Text style={styles.residentBadgeText}>Resident Registration</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Your Community</Text>
          <Text style={styles.subtitle}>
            Register to receive verified local announcements, Umuganda notices, and health updates.
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Aline"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Uwimana"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rwandan Mobile Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+250 788 123 456"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password (minimum 6 characters)</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.textInput}
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

          {/* Location Area Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Residence Village / Area</Text>
            <TouchableOpacity
              style={styles.areaSelector}
              onPress={() => {
                navigation.navigate('LocationSelector');
              }}
            >
              <MapPin size={18} color="#16A34A" />
              <Text style={styles.areaSelectorText}>
                {selectedAreaName || 'Select your residence village'}
              </Text>
              <ArrowRight size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Consent Checkbox Law No 058/2021 */}
          <TouchableOpacity
            style={styles.consentRow}
            onPress={() => setConsentGiven(!consentGiven)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, consentGiven && styles.checkboxActive]}>
              {consentGiven && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text style={styles.consentText}>
              I consent to receive official community announcements under{' '}
              <Text style={styles.consentHighlight}>Rwandan Data Protection Law N° 058/2021</Text>. My phone number remains masked.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.88}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Create Resident Account</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate('Login', { defaultRole: 'RESIDENT' })}
          >
            <Text style={styles.signInLinkText}>
              Already have an account? <Text style={styles.signInLinkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <View style={styles.otpOverlay}>
            <View style={styles.otpCard}>
              <View style={styles.otpIconWrap}>
                <ShieldCheck size={28} color="#16A34A" />
              </View>
              <Text style={styles.otpTitle}>Verify Your Mobile</Text>
              <Text style={styles.otpSubtitle}>
                Enter the 6-digit verification code dispatched via SMS to {phoneNumber}.
              </Text>

              <TextInput
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
                style={styles.otpInput}
                autoFocus
              />

              <TouchableOpacity
                style={styles.otpSubmitButton}
                onPress={handleVerifyOtp}
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.otpSubmitText}>Confirm & Activate Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  residentBadge: {
    backgroundColor: '#F0FBF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDF7E8',
  },
  residentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#087A3E',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeButton: {
    padding: 6,
  },
  areaSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FBF5',
    borderWidth: 1.5,
    borderColor: '#C6F0D7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  areaSelectorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#172B24',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  consentText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  consentHighlight: {
    color: '#0F172A',
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    height: 52,
    borderRadius: 18,
    marginTop: 8,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  signInLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  signInLinkText: {
    fontSize: 13,
    color: '#64748B',
  },
  signInLinkHighlight: {
    color: '#16A34A',
    fontWeight: '700',
  },
  otpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  otpIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  otpSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  otpInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    width: '100%',
    height: 50,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 6,
    color: '#0F172A',
    marginBottom: 16,
  },
  otpSubmitButton: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
