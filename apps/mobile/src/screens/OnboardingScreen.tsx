import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import {
  Megaphone,
  Bell,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Heart,
  Radio,
  CheckCircle2,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  highlights?: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'Civic Platform • Rwanda',
    title: 'Welcome to\nIsonga Connect',
    subtitle: 'Your community. Your updates.',
    description:
      'The official civic technology platform that directly connects residents with their local leaders, helping communities across Rwanda stay informed and united.',
    icon: Megaphone,
    iconBg: '#D1FAE5',
    iconColor: '#059669',
  },
  {
    id: '2',
    badge: 'Real-Time Civic Feeds',
    title: 'Stay Informed\nat Every Step',
    subtitle: 'Zero rumors, 100% verified updates.',
    description:
      'Receive official notices targeted to your specific village and cell regarding Umuganda, health immunizations, school programs, water maintenance, and weather cautions.',
    icon: Bell,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    highlights: ['Umuganda Schedules', 'Public Health Clinics', 'Water & Infrastructure', 'Emergency Cautions'],
  },
  {
    id: '3',
    badge: 'Local Governance',
    title: 'Connected\nCommunities',
    subtitle: 'Direct from authorized local authorities.',
    description:
      'Authorized leaders—including your Village Chief (Umukuru w\'Umudugudu), Cell Executive, and Sector Administrators—publish verified updates directly to residents.',
    icon: ShieldCheck,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: '4',
    badge: 'Ready to Connect',
    title: "Let's Get Your\nCommunity Connected",
    subtitle: 'Simple, secure, and privacy-protected.',
    description:
      'Join thousands of citizens receiving timely public announcements. Fully compliant with Rwandan Data Protection Law N° 058/2021 with masked phone privacy.',
    icon: Sparkles,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
  },
];

export function OnboardingScreen({ navigation }: any) {
  const { setHasSeenOnboarding } = useMobileAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleFinishOnboarding = () => {
    setHasSeenOnboarding(true);
    if (navigation?.replace) {
      navigation.replace('AuthSelect');
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Top Header: Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.govTag}>
          <View style={styles.govDot} />
          <Text style={styles.govTagText}>Gov-RW Civic Node</Text>
        </View>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={handleFinishOnboarding}
            style={styles.skipButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={styles.slide}>
              {/* Illustrated Badge Card */}
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <Icon size={44} color={item.iconColor} strokeWidth={2.2} />
              </View>

              {/* Tag / Badge */}
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>

              {/* Headline */}
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              {/* Description */}
              <Text style={styles.description}>{item.description}</Text>

              {/* Optional Highlights (Slide 2) */}
              {item.highlights && (
                <View style={styles.highlightsContainer}>
                  {item.highlights.map((h: string, i: number) => (
                    <View key={i} style={styles.highlightPill}>
                      <CheckCircle2 size={12} color="#16A34A" />
                      <Text style={styles.highlightText}>{h}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Bottom Navigation & Controls */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button: Next or Get Started */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === SLIDES.length - 1
              ? "Let's Get Started"
              : 'Continue'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  govTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FBF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDF7E8',
  },
  govDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  govTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#087A3E',
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  slide: {
    width,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#087A3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  badgePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 18,
    maxWidth: 320,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#16A34A',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#E2E8F0',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
