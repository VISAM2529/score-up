// screens/ResultsScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Result {
  id: number;
  syllabus: string;
  testName: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  points: number;
  date: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rank?: number;
  icon: string;
}

const ResultsScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'JEE', 'NEET', 'CET'];

  // Rich results data
  const allResults: Result[] = [
    { 
      id: 1, 
      syllabus: 'JEE', 
      testName: 'Full Mock Test 1',
      subject: 'Physics',
      score: 28, 
      total: 30, 
      percentage: 93,
      points: 280, 
      date: '2025-11-20',
      duration: 42,
      difficulty: 'Hard',
      rank: 12,
      icon: 'flask-outline'
    },
    { 
      id: 2, 
      syllabus: 'NEET', 
      testName: 'Organic Chemistry Mastery',
      subject: 'Chemistry',
      score: 27, 
      total: 35, 
      percentage: 77,
      points: 270,
      date: '2025-11-19',
      duration: 48,
      difficulty: 'Hard',
      rank: 45,
      icon: 'beaker-outline'
    },
    { 
      id: 3, 
      syllabus: 'JEE', 
      testName: 'Calculus Challenge',
      subject: 'Mathematics',
      score: 24, 
      total: 30, 
      percentage: 80,
      points: 240,
      date: '2025-11-18',
      duration: 38,
      difficulty: 'Medium',
      rank: 28,
      icon: 'calculator-outline'
    },
    { 
      id: 4, 
      syllabus: 'CET', 
      testName: 'Mechanics Deep Dive',
      subject: 'Physics',
      score: 22, 
      total: 30, 
      percentage: 73,
      points: 220,
      date: '2025-11-17',
      duration: 44,
      difficulty: 'Medium',
      rank: 56,
      icon: 'flask-outline'
    },
    { 
      id: 5, 
      syllabus: 'NEET', 
      testName: 'Botany Essentials',
      subject: 'Biology',
      score: 26, 
      total: 30, 
      percentage: 87,
      points: 260,
      date: '2025-11-16',
      duration: 35,
      difficulty: 'Easy',
      rank: 18,
      icon: 'leaf-outline'
    },
    { 
      id: 6, 
      syllabus: 'JEE', 
      testName: 'Algebra Sprint',
      subject: 'Mathematics',
      score: 19, 
      total: 25, 
      percentage: 76,
      points: 190,
      date: '2025-11-15',
      duration: 32,
      difficulty: 'Medium',
      rank: 38,
      icon: 'calculator-outline'
    },
    { 
      id: 7, 
      syllabus: 'JEE', 
      testName: 'Thermodynamics Practice',
      subject: 'Physics',
      score: 23, 
      total: 25, 
      percentage: 92,
      points: 230,
      date: '2025-11-14',
      duration: 37,
      difficulty: 'Easy',
      rank: 8,
      icon: 'flask-outline'
    },
    { 
      id: 8, 
      syllabus: 'NEET', 
      testName: 'Inorganic Quick Test',
      subject: 'Chemistry',
      score: 15, 
      total: 20, 
      percentage: 75,
      points: 150,
      date: '2025-11-13',
      duration: 28,
      difficulty: 'Medium',
      rank: 42,
      icon: 'beaker-outline'
    },
    { 
      id: 9, 
      syllabus: 'CET', 
      testName: 'Coordinate Geometry Test',
      subject: 'Mathematics',
      score: 17, 
      total: 20, 
      percentage: 85,
      points: 170,
      date: '2025-11-12',
      duration: 26,
      difficulty: 'Easy',
      rank: 15,
      icon: 'calculator-outline'
    },
    { 
      id: 10, 
      syllabus: 'JEE', 
      testName: 'Electromagnetism Quiz',
      subject: 'Physics',
      score: 14, 
      total: 20, 
      percentage: 70,
      points: 140,
      date: '2025-11-11',
      duration: 29,
      difficulty: 'Hard',
      rank: 67,
      icon: 'flask-outline'
    },
  ];

  const results = selectedFilter === 'All' 
    ? allResults 
    : allResults.filter(result => result.syllabus === selectedFilter);

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
    if (percentage >= 75) return '#5B8DEE';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', color: '#10B981' };
    if (percentage >= 75) return { text: 'Good', color: '#5B8DEE' };
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

  // Calculate overall stats
  const totalTests = allResults.length;
  const avgScore = Math.round(
    allResults.reduce((acc, r) => acc + r.percentage, 0) / totalTests
  );
  const totalPoints = allResults.reduce((acc, r) => acc + r.points, 0);

  return (
    <View style={styles.container}>
      {/* Fixed Compact Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="analytics" size={28} color="#5B8DEE" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>My Results</Text>
              <Text style={styles.headerSubtitle}>{totalTests} tests completed</Text>
            </View>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{avgScore}%</Text>
              <Text style={styles.miniStatLabel}>Avg</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{totalPoints}</Text>
              <Text style={styles.miniStatLabel}>Points</Text>
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

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const badge = getPerformanceBadge(item.percentage);
          return (
            <View style={styles.resultCard}>
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
                      colors={['#5B8DEE', '#7BA7F7']}
                      style={styles.cardIconCircle}
                    >
                      <Ionicons name={item.icon} size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.testName}
                      </Text>
                      <View style={styles.cardSubInfo}>
                        <Text style={styles.cardSubject}>{item.subject}</Text>
                        <View style={styles.dot} />
                        <Text style={styles.cardSyllabus}>{item.syllabus}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Score Badge */}
                  <View 
                    style={[
                      styles.scoreBadge,
                      { backgroundColor: getPerformanceColor(item.percentage) }
                    ]}
                  >
                    <Text style={styles.scoreText}>{item.percentage}%</Text>
                  </View>
                </View>

                {/* Details Row */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="checkmark" size={12} color="#10B981" />
                    </View>
                    <Text style={styles.detailText}>{item.score}/{item.total} Correct</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="time" size={12} color="#5B8DEE" />
                    </View>
                    <Text style={styles.detailText}>{item.duration} min</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconCircle}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                    </View>
                    <Text style={styles.detailText}>{item.points} pts</Text>
                  </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.cardFooter}>
                  <View style={styles.badgesContainer}>
                    <View 
                      style={[
                        styles.difficultyBadge, 
                        { backgroundColor: getDifficultyColor(item.difficulty) }
                      ]}
                    >
                      <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>
                    <View 
                      style={[
                        styles.performanceBadge,
                        { backgroundColor: `${badge.color}20` }
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
                    {item.rank && (
                      <View style={styles.rankBadge}>
                        <Ionicons name="trophy" size={12} color="#8B5CF6" />
                        <Text style={styles.rankText}>#{item.rank}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>

                {/* Review Button */}
                <TouchableOpacity 
                  style={styles.reviewButton}
                  onPress={() => navigation.navigate('ResultDetail', {
                    score: item.score,
                    total: item.total,
                    percentage: item.percentage,
                    points: item.points,
                    syllabus: item.syllabus,
                    testId: item.id,
                    testName: item.testName,
                    timeSpent: item.duration * 60
                  })}
                >
                  <Text style={styles.reviewButtonText}>Review Answers</Text>
                  <Ionicons name="arrow-forward" size={16} color="#5B8DEE" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSubtitle}>Complete a test to see your results</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Tests')}
            >
              <Text style={styles.emptyButtonText}>Take a Test</Text>
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
  // Fixed Compact Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  // Filter Section
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
  // Results List
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  resultCard: {
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
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
    fontWeight: '600',
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
  scoreBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 14,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
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
  performanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  performanceText: {
    fontSize: 11,
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
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  // Empty State
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
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ResultsScreen;