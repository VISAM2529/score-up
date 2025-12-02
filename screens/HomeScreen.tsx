import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedExam, setSelectedExam] = useState('CET');
  const [userName, setUserName] = useState('User');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeBottomIndex, setActiveBottomIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const bottomScrollViewRef = useRef<ScrollView>(null);

  // College images data
  const collegeImages = [
    { id: 1, image: require('../assets/college1.jpg'), title: 'Top Engineering College', subtitle: 'Your Dream Awaits' },
    { id: 2, image: require('../assets/college2.jpg'), title: 'Premier Institution', subtitle: 'Excellence in Education' },
    { id: 3, image: require('../assets/college3.jpg'), title: 'Leading University', subtitle: 'Build Your Future' },
    { id: 4, image: require('../assets/college4.jpg'), title: 'Best Campus Life', subtitle: 'Your Success Story' },
  ];

  // Bottom banner images
  const bottomBanners = [
    { id: 1, image: require('../assets/college1.jpg'), title: 'Achieve Your Goals', subtitle: 'Start Your Journey Today' },
    { id: 2, image: require('../assets/college2.jpg'), title: 'Excellence Awaits', subtitle: 'Join Top Performers' },
    { id: 3, image: require('../assets/college3.jpg'), title: 'Your Success Path', subtitle: 'Best Learning Experience' },
    { id: 4, image: require('../assets/college4.jpg'), title: 'Dream Big, Achieve More', subtitle: 'Transform Your Future' },
  ];

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log('User data from storage:', userData);
          
          // Set user name from the stored data
          if (userData.user && userData.user.name) {
            setUserName(userData.user.name);
          } else if (userData.email) {
            // Use email username if name is not available
            const emailUsername = userData.email.split('@')[0];
            setUserName(emailUsername);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Auto scroll top carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % collegeImages.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (CARD_WIDTH + 20),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [collegeImages.length]);

  // Auto scroll bottom carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBottomIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bottomBanners.length;
        bottomScrollViewRef.current?.scrollTo({
          x: nextIndex * (CARD_WIDTH + 20),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bottomBanners.length]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + 20));
    setActiveIndex(index);
  };

  const handleBottomScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + 20));
    setActiveBottomIndex(index);
  };

  const examTabs = ['CET', 'JEE', 'NEET'];

  const recentPractice = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      progress: 52, 
      icon: 'calculator',
      color: '#8B5CF6'
    },
    { 
      id: 2, 
      subject: 'Physics', 
      progress: 62, 
      icon: 'flask',
      color: '#10B981'
    },
    { 
      id: 3, 
      subject: 'Chemistry', 
      progress: 45, 
      icon: 'beaker',
      color: '#3B82F6'
    },
  ];

  const performanceStats = {
    accuracy: 78,
    totalTests: 100,
    rank: 142
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/logo.jpg')} 
                style={styles.headerLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.logoText}>ScoreUp</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Text */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hello {userName}...! 👋</Text>
          <Text style={styles.greetingSubtitle}>Keep practicing, your next rank is waiting</Text>
        </View>

        {/* College Images Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {collegeImages.map((college, index) => (
              <View key={college.id} style={[styles.bannerCard, { marginLeft: index === 0 ? 20 : 0 }]}>
                <Image 
                  source={college.image} 
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                  style={styles.bannerOverlay}
                >
                  <Text style={styles.bannerTitle}>{college.title}</Text>
                  <Text style={styles.bannerSubtitle}>{college.subtitle}</Text>
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Now</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          
          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {collegeImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeIndex === index && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Exam Tabs */}
        <View style={styles.examTabsContainer}>
          <View style={styles.examTabsRow}>
            {examTabs.map((exam) => (
              <TouchableOpacity
                key={exam}
                style={[
                  styles.examTab,
                  selectedExam === exam && styles.examTabActive
                ]}
                onPress={() => setSelectedExam(exam)}
              >
                <Ionicons 
                  name="school" 
                  size={18} 
                  color={selectedExam === exam ? '#FFFFFF' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.examTabText,
                  selectedExam === exam && styles.examTabTextActive
                ]}>
                  {exam}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.examTab}>
              <Ionicons name="school" size={18} color="#9CA3AF" />
              <Text style={styles.examTabText}>JEE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recently Practice Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Recently Practice</Text>
          </View>

          {recentPractice.map((item) => (
            <View key={item.id} style={styles.practiceCard}>
              <View style={[styles.practiceIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.practiceInfo}>
                <Text style={styles.practiceSubject}>{item.subject}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.startPracticeButton}>
                <Text style={styles.startPracticeText}>Start</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Banner Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={bottomScrollViewRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleBottomScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {bottomBanners.map((banner, index) => (
              <View key={banner.id} style={[styles.bannerCard, { marginLeft: index === 0 ? 20 : 0 }]}>
                <Image 
                  source={banner.image} 
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                  style={styles.bannerOverlay}
                >
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Explore Now</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          
          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {bottomBanners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeBottomIndex === index && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Performance Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Performance Summary</Text>
          </View>

          <View style={styles.performanceGrid}>
            {/* Accuracy Card */}
            <View style={styles.performanceCard}>
              <View style={styles.performanceIconCircle}>
                <Ionicons name="target" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.performanceValue}>{performanceStats.accuracy} %</Text>
              <Text style={styles.performanceLabel}>Accuracy</Text>
            </View>

            {/* Total Tests Card */}
            <View style={styles.performanceCard}>
              <View style={styles.performanceIconCircle}>
                <Ionicons name="document-text" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.performanceValue}>{performanceStats.totalTests}</Text>
              <Text style={styles.performanceLabel}>Total Test</Text>
            </View>

            {/* Rank Card */}
            <View style={styles.performanceCard}>
              <View style={styles.performanceIconCircle}>
                <Ionicons name="medal" size={24} color="#10B981" />
              </View>
              <Text style={styles.performanceValue}>#{performanceStats.rank}</Text>
              <Text style={styles.performanceLabel}>Rank</Text>
            </View>
          </View>

          {/* Performance Message */}
          <View style={styles.performanceMessage}>
            <Text style={styles.performanceMessageText}>
              You've outperforming 85% of Learners :)
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 10,
  },
  headerLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Greeting Section
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Carousel Container
  carouselContainer: {
    marginBottom: 20,
  },
  carouselContent: {
    paddingRight: 20,
  },

  // Banner Card
  bannerCard: {
    marginRight: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    width: CARD_WIDTH,
    backgroundColor: '#1F2937',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  indicatorActive: {
    backgroundColor: '#3B82F6',
    width: 20,
  },

  // Exam Tabs
  examTabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  examTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  examTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  examTabActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  examTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  examTabTextActive: {
    color: '#FFFFFF',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  // Practice Cards
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  practiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 35,
  },
  startPracticeButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  startPracticeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Performance Grid
  performanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  performanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  performanceMessage: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  performanceMessageText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;