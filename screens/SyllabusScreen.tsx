// screens/SyllabusScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const SyllabusScreen = () => {
  const navigation = useNavigation<any>();

  const syllabusOptions = [
    {
      id: 'JEE',
      title: 'JEE Main & Advanced',
      subtitle: 'Engineering Entrance',
      icon: 'calculator-outline',
      color: '#5B8DEE',
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
    { icon: 'document-text', text: 'Chapter Tests', color: '#5B8DEE' },
    { icon: 'trophy', text: 'Mock Exams', color: '#8B5CF6' },
    { icon: 'time', text: 'Timed Practice', color: '#F59E0B' },
    { icon: 'analytics', text: 'Analytics', color: '#10B981' },
  ];

  const handleSyllabusSelect = (syllabus: string) => {
    navigation.navigate('TestList', { syllabus });
  };

  return (
    <View style={styles.container}>
      {/* Fixed Compact Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={28} color="#5B8DEE" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Choose Your Path</Text>
              <Text style={styles.headerSubtitle}>Select exam to practice</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Features Row */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresRow}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIconCircle, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={20} color={feature.color} />
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
              <LinearGradient
                colors={['#FFFFFF', '#FAFBFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <LinearGradient
                      colors={[option.color, `${option.color}CC`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardIcon}
                    >
                      <Ionicons name={option.icon} size={32} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{option.title}</Text>
                      <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.cardDescription}>{option.description}</Text>

                {/* Subjects Tags */}
                <View style={styles.subjectsContainer}>
                  {option.subjects.map((subject, idx) => (
                    <View 
                      key={idx} 
                      style={styles.subjectTag}
                    >
                      <Ionicons name="checkmark-circle" size={14} color={option.color} />
                      <Text style={styles.subjectText}>
                        {subject}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconCircle}>
                      <Ionicons name="document-text" size={14} color="#5B8DEE" />
                    </View>
                    <Text style={styles.statText}>{option.totalTests} Tests</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statIconCircle}>
                      <Ionicons name="people" size={14} color="#10B981" />
                    </View>
                    <Text style={styles.statText}>{option.students} Students</Text>
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity 
                  style={styles.startButtonWrapper}
                  onPress={() => handleSyllabusSelect(option.id)}
                >
                  <LinearGradient
                    colors={[option.color, `${option.color}DD`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startButton}
                  >
                    <Text style={styles.startButtonText}>Start Practicing</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F0F4FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCardGradient}
          >
            <View style={styles.infoCardHeader}>
              <LinearGradient
                colors={['#5B8DEE', '#7BA7F7']}
                style={styles.infoIcon}
              >
                <Ionicons name="information-circle" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.infoTitle}>Why Choose MCQ Prep?</Text>
            </View>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Latest exam pattern questions</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Detailed solutions & explanations</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>Performance tracking & analytics</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text style={styles.benefitText}>One-time payment of ₹99 only</Text>
              </View>
            </View>
          </LinearGradient>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  cardsContainer: {
    paddingHorizontal: 24,
  },
  syllabusCard: {
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  subjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  startButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardGradient: {
    padding: 20,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  benefitIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SyllabusScreen;