// screens/ResultsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://scoreup-admin.vercel.app';

interface Result {
  _id: string;
  syllabusId: { name: string };
  testId: { name: string };
  subjectId: { name: string };
  score: number;
  totalQuestions: number;
  percentage: number;
  points: number;
  createdAt: string;
  timeSpent: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Mock' | 'Practice' | 'Chapter' | 'Previous Year';
  rank?: number;
}

const ResultsListScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters = ['All', 'JEE', 'NEET', 'CET'];

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/api/result`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAllResults(data.results);
      } else {
        throw new Error(data.message || 'Failed to fetch results');
      }
    } catch (error) {
      console.error('Fetch results error:', error);
      Alert.alert('Error', 'Failed to load results. Please try again.');
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
    switch(subject.toLowerCase()) {
      case 'physics': return 'flask-outline';
      case 'chemistry': return 'beaker-outline';
      case 'mathematics': return 'calculator-outline';
      case 'biology': return 'leaf-outline';
      default: return 'book-outline';
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

  const results = selectedFilter === 'All' 
    ? allResults 
    : allResults.filter(result => result.syllabusId.name === selectedFilter);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateTitle}>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
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

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const badge = getPerformanceBadge(item.percentage);
          return (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('ResultDetail', {
                resultId: item._id,
                score: item.score,
                total: item.totalQuestions,
                percentage: item.percentage,
                points: item.points,
                syllabus: item.syllabusId.name,
                testId: item.testId._id,
                testName: item.testId.name,
                timeSpent: item.timeSpent
              })}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.cardIconCircle}>
                    <Ionicons name={getIcon(item.subjectId.name)} size={24} color="#4F46E5" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.testId.name}
                    </Text>
                    <View style={styles.cardSubInfo}>
                      <Text style={styles.cardSubject}>{item.subjectId.name}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.cardSyllabus}>{item.syllabusId.name}</Text>
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
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={styles.detailText}>{item.score}/{item.totalQuestions}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{Math.floor(item.timeSpent / 60)}m</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
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
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSubtitle}>Complete a test to see your results</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Tests')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
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
    paddingBottom: 100,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: '#EEF2FF',
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
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  performanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4F46E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ResultsListScreen;