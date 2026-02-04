// screens/SyllabusScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

const SyllabusScreen = () => {
  const navigation = useNavigation<any>();
  const [syllabusOptions, setSyllabusOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscribedSyllabusNames, setSubscribedSyllabusNames] = useState<string>('');

  const getSubjectsByName = (name: string) => {
    switch (name) {
      case 'JEE':
        return ['Physics', 'Chemistry', 'Mathematics'];
      case 'NEET':
        return ['Physics', 'Chemistry', 'Biology'];
      case 'MHT-CET':
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
      case 'MHT-CET':
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
      case 'MHT-CET':
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
      case 'MHT-CET':
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
      case 'MHT-CET':
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

  // Use useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, reloading data...');
      loadData();
      
      return () => {
        console.log('Screen unfocused');
      };
    }, [])
  );

  const refreshUserDataFromServer = async (userId: string) => {
    try {
      console.log('=== REFRESHING USER DATA FROM SERVER ===');
      console.log('User ID:', userId);
      
      const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Server response status:', response.status);
      const data = await response.json();
      console.log('Server response success:', data.success);

      if (data.success && data.user) {
        console.log('Fresh user data received from server');
        console.log('Subscription status:', data.user.subscription?.status);
        console.log('Subscription details present:', !!data.user.subscription?.subscriptionDetails);
        
        // Update AsyncStorage with fresh data
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const existingUserData = JSON.parse(userDataString);
          
          // Update the user object while keeping other data (token, loginTime, etc)
          existingUserData.user = data.user;
          
          // Save back to AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(existingUserData));
          console.log('User data refreshed and saved to AsyncStorage');
          
          return data.user;
        }
      } else {
        console.error('Failed to refresh user data:', data.message);
        return null;
      }
    } catch (error: any) {
      console.error('=== ERROR REFRESHING USER DATA ===');
      console.error('Error message:', error.message);
      return null;
    }
  };

  const loadData = async () => {
    console.log('=== LOADING SYLLABUS DATA ===');
    setIsLoading(true);
    
    try {
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('user');
      console.log('User data from storage:', userDataString ? 'Found' : 'Not found');
      
      if (!userDataString) {
        console.log('No user data found - redirecting to login');
        setIsLoading(false);
        Alert.alert('Error', 'Please login to continue', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.user?.id || userData.user?._id;
      
      console.log('User email:', userData.user?.email);
      console.log('User ID:', userId);

      // REFRESH USER DATA FROM SERVER
      console.log('Fetching fresh user data from server...');
      const freshUserData = await refreshUserDataFromServer(userId);
      
      // Use fresh data if available, otherwise use cached data
      const currentUserData = freshUserData || userData.user;
      console.log('Using data:', freshUserData ? 'Fresh from server' : 'Cached from AsyncStorage');

      // Check if user has active subscription with details
      const userSubscription = currentUserData?.subscription;
      console.log('User subscription status:', userSubscription?.status);
      console.log('Subscription details present:', !!userSubscription?.subscriptionDetails);
      console.log('Subscription expired:', userSubscription?.isExpired);
      console.log('Expiry date:', userSubscription?.expiryDate);

      // Validate subscription
      if (!userSubscription || userSubscription.status !== 'Active') {
        console.log('No active subscription found');
        setHasSubscription(false);
        setSyllabusOptions([]);
        setIsLoading(false);
        
        Alert.alert(
          'Subscription Required',
          'Please subscribe to access syllabuses and tests.',
          [{ 
            text: 'Subscribe Now', 
            onPress: () => navigation.navigate('Subscription') 
          }]
        );
        return;
      }

      // Check if subscription is expired
      const expiryDate = userSubscription.expiryDate ? new Date(userSubscription.expiryDate) : null;
      const isExpired = userSubscription.isExpired || (expiryDate && expiryDate < new Date());
      
      if (isExpired) {
        console.log('Subscription has expired');
        setHasSubscription(false);
        setSyllabusOptions([]);
        setIsLoading(false);
        
        Alert.alert(
          'Subscription Expired',
          'Your subscription has expired. Please renew to continue.',
          [{ 
            text: 'Renew Now', 
            onPress: () => navigation.navigate('Subscription') 
          }]
        );
        return;
      }

      // Check if subscription details exist
      if (!userSubscription.subscriptionDetails) {
        console.log('Subscription details missing after server refresh');
        setHasSubscription(false);
        setSyllabusOptions([]);
        setIsLoading(false);
        
        Alert.alert(
          'Subscription Error',
          'Subscription details not found. This might be a temporary issue. Please try again or contact support.',
          [
            { 
              text: 'Retry', 
              onPress: () => loadData()
            },
            { 
              text: 'Go to Subscription', 
              onPress: () => navigation.navigate('Subscription') 
            }
          ]
        );
        return;
      }

      // Get allowed syllabus IDs from subscription details
      const subscriptionDetails = userSubscription.subscriptionDetails;
      console.log('Subscription details:', JSON.stringify(subscriptionDetails, null, 2));
      
      if (!subscriptionDetails.syllabusIds || subscriptionDetails.syllabusIds.length === 0) {
        console.log('No syllabus IDs in subscription');
        setHasSubscription(false);
        setSyllabusOptions([]);
        setIsLoading(false);
        
        Alert.alert(
          'Subscription Error',
          'No syllabuses found in your subscription. Please contact support.',
          [{ text: 'OK' }]
        );
        return;
      }

      const allowedSyllabusIds = subscriptionDetails.syllabusIds.map((s: any) => s._id);
      console.log('Allowed syllabus IDs:', allowedSyllabusIds);
      
      const syllabusNames = subscriptionDetails.syllabusNames || 
                           subscriptionDetails.syllabusIds.map((s: any) => s.name).join(', ');
      console.log('Subscribed syllabus names:', syllabusNames);
      
      setSubscribedSyllabusNames(syllabusNames);
      setHasSubscription(true);

      // Fetch all syllabi from API
      console.log('Fetching syllabi from API...');
      const syllabiRes = await fetch(`${BASE_URL}/api/syllabus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Syllabi API response status:', syllabiRes.status);
      
      if (!syllabiRes.ok) {
        throw new Error(`API returned ${syllabiRes.status}`);
      }

      const syllabiData: SyllabiResponse = await syllabiRes.json();
      console.log('Syllabi count:', syllabiData.syllabi?.length || 0);
      console.log('API success:', syllabiData.success);

      if (syllabiData.success && syllabiData.syllabi) {
        // Log all syllabi
        console.log('All syllabi from API:');
        syllabiData.syllabi.forEach(s => {
          console.log(`  - ${s.name} (${s._id}) - Active: ${s.isActive}`);
        });

        // Filter syllabi to only include those in user's subscription
        const filteredSyllabi = syllabiData.syllabi.filter(s => {
          const isActive = s.isActive;
          const isAllowed = allowedSyllabusIds.includes(s._id);
          console.log(`Filtering ${s.name}: Active=${isActive}, Allowed=${isAllowed}`);
          return isActive && isAllowed;
        });
        
        console.log('Filtered syllabi count:', filteredSyllabi.length);

        if (filteredSyllabi.length === 0) {
          console.log('No matching syllabi found');
          console.log('Allowed IDs:', allowedSyllabusIds);
          console.log('Available syllabus IDs:', syllabiData.syllabi.map(s => s._id));
          
          setSyllabusOptions([]);
          Alert.alert(
            'No Content Available',
            'No syllabi found for your subscription. The subscribed syllabuses may not be active yet. Please contact support.',
            [{ text: 'OK' }]
          );
        } else {
          // Map syllabi to display format
          const options = filteredSyllabi.map(s => ({
            id: s.name,
            syllabusId: s._id,
            title: s.fullName,
            subtitle: getSubtitleByName(s.name),
            icon: getIconByName(s.name),
            color: s.color,
            subjects: getSubjectsByName(s.name),
            totalTests: getTotalTestsByName(s.name),
            students: getStudentsByName(s.name),
            description: s.description,
          }));
          
          console.log('Syllabus options created:', options.length);
          setSyllabusOptions(options);
        }
      } else {
        console.log('API returned failure or no syllabi');
        Alert.alert('Error', 'Failed to load syllabi from server.');
        setSyllabusOptions([]);
      }
    } catch (error: any) {
      console.error('=== LOAD DATA ERROR ===');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      Alert.alert(
        'Error', 
        'Network error. Please check your connection and try again.',
        [{ text: 'Retry', onPress: () => loadData() }]
      );
      setSyllabusOptions([]);
    } finally {
      setIsLoading(false);
      console.log('=== LOAD DATA COMPLETE ===');
    }
  };

  const handleSyllabusSelect = (syllabus: string) => {
    console.log('Selected syllabus:', syllabus);
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
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#5B8DEE" />
          <Text style={styles.loadingStateText}>Loading syllabi...</Text>
          <Text style={styles.loadingStateSubtext}>Fetching your subscription details</Text>
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
              <Text style={styles.headerSubtitle}>
                {hasSubscription && subscribedSyllabusNames 
                  ? subscribedSyllabusNames 
                  : 'Select exam to practice'}
              </Text>
            </View>
          </View>
          {hasSubscription && (
            <View style={styles.premiumBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hasSubscription && (
          <View style={styles.activeSubscriptionBanner}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Active Subscription</Text>
              <Text style={styles.bannerSubtitle}>
                You have access to {subscribedSyllabusNames}
              </Text>
            </View>
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
                <>
                  <Text style={styles.emptyStateSubtitle}>
                    Your subscribed syllabuses are not currently available.{'\n'}
                    Please contact support.
                  </Text>
                  <TouchableOpacity 
                    style={[styles.subscribeButton, { backgroundColor: '#F59E0B' }]}
                    onPress={() => loadData()}
                  >
                    <Ionicons name="refresh" size={18} color="#FFFFFF" />
                    <Text style={styles.subscribeButtonText}>Retry</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            syllabusOptions.map((option) => (
              <TouchableOpacity
                key={option.syllabusId}
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
                  {/* Premium Badge on Card */}
                  <View style={styles.cardPremiumBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                    <Text style={styles.cardPremiumText}>Unlocked</Text>
                  </View>

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
              <Text style={styles.infoTitle}>Why Choose ScoreUp?</Text>
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
                <Text style={styles.benefitText}>Affordable premium access</Text>
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
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 16,
  },
  loadingStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  activeSubscriptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 16,
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 12,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
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
  cardPremiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 10,
  },
  cardPremiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
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
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  subscribeButton: {
    flexDirection: 'row',
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SyllabusScreen;