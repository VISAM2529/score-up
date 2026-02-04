import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const navigation = useNavigation<any>();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    console.log('Sending OTP to:', email);

    // HARDCODED LOGIN: Bypass Send OTP API for specific email
    if (email.toLowerCase() === 'google@gmail.com') {
      setIsLoading(true);
      setTimeout(() => {
        setShowOtp(true);
        setIsLoading(false);
        Alert.alert('OTP Sent', `Verification code sent to ${email}`);
      }, 1000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://scoreup-admin.vercel.app/api/public/auth/email-otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();
      console.log('Send OTP Response status:', response.status);
      console.log('Send OTP Response body:', responseText);

      if (response.ok) {
        setShowOtp(true);
        Alert.alert('OTP Sent', `Verification code sent to ${email}`);
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    console.log('Verifying OTP:', email, otp);

    // HARDCODED LOGIN: Bypass Verify OTP API for specific email and OTP
    if (email.toLowerCase() === 'google@gmail.com' && otp === '675432') {
      setIsLoading(true);
      console.log('Detected hardcoded login credentials. Logging in as Google Reviewer...');

      try {
        // Fetch all syllabi to give full access
        let allSyllabi = [];
        try {
          console.log('Fetching all syllabi for hardcoded access...');
          const syllabusRes = await fetch('https://scoreup-admin.vercel.app/api/syllabus');
          const syllabusData = await syllabusRes.json();
          if (syllabusData.success && Array.isArray(syllabusData.syllabi)) {
            // Map to the structure expected by TestListScreen: { _id, name }
            allSyllabi = syllabusData.syllabi.map((s: any) => ({ _id: s._id, name: s.name }));
            console.log(`Fetched ${allSyllabi.length} syllabi for hardcoded access.`);
          }
        } catch (err) {
          console.error('Failed to fetch syllabi for hardcoded login:', err);
        }

        // Mock user data for hardcoded login
        const mockUserData = {
          email: email,
          token: 'mock-jwt-token-google-play-review',
          user: {
            _id: 'mock_user_id_12345',
            name: 'Google Reviewer',
            email: email,
            role: 'user',
            isVerified: true,
            subscription: {
              status: 'Active',
              isExpired: false,
              // Set expiry far in the future (10 years)
              expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
              plan: 'Premium',
              subscriptionDetails: {
                // Grant access to ALL syllabi found
                syllabusIds: allSyllabi
              }
            }
          },
          loginTime: new Date().toISOString(),
        };

        await AsyncStorage.setItem('user', JSON.stringify(mockUserData));
        console.log('Hardcoded login successful, user data stored');

        setIsLoading(false);
        Alert.alert('Success', 'Login successful!');
        navigation.replace('Main');
      } catch (error) {
        console.error('Hardcoded login error:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Failed to save login session');
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        'https://scoreup-admin.vercel.app/api/public/auth/email-otp/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      console.log("Verify Response:", data);

      if (response.ok) {
        // ✅ Store user data in AsyncStorage (localStorage equivalent)
        const userData = {
          email: email,
          token: data?.token ?? null,
          user: data?.user ?? null,
          loginTime: new Date().toISOString(),

        };

        // Store as JSON string
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Verify storage
        const storedData = await AsyncStorage.getItem('user');
        console.log('User data stored in AsyncStorage:', storedData);

        Alert.alert('Success', 'Login successful!');

        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        console.log('Checking stored user data:', userDataString);

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log('User already logged in:', userData);
          navigation.replace('Main');
        }
      } catch (error) {
        console.error('Error checking user login:', error);
      }
    };
    checkUserLoggedIn();
  }, []);

  const handleResendOTP = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    console.log('Resending OTP to:', email);
    setIsLoading(true);
    try {
      const response = await fetch('https://scoreup-admin.vercel.app/api/public/auth/email-otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();
      console.log('Resend OTP Response status:', response.status);
      console.log('Resend OTP Response body:', responseText);

      if (response.ok) {
        Alert.alert('OTP Resent', `New verification code sent to ${email}`);
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
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
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#759BFD', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#759BFD']}
          locations={[0, 0.25, 0.38, 0.44, 0.50, 0.68, 1]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.content}>
            {/* Card Container */}
            <View style={styles.card}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <View style={styles.logoImageWrapper}>
                  <Image
                    source={require('../assets/logo.jpg')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
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
                  <Text style={styles.formSubtitle}>Enter your email address to continue!</Text>

                  <View style={[
                    styles.inputContainer,
                    isEmailFocused && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      placeholderTextColor="#C7C7C7"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      (!isValidEmail(email) || isLoading) && styles.continueButtonDisabled
                    ]}
                    onPress={handleSendOTP}
                    disabled={!isValidEmail(email) || isLoading}
                  >
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'Sending...' : 'Continue'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // OTP Verification
                <View style={styles.formSection}>
                  <Text style={styles.formTitle}>Verify OTP</Text>
                  <Text style={styles.formSubtitle}>
                    Enter the code sent to {email}
                  </Text>

                  <View style={[
                    styles.inputContainer,
                    isOtpFocused && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="000000"
                      placeholderTextColor="#C7C7C7"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      onFocus={() => setIsOtpFocused(true)}
                      onBlur={() => setIsOtpFocused(false)}
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      (otp.length !== 6 || isLoading) && styles.continueButtonDisabled
                    ]}
                    onPress={handleVerifyOTP}
                    disabled={otp.length !== 6 || isLoading}
                  >
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.otpActions}>
                    <TouchableOpacity
                      onPress={handleResendOTP}
                      disabled={isLoading}
                    >
                      <Text style={styles.linkText}>{isLoading ? 'Resending...' : 'Resend OTP'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowOtp(false);
                        setOtp('');
                      }}
                    >
                      <Text style={styles.linkText}>Change Email</Text>
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
    flexGrow: 1
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
  logoImageWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoImage: {
    width: 120,
    height: 120,
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
    letterSpacing: 8,
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