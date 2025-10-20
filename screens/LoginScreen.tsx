// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSendOTP = () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(true);
      Alert.alert('OTP Sent', `Verification code sent to +91 ${mobileNumber}\n\nDemo OTP: 1234`);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '1234') {
        Alert.alert('Success', 'Login successful! Welcome to MCQ Prep 🎉');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  const features = [
    { icon: 'book-outline', text: '1000+ Practice Questions', color: '#4F46E5' },
    { icon: 'trophy-outline', text: 'Chapter-wise Tests', color: '#10B981' },
    { icon: 'analytics-outline', text: 'Performance Analytics', color: '#F59E0B' },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <LinearGradient 
          colors={['#FFFFFF', '#F8F9FF']} 
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="school-outline" size={40} color="#4F46E5" />
              </View>
              <Text style={styles.logoText}>MCQ Prep</Text>
              <Text style={styles.tagline}>
                Your ultimate exam preparation partner
              </Text>
            </View>

            {/* Exam Tags */}
            <View style={styles.examTags}>
              <View style={styles.examTag}>
                <Text style={styles.examTagText}>JEE</Text>
              </View>
              <View style={styles.examTag}>
                <Text style={styles.examTagText}>NEET</Text>
              </View>
              <View style={styles.examTag}>
                <Text style={styles.examTagText}>CET</Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                {showOtp ? 'Verify Your Number' : 'Welcome Back!'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {showOtp 
                  ? `Enter the code sent to +91 ${mobileNumber}`
                  : 'Enter your mobile number to get started'
                }
              </Text>
            </View>

            {!showOtp ? (
              // Mobile Number Input
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    maxLength={10}
                  />
                  {mobileNumber.length === 10 && (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (mobileNumber.length !== 10 || isLoading) && styles.primaryButtonDisabled
                  ]}
                  onPress={handleSendOTP}
                  disabled={mobileNumber.length !== 10 || isLoading}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // OTP Input
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.otpInput}
                    placeholder="0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={4}
                  />
                  {otp.length === 4 && (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (otp.length !== 4 || isLoading) && styles.primaryButtonDisabled
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={otp.length !== 4 || isLoading}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.otpActions}>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('OTP Resent', 'New code sent successfully!')}
                  >
                    <Text style={styles.linkText}>Resend OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowOtp(false);
                      setOtp('');
                    }}
                  >
                    <Text style={styles.linkTextSecondary}>Change Number</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Features Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Why Choose MCQ Prep?</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                    <Ionicons name={feature.icon} size={20} color={feature.color} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>

            {/* Pricing Card */}
            <View style={styles.pricingCard}>
              <View style={styles.pricingHeader}>
                <View style={styles.pricingInfo}>
                  <Text style={styles.pricingTitle}>One-Time Payment</Text>
                  <Text style={styles.pricingSubtitle}>Lifetime Access</Text>
                </View>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>₹99</Text>
                </View>
              </View>
              <View style={styles.pricingFooter}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#6B7280" />
                <Text style={styles.pricingNote}>Secure payment • No hidden charges</Text>
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  examTags: {
    flexDirection: 'row',
    gap: 8,
  },
  examTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  examTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  countryCode: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  otpInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 8,
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  linkTextSecondary: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#EEF2FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pricingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pricingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pricingNote: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  termsLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default LoginScreen;