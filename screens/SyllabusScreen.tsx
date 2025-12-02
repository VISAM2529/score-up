// screens/SyllabusScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://scoreup-admin.vercel.app';

interface Syllabus {
  _id: string;
  name: string;
  fullName: string;
  description: string;
  color: string;
  subjects: any[];
  totalTests: number;
  students: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SyllabiResponse {
  success: boolean;
  syllabi: Syllabus[];
}

interface Subscription {
  _id: string;
  syllabusIds: Syllabus[];
  price: number;
  discountPercent: number;
  finalPrice: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  subscriptions: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const SyllabusScreen = () => {
  const navigation = useNavigation<any>();
  const [syllabusOptions, setSyllabusOptions] = useState<any[]>([]);
  const [allowedSyllabusIds, setAllowedSyllabusIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  const getSubjectsByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return ['Physics', 'Chemistry', 'Mathematics'];
      case 'NEET':
        return ['Physics', 'Chemistry', 'Biology'];
      case 'CET':
        return ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
      default:
        return [];
    }
  };

  const getIconByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return 'calculator-outline';
      case 'NEET':
        return 'medkit-outline';
      case 'CET':
        return 'book-outline';
      default:
        return 'book-outline';
    }
  };

  const getStudentsByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return '2.5M+';
      case 'NEET':
        return '1.8M+';
      case 'CET':
        return '850K+';
      default:
        return '0+';
    }
  };

  const getTotalTestsByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return 450;
      case 'NEET':
        return 380;
      case 'CET':
        return 320;
      default:
        return 0;
    }
  };

  const getSubtitleByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return 'Engineering Entrance';
      case 'NEET':
        return 'Medical Entrance';
      case 'CET':
        return 'State Entrance';
      default:
        return '';
    }
  };

  const features = [
    { icon: 'document-text', text: 'Chapter Tests', color: '#5B8DEE' },
    { icon: 'trophy', text: 'Mock Exams', color: '#8B5CF6' },
    { icon: 'time', text: 'Timed Practice', color: '#F59E0B' },
    { icon: 'analytics', text: 'Analytics', color: '#10B981' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('Loading syllabus data...');
    setIsLoading(true);
    try {
      // Fetch syllabi
      const syllabiRes = await fetch(`${BASE_URL}/api/syllabus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Syllabi Response status:', syllabiRes.status);
      const syllabiData: SyllabiResponse = await syllabiRes.json();
      console.log('Syllabi Response body:', JSON.stringify(syllabiData, null, 2));

      if (syllabiData.success) {
        // Get user subscription ID
        const userSubId = await AsyncStorage.getItem('userSubscriptionId');
        if (!userSubId) {
          console.log('No subscription found, showing all syllabi but prompting to subscribe');
          // For now, show all active syllabi, but you can add a global subscribe prompt
          const activeSyllabi = syllabiData.syllabi.filter(s => s.isActive);
          const options = activeSyllabi.map(s => ({
            id: s.name,
            title: s.fullName,
            subtitle: getSubtitleByName(s.name),
            icon: getIconByName(s.name),
            color: s.color,
            subjects: getSubjectsByName(s.name),
            totalTests: getTotalTestsByName(s.name),
            students: getStudentsByName(s.name),
            description: s.description,
          }));
          setSyllabusOptions(options);
          setHasSubscription(false);
          return;
        }

        // Fetch subscriptions to get user's sub details
        const subsRes = await fetch(`${BASE_URL}/api/admin/subscriptions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Subscriptions Response status:', subsRes.status);
        const subsData: ApiResponse = await subsRes.json();
        console.log('Subscriptions Response body:', JSON.stringify(subsData, null, 2));

        if (subsData.success) {
          const userSub = subsData.subscriptions.find((sub: Subscription) => sub._id === userSubId);
          if (userSub && userSub.isActive) {
            const allowedIds = userSub.syllabusIds.map((s: Syllabus) => s._id);
            setAllowedSyllabusIds(allowedIds);
            console.log('Allowed syllabus IDs:', allowedIds);

            // Filter syllabi based on subscription
            const filteredSyllabi = syllabiData.syllabi.filter(s => s.isActive && allowedIds.includes(s._id));
            const options = filteredSyllabi.map(s => ({
              id: s.name,
              title: s.fullName,
              subtitle: getSubtitleByName(s.name),
              icon: getIconByName(s.name),
              color: s.color,
              subjects: getSubjectsByName(s.name),
              totalTests: getTotalTestsByName(s.name),
              students: getStudentsByName(s.name),
              description: s.description,
            }));
            setSyllabusOptions(options);
            setHasSubscription(true);
          } else {
            console.log('Invalid or inactive subscription');
            Alert.alert('Subscription Expired', 'Your subscription is inactive. Please renew.', [
              { text: 'OK', onPress: () => navigation.navigate('Subscription') }
            ]);
            // Fallback to empty or all
            setSyllabusOptions([]);
          }
        } else {
          Alert.alert('Error', 'Failed to load subscriptions.');
          setSyllabusOptions([]);
        }
      } else {
        Alert.alert('Error', 'Failed to load syllabi.');
        setSyllabusOptions([]);
      }
    } catch (error) {
      console.error('Load Data Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
      setSyllabusOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyllabusSelect = (syllabus: string) => {
    navigation.navigate('TestList', { syllabus });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="school" size={28} color="#5B8DEE" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Choose Your Path</Text>
                <Text style={styles.headerSubtitle}>Loading...</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="hourglass-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyStateTitle}>Loading syllabi...</Text>
        </View>
      </View>
    );
  }

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
          {!hasSubscription && (
            <TouchableOpacity 
              style={styles.subscribeHeaderButton}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.subscribeHeaderButtonText}>Subscribe</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!hasSubscription && syllabusOptions.length > 0 && (
          <View style={styles.subscriptionPrompt}>
            <Ionicons name="star-outline" size={20} color="#F59E0B" />
            <Text style={styles.subscriptionPromptText}>Subscribe to unlock all syllabi and premium tests!</Text>
            <TouchableOpacity 
              style={styles.subscribePromptButton}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.subscribePromptButtonText}>Get Premium</Text>
            </TouchableOpacity>
          </View>
        )}

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
          {syllabusOptions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="book-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyStateTitle}>No syllabi available</Text>
              {!hasSubscription ? (
                <>
                  <Text style={styles.emptyStateSubtitle}>Subscribe to access premium syllabi and tests</Text>
                  <TouchableOpacity 
                    style={styles.subscribeButton}
                    onPress={() => navigation.navigate('Subscription')}
                  >
                    <Text style={styles.subscribeButtonText}>Choose Plan</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.emptyStateSubtitle}>Check back soon for new syllabi</Text>
              )}
            </View>
          ) : (
            syllabusOptions.map((option) => (
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
            ))
          )}
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
  subscribeHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeHeaderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  subscriptionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  subscriptionPromptText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    fontWeight: '500',
  },
  subscribePromptButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subscribePromptButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SyllabusScreen;