import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const BASE_URL = 'https://scoreup-admin.vercel.app';

interface Result {
  _id: string;
  userId: string;
  syllabusId: { _id: string; name: string };
  testId: { _id: string; name: string };
  subjectId: { _id: string; name: string };
  score: number;
  totalQuestions: number;
  percentage: number;
  points: number;
  createdAt: string;
  timeSpent: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Mock' | 'Practice' | 'Chapter' | 'Previous Year';
}

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [userName, setUserName] = useState('User');
  const [activeIndex, setActiveIndex] = useState(0);
  const [exams, setExams] = useState<string[]>([]);
  const [subscribedExams, setSubscribedExams] = useState<string[]>([]);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [performanceStats, setPerformanceStats] = useState({
    accuracy: 0,
    totalTests: 0,
    rank: 0,
    averageScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  useFocusEffect(
  React.useCallback(() => {
    // Reload data when screen comes into focus
    fetchAllData(); // or your data fetching function
  }, [])
);
  // College images data
  const collegeImages = [
    { id: 1, image: require('../assets/scoreupBanner.png') },
    // { id: 2, image: require('../assets/college2.jpg'), title: 'Premier Institution', subtitle: 'Excellence in Education' },
    // { id: 3, image: require('../assets/college3.jpg'), title: 'Leading University', subtitle: 'Build Your Future' },
    // { id: 4, image: require('../assets/college4.jpg'), title: 'Best Campus Life', subtitle: 'Your Success Story' },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch user data
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        navigation.replace('Login');
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log('User data from storage:', userData);
      
      // Set user name
      if (userData.user && userData.user.name) {
        setUserName(userData.user.name);
      } else if (userData.email) {
        const emailUsername = userData.email.split('@')[0];
        setUserName(emailUsername);
      }

      const userId = userData.user?.id || userData.user?._id;

      // Fetch syllabuses and subscription
      const syllabiRes = await fetch(`${BASE_URL}/api/syllabus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const syllabiData = await syllabiRes.json();
      
      if (syllabiData.success) {
        const allExamNames = syllabiData.syllabi.map((s: any) => s.name);

        // Get subscribed syllabuses from user subscription
        let subscribed: string[] = [];
        if (userData.user?.subscription?.subscriptionDetails?.syllabusIds) {
          subscribed = userData.user.subscription.subscriptionDetails.syllabusIds.map(
            (s: any) => s.name
          );
          setSubscribedExams(subscribed);
        }

        // Sort exams: subscribed first, then others
        const otherExams = allExamNames.filter((e: string) => !subscribed.includes(e));
        const sortedExams = [...subscribed, ...otherExams];
        setExams(sortedExams);
      }

      // Fetch user's test results
      if (userId) {
        const resultsRes = await fetch(`${BASE_URL}/api/result?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const resultsData = await resultsRes.json();
        
        if (resultsData.success && resultsData.results) {
          processResults(resultsData.results);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processResults = (results: Result[]) => {
    if (results.length === 0) return;

    // Sort by most recent
    const sortedResults = results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get recent 3 unique subjects
    const subjectMap = new Map();
    const recentTestsData = [];

    for (const result of sortedResults) {
      const subjectName = result.subjectId?.name || 'Unknown';
      if (!subjectMap.has(subjectName) && recentTestsData.length < 3) {
        subjectMap.set(subjectName, true);
        recentTestsData.push({
          id: result._id,
          subject: subjectName,
          progress: result.percentage,
          icon: getSubjectIcon(subjectName),
          color: getSubjectColor(subjectName),
          testId: result.testId?._id,
          syllabusName: result.syllabusId?.name
        });
      }
    }

    setRecentTests(recentTestsData);

    // Calculate performance stats
    const totalTests = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const averageScore = totalTests > 0 ? Math.round(
      results.reduce((sum, r) => sum + r.percentage, 0) / totalTests
    ) : 0;

    // Calculate approximate rank (based on average score)
    // This is a simple calculation - you might want to fetch actual rank from backend
    const rankEstimate = averageScore >= 90 ? 50 : 
                        averageScore >= 80 ? 100 : 
                        averageScore >= 70 ? 200 : 
                        averageScore >= 60 ? 500 : 1000;

    setPerformanceStats({
      accuracy,
      totalTests,
      rank: rankEstimate,
      averageScore
    });
  };

  const getSubjectIcon = (subject: string): any => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('physics')) return 'flask';
    if (subjectLower.includes('chemistry')) return 'beaker';
    if (subjectLower.includes('math')) return 'calculator';
    if (subjectLower.includes('biology')) return 'leaf';
    return 'book';
  };

  const getSubjectColor = (subject: string): string => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('physics')) return '#10B981';
    if (subjectLower.includes('chemistry')) return '#3B82F6';
    if (subjectLower.includes('math')) return '#8B5CF6';
    if (subjectLower.includes('biology')) return '#F59E0B';
    return '#6B7280';
  };

  // Auto scroll carousel
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

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + 20));
    setActiveIndex(index);
  };

  const handleExamPress = (exam: string) => {
    if (subscribedExams.includes(exam)) {
      navigation.navigate('Tests', { screen: 'TestList', params: { syllabus: exam } });
    } else {
      navigation.navigate('Subscription');
    }
  };

  const handleStartPractice = (testData: any) => {
    // Navigate to test list for that syllabus
    if (testData.syllabusName && subscribedExams.includes(testData.syllabusName)) {
      navigation.navigate('Tests', { 
        screen: 'TestList', 
        params: { syllabus: testData.syllabusName } 
      });
    } else {
      navigation.navigate('Subscription');
    }
  };

  const getPerformanceMessage = () => {
    const avg = performanceStats.averageScore;
    if (avg >= 90) return "Outstanding performance! You're in the top tier! 🏆";
    if (avg >= 80) return "Excellent work! Keep up the momentum! 💪";
    if (avg >= 70) return "Great progress! You're doing well! 🌟";
    if (avg >= 60) return "Good effort! Keep practicing to improve! 📈";
    return "Keep practicing! Every test makes you better! 🎯";
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/adaptive-icon.png')} 
                style={styles.headerLogoImage}
                resizeMode="contain"
              />
            </View>
            {/* <Text style={styles.logoText}>ScoreUp</Text> */}
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={24} color="#3B82F6" />
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
                  resizeMode="contain"
                />
           
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
        {exams.length > 0 && (
          <View style={styles.examTabsContainer}>
            <View style={styles.examTabsRow}>
              {exams.map((exam) => (
                <TouchableOpacity
                  key={exam}
                  style={[
                    styles.examTab,
                    subscribedExams.includes(exam) && styles.examTabActive
                  ]}
                  onPress={() => handleExamPress(exam)}
                >
                  <Ionicons 
                    name={subscribedExams.includes(exam) ? "checkmark-circle" : "lock-closed"} 
                    size={18} 
                    color={subscribedExams.includes(exam) ? '#FFFFFF' : '#9CA3AF'} 
                  />
                  <Text style={[
                    styles.examTabText,
                    subscribedExams.includes(exam) && styles.examTabTextActive
                  ]}>
                    {exam}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recently Practice Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Recent Tests</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Results')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {recentTests.length > 0 ? (
            recentTests.map((item) => (
              <View key={item.id} style={styles.practiceCard}>
                <View style={[styles.practiceIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.practiceInfo}>
                  <Text style={styles.practiceSubject}>{item.subject}</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${item.progress}%`,
                            backgroundColor: item.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{item.progress}%</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.startPracticeButton, { backgroundColor: item.color }]}
                  onPress={() => handleStartPractice(item)}
                >
                  <Text style={styles.startPracticeText}>Practice</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateCard}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No tests taken yet</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Tests')}
              >
                <Text style={styles.emptyStateButtonText}>Start Your First Test</Text>
              </TouchableOpacity>
            </View>
          )}
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
              <View style={[styles.performanceIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="target" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.performanceValue}>{performanceStats.accuracy}%</Text>
              <Text style={styles.performanceLabel}>Accuracy</Text>
            </View>

            {/* Total Tests Card */}
            <View style={styles.performanceCard}>
              <View style={[styles.performanceIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.performanceValue}>{performanceStats.totalTests}</Text>
              <Text style={styles.performanceLabel}>Total Tests</Text>
            </View>

            {/* Avg Score Card */}
            <View style={styles.performanceCard}>
              <View style={[styles.performanceIconCircle, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="trending-up" size={24} color="#10B981" />
              </View>
              <Text style={styles.performanceValue}>{performanceStats.averageScore}%</Text>
              <Text style={styles.performanceLabel}>Avg Score</Text>
            </View>
          </View>

          {/* Performance Message */}
          {performanceStats.totalTests > 0 && (
            <View style={styles.performanceMessage}>
              <Text style={styles.performanceMessageText}>
                {getPerformanceMessage()}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Tests')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="play-circle" size={28} color="#5B8DEE" />
              </View>
              <Text style={styles.quickActionText}>Start Test</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Results')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="stats-chart" size={28} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionText}>My Results</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Subscription')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="star" size={28} color="#10B981" />
              </View>
              <Text style={styles.quickActionText}>Premium</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
    backgroundColor: '#ffffff',
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
    flexWrap: 'wrap',
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
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Practice Cards
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 35,
  },
  startPracticeButton: {
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

  // Empty State
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
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

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});

export default HomeScreen;