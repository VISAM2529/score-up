// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSubscription {
  plan: string;
  status: string;
  subscriptionId: string;
  activatedOn: string;
  expiryDate: string;
  amount: number;
  transactionId: string;
  orderId: string;
  isExpired?: boolean;
  subscriptionDetails?: {
    _id: string;
    title?: string;
    syllabusIds: Array<{ _id: string; name: string }>;
    price: number;
    discountPercent: number;
    finalPrice: number;
    durationDays: number;
    syllabusNames: string;
  };
}

interface UserData {
  email: string;
  loginTime: string;
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    mobile: string | null;
    isNewUser: boolean;
    subscription?: UserSubscription;
  };
}

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('user');
      console.log('User data from storage:', userDataString);
      
      if (!userDataString) {
        Alert.alert('Error', 'Please login to view profile');
        navigation.replace('Login');
        return;
      }

      const parsedUserData: UserData = JSON.parse(userDataString);
      setUserData(parsedUserData);

      // Check if user has active subscription
      if (parsedUserData.user?.subscription) {
        const sub = parsedUserData.user.subscription;
        const isActive = sub.status === 'Active' && 
                        !sub.isExpired &&
                        sub.expiryDate && 
                        new Date(sub.expiryDate) > new Date();
        
        setHasSubscription(isActive);
        console.log('Subscription status:', isActive ? 'Active' : 'Inactive/Expired');
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('userSubscriptionId');
              await AsyncStorage.removeItem('userSubscriptionData');
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B8DEE" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadUserData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const subscription = userData.user?.subscription;
  const daysRemaining = subscription?.expiryDate ? getDaysRemaining(subscription.expiryDate) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#5B8DEE', '#7BA7F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {userData.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{userData.user.name}</Text>
              <Text style={styles.headerSubtitle}>{userData.user.email}</Text>
            </View>
          </View>
          {/* <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => Alert.alert('Settings', 'Settings coming soon')}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
        </View>

        {/* Subscription Status Banner */}
        {hasSubscription && subscription ? (
          <View style={styles.subscriptionBanner}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Premium Active</Text>
                <Text style={styles.bannerSubtitle}>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expires today'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.renewButton}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.renewButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.subscriptionBanner}>
            <View style={styles.bannerLeft}>
              <View style={[styles.bannerIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star" size={20} color="#F59E0B" />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Free Plan</Text>
                <Text style={styles.bannerSubtitle}>Upgrade to unlock all features</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.renewButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.renewButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="person-outline" size={20} color="#5B8DEE" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.user.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="mail-outline" size={20} color="#5B8DEE" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="call-outline" size={20} color="#5B8DEE" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Mobile Number</Text>
                <Text style={styles.infoValue}>
                  {userData.user.mobile || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="calendar-outline" size={20} color="#5B8DEE" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {formatDate(userData.loginTime)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Details Section */}
        {hasSubscription && subscription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription Details</Text>
            
            <View style={styles.subscriptionCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.subscriptionCardGradient}
              >
                <View style={styles.subscriptionCardHeader}>
                  <View style={styles.subscriptionIconLarge}>
                    <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.subscriptionHeaderText}>
                    <Text style={styles.subscriptionPlan}>Premium Plan</Text>
                    <Text style={styles.subscriptionStatus}>Active</Text>
                  </View>
                </View>

                {subscription.subscriptionDetails && (
                  <View style={styles.subscriptionInfoBox}>
                    <View style={styles.subscriptionInfoRow}>
                      <Ionicons name="book-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.subscriptionInfoText}>
                        {subscription.subscriptionDetails.syllabusNames}
                      </Text>
                    </View>
                    <View style={styles.subscriptionInfoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.subscriptionInfoText}>
                        {subscription.subscriptionDetails.durationDays} Days Access
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.subscriptionDates}>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Activated On</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(subscription.activatedOn)}
                    </Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Expires On</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(subscription.expiryDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.subscriptionFooter}>
                  <View style={styles.amountBox}>
                    <Text style={styles.amountLabel}>Amount Paid</Text>
                    <Text style={styles.amountValue}>₹{subscription.amount}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewReceiptButton}
                    onPress={() => Alert.alert(
                      'Payment Details',
                      `Transaction ID: ${subscription.transactionId}\nOrder ID: ${subscription.orderId}`
                    )}
                  >
                    <Ionicons name="receipt-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.viewReceiptText}>View Receipt</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Results')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="stats-chart-outline" size={24} color="#5B8DEE" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>My Results</Text>
                <Text style={styles.actionSubtitle}>View test performance</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Subscription')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="card-outline" size={24} color="#F59E0B" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Subscription Plans</Text>
                <Text style={styles.actionSubtitle}>
                  {hasSubscription ? 'Manage subscription' : 'Upgrade to premium'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Help', 'Contact support at scoreup14@gmail.com')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="help-circle-outline" size={24} color="#3B82F6" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Help & Support</Text>
                <Text style={styles.actionSubtitle}>Get assistance</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.appVersion}>ScoreUp v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  renewButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  renewButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  subscriptionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  subscriptionCardGradient: {
    padding: 20,
  },
  subscriptionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subscriptionIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  subscriptionHeaderText: {
    flex: 1,
  },
  subscriptionPlan: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  subscriptionInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  subscriptionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionInfoText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  subscriptionDates: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 6,
  },
  dateValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subscriptionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  amountBox: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewReceiptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
  },
});

export default ProfileScreen;