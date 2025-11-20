// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const scrollViewRef = React.useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contact: '',
    dob: '',
    school: '',
    class: '',
    city: '',
  });

  const [focusedField, setFocusedField] = useState('');

  const classes = ['11th', '12th'];
  
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
    'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam'
  ];

  const subscriptionPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 99,
      duration: '1 Month',
      features: [
        'Access to 500+ Questions',
        'Chapter-wise Tests',
        'Performance Analytics',
        'Doubt Support',
      ],
      color: '#10B981',
      popular: false,
    },
    {
      id: 2,
      name: 'Standard',
      price: 499,
      duration: '6 Months',
      features: [
        'Access to 2000+ Questions',
        'All Subjects Coverage',
        'Mock Tests',
        'Performance Analytics',
        'Priority Doubt Support',
        'Study Material PDF',
      ],
      color: '#5B8DEE',
      popular: true,
    },
    {
      id: 3,
      name: 'Premium',
      price: 899,
      duration: '1 Year',
      features: [
        'Unlimited Questions',
        'All Subjects Coverage',
        'Unlimited Mock Tests',
        'Advanced Analytics',
        '24/7 Doubt Support',
        'Study Material PDF',
        'Live Classes Access',
        'Personalized Guidance',
      ],
      color: '#F59E0B',
      popular: false,
    },
  ];

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleInputBlur = () => {
    setFocusedField('');
  };

  const updateProfileData = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const validateStep1 = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (!profileData.contact.trim() || profileData.contact.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit contact number');
      return false;
    }
    if (!profileData.dob.trim()) {
      Alert.alert('Error', 'Please enter your date of birth');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!profileData.school.trim()) {
      Alert.alert('Error', 'Please enter your school/college name');
      return false;
    }
    if (!profileData.class) {
      Alert.alert('Error', 'Please select your class');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!profileData.city) {
      Alert.alert('Error', 'Please select your city');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setIsProfileComplete(true);
  };

  const renderProfileComplete = () => (
    <View style={styles.completeContainer}>
      {/* Success Banner */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.successBanner}
      >
        <View style={styles.successIconWrapper}>
          <Ionicons name="checkmark-circle" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.successBannerTitle}>Profile Completed Successfully! 🎉</Text>
        <Text style={styles.successBannerSubtitle}>
          Your account is ready to start your learning journey
        </Text>
      </LinearGradient>

      {/* Profile Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionLabel}>Profile Summary</Text>
        
        {/* Personal Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="person" size={20} color="#5B8DEE" />
            </View>
            <Text style={styles.infoCardTitle}>Personal Details</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{profileData.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{profileData.dob}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contact Number</Text>
              <Text style={styles.infoValue}>+91 {profileData.contact}</Text>
            </View>
          </View>
        </View>

        {/* Education Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="school" size={20} color="#5B8DEE" />
            </View>
            <Text style={styles.infoCardTitle}>Education & Location</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>School/College</Text>
              <Text style={styles.infoValue}>{profileData.school}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Class</Text>
              <Text style={styles.infoValue}>{profileData.class}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{profileData.city}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Selected Plan Section */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionLabel}>Your Selected Plan</Text>
        
        <TouchableOpacity
          style={styles.selectedPlanCard}
          onPress={() => Alert.alert('Payment', 'Redirecting to payment gateway...')}
        >
          <LinearGradient
            colors={[`${selectedPlan.color}20`, `${selectedPlan.color}05`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selectedPlanGradient}
          >
            <View style={styles.planBadgeRow}>
              <View style={[styles.planBadge, { backgroundColor: selectedPlan.color }]}>
                <Ionicons name="star" size={16} color="#FFFFFF" />
                <Text style={styles.planBadgeText}>{selectedPlan.name}</Text>
              </View>
              {selectedPlan.popular && (
                <View style={styles.popularTag}>
                  <Text style={styles.popularTagText}>POPULAR</Text>
                </View>
              )}
            </View>

            <View style={styles.planMainInfo}>
              <View style={[styles.planIconLarge, { backgroundColor: `${selectedPlan.color}20` }]}>
                <Ionicons name="trophy" size={36} color={selectedPlan.color} />
              </View>
              
              <View style={styles.planPriceSection}>
                <Text style={styles.planPriceAmount}>₹{selectedPlan.price}</Text>
                <Text style={styles.planPriceDuration}>for {selectedPlan.duration}</Text>
              </View>
            </View>

            <View style={styles.planFeaturesCompact}>
              <Text style={styles.planFeaturesTitle}>Includes:</Text>
              <View style={styles.planFeaturesRow}>
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Ionicons name="checkmark" size={14} color={selectedPlan.color} />
                    <Text style={styles.featureChipText}>{feature}</Text>
                  </View>
                ))}
              </View>
              {selectedPlan.features.length > 3 && (
                <Text style={styles.moreFeatures}>
                  +{selectedPlan.features.length - 3} more features
                </Text>
              )}
            </View>

            <View style={styles.paymentCTA}>
              <View style={styles.paymentCTAContent}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.paymentCTAText}>Secure Payment • No Hidden Charges</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color={selectedPlan.color} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Link */}
      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={() => {
          setIsProfileComplete(false);
          setCurrentStep(1);
        }}
      >
        <Ionicons name="create-outline" size={20} color="#5B8DEE" />
        <Text style={styles.editProfileText}>Edit Profile Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((step) => (
        <View
          key={step}
          style={[
            styles.progressStep,
            currentStep >= step && styles.progressStepActive,
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconCircle}>
          <Ionicons name="person" size={24} color="#5B8DEE" />
        </View>
        <Text style={styles.stepTitle}>Personal Details</Text>
        <Text style={styles.stepSubtitle}>Tell us about yourself</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'name' && styles.inputContainerFocused,
            ]}
          >
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={profileData.name}
              onChangeText={(text) => updateProfileData('name', text)}
              onFocus={() => handleInputFocus('name')}
              onBlur={handleInputBlur}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'email' && styles.inputContainerFocused,
            ]}
          >
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={profileData.email}
              onChangeText={(text) => updateProfileData('email', text)}
              onFocus={() => handleInputFocus('email')}
              onBlur={handleInputBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contact Number *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'contact' && styles.inputContainerFocused,
            ]}
          >
            <Ionicons name="call-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit number"
              placeholderTextColor="#9CA3AF"
              value={profileData.contact}
              onChangeText={(text) => updateProfileData('contact', text)}
              onFocus={() => handleInputFocus('contact')}
              onBlur={handleInputBlur}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date of Birth *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'dob' && styles.inputContainerFocused,
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              value={profileData.dob}
              onChangeText={(text) => updateProfileData('dob', text)}
              onFocus={() => handleInputFocus('dob')}
              onBlur={handleInputBlur}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconCircle}>
          <Ionicons name="school" size={24} color="#5B8DEE" />
        </View>
        <Text style={styles.stepTitle}>Education Details</Text>
        <Text style={styles.stepSubtitle}>Your academic information</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>School/College Name *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === 'school' && styles.inputContainerFocused,
            ]}
          >
            <Ionicons name="business-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your school/college"
              placeholderTextColor="#9CA3AF"
              value={profileData.school}
              onChangeText={(text) => updateProfileData('school', text)}
              onFocus={() => handleInputFocus('school')}
              onBlur={handleInputBlur}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Your Class *</Text>
          <View style={styles.classContainer}>
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classCard,
                  profileData.class === cls && styles.classCardActive,
                ]}
                onPress={() => updateProfileData('class', cls)}
              >
                {profileData.class === cls && (
                  <LinearGradient
                    colors={['#5B8DEE', '#7BA7F7']}
                    style={styles.classCardGradient}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.classCardTextActive}>{cls}</Text>
                  </LinearGradient>
                )}
                {profileData.class !== cls && (
                  <View style={styles.classCardContent}>
                    <Ionicons name="school-outline" size={24} color="#5B8DEE" />
                    <Text style={styles.classCardText}>{cls}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconCircle}>
          <Ionicons name="location" size={24} color="#5B8DEE" />
        </View>
        <Text style={styles.stepTitle}>Location</Text>
        <Text style={styles.stepSubtitle}>Select your city</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.cityGrid}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.cityCard,
                profileData.city === city && styles.cityCardActive,
              ]}
              onPress={() => updateProfileData('city', city)}
            >
              {profileData.city === city ? (
                <LinearGradient
                  colors={['#5B8DEE', '#7BA7F7']}
                  style={styles.cityCardGradient}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.cityCardTextActive}>{city}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.cityCardContent}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.cityCardText}>{city}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconCircle}>
          <Ionicons name="star" size={24} color="#5B8DEE" />
        </View>
        <Text style={styles.stepTitle}>Choose Your Plan</Text>
        <Text style={styles.stepSubtitle}>Select a subscription plan to continue</Text>
      </View>

      <View style={styles.plansContainer}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handleSubscribe(plan)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}
            <LinearGradient
              colors={[`${plan.color}10`, '#FFFFFF']}
              style={styles.planCardGradient}
            >
              <View style={styles.planHeader}>
                <View style={[styles.planIconCircle, { backgroundColor: `${plan.color}15` }]}>
                  <Ionicons name="trophy" size={28} color={plan.color} />
                </View>
                <View style={styles.planHeaderInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
              </View>

              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
                <Text style={styles.planPriceLabel}>/{plan.duration}</Text>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                onPress={() => handleSubscribe(plan)}
              >
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerContent}>
          {((currentStep > 1 && !isProfileComplete) || isProfileComplete) && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                if (isProfileComplete) {
                  setIsProfileComplete(false);
                  setCurrentStep(4);
                } else {
                  handleBack();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isProfileComplete ? 'Profile Summary' : 'Complete Your Profile'}
            </Text>
            {!isProfileComplete && (
              <Text style={styles.headerSubtitle}>Step {currentStep} of 4</Text>
            )}
          </View>
        </View>
        {!isProfileComplete && renderProgressBar()}
      </LinearGradient>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isProfileComplete ? (
          renderProfileComplete()
        ) : (
          <>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      {currentStep < 4 && !isProfileComplete && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === 3 ? 'Complete Profile' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  inputContainerFocused: {
    borderColor: '#5B8DEE',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  classContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  classCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classCardActive: {
    borderColor: '#5B8DEE',
    borderWidth: 2,
  },
  classCardGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  classCardContent: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  classCardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  classCardTextActive: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cityCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cityCardActive: {
    borderColor: '#5B8DEE',
    borderWidth: 2,
  },
  cityCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
  cityCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  cityCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  cityCardTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planCardGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  planIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planHeaderInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
  },
  planPriceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  planFeatures: {
    gap: 12,
    marginBottom: 24,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B8DEE',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Profile Complete Styles - Modern Design
  completeContainer: {
    flex: 1,
  },
  successBanner: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  successIconWrapper: {
    marginBottom: 12,
  },
  successBannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  successBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  infoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  infoGrid: {
    gap: 14,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  selectedPlanCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#5B8DEE',
  },
  selectedPlanGradient: {
    padding: 20,
  },
  planBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  planBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  popularTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  planIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPriceSection: {
    flex: 1,
  },
  planPriceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  planPriceDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  planFeaturesCompact: {
    marginBottom: 20,
  },
  planFeaturesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  planFeaturesRow: {
    gap: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 6,
  },
  featureChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  moreFeatures: {
    fontSize: 13,
    color: '#5B8DEE',
    fontWeight: '600',
    marginTop: 4,
  },
  paymentCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  paymentCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  paymentCTAText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B8DEE',
  },
});

export default ProfileScreen;