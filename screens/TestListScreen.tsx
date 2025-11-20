// screens/TestListScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const stats = {
    total: allTests.length,
    completed: allTests.filter(t => t.attempted).length,
    pending: allTests.filter(t => !t.attempted).length,
    avgScore: Math.round(
      allTests.filter(t => t.attempted && t.score).reduce((acc, t) => acc + (t.score || 0), 0) / 
      allTests.filter(t => t.attempted).length
    ),
  };

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
            <Text style={styles.headerTitle}>{syllabus} Tests</Text>
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
});

export default TestListScreen;