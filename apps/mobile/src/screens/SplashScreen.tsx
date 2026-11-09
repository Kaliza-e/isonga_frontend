import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import { IsongaLogo } from '../components/Logo';

const { height } = Dimensions.get('window');

export function SplashScreen({ onFinish, navigation }: { onFinish?: (target?: string) => void; navigation?: any }) {
  const { user, isAuthenticated, hasSeenOnboarding } = useMobileAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation on loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      handleComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleComplete}
      style={styles.container}
    >
      {/* Brand Section */}
      <Animated.View
        style={[
          styles.brandContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Authentic Isonga Community Emblem */}
        <View style={styles.logoBadge}>
          <IsongaLogo size={76} />
        </View>

        <Text style={styles.title}>Isonga{'\n'}Connect</Text>
        <Text style={styles.tagline}>Your community. Your updates.</Text>
      </Animated.View>

      {/* City & Hills Artwork / Graphic */}
      <View style={styles.illustrationWrapper}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?w=800&q=80',
          }}
          style={styles.illustration}
          resizeMode="cover"
        />
        <View style={styles.overlayWave} />

        {/* Loading Dots Indicator */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, styles.dotActive, { opacity: pulseAnim }]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    paddingTop: height * 0.12,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.mintBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 4,
  },
  logoCircleBlue: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.info,
  },
  logoCircleGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  logoCircleYellow: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.warning,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  illustrationWrapper: {
    width: '100%',
    height: height * 0.42,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  overlayWave: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 163, 74, 0.18)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  dotActive: {
    backgroundColor: colors.primary,
    opacity: 1,
    width: 20,
  },
});
