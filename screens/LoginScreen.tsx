// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isOtpFocused, setIsOtpFocused] = useState(false);
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
        Alert.alert('Success', 'Login successful! Welcome to ScoreUp 🎉');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

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
          colors={['#759BFD', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#759BFD']} 
          locations={[0, 0.25, 0.38, 0.44, 0.50, 0.68, 1]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Card Container */}
            <View style={styles.card}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                {/* ScoreUp Logo */}
                <View style={styles.logoWrapper}>
                  <View style={styles.bookIcon}>
                    <View style={styles.bookLeftPage}>
                      <View style={styles.bookLeftStripe1} />
                      <View style={styles.bookLeftStripe2} />
                    </View>
                    <View style={styles.bookRightPage}>
                      <View style={styles.bookRightStripe} />
                    </View>
                  </View>
                </View>
                <Text style={styles.logoText}>ScoreUp</Text>
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>MCQ Preparation</Text>
                <Text style={styles.subtitle}>Your Smart Exam Success Partner</Text>
              </View>

              {/* Login Form */}
              {!showOtp ? (
                <View style={styles.formSection}>
                  <Text style={styles.formTitle}>Login</Text>
                  <Text style={styles.formSubtitle}>Enter your phone number to continue!</Text>
                  
                  <View style={[
                    styles.inputContainer,
                    isPhoneFocused && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone number"
                      placeholderTextColor="#C7C7C7"
                      keyboardType="phone-pad"
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => setIsPhoneFocused(false)}
                      maxLength={10}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      (mobileNumber.length !== 10 || isLoading) && styles.continueButtonDisabled
                    ]}
                    onPress={handleSendOTP}
                    disabled={mobileNumber.length !== 10 || isLoading}
                  >
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'Sending...' : 'Continue'}
                    </Text>
                  </TouchableOpacity>

                  {/* Social Login */}
                  <Text style={styles.orText}>Or login with</Text>
                  
                  <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Apple')}
                    >
                      <AntDesign name="apple1" size={24} color="#000000" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Google')}
                    >
                      <AntDesign name="google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Email')}
                    >
                      <Ionicons name="mail" size={24} color="#5B8DEE" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // OTP Verification
                <View style={styles.formSection}>
                  <Text style={styles.formTitle}>Verify OTP</Text>
                  <Text style={styles.formSubtitle}>
                    Enter the code sent to +91 {mobileNumber}
                  </Text>
                  
                  <View style={[
                    styles.inputContainer,
                    isOtpFocused && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="0000"
                      placeholderTextColor="#C7C7C7"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      onFocus={() => setIsOtpFocused(true)}
                      onBlur={() => setIsOtpFocused(false)}
                      maxLength={4}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      (otp.length !== 4 || isLoading) && styles.continueButtonDisabled
                    ]}
                    onPress={handleVerifyOTP}
                    disabled={otp.length !== 4 || isLoading}
                  >
                    <Text style={styles.continueButtonText}>
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
                      <Text style={styles.linkText}>Change Number</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#759BFD',
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
  },
  
  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    marginBottom: 12,
  },
  bookIcon: {
    width: 80,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookLeftPage: {
    width: 32,
    height: 60,
    backgroundColor: '#2463EB',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    justifyContent: 'space-evenly',
    paddingHorizontal: 6,
  },
  bookLeftStripe1: {
    width: '100%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  bookLeftStripe2: {
    width: '100%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  bookRightPage: {
    width: 32,
    height: 60,
    backgroundColor: '#F97316',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookRightStripe: {
    width: '70%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  
  // Title Section
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Form Section
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'left',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'left',
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  inputContainerFocused: {
    borderColor: '#5B8DEE',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  input: {
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  otpInput: {
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 4,
  },
  continueButton: {
    backgroundColor: '#7CA4F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Social Login
  orText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // OTP Actions
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  linkText: {
    color: '#5B8DEE',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;