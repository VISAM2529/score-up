import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SubscriptionScreen = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      const subId = await AsyncStorage.getItem('userSubscriptionId');
      setIsSubscribed(!!subId);
    };
    checkSubscription();
  }, []);

  const fetchSubscriptions = async () => {
    console.log('Fetching subscriptions...');
    setIsLoading(true);
    try {
      const response = await fetch('https://scoreup-admin.vercel.app/api/admin/subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Subscriptions Response status:', response.status);
      const responseData: ApiResponse = await response.json();
      console.log('Subscriptions Response body:', JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.success) {
        // Filter only active subscriptions
        const activeSubs = responseData.subscriptions.filter(sub => sub.isActive);
        setSubscriptions(activeSubs);
      } else {
        Alert.alert('Error', 'Failed to fetch subscriptions. Please try again.');
      }
    } catch (error) {
      console.error('Fetch Subscriptions Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedSubscription) return;

    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Store subscription details
        const subscriptionData = {
          subscriptionId: selectedSubscription._id,
          syllabusNames: selectedSubscription.syllabusIds.map(s => s.name).join(', '),
          price: selectedSubscription.price,
          durationDays: selectedSubscription.durationDays,
          subscribedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + selectedSubscription.durationDays * 24 * 60 * 60 * 1000).toISOString(),
        };

        await AsyncStorage.setItem('userSubscriptionId', selectedSubscription._id);
        await AsyncStorage.setItem('userSubscriptionData', JSON.stringify(subscriptionData));
        
        console.log('Subscription stored:', subscriptionData);
        
        setIsSubscribed(true);
        setIsProcessingPayment(false);
        setShowPaymentModal(false);
        
        Alert.alert(
          'Payment Successful! 🎉',
          `You've subscribed to ${selectedSubscription.syllabusIds.map(s => s.name).join(', ')} for ${selectedSubscription.durationDays} days.`,
          [{ text: 'OK', onPress: () => setSelectedSubscription(null) }]
        );
      } catch (error) {
        console.error('Store Subscription Error:', error);
        setIsProcessingPayment(false);
        Alert.alert('Error', 'Failed to save subscription. Please try again.');
      }
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedSubscription(null);
  };

  const stats = {
    total: subscriptions.length,
    subscribed: isSubscribed ? 1 : 0,
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
    const syllabusNames = item.syllabusIds.map(s => s.name).join(', ');

    return (
      <TouchableOpacity
        style={styles.subscriptionCard}
        onPress={() => handleSubscribeClick(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#FFFFFF', '#FAFBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subscriptionCardGradient}
        >
          {/* Subscription Header */}
          <View style={styles.subscriptionHeader}>
            <LinearGradient
              colors={['#5B8DEE', '#7BA7F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscriptionIconCircle}
            >
              <Ionicons name="card-outline" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.subscriptionHeaderText}>
              <View style={styles.subscriptionTitleRow}>
                <Text style={styles.subscriptionName} numberOfLines={1}>{syllabusNames}</Text>
              </View>
              <View style={styles.subscriptionSubInfo}>
                <Text style={styles.subscriptionSubject}>{item.durationDays} Days Access</Text>
              </View>
            </View>
          </View>

          {/* Subscription Info */}
          <View style={styles.subscriptionMeta}>
            <View style={styles.subscriptionMetaItem}>
              <View style={styles.metaIconCircle}>
                <Ionicons name="document-text" size={12} color="#5B8DEE" />
              </View>
              <Text style={styles.subscriptionMetaText}>{item.syllabusIds.length} Syllabus{item.syllabusIds.length > 1 ? 'es' : ''}</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.subscriptionFooter}>
            <View style={styles.subscriptionFooterLeft}>
              <View style={styles.priceContainer}>
                <Text style={styles.finalPrice}>₹{item.price}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={() => handleSubscribeClick(item)}
            >
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.loadingHeader}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Subscriptions</Text>
              <Text style={styles.headerSubtitle}>Loading plans...</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="card-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyStateTitle}>Loading Subscriptions...</Text>
        </View>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Subscriptions</Text>
            <Text style={styles.headerSubtitle}>{stats.total} plans available</Text>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{stats.subscribed}</Text>
              <Text style={styles.miniStatLabel}>Active</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Subscriptions List */}
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderSubscriptionItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="card-outline" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>No plans available</Text>
            <Text style={styles.emptyStateSubtitle}>Check back soon for new subscriptions</Text>
          </View>
        }
      />

      {/* Razorpay Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePaymentCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.razorpayLogoContainer}>
                <View style={styles.razorpayLogo}>
                  <Text style={styles.razorpayLogoText}>Razorpay</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handlePaymentCancel}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Payment Details */}
            {selectedSubscription && (
              <>
                <View style={styles.paymentDetailsSection}>
                  <Text style={styles.paymentTitle}>Complete Your Payment</Text>
                  <Text style={styles.paymentSubtitle}>
                    {selectedSubscription.syllabusIds.map(s => s.name).join(', ')}
                  </Text>
                  
                  {/* Amount Display */}
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount to Pay</Text>
                    <Text style={styles.amountValue}>₹{selectedSubscription.price}</Text>
                  </View>

                  {/* Plan Details */}
                  <View style={styles.planDetailsCard}>
                    <View style={styles.planDetailRow}>
                      <Ionicons name="time-outline" size={20} color="#6B7280" />
                      <Text style={styles.planDetailText}>
                        {selectedSubscription.durationDays} Days Access
                      </Text>
                    </View>
                    <View style={styles.planDetailRow}>
                      <Ionicons name="book-outline" size={20} color="#6B7280" />
                      <Text style={styles.planDetailText}>
                        {selectedSubscription.syllabusIds.length} Syllabus{selectedSubscription.syllabusIds.length > 1 ? 'es' : ''}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.paymentMethodSection}>
                  <Text style={styles.sectionTitle}>Payment Method</Text>
                  
                  <TouchableOpacity style={styles.paymentMethodCard}>
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="card" size={24} color="#5B8DEE" />
                    </View>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>Test Card</Text>
                      <Text style={styles.paymentMethodSubtext}>**** **** **** 1234</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  <View style={styles.testModeNotice}>
                    <Ionicons name="information-circle" size={16} color="#F59E0B" />
                    <Text style={styles.testModeText}>Test Mode - No actual payment will be charged</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handlePaymentCancel}
                    disabled={isProcessingPayment}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.payButton, isProcessingPayment && styles.payButtonDisabled]}
                    onPress={handlePaymentSuccess}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Text style={styles.payButtonText}>Processing...</Text>
                        <View style={styles.loadingDot} />
                      </>
                    ) : (
                      <>
                        <Text style={styles.payButtonText}>Pay ₹{selectedSubscription.price}</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Secure Payment Notice */}
                <View style={styles.secureNotice}>
                  <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                  <Text style={styles.secureNoticeText}>Secure Payment powered by Razorpay</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  subscriptionCard: {
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subscriptionCardGradient: {
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  subscriptionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionHeaderText: {
    flex: 1,
  },
  subscriptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  subscriptionSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionSubject: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  subscriptionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  subscriptionMetaItem: {
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
  subscriptionMetaText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  subscriptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subscriptionFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    flexWrap: 'wrap',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  finalPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  subscribeButtonText: {
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
  loadingHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  razorpayLogoContainer: {
    flex: 1,
  },
  razorpayLogo: {
    backgroundColor: '#3395FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  razorpayLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetailsSection: {
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  amountContainer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#5B8DEE',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  planDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planDetailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethodSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  testModeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  testModeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },
  payButton: {
    flex: 2,
    backgroundColor: '#5B8DEE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureNoticeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});

export default SubscriptionScreen;