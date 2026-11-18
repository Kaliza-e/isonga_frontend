import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { useMobileAuth } from '../context/AuthContext';
import {
  Users,
  Calendar,
  HeartHandshake,
  Radio,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react-native';

const { width, height = 800 } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  stepNumber: string;
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
    stepNumber: '1',
    badge: "Civic Partnership • Ubuyobozi bw'Ibanze",
    title: 'Direct Connection With Your Local Leaders',
    kinyarwandaSubtitle: "Guhuza Abaturage n'Umukuru w'Umudugudu",
    description:
      "Directly bridge the gap between your household and local governance. Receive verified directives, community notices, and official security advisories straight from your Village Chief (Umukuru w'Umudugudu) and Akagari council.",
    imageUri: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
    primaryIcon: Users,
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
    highlights: ["Umukuru w'Umudugudu", 'Akagari Executive Council', 'Verified Official Directives'],
  },
  {
    id: '2',
    stepNumber: '2',
    badge: 'Community Action • Umuganda Rusange',
    title: 'Stay Synced on Umuganda & Village Assemblies',
    kinyarwandaSubtitle: "Inama z'Abaturage n'Ibikorwa Rusange",
    description:
      'Never miss a monthly Umuganda gathering or mandatory village assembly. Get exact assembly locations, designated road and drainage clearing zones, required equipment, and post-meeting community resolutions.',
    imageUri: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    primaryIcon: Calendar,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    highlights: ['Monthly Umuganda Dates', 'Work Site Coordinates', 'Community Resolutions'],
  },
  {
    id: '3',
    stepNumber: '3',
    badge: 'Public Health & Utilities • WASAC Alerts',
    title: 'Vital Health Clinics & Utility Advisories',
    kinyarwandaSubtitle: "Ubuzima bwa Rubanda na Gahunda za WASAC",
    description:
      "Receive timely advance notices prior to scheduled WASAC water network maintenance in your sector, routine immunization clinics with community health workers (Abajyanama b'Ubuzima), and seasonal weather updates.",
    imageUri: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    primaryIcon: HeartHandshake,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    highlights: ['WASAC Water Maintenance', "Abajyanama b'Ubuzima", 'Urgent Health Screenings'],
  },
  {
    id: '4',
    stepNumber: '4',
    badge: 'Civic Inclusion • Law N° 058/2021',
    title: 'Inclusive SMS Broadcasts & Data Privacy',
    kinyarwandaSubtitle: "Ubutumwa bwa SMS n'Umutekano w'Amakuru",
    description:
      'Engineered for every resident across Rwanda—accessible via smartphone mobile application or instant SMS notifications on basic feature phones. Your personal privacy is strictly safeguarded under Rwandan Law N° 058/2021.',
    imageUri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    primaryIcon: Radio,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    highlights: ['Direct Phone SMS', 'Masked Number Privacy', 'Zero Commercial Spam'],
  },
];

export function OnboardingScreen({ navigation }: any) {
  const { setHasSeenOnboarding } = useMobileAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinishOnboarding = () => {
    setHasSeenOnboarding(true);
    if (navigation?.replace) {
      navigation.replace('AuthSelect');
    } else if (navigation?.navigate) {
      navigation.navigate('AuthSelect');
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleFinishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const goToSlide = (idx: number) => {
    flatListRef.current?.scrollToIndex({
      index: idx,
      animated: true,
    });
    setCurrentIndex(idx);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0 && typeof viewableItems[0].index === 'number') {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.govTag}>
          <View style={styles.govDot} />
          <Text style={styles.govTagText}>Gov-RW Civic Network</Text>
        </View>

        <View style={styles.topRightControls}>
          <View style={styles.stepCounterPill}>
            <Text style={styles.stepCounterText}>
              Slide {currentIndex + 1} of {SLIDES.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleFinishOnboarding}
            style={styles.skipButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
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
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => {
          const Icon = item.primaryIcon;
          return (
            <ScrollView
              style={{ width }}
              contentContainerStyle={styles.slideScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Authentic Photography Card Featuring Real Communities */}
              <View style={styles.imageCardContainer}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                <View style={styles.imageGradientOverlay} />

                {/* Floating Icon Badge */}
                <View style={[styles.floatingIconBadge, { backgroundColor: item.iconBg }]}>
                  <Icon size={24} color={item.iconColor} strokeWidth={2.4} />
                </View>

                {/* Civic Category Pill */}
                <View style={styles.floatingCategoryPill}>
                  <Text style={styles.floatingCategoryText}>{item.badge}</Text>
                </View>
              </View>

              {/* Text Content */}
              <View style={styles.textContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.kinyarwandaSubtitle}>{item.kinyarwandaSubtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>

                {/* Highlights */}
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
        {/* Pagination Dots (Interactive) */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
              />
            );
          })}
        </View>

        {/* Buttons Row: Back (if not first) + Continue/Get Started */}
        <View style={styles.buttonRow}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={handlePrev}
              activeOpacity={0.85}
            >
              <ArrowLeft size={18} color="#475569" />
              <Text style={styles.prevButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, currentIndex === 0 && { flex: 1 }]}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryButtonText}>
              {currentIndex === SLIDES.length - 1
                ? 'Get Started • Injira'
                : 'Continue'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingHorizontal: 22,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    letterSpacing: 0.2,
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
    paddingTop: 14,
    paddingBottom: 20,
  },
  imageCardContainer: {
    width: '100%',
    height: 230,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 35, 25, 0.25)',
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
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  floatingCategoryPill: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
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
    paddingBottom: Platform.OS === 'web' ? 24 : 32,
    paddingTop: 12,
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prevButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
