import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Calendar,
  HeartHandshake,
  Radio,
  Lock,
  ArrowRight,
  CheckCircle2,
  Megaphone,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  kinyarwandaSubtitle: string;
  description: string;
  imageUri: string;
  primaryIcon: any;
  iconBg: string;
  iconColor: string;
  highlights: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'Civic Partnership • Rwanda',
    title: 'Connect Directly With Your Local Leaders',
    kinyarwandaSubtitle: "Guhuza Abaturage n'Ubuyobozi bw'Ibanze",
    description:
      "Directly bridge the gap between your household and local governance. Receive verified directives, security advisories, and neighborhood decisions straight from your Village Chief (Umukuru w'Umudugudu) and Cell executives.",
    imageUri: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
    primaryIcon: Users,
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
    highlights: ["Umukuru w'Umudugudu", 'Akagari Executive', 'Zero Rumors, 100% Verified'],
  },
  {
    id: '2',
    badge: 'Community Action • Umuganda',
    title: 'Stay Synced on Umuganda & Village Assemblies',
    kinyarwandaSubtitle: "Inama z'Abaturage n'Ibikorwa Rusange",
    description:
      'Never miss a monthly Umuganda gathering or mandatory village assembly. Get exact assembly times, designated drainage or road sections, required tools, and post-meeting community resolutions on your phone.',
    imageUri: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
    primaryIcon: Calendar,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    highlights: ['Monthly Umuganda Dates', 'Required Tool Checklists', 'Security Patrol (Irondo) Updates'],
  },
  {
    id: '3',
    badge: 'Essential Services • Health & Utilities',
    title: 'Vital Public Health & Utility Alerts',
    kinyarwandaSubtitle: 'Ubuzima bwa Rubanda na Serivisi za Leta',
    description:
      "Get advance warnings before scheduled WASAC water network maintenance in your sector, childhood immunization clinics with community health workers (Abajyanama b'Ubuzima), and emergency weather advisories.",
    imageUri: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    primaryIcon: HeartHandshake,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    highlights: ['Free Health Screenings', 'WASAC Water Cut Alerts', 'Meteo Weather Advisories'],
  },
  {
    id: '4',
    badge: 'Nationwide Reach • Law N° 058/2021',
    title: 'Inclusive SMS & App Alerts For Every Citizen',
    kinyarwandaSubtitle: "Ubutumwa bwa SMS n'Umutekano w'Amakuru",
    description:
      'Engineered for all Rwandan citizens—whether using smartphone mobile data or receiving instant SMS on basic mobile phones. Your personal identity is strictly protected under Rwandan Data Protection Law N° 058/2021.',
    imageUri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    primaryIcon: Radio,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    highlights: ['Instant SMS Delivery', 'Masked Phone Privacy', 'Zero Commercial Spam'],
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
    } else {
      navigation.navigate('AuthSelect');
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
      {/* Top Header: Civic Node Indicator & Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.govTag}>
          <View style={styles.govDot} />
          <Text style={styles.govTagText}>Gov-RW Civic Node</Text>
        </View>

        <View style={styles.topRightControls}>
          <View style={styles.stepCounterPill}>
            <Text style={styles.stepCounterText}>
              {currentIndex + 1} of {SLIDES.length}
            </Text>
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
          const Icon = item.primaryIcon;
          return (
            <ScrollView
              style={{ width }}
              contentContainerStyle={styles.slideScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Real Authentic Photography Card with Floating Icon Badge */}
              <View style={styles.imageCardContainer}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                <View style={styles.imageGradientOverlay} />

                {/* Floating Real Lucide Icon Badge */}
                <View style={[styles.floatingIconBadge, { backgroundColor: item.iconBg }]}>
                  <Icon size={24} color={item.iconColor} strokeWidth={2.4} />
                </View>

                {/* Civic Category Pill on Image */}
                <View style={styles.floatingCategoryPill}>
                  <Text style={styles.floatingCategoryText}>{item.badge}</Text>
                </View>
              </View>

              {/* Text Content */}
              <View style={styles.textContent}>
                {/* Headline */}
                <Text style={styles.title}>{item.title}</Text>
                
                {/* Kinyarwanda Subtitle */}
                <Text style={styles.kinyarwandaSubtitle}>{item.kinyarwandaSubtitle}</Text>

                {/* Description */}
                <Text style={styles.description}>{item.description}</Text>

                {/* Highlights Pills */}
                <View style={styles.highlightsContainer}>
                  {item.highlights.map((h: string, i: number) => (
                    <View key={i} style={styles.highlightPill}>
                      <CheckCircle2 size={13} color="#16A34A" />
                      <Text style={styles.highlightText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
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
              ? 'Get Started as Resident or Leader'
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
    paddingTop: 50,
    paddingHorizontal: 22,
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
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepCounterPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  slideScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 20,
  },
  imageCardContainer: {
    width: '100%',
    height: height * 0.28,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 35, 25, 0.22)',
  },
  floatingIconBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  floatingCategoryPill: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  floatingCategoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  textContent: {
    paddingTop: 18,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F291E',
    letterSpacing: -0.4,
    lineHeight: 28,
    marginBottom: 4,
  },
  kinyarwandaSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#4B6358',
    lineHeight: 19,
    marginBottom: 16,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
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
    backgroundColor: '#CBD5E1',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
