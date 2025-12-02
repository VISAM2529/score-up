import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import { API_CONFIG, getFullApiUrl, API_ENDPOINTS } from '../config/api.config';

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
}

interface ApiResponse {
  success: boolean;
  subscriptions: Subscription[];
}

const RAZORPAY_TEST_KEY = "rzp_test_123456789"; // 🔥 Your test key ID only

const SubscriptionScreen = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchSubscriptions();
    loadUserData();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      const subId = await AsyncStorage.getItem("userSubscriptionId");
      setIsSubscribed(!!subId);
    };
    checkSubscription();
  }, []);

  // ✅ Load User Data
  const loadUserData = async () => {
    const userString = await AsyncStorage.getItem("user");
    if (userString) setUserData(JSON.parse(userString));
  };

  // ✅ Fetch Subscriptions From Your API
  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(API_ENDPOINTS.subscriptions);
      const responseData: ApiResponse = await response.json();

      if (response.ok && responseData.success) {
        const active = responseData.subscriptions.filter(s => s.isActive);
        setSubscriptions(active);
      } else {
        Alert.alert("Error", "Unable to load subscriptions.");
      }
    } catch {
      Alert.alert("Network Error", "Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // 🔥 DIRECT RAZORPAY TEST PAYMENT (NO BACKEND)
  // ----------------------------------------------------
  const handleSubscribe = async (subscription: Subscription) => {
    try {
      const options = {
        description: subscription.syllabusIds.map(s => s.name).join(', '),
        currency: 'INR',
        key: RAZORPAY_TEST_KEY,
        amount: subscription.price * 100,
        name: "ScoreUp Test Mode",
        prefill: {
          email: userData?.email || "",
          contact: userData?.phone || "",
          name: userData?.user?.name || "",
        },
        theme: { color: "#5B8DEE" }
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment success
          Alert.alert("Payment Success (Test Mode)", `Payment ID: ${data.razorpay_payment_id}`);

          // --------------------------------------------------
          // 🔥 STORE SUBSCRIPTION JUST LIKE YOUR OLD LOGIC
          // --------------------------------------------------
          const subscriptionData = {
            subscriptionId: subscription._id,
            syllabusNames: subscription.syllabusIds.map(s => s.name).join(", "),
            price: subscription.price,
            durationDays: subscription.durationDays,
            subscribedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + subscription.durationDays * 86400000).toISOString(),
            paymentId: data.razorpay_payment_id,
          };

          await AsyncStorage.setItem("userSubscriptionId", subscription._id);
          await AsyncStorage.setItem("userSubscriptionData", JSON.stringify(subscriptionData));

          setIsSubscribed(true);
        })
        .catch((err: any) => {
          Alert.alert("Payment Cancelled", err.description || "");
        });

    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  // UI Rendering Logic (same as yours, unchanged)
  const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
    const syllabusNames = item.syllabusIds.map(s => s.name).join(', ');

    return (
      <TouchableOpacity style={styles.subscriptionCard} onPress={() => handleSubscribe(item)}>
        <LinearGradient colors={["#FFF", "#FAFBFF"]} style={styles.subscriptionCardGradient}>
          <View style={styles.subscriptionHeader}>
            <LinearGradient colors={["#5B8DEE", "#7BA7F7"]} style={styles.subscriptionIconCircle}>
              <Ionicons name="card-outline" size={24} color="#FFF" />
            </LinearGradient>

            <View style={styles.subscriptionHeaderText}>
              <Text style={styles.subscriptionName}>{syllabusNames}</Text>
              <Text style={styles.subscriptionSubject}>{item.durationDays} Days Access</Text>
            </View>
          </View>

          <View style={styles.subscriptionFooter}>
            <Text style={styles.finalPrice}>₹{item.price}</Text>

            <TouchableOpacity style={styles.subscribeButton} onPress={() => handleSubscribe(item)}>
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.testModeBadge}>
            <Ionicons name="information-circle" size={14} color="#F59E0B" />
            <Text style={styles.testModeText}>Test Mode</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5B8DEE", "#5B8DEE"]} style={styles.header}>
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <Text style={styles.headerSubtitle}>{subscriptions.length} plans available</Text>
      </LinearGradient>

      <FlatList
        data={subscriptions}
        keyExtractor={item => item._id}
        renderItem={renderSubscriptionItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// -----------------
// Styles (kept same)
// -----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: '#FFF', fontWeight: '700' },
  headerSubtitle: { fontSize: 12, color: '#FFF', opacity: 0.9 },

  listContent: { padding: 20 },

  subscriptionCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  subscriptionCardGradient: { padding: 16 },

  subscriptionHeader: { flexDirection: 'row', marginBottom: 14 },
  subscriptionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionHeaderText: { flex: 1 },
  subscriptionName: { fontSize: 16, fontWeight: '700', color: '#111' },
  subscriptionSubject: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  finalPrice: { fontSize: 22, fontWeight: '700', color: '#5B8DEE' },

  subscriptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  subscribeButton: {
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  subscribeButtonText: { color: '#fff', fontWeight: '700' },

  testModeBadge: {
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  testModeText: { color: '#92400E', fontSize: 11, fontWeight: '700' },
});

export default SubscriptionScreen;
