// screens/SyllabusScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SyllabusScreen = () => {
  const navigation = useNavigation<any>();

  const syllabusOptions = [
    {
      id: 'JEE',
      title: 'JEE Main & Advanced',
      subtitle: 'Engineering Entrance',
      icon: 'calculator-outline',
      color: '#4F46E5',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      totalTests: 450,
      students: '2.5M+',
      description: 'Prepare for IIT, NIT, and other engineering colleges',
    },
    {
      id: 'NEET',
      title: 'NEET UG',
      subtitle: 'Medical Entrance',
      icon: 'medkit-outline',
      color: '#EC4899',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      totalTests: 380,
      students: '1.8M+',
      description: 'Crack MBBS, BDS, and AYUSH admissions',
    },
    {
      id: 'CET',
      title: 'MHT-CET',
      subtitle: 'State Entrance',
      icon: 'book-outline',
      color: '#10B981',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      totalTests: 320,
      students: '850K+',
      description: 'Maharashtra engineering & medical admissions',
    },
  ];

  const features = [
    { icon: 'flash-outline', text: 'Chapter Tests', color: '#F59E0B' },
    { icon: 'trophy-outline', text: 'Mock Exams', color: '#8B5CF6' },
    { icon: 'time-outline', text: 'Timed Practice', color: '#3B82F6' },
    { icon: 'analytics-outline', text: 'Analytics', color: '#10B981' },
  ];

  const handleSyllabusSelect = (syllabus: string) => {
    navigation.navigate('TestList', { syllabus });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="school-outline" size={40} color="#4F46E5" />
            </View>
            <Text style={styles.headerTitle}>Choose Your Path</Text>
            <Text style={styles.headerSubtitle}>
              Select your exam to start practicing
            </Text>
          </View>

          {/* Features Row */}
          <View style={styles.featuresRow}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={18} color={feature.color} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Syllabus Cards */}
        <View style={styles.cardsContainer}>
          {syllabusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.syllabusCard}
              onPress={() => handleSyllabusSelect(option.id)}
              activeOpacity={0.7}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.cardIcon, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons name={option.icon} size={32} color={option.color} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{option.title}</Text>
                    <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.arrowButton}>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </View>

              {/* Description */}
              <Text style={styles.cardDescription}>{option.description}</Text>

              {/* Subjects Tags */}
              <View style={styles.subjectsContainer}>
                {option.subjects.map((subject, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.subjectTag, { backgroundColor: `${option.color}10` }]}
                  >
                    <Text style={[styles.subjectText, { color: option.color }]}>
                      {subject}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{option.totalTests} Tests</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{option.students} Students</Text>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: option.color }]}
                onPress={() => handleSyllabusSelect(option.id)}
              >
                <Text style={styles.startButtonText}>Start Practicing</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.infoTitle}>Why Choose MCQ Prep?</Text>
          </View>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Latest exam pattern questions</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Detailed solutions & explanations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Performance tracking & analytics</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.benefitText}>One-time payment of ₹99 only</Text>
            </View>
          </View>
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
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    alignItems: 'center',
    width: 70,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  syllabusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  subjectTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SyllabusScreen;