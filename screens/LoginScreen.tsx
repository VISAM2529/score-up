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

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;


   useEffect(() => {
    const checkUser = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('@user_info');
        if (userInfo) {
          navigation.replace('Main');
        }
      } catch (error) {
        console.log('Error checking user info:', error);
      }
    };
    checkUser();
  }, []);
  
  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const otpInputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation<any>();

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  // Reset animation when step changes
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  // Timer countdown for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Auto-focus first OTP input when switching to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 300);
    }
  }, [step]);

  // Function to send OTP
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('https://scoreup-admin.vercel.app/api/public/auth/email-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        Alert.alert('OTP Sent', 'Check your email for the verification code.');
        setStep('otp');
        setTimer(30);
        setCanResend(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      Alert.alert('Error', 'Something went wrong while sending OTP.');
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (!email || otpString.length !== 6) {
      Alert.alert('Missing fields', 'Please enter the complete 6-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('https://scoreup-admin.vercel.app/api/public/auth/email-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        Alert.alert('Verified', data.message);

        // Save user details in AsyncStorage
        await AsyncStorage.setItem('@user_info', JSON.stringify(data.user));

        // Navigate after verification
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      Alert.alert('Error', 'Something went wrong while verifying OTP.');
    }
  };

  // Handle OTP input change with auto-focus to next input
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input when current is filled
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits are entered
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value];
      if (fullOtp.every(digit => digit !== '')) {
        // Small delay to show the last digit before submitting
        setTimeout(() => {
          handleVerifyOtp();
        }, 300);
      }
    }
  };

  // Handle OTP input backspace with auto-focus to previous input
  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        const newOtp = [...otp];
        otpInputs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // If current field has value, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    if (canResend) {
      setOtp(['', '', '', '', '', '']);
      handleSendOtp();
    }
  };

  // Mask email for display
  const getMaskedEmail = () => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.substring(0, 3)}***@${domain}`;
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
          colors={['#EEF2FF', '#FEFEFE', '#FFFFFF']} 
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Decorative Background Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => step === 'otp' ? setStep('email') : navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.backIconContainer}>
                <Ionicons name="arrow-back" size={22} color="#0F172A" />
              </View>
              <Text style={styles.headerTitle}>
                {step === 'email' ? 'Continue with Email' : 'Check your Email'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {step === 'email' ? (
              <>
                {/* Email Login Illustration */}
                <View style={styles.illustrationContainer}>
                  <View style={styles.illustrationWrapper}>
                    <Image 
                      source={require('../assets/email-login-image.png')}
                      style={styles.illustration}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* Email Input Section */}
                <View style={styles.formSection}>
                  <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>Please enter your Email</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.emailInputContainer}>
                        <View style={styles.inputIconContainer}>
                          <Ionicons name="mail-outline" size={20} color="#64748B" />
                        </View>
                        <TextInput
                          style={[
                            styles.emailInput,
                            emailFocused && styles.emailInputFocused,
                            email && isValidEmail(email) && styles.emailInputValid
                          ]}
                          placeholder="xyz@gmail.com"
                          placeholderTextColor="#94A3B8"
                          keyboardType="email-address"
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          autoCorrect={false}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                        />
                        {email && isValidEmail(email) && (
                          <Animated.View 
                            style={styles.validationIconContainer}
                          >
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                          </Animated.View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.continueButton, 
                        isLoading && styles.buttonDisabled,
                        (!email || !isValidEmail(email)) && styles.buttonInactive
                      ]}
                      onPress={handleSendOtp}
                      disabled={isLoading || !email || !isValidEmail(email)}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#0066FF', '#0052CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                          <>
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* Trust Indicator */}
                  <View style={styles.trustIndicator}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
                    <Text style={styles.trustText}>Your email is secure and protected</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* OTP Verification Illustration */}
                <View style={styles.illustrationContainer}>
                  <View style={styles.illustrationWrapper}>
                    <Image 
                      source={require('../assets/verify-email.png')}
                      style={styles.illustration}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* OTP Input Section */}
                <View style={styles.formSection}>
                  <View style={styles.formCard}>
                    <Text style={styles.otpDescription}>
                      We've sent a verification code to
                    </Text>
                    <View style={styles.emailBadge}>
                      <Ionicons name="mail" size={16} color="#0066FF" />
                      <Text style={styles.maskedEmail}>{getMaskedEmail()}</Text>
                    </View>

                    {/* OTP Input Boxes */}
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <View key={index} style={styles.otpInputWrapper}>
                          <TextInput
                            ref={(ref) => (otpInputs.current[index] = ref)}
                            style={[
                              styles.otpInput,
                              focusedOtpIndex === index && styles.otpInputFocused,
                              digit && styles.otpInputFilled
                            ]}
                            maxLength={1}
                            keyboardType="numeric"
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleOtpKeyPress(e, index)}
                            onFocus={() => setFocusedOtpIndex(index)}
                            onBlur={() => setFocusedOtpIndex(null)}
                            selectTextOnFocus
                          />
                          {digit && (
                            <View style={styles.otpDot} />
                          )}
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.loginButton, 
                        isLoading && styles.buttonDisabled,
                        otp.join('').length !== 6 && styles.buttonInactive
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={isLoading || otp.join('').length !== 6}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#0066FF', '#0052CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                          <>
                            <Text style={styles.loginButtonText}>Verify & Login</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Timer and Resend Code */}
                    <View style={styles.resendContainer}>
                      {timer > 0 ? (
                        <View style={styles.timerContainer}>
                          <Ionicons name="time-outline" size={16} color="#64748B" />
                          <Text style={styles.timerText}>
                            Resend in {timer.toString().padStart(2, '0')}s
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          onPress={handleResendCode}
                          disabled={!canResend}
                          activeOpacity={0.7}
                          style={styles.resendButton}
                        >
                          <Ionicons name="refresh-outline" size={18} color="#0066FF" />
                          <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Change Email Option */}
                  <TouchableOpacity 
                    style={styles.changeEmailButton}
                    onPress={() => setStep('email')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={18} color="#64748B" />
                    <Text style={styles.changeEmailText}>Change Email Address</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  gradient: { 
    flex: 1,
    minHeight: height,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    bottom: 100,
    left: -50,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  illustrationWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  illustration: {
    width: width * 0.55,
    height: width * 0.55,
    maxWidth: 240,
    maxHeight: 240,
  },
  formSection: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  emailInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIconContainer: {
    position: 'absolute',
    left: 18,
    zIndex: 1,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingLeft: 52,
    paddingRight: 52,
    paddingVertical: 18,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  emailInputFocused: {
    borderColor: '#0066FF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  emailInputValid: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  validationIconContainer: {
    position: 'absolute',
    right: 18,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonInactive: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  trustIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  trustText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  otpDescription: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  maskedEmail: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  otpInputWrapper: {
    position: 'relative',
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0F172A',
  },
  otpInputFocused: {
    borderColor: '#0066FF',
    borderWidth: 2.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  otpInputFilled: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  otpDot: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 15,
    color: '#0066FF',
    fontWeight: '700',
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  changeEmailText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default LoginScreen;