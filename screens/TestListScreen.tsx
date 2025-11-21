// screens/TestListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://scoreup-admin.vercel.app';

interface Syllabus {
  _id: string;
  name: string;
  fullName: string;
  description: string;
  color: string;
  subjects: any[];
  totalTests: number;
  students: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SyllabiResponse {
  success: boolean;
  syllabi: Syllabus[];
}

interface ApiTest {
  _id: string;
  name: string;
  syllabusId: {
    _id: string;
    name: string;
  };
  subjectId: {
    _id: string;
    name: string;
  };
  type: 'Mock' | 'Practice' | 'Chapter' | 'Previous Year';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  questions: any[]; // Full questions array
  isPremium: boolean;
  isActive: boolean;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TestsResponse {
  success: boolean;
  tests: ApiTest[];
}

interface Subscription {
  _id: string;
  syllabusIds: Syllabus[];
  price: number;
  discountPercent: number;
  finalPrice: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubsResponse {
  success: boolean;
  subscriptions: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface Test {
  id: string;
  name: string;
  chapter: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  attempted: boolean;
  score?: number;
  type: 'Mock' | 'Practice' | 'Chapter' | 'Previous Year';
  icon: string;
  testData: ApiTest; // Full test data
}

const TestListScreen = () => {
  const route = useRoute<any>();
  const syllabusName = route.params?.syllabus || 'JEE';
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [allowedSyllabusIds, setAllowedSyllabusIds] = useState<string[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const filters = ['All', 'Mock', 'Practice', 'Chapter', 'Previous Year'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('Loading test data...');
    setIsLoading(true);
    try {
      // Fetch syllabi
      const syllabiRes = await fetch(`${BASE_URL}/api/syllabus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Syllabi Response status:', syllabiRes.status);
      const syllabiData: SyllabiResponse = await syllabiRes.json();
      console.log('Syllabi Response body:', JSON.stringify(syllabiData, null, 2));
      setSyllabi(syllabiData.syllabi || []);

      // Get user subscription ID
      const userSubId = await AsyncStorage.getItem('userSubscriptionId');
      if (!userSubId) {
        console.log('No subscription found, navigating to Subscription');
        Alert.alert('Access Required', 'Please subscribe to access tests.', [
          { text: 'OK', onPress: () => navigation.replace('Subscription') }
        ]);
        return;
      }

      // Fetch subscriptions to get user's sub details
      const subsRes = await fetch(`${BASE_URL}/api/admin/subscriptions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Subscriptions Response status:', subsRes.status);
      const subsData: SubsResponse = await subsRes.json();
      console.log('Subscriptions Response body:', JSON.stringify(subsData, null, 2));

      if (subsData.success) {
        const userSub = subsData.subscriptions.find((sub: Subscription) => sub._id === userSubId);
        if (userSub && userSub.isActive) {
          const allowedIds = userSub.syllabusIds.map((s: Syllabus) => s._id);
          setAllowedSyllabusIds(allowedIds);
          console.log('Allowed syllabus IDs:', allowedIds);

          // Check access for current syllabus
          const currentSyllabus = syllabiData.syllabi.find((s: Syllabus) => s.name === syllabusName);
          if (currentSyllabus && allowedIds.includes(currentSyllabus._id)) {
            setHasAccess(true);
            // Fetch tests for this syllabus
            await fetchTests(currentSyllabus._id);
          } else {
            console.log('No access to current syllabus:', syllabusName);
          }
        } else {
          console.log('Invalid or inactive subscription');
          Alert.alert('Subscription Expired', 'Your subscription is inactive. Please renew.', [
            { text: 'OK', onPress: () => navigation.replace('Subscription') }
          ]);
        }
      } else {
        Alert.alert('Error', 'Failed to load subscriptions.');
      }
    } catch (error) {
      console.error('Load Data Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTests = async (syllabusId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/tests?syllabusId=${syllabusId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Tests Response status:', response.status);
      const testsData: TestsResponse = await response.json();
      console.log('Tests Response body:', JSON.stringify(testsData, null, 2));

      if (testsData.success) {
        const mappedTests: Test[] = testsData.tests
          .filter(test => test.isActive)
          .map(test => ({
            id: test._id,
            name: test.name,
            chapter: test.subjectId.name, // Using subject as chapter for display
            subject: test.subjectId.name,
            questions: test.totalQuestions,
            duration: test.duration,
            difficulty: test.difficulty as 'Easy' | 'Medium' | 'Hard',
            points: test.totalQuestions * test.pointsPerQuestion,
            attempted: false, // For now, assume not attempted; can be fetched later
            score: undefined,
            type: test.type as 'Mock' | 'Practice' | 'Chapter' | 'Previous Year',
            icon: getIconForType(test.type), // Helper to get icon
            testData: test,
          }));
        setTests(mappedTests);
      } else {
        Alert.alert('Error', 'Failed to fetch tests.');
      }
    } catch (error) {
      console.error('Fetch Tests Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Mock':
        return 'trophy-outline';
      case 'Practice':
        return 'play-outline';
      case 'Chapter':
        return 'book-outline';
      case 'Previous Year':
        return 'archive-outline';
      default:
        return 'document-outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredTests = selectedFilter === 'All' 
    ? tests 
    : tests.filter(test => test.type === selectedFilter);

  const stats = {
    total: tests.length,
    completed: 0, // Since no attempted data yet
    pending: tests.length,
    avgScore: 0,
  };

  const handleTestSelect = (test: Test) => {
    navigation.navigate('Test', { test });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{syllabusName} Tests</Text>
              <Text style={styles.headerSubtitle}>Loading...</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="hourglass-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyStateTitle}>Loading tests...</Text>
        </View>
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{syllabusName} Tests</Text>
              <Text style={styles.headerSubtitle}>Access Required</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="lock-closed-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyStateTitle}>Subscribe for Access</Text>
          <Text style={styles.emptyStateSubtitle}>Get {syllabusName} tests with a premium plan</Text>
          <TouchableOpacity 
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.subscribeButtonText}>Choose Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{syllabusName} Tests</Text>
            <Text style={styles.headerSubtitle}>{stats.total} tests available</Text>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{stats.completed}</Text>
              <Text style={styles.miniStatLabel}>Done</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{stats.avgScore}%</Text>
              <Text style={styles.miniStatLabel}>Score</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={styles.filterButtonWrapper}
            >
              {selectedFilter === filter ? (
                <LinearGradient
                  colors={['#5B8DEE', '#7BA7F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.filterButtonActive}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.filterButtonTextActive}>{filter}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterButtonInactive}>
                  <Text style={styles.filterButtonTextInactive}>{filter}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tests List */}
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testCard}
            onPress={() => handleTestSelect(item)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FAFBFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.testCardGradient}
            >
              {/* Test Header */}
              <View style={styles.testHeader}>
                <LinearGradient
                  colors={['#5B8DEE', '#7BA7F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.testIconCircle}
                >
                  <Ionicons name={item.icon} size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.testHeaderText}>
                  <View style={styles.testTitleRow}>
                    <Text style={styles.testName} numberOfLines={1}>{item.name}</Text>
                    {item.attempted && (
                      <View style={styles.attemptedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                      </View>
                    )}
                  </View>
                  <View style={styles.testSubInfo}>
                    <Text style={styles.testSubject}>{item.subject}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.testChapter} numberOfLines={1}>{item.chapter}</Text>
                  </View>
                </View>
              </View>

              {/* Test Info */}
              <View style={styles.testMeta}>
                <View style={styles.testMetaItem}>
                  <View style={styles.metaIconCircle}>
                    <Ionicons name="document-text" size={12} color="#5B8DEE" />
                  </View>
                  <Text style={styles.testMetaText}>{item.questions} Questions</Text>
                </View>
                <View style={styles.testMetaItem}>
                  <View style={styles.metaIconCircle}>
                    <Ionicons name="time" size={12} color="#5B8DEE" />
                  </View>
                  <Text style={styles.testMetaText}>{item.duration} min</Text>
                </View>
                <View style={styles.testMetaItem}>
                  <View style={styles.metaIconCircle}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                  </View>
                  <Text style={styles.testMetaText}>{item.points} pts</Text>
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.testFooter}>
                <View style={styles.testFooterLeft}>
                  <View 
                    style={[
                      styles.difficultyBadge, 
                      { backgroundColor: getDifficultyColor(item.difficulty) }
                    ]}
                  >
                    <Text style={styles.difficultyText}>{item.difficulty}</Text>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                  </View>
                  {item.attempted && item.score && (
                    <View style={styles.scoreBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text style={styles.scoreValue}>{item.score}%</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => handleTestSelect(item)}
                >
                  <Text style={styles.startButtonText}>
                    {item.attempted ? 'Retake' : 'Start'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>No tests found</Text>
            <Text style={styles.emptyStateSubtitle}>Try selecting a different filter</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 60,
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  filterButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 6,
  },
  filterButtonInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
  },
  filterButtonTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterButtonTextInactive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  testCard: {
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testCardGradient: {
    padding: 16,
  },
  testHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  testIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testHeaderText: {
    flex: 1,
  },
  testTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  testName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  attemptedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testSubject: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 6,
  },
  testChapter: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    fontWeight: '500',
  },
  testMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testMetaText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  testFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B8DEE',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  subscribeButton: {
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TestListScreen;