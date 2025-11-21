// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

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

// const SubscriptionScreen = () => {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigation = useNavigation<any>();

//   useEffect(() => {
//     fetchSubscriptions();
//   }, []);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const subId = await AsyncStorage.getItem('userSubscriptionId');
//       setIsSubscribed(!!subId);
//     };
//     checkSubscription();
//   }, []);

//   const fetchSubscriptions = async () => {
//     console.log('Fetching subscriptions...');
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://scoreup-admin.vercel.app/api/admin/subscriptions', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Subscriptions Response status:', response.status);
//       const responseData: ApiResponse = await response.json();
//       console.log('Subscriptions Response body:', JSON.stringify(responseData, null, 2));

//       if (response.ok && responseData.success) {
//         // Filter only active subscriptions
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

//   const handleSubscribe = async (subscription: Subscription) => {
//     console.log('Subscribing to plan:', subscription._id);
//     try {
//       await AsyncStorage.setItem('userSubscriptionId', subscription._id);
//       console.log('Subscription ID stored:', subscription._id);
//       setIsSubscribed(true);
//       Alert.alert(
//         'Success',
//         `Subscribed to ${subscription.syllabusIds.map(s => s.name).join(', ')} plan for ${subscription.durationDays} days at ₹${subscription.finalPrice}!`
//       );
//     } catch (error) {
//       console.error('Store Subscription Error:', error);
//       Alert.alert('Error', 'Failed to save subscription. Please try again.');
//     }
//   };

//   const getDiscountColor = (discountPercent: number) => {
//     if (discountPercent > 20) return '#EF4444'; // High discount red
//     if (discountPercent > 0) return '#F59E0B'; // Discount orange
//     return '#10B981'; // No discount green
//   };

//   const stats = {
//     total: subscriptions.length,
//     subscribed: isSubscribed ? 1 : 0,
//   };

//   const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
//     const syllabusNames = item.syllabusIds.map(s => s.name).join(', ');
//     const originalPrice = item.price > item.finalPrice ? `₹${item.price}` : null;
//     const discount = item.discountPercent > 0 ? `${item.discountPercent}% OFF` : null;

//     return (
//       <TouchableOpacity
//         style={styles.subscriptionCard}
//         onPress={() => handleSubscribe(item)}
//         activeOpacity={0.7}
//       >
//         <LinearGradient
//           colors={['#FFFFFF', '#FAFBFF']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.subscriptionCardGradient}
//         >
//           {/* Subscription Header */}
//           <View style={styles.subscriptionHeader}>
//             <LinearGradient
//               colors={['#5B8DEE', '#7BA7F7']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.subscriptionIconCircle}
//             >
//               <Ionicons name="card-outline" size={24} color="#FFFFFF" />
//             </LinearGradient>
//             <View style={styles.subscriptionHeaderText}>
//               <View style={styles.subscriptionTitleRow}>
//                 <Text style={styles.subscriptionName} numberOfLines={1}>{syllabusNames}</Text>
//               </View>
//               <View style={styles.subscriptionSubInfo}>
//                 <Text style={styles.subscriptionSubject}>{item.durationDays} Days Access</Text>
//               </View>
//             </View>
//           </View>

//           {/* Subscription Info */}
//           <View style={styles.subscriptionMeta}>
//             <View style={styles.subscriptionMetaItem}>
//               <View style={styles.metaIconCircle}>
//                 <Ionicons name="document-text" size={12} color="#5B8DEE" />
//               </View>
//               <Text style={styles.subscriptionMetaText}>{item.syllabusIds.length} Syllabus{item.syllabusIds.length > 1 ? 'es' : ''}</Text>
//             </View>
//           </View>

//           {/* Bottom Section */}
//           <View style={styles.subscriptionFooter}>
//             <View style={styles.subscriptionFooterLeft}>
//               {originalPrice && (
//                 <View style={styles.originalPriceBadge}>
//                   <Text style={styles.originalPriceText}>{originalPrice}</Text>
//                 </View>
//               )}
//               {discount && (
//                 <View 
//                   style={[
//                     styles.discountBadge, 
//                     { backgroundColor: getDiscountColor(item.discountPercent) }
//                   ]}
//                 >
//                   <Text style={styles.discountText}>{discount}</Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.priceContainer}>
//               <Text style={styles.finalPrice}>₹{item.finalPrice}</Text>
//             </View>
//             <TouchableOpacity 
//               style={styles.subscribeButton}
//               onPress={() => handleSubscribe(item)}
//             >
//               <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
//               <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//             </TouchableOpacity>
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
//       {/* Header */}
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

//       {/* Subscriptions List */}
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
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 24,
//     paddingBottom: 16,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 2,
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: '500',
//   },
//   headerStats: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   miniStat: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     minWidth: 60,
//   },
//   miniStatValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 2,
//   },
//   miniStatLabel: {
//     fontSize: 10,
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: '600',
//   },
//   listContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 20,
//   },
//   subscriptionCard: {
//     borderRadius: 16,
//     marginBottom: 14,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   subscriptionCardGradient: {
//     padding: 16,
//   },
//   subscriptionHeader: {
//     flexDirection: 'row',
//     marginBottom: 14,
//   },
//   subscriptionIconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   subscriptionHeaderText: {
//     flex: 1,
//   },
//   subscriptionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   subscriptionName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     flex: 1,
//   },
//   subscriptionSubInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   subscriptionSubject: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   subscriptionMeta: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 14,
//   },
//   subscriptionMetaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   metaIconCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#EEF2FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   subscriptionMetaText: {
//     fontSize: 13,
//     color: '#374151',
//     fontWeight: '600',
//   },
//   subscriptionFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 14,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   subscriptionFooterLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     gap: 8,
//     flexWrap: 'wrap',
//   },
//   originalPriceBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//     backgroundColor: '#FEF3C7',
//   },
//   originalPriceText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#92400E',
//     textDecorationLine: 'line-through',
//   },
//   discountBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },
//   discountText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   priceContainer: {
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   finalPrice: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#5B8DEE',
//     marginBottom: 4,
//   },
//   subscribeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#5B8DEE',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 10,
//     gap: 6,
//   },
//   subscribeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 80,
//   },
//   emptyIconCircle: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     color: '#6B7280',
//     fontWeight: '700',
//     marginBottom: 8,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   loadingHeader: {
//     paddingTop: 60,
//     paddingHorizontal: 24,
//     paddingBottom: 16,
//   },
// });

// export default SubscriptionScreen;
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      const response = await fetch('http://scoreup-admin.vercel.app/api/admin/subscriptions', {
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

  const handleSubscribe = async (subscription: Subscription) => {
    console.log('Subscribing to plan:', subscription._id);
    try {
      await AsyncStorage.setItem('userSubscriptionId', subscription._id);
      console.log('Subscription ID stored:', subscription._id);
      setIsSubscribed(true);
      Alert.alert(
        'Success',
        `Subscribed to ${subscription.syllabusIds.map(s => s.name).join(', ')} plan for ${subscription.durationDays} days at ₹${subscription.finalPrice}!`
      );
    } catch (error) {
      console.error('Store Subscription Error:', error);
      Alert.alert('Error', 'Failed to save subscription. Please try again.');
    }
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
        onPress={() => handleSubscribe(item)}
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
                <Text style={styles.finalPrice}>₹{item.finalPrice}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={() => handleSubscribe(item)}
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
});

export default SubscriptionScreen;