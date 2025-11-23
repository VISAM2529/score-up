import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
// import RazorpayCheckout from 'react-native-razorpay'; // Uncomment for native
// For Expo: npm install react-native-razorpay

const { width } = Dimensions.get('window');

interface Syllabus {
  _id: string;
  name: string;
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

const SubscriptionScreen = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://scoreup-admin.vercel.app/api/admin/subscriptions'
      );
      const data: ApiResponse = await response.json();

      if (data.success) {
        // Filter only active subscriptions
        const activeSubscriptions = data.subscriptions.filter(
          (sub) => sub.isActive
        );
        setSubscriptions(activeSubscriptions);
      } else {
        Alert.alert('Error', 'Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      Alert.alert('Error', 'Something went wrong while fetching subscriptions');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscriptions();
  };

  // Calculate discount percentage for display
  const getDiscountPercentage = (price: number, finalPrice: number) => {
    if (price === finalPrice) return 0;
    return Math.round(((price - finalPrice) / price) * 100);
  };

  // Handle Razorpay Payment
  const handlePayment = async (subscription: Subscription) => {
    setProcessingPayment(true);
    setSelectedPlan(subscription._id);

    try {
      // Razorpay options
      const options = {
        description: `Subscription for ${subscription.syllabusIds
          .map((s) => s.name)
          .join(', ')}`,
        image: 'https://your-logo-url.com/logo.png', // Replace with your logo
        currency: 'INR',
        key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay Test Key
        amount: subscription.finalPrice * 100, // Amount in paise
        name: 'ScoreUp Premium',
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User Name',
        },
        theme: { color: '#0066FF' },
      };

      // For React Native (non-Expo)
      // Uncomment when using react-native-razorpay
      /*
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment Success
          await saveSubscriptionToStorage(subscription);
          Alert.alert(
            'Success',
            `Payment successful! Payment ID: ${data.razorpay_payment_id}`
          );
        })
        .catch((error: any) => {
          // Payment Failed
          Alert.alert('Payment Failed', `Error: ${error.description}`);
        })
        .finally(() => {
          setProcessingPayment(false);
          setSelectedPlan(null);
        });
      */

      // FOR TESTING: Simulate payment success
      // Remove this in production and use actual Razorpay integration
      setTimeout(async () => {
        await saveSubscriptionToStorage(subscription);
        Alert.alert(
          'Success! 🎉',
          `Subscription activated successfully!\n\nPlan: ${subscription.syllabusIds
            .map((s) => s.name)
            .join(', ')}\nDuration: ${subscription.durationDays} days\nAmount: ₹${
            subscription.finalPrice
          }`
        );
        setProcessingPayment(false);
        setSelectedPlan(null);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment initialization failed');
      setProcessingPayment(false);
      setSelectedPlan(null);
    }
  };

  // Save subscription to AsyncStorage
  const saveSubscriptionToStorage = async (subscription: Subscription) => {
    try {
      const subscriptionData = {
        subscriptionId: subscription._id,
        syllabusNames: subscription.syllabusIds.map((s) => s._id),
        finalPrice: subscription.finalPrice,
        durationDays: subscription.durationDays,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(
  Date.now() + 365 * 24 * 60 * 60 * 1000
).toISOString(),

      };

      await AsyncStorage.setItem(
        '@user_subscription',
        JSON.stringify(subscriptionData)
      );
      console.log('Subscription saved to storage:', subscriptionData);
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  // Render subscription card
  const renderSubscriptionCard = (subscription: Subscription, index: number) => {
    const discount = getDiscountPercentage(
      subscription.price,
      subscription.finalPrice
    );
    const isProcessing =
      processingPayment && selectedPlan === subscription._id;

    return (
      <View key={subscription._id} style={styles.cardWrapper}>
        <LinearGradient
          colors={
            index % 3 === 0
              ? ['#667eea', '#764ba2']
              : index % 3 === 1
              ? ['#f093fb', '#f5576c']
              : ['#4facfe', '#00f2fe']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}

          {/* Card Content */}
          <View style={styles.card}>
            {/* Syllabus Names */}
            <View style={styles.syllabusContainer}>
              {subscription.syllabusIds.map((syllabus, idx) => (
                <View key={syllabus._id} style={styles.syllabusChip}>
                  <Ionicons name="book-outline" size={14} color="#0066FF" />
                  <Text style={styles.syllabusText}>{syllabus.name}</Text>
                </View>
              ))}
            </View>

            {/* Duration */}
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={20} color="#64748B" />
              <Text style={styles.durationText}>
                {subscription.durationDays} Days Access
              </Text>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                {subscription.price !== subscription.finalPrice && (
                  <Text style={styles.originalPrice}>₹{subscription.price}</Text>
                )}
                <Text style={styles.finalPrice}>₹{subscription.finalPrice}</Text>
              </View>
              <Text style={styles.priceLabel}>Total Price</Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.featureText}>Unlimited Practice</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.featureText}>Detailed Analytics</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.featureText}>Expert Support</Text>
              </View>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity
              style={[styles.subscribeButton, isProcessing && styles.buttonDisabled]}
              onPress={() => handlePayment(subscription)}
              disabled={isProcessing || processingPayment}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#0066FF', '#0052CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Subscribe Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Loading Subscriptions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EEF2FF', '#FEFEFE', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Premium Plans</Text>
            <Text style={styles.headerSubtitle}>
              Choose the perfect plan for you
            </Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={28} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {/* Subscriptions List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {subscriptions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>No active subscriptions found</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchSubscriptions}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {subscriptions.map((subscription, index) =>
                renderSubscriptionCard(subscription, index)
              )}

              {/* Trust Badge */}
              <View style={styles.trustBadge}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.trustText}>
                  Secure payment powered by Razorpay
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  cardWrapper: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 3,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  syllabusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  syllabusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  syllabusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066FF',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  durationText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  finalPrice: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  subscribeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 12,
  },
  trustText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});