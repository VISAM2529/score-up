// screens/SyllabusScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SyllabusScreen = () => {
  const navigation = useNavigation<any>();
  const [syllabi, setSyllabi] = useState<any[]>([]);
  const [filteredSyllabi, setFilteredSyllabi] = useState<any[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const features = [
    { icon: 'flash-outline', text: 'Chapter Tests', color: '#F59E0B' },
    { icon: 'trophy-outline', text: 'Mock Exams', color: '#8B5CF6' },
    { icon: 'time-outline', text: 'Timed Practice', color: '#3B82F6' },
    { icon: 'analytics-outline', text: 'Analytics', color: '#10B981' },
  ];

  // ✅ Load user subscription from AsyncStorage
  const loadUserSubscription = async () => {
    try {
      const subscriptionData = await AsyncStorage.getItem('@user_subscription');
      if (subscriptionData) {
        const subscription = JSON.parse(subscriptionData);
        
        // Check if subscription is still active
        const expiryDate = new Date(subscription.expiryDate);
        const now = new Date();
        
        if (expiryDate > now) {
          setUserSubscription(subscription);
          setHasActiveSubscription(true);
          return subscription;
        } else {
          // Subscription expired
          await AsyncStorage.removeItem('@user_subscription');
          setHasActiveSubscription(false);
          Alert.alert(
            'Subscription Expired',
            'Your subscription has expired. Please purchase a new plan to continue.',
            [
              {
                text: 'View Plans',
                onPress: () => navigation.navigate('Subscription'),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
          return null;
        }
      } else {
        setHasActiveSubscription(false);
        return null;
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setHasActiveSubscription(false);
      return null;
    }
  };

  // ✅ Fetch syllabi from API
  const fetchSyllabi = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://scoreup-admin.vercel.app/api/syllabus');
      const data = await res.json();
      if (data.success && Array.isArray(data.syllabi)) {
        setSyllabi(data.syllabi);
        return data.syllabi;
      } else {
        console.warn('Invalid syllabi data received');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch syllabi:', error);
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Filter syllabi based on subscription
  const filterSyllabiBySubscription = (allSyllabi: any[], subscription: any) => {
    if (!subscription || !subscription.syllabusNames || subscription.syllabusNames.length === 0) {
      // No subscription, show message to purchase
      setFilteredSyllabi([]);
      return;
    }

    // Filter syllabi that match the purchased syllabus IDs
    const purchasedSyllabusIds = subscription.syllabusNames;
    const filtered = allSyllabi.filter((syllabus) =>
      purchasedSyllabusIds.includes(syllabus._id)
    );

    setFilteredSyllabi(filtered);
  };

  // ✅ Load selected syllabi from AsyncStorage (optional legacy support)
  const loadSelected = async () => {
    try {
      const raw = await AsyncStorage.getItem('@selected_syllabi');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSelectedSyllabi(parsed);
        else setSelectedSyllabi([]);
      } else setSelectedSyllabi([]);
    } catch {
      setSelectedSyllabi([]);
    }
  };

  // ✅ Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    // Load subscription first
    const subscription = await loadUserSubscription();
    
    // Then fetch syllabi
    const allSyllabi = await fetchSyllabi();
    
    // Filter syllabi based on subscription
    if (subscription && allSyllabi.length > 0) {
      filterSyllabiBySubscription(allSyllabi, subscription);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    initializeData();
  };

  // ✅ Handle syllabus selection
  const handleSyllabusSelect = (syllabusId: string, syllabusName: string) => {
    if (!hasActiveSubscription) {
      Alert.alert(
        'Subscription Required',
        'Please purchase a subscription to access this content.',
        [
          {
            text: 'View Plans',
            onPress: () => navigation.navigate('Subscription'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    console.log('Selected Syllabus:', syllabusId, syllabusName);
    navigation.navigate('TestList', {
      syllabusId,       // used for API call
      syllabusName,     // used for UI color and title
    });
  };

  // ✅ Navigate to subscription screen
  const handleViewPlans = () => {
    navigation.navigate('Subscription');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ color: '#6B7280', marginTop: 10 }}>Loading syllabi...</Text>
      </View>
    );
  }

  // ✅ Show subscription required message if no active subscription
  if (!hasActiveSubscription) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Subscription Required</Text>
            <Text style={styles.emptyMessage}>
              Purchase a subscription to access premium content and start your exam preparation.
            </Text>
            
            <TouchableOpacity
              style={styles.viewPlansButton}
              onPress={handleViewPlans}
              activeOpacity={0.8}
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
              <Text style={styles.viewPlansText}>View Subscription Plans</Text>
            </TouchableOpacity>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>What you'll get:</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.benefitText}>Access to all exam syllabi</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.benefitText}>Unlimited practice tests</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.benefitText}>Detailed performance analytics</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.benefitText}>Mock exams & timed tests</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ✅ Show message if no syllabi match subscription
  if (filteredSyllabi.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="albums-outline" size={64} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No Syllabi Available</Text>
            <Text style={styles.emptyMessage}>
              Your subscription is active, but no matching syllabi were found. Please contact support.
            </Text>
            
            <TouchableOpacity
              style={styles.viewPlansButton}
              onPress={handleViewPlans}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.viewPlansText}>View All Plans</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
            <Text style={styles.headerSubtitle}>Select your exam to start practicing</Text>
            
            {/* Subscription Badge */}
            {userSubscription && (
              <View style={styles.subscriptionBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.subscriptionBadgeText}>
                  Premium Active • {Math.ceil((new Date(userSubscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                </Text>
              </View>
            )}
          </View>

          {/* Features Row */}
          <View style={styles.featuresRow}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon as any} size={18} color={feature.color} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Syllabus Cards */}
        <View style={styles.cardsContainer}>
          {filteredSyllabi.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.syllabusCard}
              onPress={() => handleSyllabusSelect(item._id, item.name)}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.cardIcon, { backgroundColor: `${item.color || '#4F46E5'}15` }]}>
                    <Ionicons
                      name="book-outline"
                      size={32}
                      color={item.color || '#4F46E5'}
                    />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{item.fullName}</Text>
                    <Text style={styles.cardSubtitle}>
                      {item.name === 'JEE'
                        ? 'Engineering Entrance'
                        : item.name === 'NEET'
                        ? 'Medical Entrance'
                        : 'Entrance Exam'}
                    </Text>
                  </View>
                </View>
                <View style={styles.arrowButton}>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </View>

              {/* Description */}
              <Text style={styles.cardDescription}>{item.description || 'No description available.'}</Text>

              {/* Subjects */}
              <View style={styles.subjectsContainer}>
                {item.subjects && item.subjects.length > 0 ? (
                  item.subjects.map((sub: string, idx: number) => (
                    <View
                      key={idx}
                      style={[styles.subjectTag, { backgroundColor: `${item.color || '#4F46E5'}10` }]}
                    >
                      <Text style={[styles.subjectText, { color: item.color || '#4F46E5' }]}>
                        {sub}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>No subjects added</Text>
                )}
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{item.totalTests || 0} Tests</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>
                    {item.students ? `${item.students}+` : 'No data'} Students
                  </Text>
                </View>
              </View>

              {/* Action */}
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: item.color || '#4F46E5' }]}
                onPress={() => handleSyllabusSelect(item._id, item.name)}
              >
                <Text style={styles.startButtonText}>Start Practicing</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
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
              <Text style={styles.benefitText}>Premium access starting at ₹99</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  headerContent: { alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  headerSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  subscriptionBadgeText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
  },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12 },
  featureItem: { alignItems: 'center', width: 70 },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: { fontSize: 11, color: '#6B7280', textAlign: 'center', fontWeight: '500' },
  cardsContainer: { paddingHorizontal: 24, paddingTop: 24 },
  syllabusCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardSubtitle: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginVertical: 10 },
  subjectsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  subjectTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  subjectText: { fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 20,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  startButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  benefitsList: { gap: 12 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { fontSize: 14, color: '#6B7280', flex: 1 },
  bottomSpacing: { height: 20 },
  
  // Empty state styles
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  viewPlansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginBottom: 32,
    elevation: 4,
  },
  viewPlansText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
});

export default SyllabusScreen;