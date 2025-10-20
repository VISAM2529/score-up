// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const stats = [
    { label: 'Tests', value: '24', icon: 'checkmark-circle-outline', color: '#10B981' },
    { label: 'Avg Score', value: '78%', icon: 'trending-up-outline', color: '#4F46E5' },
    { label: 'Streak', value: '7d', icon: 'flame-outline', color: '#F59E0B' },
    { label: 'Rank', value: '#156', icon: 'trophy-outline', color: '#EC4899' },
  ];

  const recentTests = [
    { 
      id: 1, 
      subject: 'Physics', 
      chapter: 'Mechanics', 
      questions: 30, 
      duration: '45 min', 
      difficulty: 'Medium', 
      icon: 'flask-outline',
      color: '#4F46E5'
    },
    { 
      id: 2, 
      subject: 'Chemistry', 
      chapter: 'Organic Chemistry', 
      questions: 25, 
      duration: '40 min', 
      difficulty: 'Hard', 
      icon: 'beaker-outline',
      color: '#EC4899'
    },
    { 
      id: 3, 
      subject: 'Mathematics', 
      chapter: 'Calculus', 
      questions: 35, 
      duration: '50 min', 
      difficulty: 'Easy', 
      icon: 'calculator-outline',
      color: '#10B981'
    },
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Practice', 
      subtitle: 'Quick Test', 
      icon: 'flash-outline', 
      color: '#4F46E5', 
      screen: 'Tests' 
    },
    { 
      id: 2, 
      title: 'Results', 
      subtitle: 'Performance', 
      icon: 'stats-chart-outline', 
      color: '#EC4899', 
      screen: 'My Results' 
    },
    { 
      id: 3, 
      title: 'Syllabus', 
      subtitle: 'Topics', 
      icon: 'book-outline', 
      color: '#10B981', 
      screen: 'Tests' 
    },
    { 
      id: 4, 
      title: 'Profile', 
      subtitle: 'Account', 
      icon: 'person-outline', 
      color: '#F59E0B', 
      screen: 'Profile' 
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>Good Morning 👋</Text>
              <Text style={styles.userName}>Rahul Sharma</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsContent}>
              <View style={styles.pointsLeft}>
                <View style={styles.starIcon}>
                  <Ionicons name="star" size={24} color="#F59E0B" />
                </View>
                <View>
                  <Text style={styles.pointsLabel}>Your Points</Text>
                  <Text style={styles.pointsValue}>2,450</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIconCircle, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Tests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tests')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={styles.testCard}
              onPress={() => navigation.navigate('Tests')}
            >
              <View style={styles.testCardContent}>
                <View style={[styles.testIcon, { backgroundColor: `${test.color}15` }]}>
                  <Ionicons name={test.icon} size={28} color={test.color} />
                </View>
                
                <View style={styles.testInfo}>
                  <Text style={styles.testSubject}>{test.subject}</Text>
                  <Text style={styles.testChapter}>{test.chapter}</Text>
                  
                  <View style={styles.testMeta}>
                    <View style={styles.testMetaItem}>
                      <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                      <Text style={styles.testMetaText}>{test.questions} Qs</Text>
                    </View>
                    <View style={styles.testMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.testMetaText}>{test.duration}</Text>
                    </View>
                    <View 
                      style={[
                        styles.difficultyBadge, 
                        { backgroundColor: `${getDifficultyColor(test.difficulty)}15` }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.difficultyText, 
                          { color: getDifficultyColor(test.difficulty) }
                        ]}
                      >
                        {test.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.testArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pointsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#78350F',
  },
  redeemButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  redeemButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
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
  testCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  testChapter: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  testArrow: {
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;