// screens/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onboardingData = [
    {
      id: 1,
      icon: 'school-outline',
      title: 'Master Your Exams',
      subtitle: 'Access 1000+ curated questions for JEE, NEET & CET. Practice with chapter-wise tests and full-length mock exams.',
      gradient: ['#FFFFFF', '#F8F9FF'],
      accentColor: '#4F46E5',
      iconBg: '#EEF2FF',
    },
    {
      id: 2,
      icon: 'trophy-outline',
      title: 'Earn Rewards Daily',
      subtitle: 'Complete tests, earn points, and unlock premium features. Track achievements and redeem exciting rewards.',
      gradient: ['#FFFFFF', '#FFF9F5'],
      accentColor: '#F59E0B',
      iconBg: '#FEF3C7',
    },
    {
      id: 3,
      icon: 'analytics-outline',
      title: 'Track Your Progress',
      subtitle: 'Get detailed performance analytics, study time insights, and personalized recommendations to improve faster.',
      gradient: ['#FFFFFF', '#F0FDF9'],
      accentColor: '#10B981',
      iconBg: '#D1FAE5',
    },
    {
      id: 4,
      icon: 'rocket-outline',
      title: 'Start Your Success Journey',
      subtitle: 'Join 10,000+ students who are crushing their exam prep. One-time payment of ₹99 for lifetime access.',
      gradient: ['#FFFFFF', '#FFF5F9'],
      accentColor: '#EC4899',
      iconBg: '#FCE7F3',
    },
  ];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const scrollToPage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({
      x: pageIndex * width,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      scrollToPage(currentPage + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header with Skip */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>MCQ Prep</Text>
          {currentPage < onboardingData.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
      >
        {onboardingData.map((item, index) => (
          <LinearGradient
            key={item.id}
            colors={item.gradient}
            style={[styles.page, { width }]}
          >
            <View style={styles.content}>
              {/* Icon Container */}
              <View style={styles.illustrationContainer}>
                <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={80} color={item.accentColor} />
                </View>
                {/* Decorative elements */}
                <View style={[styles.decorDot, styles.decorDot1, { backgroundColor: item.accentColor }]} />
                <View style={[styles.decorDot, styles.decorDot2, { backgroundColor: item.accentColor }]} />
                <View style={[styles.decorDot, styles.decorDot3, { backgroundColor: item.accentColor }]} />
              </View>

              {/* Content Section */}
              <View style={styles.textContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              {/* Page Indicator */}
              <View style={styles.pagination}>
                {onboardingData.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.paginationDot,
                      currentPage === idx && [
                        styles.paginationDotActive,
                        { backgroundColor: item.accentColor }
                      ],
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {currentPage === onboardingData.length - 1 ? (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: onboardingData[currentPage].accentColor }]}
            onPress={handleNext}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: onboardingData[currentPage].accentColor }]}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  page: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
    height: height * 0.4,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  decorDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.3,
  },
  decorDot1: {
    top: 60,
    right: 40,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  decorDot2: {
    bottom: 80,
    left: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  decorDot3: {
    top: 120,
    left: 50,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 32,
    height: 8,
    borderRadius: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default OnboardingScreen;