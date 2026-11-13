import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { IsongaLogo } from '../components/Logo';
import {
  Users,
  ShieldCheck,
  Radio,
  CheckCircle2,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export function SplashScreen({
  onFinish,
  navigation,
}: {
  onFinish?: (target?: string) => void;
  navigation?: any;
}) {
  const { user, isAuthenticated, hasSeenOnboarding } = useMobileAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const determineTarget = () => {
    if (isAuthenticated && user) {
      const adminRoles = ['CELL_ADMIN', 'SECTOR_ADMIN', 'DISTRICT_ADMIN', 'SUPER_ADMIN'];
      return adminRoles.includes(user.role) ? 'ChiefPortal' : 'MainTabs';
    }
    return hasSeenOnboarding ? 'AuthSelect' : 'Onboarding';
  };

  const handleComplete = () => {
    const target = determineTarget();
    if (onFinish) {
      onFinish(target);
    } else if (navigation?.replace) {
      navigation.replace(target);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Pulse animation on connection indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      handleComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleComplete}
      style={styles.container}
    >
      {/* Top Civic Badge */}
      <Animated.View
        style={[
          styles.topHeader,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.govBadge}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.govBadgeText}>Republic of Rwanda • Civic Network</Text>
        </View>
      </Animated.View>

      {/* Main Center Content: Connecting Citizens to Local Leaders */}
      <Animated.View
        style={[
          styles.centerSection,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Glowing Logo Emblem */}
        <View style={styles.logoRingWrapper}>
          <Animated.View
            style={[
              styles.pulseRing,
              { opacity: pulseAnim, transform: [{ scale: 1.08 }] },
            ]}
          />
          <View style={styles.logoBadge}>
            <IsongaLogo size={90} />
          </View>
        </View>

        {/* Brand Name */}
        <Text style={styles.title}>Isonga Connect</Text>

        {/* Direct Civic Connection Taglines */}
        <Text style={styles.kinyarwandaMotto}>Guhuza Abaturage n&apos;Ubuyobozi</Text>
        <Text style={styles.englishSubtitle}>
          Direct Bridge Between Citizens &amp; Local Leaders
        </Text>

        {/* Civic Bridge Visual Card */}
        <View style={styles.civicBridgeCard}>
          {/* Citizen Side */}
          <View style={styles.bridgeNode}>
            <View style={[styles.nodeIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Users size={20} color="#15803D" />
            </View>
            <Text style={styles.nodeLabel}>Abaturage</Text>
            <Text style={styles.nodeSub}>Citizens</Text>
          </View>

          {/* Connection Link */}
          <View style={styles.bridgeLink}>
            <View style={styles.bridgeLine} />
            <View style={styles.bridgeMiddleBadge}>
              <Radio size={14} color="#059669" />
            </View>
            <View style={styles.bridgeLine} />
          </View>

          {/* Leader Side */}
          <View style={styles.bridgeNode}>
            <View style={[styles.nodeIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <ShieldCheck size={20} color="#D97706" />
            </View>
            <Text style={styles.nodeLabel}>Ubuyobozi</Text>
            <Text style={styles.nodeSub}>Local Leaders</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Status & Trust Banner */}
      <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
        <View style={styles.trustBadge}>
          <CheckCircle2 size={14} color="#16A34A" />
          <Text style={styles.trustBadgeText}>
            Umudugudu • Akagari • Umurenge • Akarere
          </Text>
        </View>

        {/* Modern Connecting Indicator */}
        <View style={styles.loadingRow}>
          <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.dot, styles.dotMiddle, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FCF9',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.06,
    paddingHorizontal: 24,
  },
  topHeader: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  govBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  govBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  centerSection: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 'auto',
  },
  logoRingWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#86EFAC',
    backgroundColor: '#ECFDF5',
  },
  logoBadge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F291E',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 6,
  },
  kinyarwandaMotto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 4,
  },
  englishSubtitle: {
    fontSize: 13,
    color: '#4B6358',
    textAlign: 'center',
    marginBottom: 26,
    maxWidth: 280,
    lineHeight: 18,
  },
  civicBridgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  bridgeNode: {
    alignItems: 'center',
    width: 80,
  },
  nodeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  nodeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F291E',
  },
  nodeSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  bridgeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 6,
  },
  bridgeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#A7F3D0',
  },
  bridgeMiddleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  dotMiddle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#047857',
  },
});
