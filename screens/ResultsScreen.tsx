// screens/ResultsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ResultsScreen = () => {
  const route = useRoute<any>();
  const { score, total, percentage, points, syllabus, testId, testName, timeSpent } = route.params;
  const navigation = useNavigation<any>();

  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate progress circle
    Animated.spring(progressAnim, {
      toValue: percentage,
      tension: 20,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: '#10B981', icon: 'trophy-outline' };
    if (percentage >= 75) return { text: 'Excellent Work!', color: '#3B82F6', icon: 'star-outline' };
    if (percentage >= 60) return { text: 'Good Job!', color: '#F59E0B', icon: 'thumbs-up-outline' };
    if (percentage >= 40) return { text: 'Keep Practicing!', color: '#F97316', icon: 'bulb-outline' };
    return { text: 'Need More Practice!', color: '#EF4444', icon: 'book-outline' };
  };

  const getGrade = () => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  const getSyllabusColor = () => {
    switch(syllabus) {
      case 'JEE': return '#4F46E5';
      case 'NEET': return '#EC4899';
      case 'CET': return '#10B981';
      default: return '#4F46E5';
    }
  };

  const performanceMsg = getPerformanceMessage();
  const grade = getGrade();
  const correct = score;
  const incorrect = total - score;
  const syllabusColor = getSyllabusColor();

  // Calculate insights
  const insights = [
    { 
      icon: 'checkmark-circle-outline', 
      label: 'Correct', 
      value: correct.toString(), 
      color: '#10B981',
      detail: `${((correct / total) * 100).toFixed(0)}% accuracy`
    },
    { 
      icon: 'close-circle-outline', 
      label: 'Incorrect', 
      value: incorrect.toString(), 
      color: '#EF4444',
      detail: `${((incorrect / total) * 100).toFixed(0)}% wrong`
    },
    { 
      icon: 'time-outline', 
      label: 'Time', 
      value: formatTime(timeSpent), 
      color: '#3B82F6',
      detail: `${Math.round(timeSpent / total)}s per Q`
    },
    { 
      icon: 'star-outline', 
      label: 'Points', 
      value: points.toString(), 
      color: '#F59E0B',
      detail: 'Rewards earned'
    },
  ];

  const recommendations = [
    { 
      icon: 'book-outline', 
      title: 'Review Answers', 
      subtitle: 'Learn from mistakes',
      action: 'View',
      color: '#4F46E5'
    },
    { 
      icon: 'refresh-outline', 
      title: 'Retake Test', 
      subtitle: 'Improve score',
      action: 'Retake',
      color: '#10B981'
    },
    { 
      icon: 'trending-up-outline', 
      title: 'Practice More', 
      subtitle: 'Strengthen topics',
      action: 'Practice',
      color: '#EC4899'
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <View style={[styles.syllabusBadge, { backgroundColor: `${syllabusColor}15` }]}>
              <Text style={[styles.syllabusBadgeText, { color: syllabusColor }]}>{syllabus}</Text>
            </View>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.headerLabel}>Test Completed</Text>
            <Text style={styles.headerTitle}>{testName || `Test ${testId}`}</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Score Circle Card */}
        <View style={styles.section}>
          <View style={styles.scoreCard}>
            {/* Performance Message */}
            <View style={[styles.performanceIcon, { backgroundColor: `${performanceMsg.color}15` }]}>
              <Ionicons name={performanceMsg.icon} size={32} color={performanceMsg.color} />
            </View>
            <Text style={[styles.performanceText, { color: performanceMsg.color }]}>
              {performanceMsg.text}
            </Text>

            {/* Score Circle */}
            <View style={styles.scoreCircleContainer}>
              <View style={styles.scoreCircleOuter}>
                <View style={[styles.scoreCircleProgress, { 
                  borderColor: performanceMsg.color,
                  borderTopWidth: 8,
                  borderRightWidth: percentage >= 25 ? 8 : 0,
                  borderBottomWidth: percentage >= 50 ? 8 : 0,
                  borderLeftWidth: percentage >= 75 ? 8 : 0,
                }]} />
                
                <View style={styles.scoreCircleInner}>
                  <Text style={styles.scorePercentage}>{percentage}%</Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                  <View style={[styles.gradeBadge, { backgroundColor: `${performanceMsg.color}15` }]}>
                    <Text style={[styles.gradeText, { color: performanceMsg.color }]}>
                      Grade {grade}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Score Details */}
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreDetailsText}>
                You answered <Text style={styles.scoreDetailsBold}>{correct}</Text> out of{' '}
                <Text style={styles.scoreDetailsBold}>{total}</Text> correctly
              </Text>
            </View>
          </View>
        </View>

        {/* Points Earned Card */}
        <View style={styles.section}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsContent}>
              <View style={styles.pointsLeft}>
                <View style={styles.pointsIcon}>
                  <Ionicons name="star" size={32} color="#F59E0B" />
                </View>
                <View style={styles.pointsInfo}>
                  <Text style={styles.pointsLabel}>Points Earned</Text>
                  <Text style={styles.pointsValue}>+{points}</Text>
                  <Text style={styles.pointsSubtext}>Use for rewards</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Insights Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                  <Ionicons name={insight.icon} size={20} color={insight.color} />
                </View>
                <Text style={styles.insightLabel}>{insight.label}</Text>
                <Text style={styles.insightValue}>{insight.value}</Text>
                <Text style={styles.insightDetail}>{insight.detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          {recommendations.map((rec, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendationCard}
              activeOpacity={0.7}
            >
              <View style={[styles.recommendationIcon, { backgroundColor: `${rec.color}15` }]}>
                <Ionicons name={rec.icon} size={24} color={rec.color} />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <Text style={styles.recommendationSubtitle}>{rec.subtitle}</Text>
              </View>
              <View style={styles.recommendationAction}>
                <Text style={styles.recommendationActionText}>{rec.action}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: syllabusColor }]}
            onPress={() => navigation.navigate('Tests')}
          >
            <Ionicons name="grid-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Browse All Tests</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('My Results')}
            >
              <Ionicons name="bar-chart-outline" size={20} color="#6B7280" />
              <Text style={styles.secondaryButtonText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="home-outline" size={20} color="#6B7280" />
              <Text style={styles.secondaryButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Study Tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconCircle}>
                <Ionicons name="bulb-outline" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.tipTitle}>Study Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Consistent practice is key to success. Review your mistakes, understand concepts, and keep taking tests regularly to improve!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syllabusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  syllabusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  dateBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: -100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  performanceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  scoreCircleContainer: {
    marginBottom: 24,
  },
  scoreCircleOuter: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scoreCircleProgress: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    transform: [{ rotate: '-90deg' }],
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  scoreCircleInner: {
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  gradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreDetails: {
    alignItems: 'center',
  },
  scoreDetailsText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  scoreDetailsBold: {
    fontWeight: '700',
    color: '#111827',
  },
  pointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 20,
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
  pointsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 2,
  },
  pointsSubtext: {
    fontSize: 11,
    color: '#92400E',
  },
  redeemButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  redeemButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  insightDetail: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recommendationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  recommendationAction: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  recommendationActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EEF2FF',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default ResultsScreen;