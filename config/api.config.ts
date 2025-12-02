// config/api.config.ts
// API Configuration for different environments

import { Platform } from 'react-native';

// ============================================================================
// RAZORPAY CONFIGURATION
// ============================================================================

// Get your Razorpay Test Key ID from: https://dashboard.razorpay.com/app/keys
export const RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxxxx'; // REPLACE WITH YOUR KEY

// ============================================================================
// BACKEND API URL CONFIGURATION
// ============================================================================

// Change this based on your environment
const ENVIRONMENT: 'local' | 'staging' | 'production' = 'local';

// Backend URLs for different environments
const API_URLS = {
  // Local Development
  local: {
    // For iOS Simulator
    ios: 'http://localhost:3000',
    // For Android Emulator (10.0.2.2 is Android's way to access host machine)
    android: 'http://10.0.2.2:3000',
    // For Physical Device (Replace with your computer's local IP)
    // Find your IP: Mac/Linux: ifconfig | Windows: ipconfig
    device: 'http://192.168.1.100:3000', // REPLACE WITH YOUR LOCAL IP
  },
  
  // Staging Environment (e.g., Vercel preview deployment)
  staging: 'https://your-app-staging.vercel.app',
  
  // Production Environment
  production: 'https://your-app.vercel.app', // REPLACE WITH YOUR DOMAIN
};

// ============================================================================
// GET API URL BASED ON ENVIRONMENT AND PLATFORM
// ============================================================================

export const getApiUrl = (): string => {
  if (ENVIRONMENT === 'local') {
    if (Platform.OS === 'ios') {
      return API_URLS.local.ios;
    } else if (Platform.OS === 'android') {
      // Check if running on emulator or physical device
      // You can manually switch this if needed
      return API_URLS.local.android; // Change to API_URLS.local.device for physical device
    }
    return API_URLS.local.ios;
  }
  
  return API_URLS[ENVIRONMENT];
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Payment Endpoints
  createOrder: '/api/payment/create-order',
  verifyPayment: '/api/payment/verify-payment',
  getPaymentDetails: (paymentId: string) => `/api/payment/${paymentId}`,
  
  // Subscription Endpoints (your existing API)
  subscriptions: 'https://scoreup-admin.vercel.app/api/admin/subscriptions',
  
  // Auth Endpoints (your existing API)
  sendOtp: 'https://scoreup-admin.vercel.app/api/public/auth/email-otp/send',
  verifyOtp: 'https://scoreup-admin.vercel.app/api/public/auth/email-otp/verify',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getFullApiUrl = (endpoint: string): string => {
  const baseUrl = getApiUrl();
  return `${baseUrl}${endpoint}`;
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  razorpayKeyId: RAZORPAY_KEY_ID,
  environment: ENVIRONMENT,
  endpoints: API_ENDPOINTS,
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// In your components:

import { API_CONFIG, getFullApiUrl, API_ENDPOINTS } from './config/api.config';

// Example 1: Create Razorpay Order
const response = await fetch(getFullApiUrl(API_ENDPOINTS.createOrder), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 100, subscriptionId: 'abc123' })
});

// Example 2: Verify Payment
const response = await fetch(getFullApiUrl(API_ENDPOINTS.verifyPayment), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
});

// Example 3: Get Payment Details
const response = await fetch(getFullApiUrl(API_ENDPOINTS.getPaymentDetails('pay_123')));

// Example 4: Use Razorpay Key
import RazorpayCheckout from 'react-native-razorpay';
RazorpayCheckout.open({
  key: API_CONFIG.razorpayKeyId,
  amount: 10000,
  // ... other options
});
*/

// ============================================================================
// DEVELOPMENT TIPS
// ============================================================================

/*
1. FOR LOCAL DEVELOPMENT:
   - Set ENVIRONMENT to 'local'
   - iOS Simulator: Will use http://localhost:3000
   - Android Emulator: Will use http://10.0.2.2:3000
   - Physical Device: Update API_URLS.local.device with your computer's IP

2. TO FIND YOUR LOCAL IP:
   - Mac/Linux: Run `ifconfig` in terminal, look for inet under en0 or wlan0
   - Windows: Run `ipconfig` in command prompt, look for IPv4 Address
   - Example: 192.168.1.100

3. FOR STAGING:
   - Set ENVIRONMENT to 'staging'
   - Deploy to Vercel preview branch
   - Update API_URLS.staging with your preview URL

4. FOR PRODUCTION:
   - Set ENVIRONMENT to 'production'
   - Update API_URLS.production with your live domain
   - Switch RAZORPAY_KEY_ID to live key (rzp_live_xxxxxxxxxx)

5. TESTING:
   - Always test payment flow in 'local' or 'staging' first
   - Use Razorpay test cards
   - Verify webhooks are working before going live
*/

export default API_CONFIG;