// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, Linking, Platform } from 'react-native';
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as WebBrowser from 'expo-web-browser';

// const BASE_URL = 'https://scoreup-admin.vercel.app';
// const RAZORPAY_KEY_ID = 'rzp_test_Rn87PfZGoGlv4l';

// interface Syllabus {
//   _id: string;
//   name: string;
// }

// interface Subscription {
//   _id: string;
//   syllabusIds: Syllabus[];
//   price: number;
//   discountPercent: number;
//   finalPrice: number;
//   durationDays: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ApiResponse {
//   success: boolean;
//   subscriptions: Subscription[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//   };
// }

// interface UserSubscription {
//   plan: string;
//   status: string;
//   subscriptionId: string;
//   activatedOn: string;
//   expiryDate: string;
//   amount: number;
//   transactionId: string;
//   orderId: string;
// }

// const SubscriptionScreen = () => {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
//   const navigation = useNavigation<any>();
  
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const currentOrderIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     fetchUserData();
//     fetchSubscriptions();
    
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//     };
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const userDataString = await AsyncStorage.getItem('user');
//       if (userDataString) {
//         const userData = JSON.parse(userDataString);
//         console.log('User data from storage:', userData);
        
//         // Check if user has an active subscription
//         if (userData.user?.subscription) {
//           const sub = userData.user.subscription;
          
//           // Check if subscription is active and not expired
//           const isActive = sub.status === 'Active' && 
//                           sub.expiryDate && 
//                           new Date(sub.expiryDate) > new Date();
          
//           if (isActive) {
//             setUserSubscription(sub);
//             console.log('Active subscription found:', sub.subscriptionId);
//           } else {
//             setUserSubscription(null);
//             console.log('No active subscription or subscription expired');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const pollPaymentStatus = async (orderId: string) => {
//     try {
//       console.log('Polling payment status for order:', orderId);
      
//       const response = await fetch(`${BASE_URL}/api/razorpay/payment-callback?orderId=${orderId}`);
//       const data = await response.json();
      
//       console.log('Payment status:', data);
      
//       if (data.status === 'success') {
//         if (pollingIntervalRef.current) {
//           clearInterval(pollingIntervalRef.current);
//           pollingIntervalRef.current = null;
//         }
        
//         await processSuccessfulPayment(data.orderId, data.paymentId, data.signature);
        
//       } else if (data.status === 'failed') {
//         if (pollingIntervalRef.current) {
//           clearInterval(pollingIntervalRef.current);
//           pollingIntervalRef.current = null;
//         }
        
//         setIsProcessingPayment(false);
//         Alert.alert('Payment Failed', data.reason || 'Something went wrong. Please try again.');
        
//       } else if (data.status === 'cancelled') {
//         if (pollingIntervalRef.current) {
//           clearInterval(pollingIntervalRef.current);
//           pollingIntervalRef.current = null;
//         }
        
//         setIsProcessingPayment(false);
//         Alert.alert('Payment Cancelled', 'You cancelled the payment.');
//       }
      
//     } catch (error) {
//       console.error('Error polling payment status:', error);
//     }
//   };

//   const startPolling = (orderId: string) => {
//     currentOrderIdRef.current = orderId;
    
//     pollingIntervalRef.current = setInterval(() => {
//       pollPaymentStatus(orderId);
//     }, 2000);
    
//     setTimeout(() => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//         pollingIntervalRef.current = null;
//         setIsProcessingPayment(false);
//         Alert.alert('Timeout', 'Payment verification timed out. Please check your subscription status.');
//       }
//     }, 5 * 60 * 1000);
//   };

//   const processSuccessfulPayment = async (orderId: string, paymentId: string, signature: string) => {
//     if (!selectedSubscription) {
//       console.error('No subscription selected');
//       setIsProcessingPayment(false);
//       return;
//     }

//     console.log('Processing successful payment...');
    
//     const isVerified = await verifyPayment(orderId, paymentId, signature);
    
//     if (isVerified) {
//       console.log('Payment verified successfully');
      
//       const updateSuccess = await updateUserSubscription(paymentId, orderId, selectedSubscription);

//       if (updateSuccess) {
//         const subscriptionData = {
//           subscriptionId: selectedSubscription._id,
//           syllabusNames: selectedSubscription.syllabusIds.map(s => s.name).join(', '),
//           price: selectedSubscription.price,
//           durationDays: selectedSubscription.durationDays,
//           subscribedAt: new Date().toISOString(),
//           expiresAt: new Date(Date.now() + selectedSubscription.durationDays * 24 * 60 * 60 * 1000).toISOString(),
//           paymentId: paymentId,
//           orderId: orderId,
//         };

//         await AsyncStorage.setItem('userSubscriptionId', selectedSubscription._id);
//         await AsyncStorage.setItem('userSubscriptionData', JSON.stringify(subscriptionData));
        
//         // Update user data in AsyncStorage with new subscription
//         const userDataString = await AsyncStorage.getItem('user');
//         if (userDataString) {
//           const userData = JSON.parse(userDataString);
//           userData.user.subscription = {
//             plan: 'Premium',
//             status: 'Active',
//             subscriptionId: selectedSubscription._id,
//             activatedOn: new Date().toISOString(),
//             expiryDate: new Date(Date.now() + selectedSubscription.durationDays * 24 * 60 * 60 * 1000).toISOString(),
//             amount: selectedSubscription.price,
//             transactionId: paymentId,
//             orderId: orderId
//           };
//           await AsyncStorage.setItem('user', JSON.stringify(userData));
//           setUserSubscription(userData.user.subscription);
//         }
        
//         setShowPaymentModal(false);
//         setIsProcessingPayment(false);
        
//         // After updating AsyncStorage in processSuccessfulPayment
// Alert.alert(
//   'Payment Successful! 🎉',
//   `You've subscribed to ${selectedSubscription.syllabusIds.map(s => s.name).join(', ')} for ${selectedSubscription.durationDays} days.\n\nYour subscription is now active!`,
//   [{ 
//     text: 'OK',
//     onPress: () => {
//       setSelectedSubscription(null);
//       // Navigate to home and back to force refresh
//       navigation.navigate('Home');
//     }
//   }]
// );
//       } else {
//         Alert.alert('Error', 'Failed to update subscription. Please contact support with Payment ID: ' + paymentId);
//         setIsProcessingPayment(false);
//       }
//     } else {
//       Alert.alert('Error', 'Payment verification failed. Please contact support.');
//       setIsProcessingPayment(false);
//     }
//   };

//   const updateUserSubscription = async (
//     paymentId: string, 
//     orderId: string, 
//     subscription: Subscription
//   ): Promise<boolean> => {
//     try {
//       console.log('=== UPDATING USER SUBSCRIPTION ===');
      
//       const userDataString = await AsyncStorage.getItem('user');
//       if (!userDataString) {
//         console.error('User data not found in AsyncStorage');
//         return false;
//       }

//       const userData = JSON.parse(userDataString);
//       const userId = userData.user?.id || userData.user?._id;

//       console.log('User ID:', userId);
//       console.log('Subscription ID:', subscription._id);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 10000);

//       try {
//         const response = await fetch(`${BASE_URL}/api/user/update-subscription`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId: userId,
//             subscriptionId: subscription._id,
//             paymentId: paymentId,
//             orderId: orderId,
//             amount: subscription.price,
//             durationDays: subscription.durationDays
//           }),
//           signal: controller.signal
//         });

//         clearTimeout(timeoutId);

//         const data = await response.json();
//         console.log('Update subscription response:', data);

//         return data.success;
//       } catch (fetchError: any) {
//         console.error('DB update failed:', fetchError);
//         // Return true anyway - payment was successful
//         return true;
//       }
//     } catch (error) {
//       console.error('Update subscription error:', error);
//       return true;
//     }
//   };

//   const fetchSubscriptions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/api/admin/subscriptions`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const responseData: ApiResponse = await response.json();

//       if (response.ok && responseData.success) {
//         const activeSubs = responseData.subscriptions.filter(sub => sub.isActive);
//         setSubscriptions(activeSubs);
//       } else {
//         Alert.alert('Error', 'Failed to fetch subscriptions. Please try again.');
//       }
//     } catch (error) {
//       console.error('Fetch Subscriptions Error:', error);
//       Alert.alert('Error', 'Network error. Please check your connection.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubscribeClick = (subscription: Subscription, isSubscribed: boolean) => {
//     if (isSubscribed) {
//       Alert.alert(
//         'Already Subscribed',
//         'You already have an active subscription for this plan.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }
    
//     setSelectedSubscription(subscription);
//     setShowPaymentModal(true);
//   };

//   const createRazorpayOrder = async (amount: number) => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/razorpay/create-order`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: amount * 100,
//           currency: 'INR',
//         }),
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         return data.order;
//       } else {
//         throw new Error(data.message || 'Failed to create order');
//       }
//     } catch (error) {
//       console.error('Create Order Error:', error);
//       throw error;
//     }
//   };

//   const verifyPayment = async (
//     orderId: string,
//     paymentId: string,
//     signature: string
//   ) => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/razorpay/verify-payment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           orderId,
//           paymentId,
//           signature,
//         }),
//       });

//       const data = await response.json();
//       return data.success;
//     } catch (error) {
//       console.error('Verify Payment Error:', error);
//       return false;
//     }
//   };

//   const openRazorpayCheckout = async (order: any, userData: any) => {
//     try {
//       const syllabusNames = selectedSubscription?.syllabusIds.map(s => s.name).join(', ') || '';
//       const durationDays = selectedSubscription?.durationDays || 0;
      
//       const paymentUrl = `${BASE_URL}/api/razorpay/payment-page?` + 
//         `orderId=${encodeURIComponent(order.id)}` +
//         `&amount=${encodeURIComponent(order.amount)}` +
//         `&currency=${encodeURIComponent(order.currency)}` +
//         `&description=${encodeURIComponent(`${syllabusNames} - ${durationDays} Days`)}` +
//         `&name=${encodeURIComponent(userData.userName)}` +
//         `&email=${encodeURIComponent(userData.userEmail)}` +
//         `&contact=${encodeURIComponent(userData.userPhone)}` +
//         `&returnUrl=${encodeURIComponent(BASE_URL)}`;

//       console.log('Opening payment URL:', paymentUrl);
      
//       startPolling(order.id);
      
//       const result = await WebBrowser.openBrowserAsync(paymentUrl, {
//         toolbarColor: '#5B8DEE',
//         controlsColor: '#FFFFFF',
//         showTitle: true,
//         dismissButtonStyle: 'close',
//       });
      
//       console.log('WebBrowser closed:', result);
      
//     } catch (error) {
//       console.error('Error opening Razorpay:', error);
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//       throw error;
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     if (!selectedSubscription) return;

//     setIsProcessingPayment(true);

//     try {
//       const userDataString = await AsyncStorage.getItem('user');
//       if (!userDataString) {
//         Alert.alert('Error', 'Please login to continue');
//         setIsProcessingPayment(false);
//         return;
//       }

//       const userData = JSON.parse(userDataString);
//       const userEmail = userData.user?.email || 'user@example.com';
//       const userName = userData.user?.name || 'User';
//       const userPhone = userData.user?.phone || '9999999999';

//       const order = await createRazorpayOrder(selectedSubscription.price);

//       await openRazorpayCheckout(order, {
//         userName,
//         userEmail,
//         userPhone,
//       });

//     } catch (error) {
//       console.error('Payment Error:', error);
//       setIsProcessingPayment(false);
//       Alert.alert('Error', 'Failed to initiate payment. Please try again.');
//     }
//   };

//   const handlePaymentCancel = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//     setShowPaymentModal(false);
//     setSelectedSubscription(null);
//     setIsProcessingPayment(false);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const stats = {
//     total: subscriptions.length,
//     subscribed: userSubscription ? 1 : 0,
//   };

//   const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
//     const syllabusNames = item.syllabusIds.map(s => s.name).join(', ');
//     const isSubscribed = userSubscription?.subscriptionId === item._id;
//     const expiryDate = userSubscription && isSubscribed ? formatDate(userSubscription.expiryDate) : null;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.subscriptionCard,
//           isSubscribed && styles.subscriptionCardActive
//         ]}
//         onPress={() => handleSubscribeClick(item, isSubscribed)}
//         activeOpacity={0.7}
//         disabled={isSubscribed}
//       >
//         <LinearGradient
//           colors={isSubscribed ? ['#E0F2FE', '#DBEAFE'] : ['#FFFFFF', '#FAFBFF']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.subscriptionCardGradient}
//         >
//           {isSubscribed && (
//             <View style={styles.subscribedBadge}>
//               <Ionicons name="checkmark-circle" size={16} color="#10B981" />
//               <Text style={styles.subscribedBadgeText}>Active</Text>
//             </View>
//           )}

//           <View style={styles.subscriptionHeader}>
//             <LinearGradient
//               colors={isSubscribed ? ['#10B981', '#059669'] : ['#5B8DEE', '#7BA7F7']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.subscriptionIconCircle}
//             >
//               <Ionicons 
//                 name={isSubscribed ? "checkmark-circle" : "card-outline"} 
//                 size={24} 
//                 color="#FFFFFF" 
//               />
//             </LinearGradient>
//             <View style={styles.subscriptionHeaderText}>
//               <View style={styles.subscriptionTitleRow}>
//                 <Text style={styles.subscriptionName} numberOfLines={1}>
//                   {syllabusNames}
//                 </Text>
//               </View>
//               <View style={styles.subscriptionSubInfo}>
//                 <Text style={styles.subscriptionSubject}>
//                   {item.durationDays} Days Access
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.subscriptionMeta}>
//             <View style={styles.subscriptionMetaItem}>
//               <View style={styles.metaIconCircle}>
//                 <Ionicons name="document-text" size={12} color="#5B8DEE" />
//               </View>
//               <Text style={styles.subscriptionMetaText}>
//                 {item.syllabusIds.length} Syllabus{item.syllabusIds.length > 1 ? 'es' : ''}
//               </Text>
//             </View>
            
//             {isSubscribed && expiryDate && (
//               <View style={styles.subscriptionMetaItem}>
//                 <View style={[styles.metaIconCircle, { backgroundColor: '#FEF3C7' }]}>
//                   <Ionicons name="calendar-outline" size={12} color="#F59E0B" />
//                 </View>
//                 <Text style={styles.subscriptionMetaText}>
//                   Expires: {expiryDate}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.subscriptionFooter}>
//             <View style={styles.subscriptionFooterLeft}>
//               <View style={styles.priceContainer}>
//                 <Text style={[
//                   styles.finalPrice,
//                   isSubscribed && styles.finalPriceActive
//                 ]}>
//                   ₹{item.price}
//                 </Text>
//               </View>
//             </View>
            
//             {isSubscribed ? (
//               <View style={styles.activeButton}>
//                 <Ionicons name="shield-checkmark" size={16} color="#10B981" />
//                 <Text style={styles.activeButtonText}>Active Plan</Text>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 style={styles.subscribeButton}
//                 onPress={() => handleSubscribeClick(item, isSubscribed)}
//               >
//                 <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
//                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.loadingHeader}>
//           <View style={styles.headerRow}>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.headerTitle}>Subscriptions</Text>
//               <Text style={styles.headerSubtitle}>Loading plans...</Text>
//             </View>
//           </View>
//         </LinearGradient>
//         <View style={styles.emptyState}>
//           <View style={styles.emptyIconCircle}>
//             <Ionicons name="card-outline" size={48} color="#9CA3AF" />
//           </View>
//           <Text style={styles.emptyStateTitle}>Loading Subscriptions...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
          
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>Subscriptions</Text>
//             <Text style={styles.headerSubtitle}>{stats.total} plans available</Text>
//           </View>

//           <View style={styles.headerStats}>
//             <View style={styles.miniStat}>
//               <Text style={styles.miniStatValue}>{stats.subscribed}</Text>
//               <Text style={styles.miniStatLabel}>Active</Text>
//             </View>
//           </View>
//         </View>
//       </LinearGradient>

//       <FlatList
//         data={subscriptions}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         renderItem={renderSubscriptionItem}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <View style={styles.emptyIconCircle}>
//               <Ionicons name="card-outline" size={48} color="#9CA3AF" />
//             </View>
//             <Text style={styles.emptyStateTitle}>No plans available</Text>
//             <Text style={styles.emptyStateSubtitle}>Check back soon for new subscriptions</Text>
//           </View>
//         }
//       />

//       <Modal
//         visible={showPaymentModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={handlePaymentCancel}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.razorpayLogoContainer}>
//                 <View style={styles.razorpayLogo}>
//                   <Text style={styles.razorpayLogoText}>Razorpay</Text>
//                 </View>
//               </View>
//               <TouchableOpacity 
//                 style={styles.closeButton}
//                 onPress={handlePaymentCancel}
//                 disabled={isProcessingPayment}
//               >
//                 <Ionicons name="close" size={24} color="#374151" />
//               </TouchableOpacity>
//             </View>

//             {selectedSubscription && (
//               <>
//                 <View style={styles.paymentDetailsSection}>
//                   <Text style={styles.paymentTitle}>Complete Your Payment</Text>
//                   <Text style={styles.paymentSubtitle}>
//                     {selectedSubscription.syllabusIds.map(s => s.name).join(', ')}
//                   </Text>
                  
//                   <View style={styles.amountContainer}>
//                     <Text style={styles.amountLabel}>Amount to Pay</Text>
//                     <Text style={styles.amountValue}>₹{selectedSubscription.price}</Text>
//                   </View>

//                   <View style={styles.planDetailsCard}>
//                     <View style={styles.planDetailRow}>
//                       <Ionicons name="time-outline" size={20} color="#6B7280" />
//                       <Text style={styles.planDetailText}>
//                         {selectedSubscription.durationDays} Days Access
//                       </Text>
//                     </View>
//                     <View style={styles.planDetailRow}>
//                       <Ionicons name="book-outline" size={20} color="#6B7280" />
//                       <Text style={styles.planDetailText}>
//                         {selectedSubscription.syllabusIds.length} Syllabus{selectedSubscription.syllabusIds.length > 1 ? 'es' : ''}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.paymentMethodSection}>
//                   <Text style={styles.sectionTitle}>Payment via Razorpay</Text>
                  
//                   <View style={styles.paymentInfoCard}>
//                     <Ionicons name="shield-checkmark" size={24} color="#10B981" />
//                     <Text style={styles.paymentInfoText}>
//                       Secure payment powered by Razorpay. Supports UPI, Cards, Net Banking & more.
//                     </Text>
//                   </View>

                 
//                 </View>

//                 <View style={styles.actionButtons}>
//                   <TouchableOpacity 
//                     style={[styles.cancelButton, isProcessingPayment && styles.buttonDisabled]}
//                     onPress={handlePaymentCancel}
//                     disabled={isProcessingPayment}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity 
//                     style={[styles.payButton, isProcessingPayment && styles.payButtonDisabled]}
//                     onPress={handlePaymentSuccess}
//                     disabled={isProcessingPayment}
//                   >
//                     {isProcessingPayment ? (
//                       <>
//                         <Text style={styles.payButtonText}>Verifying Payment...</Text>
//                         <View style={styles.loadingDot} />
//                       </>
//                     ) : (
//                       <>
//                         <Text style={styles.payButtonText}>Pay ₹{selectedSubscription.price}</Text>
//                         <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F9FAFB' },
//   loadingContainer: { flex: 1, backgroundColor: '#F9FAFB' },
//   header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
//   headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
//   headerTextContainer: { flex: 1 },
//   headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
//   headerSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' },
//   headerStats: { flexDirection: 'row', gap: 12 },
//   miniStat: { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, minWidth: 60 },
//   miniStatValue: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
//   miniStatLabel: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
//   listContent: { paddingHorizontal: 24, paddingBottom: 20 },
//   subscriptionCard: { 
//     borderRadius: 16, 
//     marginBottom: 14, 
//     marginTop: 14, 
//     overflow: 'hidden', 
//     borderWidth: 1, 
//     borderColor: '#E5E7EB' 
//   },
//   subscriptionCardActive: {
//     borderWidth: 2,
//     borderColor: '#10B981',
//     shadowColor: '#10B981',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   subscriptionCardGradient: { padding: 16 },
//   subscribedBadge: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#D1FAE5',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     gap: 4,
//     zIndex: 10,
//   },
//   subscribedBadgeText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#10B981',
//   },
//   subscriptionHeader: { flexDirection: 'row', marginBottom: 14 },
//   subscriptionIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   subscriptionHeaderText: { flex: 1 },
//   subscriptionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
//   subscriptionName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
//   subscriptionSubInfo: { flexDirection: 'row', alignItems: 'center' },
//   subscriptionSubject: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
//   subscriptionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
//   subscriptionMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   metaIconCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
//   subscriptionMetaText: { fontSize: 13, color: '#374151', fontWeight: '600' },
//   subscriptionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
//   subscriptionFooterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8, flexWrap: 'wrap' },
//   priceContainer: { alignItems: 'flex-start' },
//   finalPrice: { fontSize: 28, fontWeight: '700', color: '#5B8DEE' },
//   finalPriceActive: { color: '#10B981' },
//   subscribeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5B8DEE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, gap: 6 },
//   subscribeButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
//   activeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#D1FAE5',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 10,
//     gap: 6,
//   },
//   activeButtonText: {
//     color: '#10B981',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
//   emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   emptyStateTitle: { fontSize: 18, color: '#6B7280', fontWeight: '700', marginBottom: 8 },
//   emptyStateSubtitle: { fontSize: 14, color: '#9CA3AF' },
//   loadingHeader: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
//   modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20, maxHeight: '90%' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
//   razorpayLogoContainer: { flex: 1 },
//   razorpayLogo: { backgroundColor: '#3395FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignSelf: 'flex-start' },
//   razorpayLogoText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
//   closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
//   paymentDetailsSection: { marginBottom: 24 },
//   paymentTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
//   paymentSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
//   amountContainer: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#5B8DEE' },
//   amountLabel: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 8 },
//   amountValue: { fontSize: 36, fontWeight: '700', color: '#5B8DEE' },
//   planDetailsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
//   planDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   planDetailText: { fontSize: 14, color: '#374151', fontWeight: '600' },
//   paymentMethodSection: { marginBottom: 24 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
//   paymentInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 12, gap: 12 },
//   paymentInfoText: { flex: 1, fontSize: 13, color: '#166534', fontWeight: '600', lineHeight: 18 },
//   testModeNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, gap: 8 },
//   testModeText: { fontSize: 12, color: '#92400E', fontWeight: '600', flex: 1 },
//   actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
//   cancelButton: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   cancelButtonText: { color: '#374151', fontSize: 16, fontWeight: '700' },
//   buttonDisabled: { opacity: 0.5 },
//   payButton: { flex: 2, backgroundColor: '#5B8DEE', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
//   payButtonDisabled: { backgroundColor: '#9CA3AF' },
//   payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
//   loadingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
// });

// export default SubscriptionScreen;


import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

const BASE_URL = 'https://scoreup-admin.vercel.app';
const RAZORPAY_KEY_ID = 'rzp_live_RsyxtBvxvFXIHL';

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

interface UserSubscription {
  plan: string;
  status: string;
  subscriptionId: string;
  activatedOn: string;
  expiryDate: string;
  amount: number;
  transactionId: string;
  orderId: string;
}

const SubscriptionScreen = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchUserData();
    fetchSubscriptions();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('User data from storage:', userData);
        
        if (userData.user?.subscription) {
          const sub = userData.user.subscription;
          
          const isActive = sub.status === 'Active' && 
                          sub.expiryDate && 
                          new Date(sub.expiryDate) > new Date();
          
          if (isActive) {
            setUserSubscription(sub);
            console.log('Active subscription found:', sub.subscriptionId);
          } else {
            setUserSubscription(null);
            console.log('No active subscription or subscription expired');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const processSuccessfulPayment = async (orderId: string, paymentId: string, signature: string) => {
    if (!selectedSubscription) {
      console.error('No subscription selected');
      setIsProcessingPayment(false);
      return;
    }

    console.log('Processing successful payment...');
    
    const isVerified = await verifyPayment(orderId, paymentId, signature);
    
    if (isVerified) {
      console.log('Payment verified successfully');
      
      const updateSuccess = await updateUserSubscription(paymentId, orderId, selectedSubscription);

      if (updateSuccess) {
        const subscriptionData = {
          subscriptionId: selectedSubscription._id,
          syllabusNames: selectedSubscription.syllabusIds.map(s => s.name).join(', '),
          price: selectedSubscription.price,
          durationDays: selectedSubscription.durationDays,
          subscribedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + selectedSubscription.durationDays * 24 * 60 * 60 * 1000).toISOString(),
          paymentId: paymentId,
          orderId: orderId,
        };

        await AsyncStorage.setItem('userSubscriptionId', selectedSubscription._id);
        await AsyncStorage.setItem('userSubscriptionData', JSON.stringify(subscriptionData));
        
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.user.subscription = {
            plan: 'Premium',
            status: 'Active',
            subscriptionId: selectedSubscription._id,
            activatedOn: new Date().toISOString(),
            expiryDate: new Date(Date.now() + selectedSubscription.durationDays * 24 * 60 * 60 * 1000).toISOString(),
            amount: selectedSubscription.price,
            transactionId: paymentId,
            orderId: orderId
          };
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUserSubscription(userData.user.subscription);
        }
        
        setShowPaymentModal(false);
        setIsProcessingPayment(false);
        
        Alert.alert(
          'Payment Successful! 🎉',
          `You've subscribed to ${selectedSubscription.syllabusIds.map(s => s.name).join(', ')} for ${selectedSubscription.durationDays} days.\n\nYour subscription is now active!`,
          [{ 
            text: 'OK',
            onPress: () => {
              setSelectedSubscription(null);
              navigation.navigate('Home');
            }
          }]
        );
      } else {
        Alert.alert('Error', 'Failed to update subscription. Please contact support with Payment ID: ' + paymentId);
        setIsProcessingPayment(false);
      }
    } else {
      Alert.alert('Error', 'Payment verification failed. Please contact support.');
      setIsProcessingPayment(false);
    }
  };

  const updateUserSubscription = async (
    paymentId: string, 
    orderId: string, 
    subscription: Subscription
  ): Promise<boolean> => {
    try {
      console.log('=== UPDATING USER SUBSCRIPTION ===');
      
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        console.error('User data not found in AsyncStorage');
        return false;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.user?.id || userData.user?._id;

      console.log('User ID:', userId);
      console.log('Subscription ID:', subscription._id);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${BASE_URL}/api/user/update-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            subscriptionId: subscription._id,
            paymentId: paymentId,
            orderId: orderId,
            amount: subscription.price,
            durationDays: subscription.durationDays
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        console.log('Update subscription response:', data);

        return data.success;
      } catch (fetchError: any) {
        console.error('DB update failed:', fetchError);
        return true;
      }
    } catch (error) {
      console.error('Update subscription error:', error);
      return true;
    }
  };

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/subscriptions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData: ApiResponse = await response.json();

      if (response.ok && responseData.success) {
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

  const handleSubscribeClick = (subscription: Subscription, isSubscribed: boolean) => {
    if (isSubscribed) {
      Alert.alert(
        'Already Subscribed',
        'You already have an active subscription for this plan.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedSubscription(subscription);
    setShowPaymentModal(true);
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'INR',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.order;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Create Order Error:', error);
      throw error;
    }
  };

  const verifyPayment = async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Verify Payment Error:', error);
      return false;
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedSubscription) return;

    setIsProcessingPayment(true);

    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        Alert.alert('Error', 'Please login to continue');
        setIsProcessingPayment(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const userEmail = userData.user?.email || 'user@example.com';
      const userName = userData.user?.name || 'User';
      const userPhone = userData.user?.phone || '9999999999';

      // Create Razorpay order
      const order = await createRazorpayOrder(selectedSubscription.price);
      
      // Prepare Razorpay options
      const options = {
        description: `${selectedSubscription.syllabusIds.map(s => s.name).join(', ')} - ${selectedSubscription.durationDays} Days`,
        image: 'https://your-logo-url.com/logo.png', // Add your app logo URL
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        order_id: order.id,
        name: 'ScoreUp',
        prefill: {
          email: userEmail,
          contact: userPhone,
          name: userName,
        },
        theme: { color: '#5B8DEE' },
      };

      // Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then((data: any) => {
          // Payment success
          console.log('Payment Success:', data);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
          processSuccessfulPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        })
        .catch((error: any) => {
          // Payment failed or cancelled
          console.log('Payment Error:', error);
          setIsProcessingPayment(false);
          
          if (error.code === 2) {
            Alert.alert('Payment Cancelled', 'You cancelled the payment.');
          } else {
            Alert.alert('Payment Failed', error.description || 'Something went wrong. Please try again.');
          }
        });

    } catch (error) {
      console.error('Payment Error:', error);
      setIsProcessingPayment(false);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedSubscription(null);
    setIsProcessingPayment(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const stats = {
    total: subscriptions.length,
    subscribed: userSubscription ? 1 : 0,
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
    const syllabusNames = item.syllabusIds.map(s => s.name).join(', ');
    const isSubscribed = userSubscription?.subscriptionId === item._id;
    const expiryDate = userSubscription && isSubscribed ? formatDate(userSubscription.expiryDate) : null;

    return (
      <TouchableOpacity
        style={[
          styles.subscriptionCard,
          isSubscribed && styles.subscriptionCardActive
        ]}
        onPress={() => handleSubscribeClick(item, isSubscribed)}
        activeOpacity={0.7}
        disabled={isSubscribed}
      >
        <LinearGradient
          colors={isSubscribed ? ['#E0F2FE', '#DBEAFE'] : ['#FFFFFF', '#FAFBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subscriptionCardGradient}
        >
          {isSubscribed && (
            <View style={styles.subscribedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.subscribedBadgeText}>Active</Text>
            </View>
          )}

          <View style={styles.subscriptionHeader}>
            <LinearGradient
              colors={isSubscribed ? ['#10B981', '#059669'] : ['#5B8DEE', '#7BA7F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscriptionIconCircle}
            >
              <Ionicons 
                name={isSubscribed ? "checkmark-circle" : "card-outline"} 
                size={24} 
                color="#FFFFFF" 
              />
            </LinearGradient>
            <View style={styles.subscriptionHeaderText}>
              <View style={styles.subscriptionTitleRow}>
                <Text style={styles.subscriptionName} numberOfLines={1}>
                  {syllabusNames}
                </Text>
              </View>
              <View style={styles.subscriptionSubInfo}>
                <Text style={styles.subscriptionSubject}>
                  {item.durationDays} Days Access
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.subscriptionMeta}>
            <View style={styles.subscriptionMetaItem}>
              <View style={styles.metaIconCircle}>
                <Ionicons name="document-text" size={12} color="#5B8DEE" />
              </View>
              <Text style={styles.subscriptionMetaText}>
                {item.syllabusIds.length} Syllabus{item.syllabusIds.length > 1 ? 'es' : ''}
              </Text>
            </View>
            
            {isSubscribed && expiryDate && (
              <View style={styles.subscriptionMetaItem}>
                <View style={[styles.metaIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="calendar-outline" size={12} color="#F59E0B" />
                </View>
                <Text style={styles.subscriptionMetaText}>
                  Expires: {expiryDate}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.subscriptionFooter}>
            <View style={styles.subscriptionFooterLeft}>
              <View style={styles.priceContainer}>
                <Text style={[
                  styles.finalPrice,
                  isSubscribed && styles.finalPriceActive
                ]}>
                  ₹{item.price}
                </Text>
              </View>
            </View>
            
            {isSubscribed ? (
              <View style={styles.activeButton}>
                <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                <Text style={styles.activeButtonText}>Active Plan</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => handleSubscribeClick(item, isSubscribed)}
              >
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
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

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePaymentCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.razorpayLogoContainer}>
                <View style={styles.razorpayLogo}>
                  <Text style={styles.razorpayLogoText}>Razorpay</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handlePaymentCancel}
                disabled={isProcessingPayment}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {selectedSubscription && (
              <>
                <View style={styles.paymentDetailsSection}>
                  <Text style={styles.paymentTitle}>Complete Your Payment</Text>
                  <Text style={styles.paymentSubtitle}>
                    {selectedSubscription.syllabusIds.map(s => s.name).join(', ')}
                  </Text>
                  
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount to Pay</Text>
                    <Text style={styles.amountValue}>₹{selectedSubscription.price}</Text>
                  </View>

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

                <View style={styles.paymentMethodSection}>
                  <Text style={styles.sectionTitle}>Payment via Razorpay</Text>
                  
                  <View style={styles.paymentInfoCard}>
                    <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                    <Text style={styles.paymentInfoText}>
                      Secure payment powered by Razorpay. Supports UPI, Cards, Net Banking & more.
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.cancelButton, isProcessingPayment && styles.buttonDisabled]}
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' },
  headerStats: { flexDirection: 'row', gap: 12 },
  miniStat: { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, minWidth: 60 },
  miniStatValue: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  miniStatLabel: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  listContent: { paddingHorizontal: 24, paddingBottom: 20 },
  subscriptionCard: { 
    borderRadius: 16, 
    marginBottom: 14, 
    marginTop: 14, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  subscriptionCardActive: {
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscriptionCardGradient: { padding: 16 },
  subscribedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  subscribedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  subscriptionHeader: { flexDirection: 'row', marginBottom: 14 },
  subscriptionIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  subscriptionHeaderText: { flex: 1 },
  subscriptionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  subscriptionName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  subscriptionSubInfo: { flexDirection: 'row', alignItems: 'center' },
  subscriptionSubject: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  subscriptionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  subscriptionMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIconCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  subscriptionMetaText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  subscriptionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  subscriptionFooterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8, flexWrap: 'wrap' },
  priceContainer: { alignItems: 'flex-start' },
  finalPrice: { fontSize: 28, fontWeight: '700', color: '#5B8DEE' },
  finalPriceActive: { color: '#10B981' },
  subscribeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5B8DEE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, gap: 6 },
  subscribeButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  activeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  activeButtonText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyStateTitle: { fontSize: 18, color: '#6B7280', fontWeight: '700', marginBottom: 8 },
  emptyStateSubtitle: { fontSize: 14, color: '#9CA3AF' },
  loadingHeader: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  razorpayLogoContainer: { flex: 1 },
  razorpayLogo: { backgroundColor: '#3395FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignSelf: 'flex-start' },
  razorpayLogoText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  paymentDetailsSection: { marginBottom: 24 },
  paymentTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  paymentSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  amountContainer: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#5B8DEE' },
  amountLabel: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 8 },
  amountValue: { fontSize: 36, fontWeight: '700', color: '#5B8DEE' },
  planDetailsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  planDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planDetailText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  paymentMethodSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  paymentInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 12, gap: 12 },
  paymentInfoText: { flex: 1, fontSize: 13, color: '#166534', fontWeight: '600', lineHeight: 18 },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  cancelButton: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: '#374151', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { opacity: 0.5 },
  payButton: { flex: 2, backgroundColor: '#5B8DEE', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  payButtonDisabled: { backgroundColor: '#9CA3AF' },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loadingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
});

export default SubscriptionScreen;