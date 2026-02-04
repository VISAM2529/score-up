import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  rank?: number;
  answers: any[];
}

interface ApiResponse {
  success: boolean;
  results: Result[];
}

const ResultsListScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  // Get unique syllabuses from results for filter tabs
  const [availableSyllabuses, setAvailableSyllabuses] = useState<string[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        Alert.alert('Error', 'Please login to view results');
        navigation.replace('Login');
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const userIdFromStorage = userData.user?.id || userData.user?._id;
      
      if (!userIdFromStorage) {
        Alert.alert('Error', 'User ID not found');
        setIsLoading(false);
        return;
      }

      setUserId(userIdFromStorage);
      console.log('Fetching results for userId:', userIdFromStorage);

      const response = await fetch(`${BASE_URL}/api/result?userId=${userIdFromStorage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const data: ApiResponse = await response.json();
      console.log('Results fetched:', data.results?.length || 0);

      if (data.success && data.results) {
        // Sort by most recent first
        const sortedResults = data.results.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setAllResults(sortedResults);
        
        // Extract unique syllabuses for filters
        const uniqueSyllabuses = Array.from(
          new Set(sortedResults.map(r => r.syllabusId?.name).filter(Boolean))
        );
        setAvailableSyllabuses(['All', ...uniqueSyllabuses]);
        
        console.log('Available syllabuses:', uniqueSyllabuses);
      } else {
        console.log('No results found or API error');
        setAllResults([]);
      }
    } catch (error) {
      console.error('Fetch results error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 75) return '#3B82F6';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', color: '#10B981' };
    if (percentage >= 75) return { text: 'Good', color: '#3B82F6' };
    if (percentage >= 60) return { text: 'Average', color: '#F59E0B' };
    return { text: 'Needs Work', color: '#EF4444' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('physics')) return 'flask-outline';
    if (subjectLower.includes('chemistry')) return 'beaker-outline';
    if (subjectLower.includes('math')) return 'calculator-outline';
    if (subjectLower.includes('biology')) return 'leaf-outline';
    return 'book-outline';
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Mock': return 'trophy-outline';
      case 'Practice': return 'play-outline';
      case 'Chapter': return 'book-outline';
      case 'Previous Year': return 'archive-outline';
      default: return 'document-outline';
    }
  };

  // Calculate overall stats
  const totalTests = allResults.length;
  const avgScore = totalTests > 0 ? Math.round(
    allResults.reduce((acc, r) => acc + r.percentage, 0) / totalTests
  ) : 0;
  const totalPoints = allResults.reduce((acc, r) => acc + r.points, 0);
  const bestScore = totalTests > 0 ? Math.max(...allResults.map(r => r.percentage)) : 0;

  const stats = [
    { label: 'Tests Taken', value: totalTests.toString(), icon: 'document-text-outline', color: '#4F46E5' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: 'trending-up-outline', color: '#10B981' },
    { label: 'Best Score', value: `${bestScore}%`, icon: 'trophy-outline', color: '#F59E0B' },
    { label: 'Total Points', value: totalPoints.toString(), icon: 'star-outline', color: '#EC4899' },
  ];

  // Filter results
  const filteredResults = selectedFilter === 'All' 
    ? allResults 
    : allResults.filter(result => result.syllabusId?.name === selectedFilter);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Results</Text>
            <Text style={styles.headerSubtitle}>Track your performance & progress</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="analytics-outline" size={28} color="#4F46E5" />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconCircle, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      {availableSyllabuses.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {availableSyllabuses.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter 
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive
              ]}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter 
                    ? styles.filterButtonTextActive 
                    : styles.filterButtonTextInactive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Results List */}
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchResults}
        renderItem={({ item }) => {
          const badge = getPerformanceBadge(item.percentage);
          return (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => {
                console.log('Navigating to ResultDetail with:', {
                  resultId: item._id,
                  testId: item.testId?._id
                });
                navigation.navigate('ResultDetail', {
                  resultId: item._id,
                  testId: item.testId?._id
                });
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#FFFFFF', '#FAFBFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <LinearGradient
                      colors={['#4F46E5', '#6366F1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardIconCircle}
                    >
                      <Ionicons 
                        name={getIcon(item.subjectId?.name || '') as any} 
                        size={24} 
                        color="#FFFFFF" 
                      />
                    </LinearGradient>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.testId?.name || 'Test'}
                      </Text>
                      <View style={styles.cardSubInfo}>
                        <Text style={styles.cardSubject}>
                          {item.subjectId?.name || 'Subject'}
                        </Text>
                        <View style={styles.dot} />
                        <Text style={styles.cardSyllabus}>
                          {item.syllabusId?.name || 'Syllabus'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Score Circle */}
                  <View 
                    style={[
                      styles.scoreCircle,
                      { borderColor: getPerformanceColor(item.percentage) }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.scoreText,
                        { color: getPerformanceColor(item.percentage) }
                      ]}
                    >
                      {item.percentage}%
                    </Text>
                  </View>
                </View>

                {/* Details Row */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    </View>
                    <Text style={styles.detailText}>
                      {item.score}/{item.totalQuestions}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="time-outline" size={12} color="#6B7280" />
                    </View>
                    <Text style={styles.detailText}>
                      {Math.floor(item.timeSpent / 60)}m {item.timeSpent % 60}s
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                    </View>
                    <Text style={styles.detailText}>{item.points} pts</Text>
                  </View>
                  <View 
                    style={[
                      styles.difficultyBadge, 
                      { backgroundColor: `${getDifficultyColor(item.difficulty)}15` }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.difficultyText, 
                        { color: getDifficultyColor(item.difficulty) }
                      ]}
                    >
                      {item.difficulty}
                    </Text>
                  </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.cardFooter}>
                  <View style={styles.badgesContainer}>
                    <View style={styles.typeBadge}>
                      <Ionicons 
                        name={getTypeIcon(item.type) as any} 
                        size={12} 
                        color="#4F46E5" 
                      />
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    {item.rank && (
                      <View style={styles.rankBadge}>
                        <Ionicons name="trophy" size={12} color="#8B5CF6" />
                        <Text style={styles.rankText}>Rank #{item.rank}</Text>
                      </View>
                    )}
                    <View 
                      style={[
                        styles.performanceBadge,
                        { backgroundColor: `${badge.color}15` }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.performanceText,
                          { color: badge.color }
                        ]}
                      >
                        {badge.text}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedFilter === 'All' 
                ? 'Complete a test to see your results' 
                : `No ${selectedFilter} results yet`}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Syllabus')}
            >
              <Text style={styles.emptyButtonText}>Start a Test</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  filterScrollView: {
    marginTop: 16,
    marginBottom: 12,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterButtonTextInactive: {
    color: '#6B7280',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  resultCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubject: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 6,
  },
  cardSyllabus: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },
  rankBadge: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankText: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  performanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  performanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '700',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ResultsListScreen;