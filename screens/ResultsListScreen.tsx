// screens/ResultsListScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const ResultsListScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

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
      date: '2025-10-14',
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
      date: '2025-10-13',
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
      date: '2025-10-12',
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
      date: '2025-10-11',
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
      date: '2025-10-10',
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
      date: '2025-10-09',
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
      date: '2025-10-08',
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
      date: '2025-10-07',
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
      date: '2025-10-06',
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
      date: '2025-10-05',
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

  // Calculate overall stats
  const totalTests = allResults.length;
  const avgScore = Math.round(
    allResults.reduce((acc, r) => acc + r.percentage, 0) / totalTests
  );
  const totalPoints = allResults.reduce((acc, r) => acc + r.points, 0);
  const bestScore = Math.max(...allResults.map(r => r.percentage));

  const stats = [
    { label: 'Tests Taken', value: totalTests.toString(), icon: 'document-text-outline', color: '#4F46E5' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: 'trending-up-outline', color: '#10B981' },
    { label: 'Best Score', value: `${bestScore}%`, icon: 'trophy-outline', color: '#F59E0B' },
    { label: 'Total Points', value: totalPoints.toString(), icon: 'star-outline', color: '#EC4899' },
  ];

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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const badge = getPerformanceBadge(item.percentage);
          return (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('Results', {
                score: item.score,
                total: item.total,
                percentage: item.percentage,
                points: item.points,
                syllabus: item.syllabus,
                testId: item.id,
                testName: item.testName,
                timeSpent: item.duration * 60
              })}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.cardIconCircle}>
                    <Ionicons name={item.icon} size={24} color="#4F46E5" />
                  </View>
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
                  <Text style={styles.detailText}>{item.score}/{item.total}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{item.duration}m</Text>
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
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
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