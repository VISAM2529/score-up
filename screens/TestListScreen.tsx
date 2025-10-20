// screens/TestListScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Test {
  id: number;
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
}

const TestListScreen = () => {
  const route = useRoute<any>();
  const syllabus = route.params?.syllabus || 'JEE';
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filters = ['All', 'Mock', 'Practice', 'Chapter', 'Previous Year'];

  // Rich test data
  const allTests: Test[] = [
    // Physics Tests
    { id: 1, name: 'Full Mock Test 1', chapter: 'Complete Syllabus', subject: 'Physics', questions: 90, duration: 180, difficulty: 'Hard', points: 450, attempted: true, score: 78, type: 'Mock', icon: 'flask-outline' },
    { id: 2, name: 'Mechanics Deep Dive', chapter: 'Mechanics', subject: 'Physics', questions: 30, duration: 45, difficulty: 'Medium', points: 150, attempted: false, type: 'Chapter', icon: 'flask-outline' },
    { id: 3, name: 'Thermodynamics Practice', chapter: 'Thermodynamics', subject: 'Physics', questions: 25, duration: 40, difficulty: 'Easy', points: 125, attempted: true, score: 92, type: 'Practice', icon: 'flask-outline' },
    { id: 4, name: 'Electromagnetism Quiz', chapter: 'Electromagnetism', subject: 'Physics', questions: 20, duration: 30, difficulty: 'Hard', points: 100, attempted: false, type: 'Chapter', icon: 'flask-outline' },
    { id: 5, name: '2023 Physics Paper', chapter: 'Complete Syllabus', subject: 'Physics', questions: 75, duration: 150, difficulty: 'Hard', points: 375, attempted: false, type: 'Previous Year', icon: 'flask-outline' },
    
    // Chemistry Tests
    { id: 6, name: 'Organic Chemistry Mastery', chapter: 'Organic Chemistry', subject: 'Chemistry', questions: 35, duration: 50, difficulty: 'Hard', points: 175, attempted: true, score: 65, type: 'Chapter', icon: 'beaker-outline' },
    { id: 7, name: 'Inorganic Quick Test', chapter: 'Inorganic Chemistry', subject: 'Chemistry', questions: 20, duration: 30, difficulty: 'Medium', points: 100, attempted: false, type: 'Practice', icon: 'beaker-outline' },
    { id: 8, name: 'Full Mock Test 2', chapter: 'Complete Syllabus', subject: 'Chemistry', questions: 90, duration: 180, difficulty: 'Hard', points: 450, attempted: false, type: 'Mock', icon: 'beaker-outline' },
    { id: 9, name: 'Physical Chemistry Basics', chapter: 'Physical Chemistry', subject: 'Chemistry', questions: 25, duration: 40, difficulty: 'Easy', points: 125, attempted: true, score: 88, type: 'Chapter', icon: 'beaker-outline' },
    
    // Mathematics Tests
    { id: 10, name: 'Calculus Challenge', chapter: 'Calculus', subject: 'Mathematics', questions: 30, duration: 45, difficulty: 'Hard', points: 150, attempted: false, type: 'Chapter', icon: 'calculator-outline' },
    { id: 11, name: 'Algebra Sprint', chapter: 'Algebra', subject: 'Mathematics', questions: 25, duration: 35, difficulty: 'Medium', points: 125, attempted: true, score: 76, type: 'Practice', icon: 'calculator-outline' },
    { id: 12, name: 'Coordinate Geometry Test', chapter: 'Coordinate Geometry', subject: 'Mathematics', questions: 20, duration: 30, difficulty: 'Easy', points: 100, attempted: false, type: 'Chapter', icon: 'calculator-outline' },
    { id: 13, name: 'Full Mock Test 3', chapter: 'Complete Syllabus', subject: 'Mathematics', questions: 90, duration: 180, difficulty: 'Hard', points: 450, attempted: false, type: 'Mock', icon: 'calculator-outline' },
    { id: 14, name: '2022 Mathematics Paper', chapter: 'Complete Syllabus', subject: 'Mathematics', questions: 75, duration: 150, difficulty: 'Hard', points: 375, attempted: true, score: 82, type: 'Previous Year', icon: 'calculator-outline' },
    
    // Biology Tests (for NEET)
    { id: 15, name: 'Botany Essentials', chapter: 'Botany', subject: 'Biology', questions: 30, duration: 40, difficulty: 'Medium', points: 150, attempted: false, type: 'Chapter', icon: 'leaf-outline' },
    { id: 16, name: 'Zoology Quick Quiz', chapter: 'Zoology', subject: 'Biology', questions: 25, duration: 35, difficulty: 'Easy', points: 125, attempted: true, score: 90, type: 'Practice', icon: 'leaf-outline' },
  ];

  const tests = selectedFilter === 'All' 
    ? allTests 
    : allTests.filter(test => test.type === selectedFilter);

  const handleTestSelect = (test: Test) => {
    navigation.navigate('Test', { syllabus, testId: test.id, testName: test.name });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSyllabusColor = () => {
    switch(syllabus) {
      case 'JEE': return '#4F46E5';
      case 'NEET': return '#EC4899';
      case 'CET': return '#10B981';
      default: return '#4F46E5';
    }
  };

  const stats = {
    total: allTests.length,
    completed: allTests.filter(t => t.attempted).length,
    pending: allTests.filter(t => !t.attempted).length,
    avgScore: Math.round(
      allTests.filter(t => t.attempted && t.score).reduce((acc, t) => acc + (t.score || 0), 0) / 
      allTests.filter(t => t.attempted).length
    ),
  };

  const syllabusColor = getSyllabusColor();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: `${syllabusColor}15` }]}>
            <Ionicons name="book-outline" size={28} color={syllabusColor} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{syllabus} Tests</Text>
            <Text style={styles.headerSubtitle}>Choose your test and start practicing</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{stats.completed}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={styles.statValue}>{stats.avgScore}%</Text>
          </View>
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
                ? [styles.filterButtonActive, { backgroundColor: syllabusColor }]
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

      {/* Tests List */}
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testCard}
            onPress={() => handleTestSelect(item)}
            activeOpacity={0.7}
          >
            {/* Test Header */}
            <View style={styles.testHeader}>
              <View style={[styles.testIconCircle, { backgroundColor: `${syllabusColor}15` }]}>
                <Ionicons name={item.icon} size={24} color={syllabusColor} />
              </View>
              <View style={styles.testHeaderText}>
                <View style={styles.testTitleRow}>
                  <Text style={styles.testName} numberOfLines={1}>{item.name}</Text>
                  {item.attempted && (
                    <View style={styles.attemptedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
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
                <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                <Text style={styles.testMetaText}>{item.questions} Qs</Text>
              </View>
              <View style={styles.testMetaItem}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.testMetaText}>{item.duration} min</Text>
              </View>
              <View style={styles.testMetaItem}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.testMetaText}>{item.points} pts</Text>
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
            <View style={styles.testFooter}>
              <View style={styles.testFooterLeft}>
                <View style={[styles.typeBadge, { backgroundColor: `${syllabusColor}15` }]}>
                  <Text style={[styles.typeText, { color: syllabusColor }]}>{item.type}</Text>
                </View>
                {item.attempted && item.score && (
                  <Text style={styles.scoreText}>
                    Score: <Text style={styles.scoreValue}>{item.score}%</Text>
                  </Text>
                )}
              </View>
              <View style={[styles.startButton, { backgroundColor: syllabusColor }]}>
                <Text style={styles.startButtonText}>
                  {item.attempted ? 'Retake' : 'Start'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No tests found</Text>
            <Text style={styles.emptyStateSubtitle}>Try a different filter</Text>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
  testCard: {
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
  testHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  testIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  attemptedBadge: {
    backgroundColor: '#D1FAE5',
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
    fontWeight: '500',
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
  },
  testMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testMetaText: {
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
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  testFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreValue: {
    fontWeight: '700',
    color: '#10B981',
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
});

export default TestListScreen;