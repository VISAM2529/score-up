// screens/ResultDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const ResultDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { score, total, percentage, testName } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Sample questions with user answers and explanations
  const questions = [
    {
      id: 1,
      text: 'What is the SI unit of force?',
      subject: 'Physics',
      topic: 'Mechanics',
      userAnswer: 'b',
      options: [
        { id: 'a', text: 'Joule', isCorrect: false },
        { id: 'b', text: 'Newton', isCorrect: true },
        { id: 'c', text: 'Watt', isCorrect: false },
        { id: 'd', text: 'Pascal', isCorrect: false },
      ],
      explanation: 'The SI unit of force is Newton (N). It is named after Sir Isaac Newton. One Newton is the force required to accelerate a mass of one kilogram at a rate of one meter per second squared (1 N = 1 kg⋅m/s²).',
    },
    {
      id: 2,
      text: 'The velocity of light in vacuum is approximately:',
      subject: 'Physics',
      topic: 'Optics',
      userAnswer: 'c',
      options: [
        { id: 'a', text: '3 × 10⁸ m/s', isCorrect: true },
        { id: 'b', text: '3 × 10⁶ m/s', isCorrect: false },
        { id: 'c', text: '3 × 10⁷ m/s', isCorrect: false },
        { id: 'd', text: '3 × 10⁹ m/s', isCorrect: false },
      ],
      explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second (299,792,458 m/s to be exact). This is a fundamental constant in physics, denoted by "c", and nothing can travel faster than light in vacuum.',
    },
    {
      id: 3,
      text: 'Which of the following is a scalar quantity?',
      subject: 'Physics',
      topic: 'Vectors',
      userAnswer: 'c',
      options: [
        { id: 'a', text: 'Velocity', isCorrect: false },
        { id: 'b', text: 'Force', isCorrect: false },
        { id: 'c', text: 'Energy', isCorrect: true },
        { id: 'd', text: 'Acceleration', isCorrect: false },
      ],
      explanation: 'Energy is a scalar quantity because it only has magnitude and no direction. Velocity, force, and acceleration are all vector quantities as they have both magnitude and direction.',
    },
    {
      id: 4,
      text: 'What is the atomic number of Carbon?',
      subject: 'Chemistry',
      topic: 'Periodic Table',
      userAnswer: 'b',
      options: [
        { id: 'a', text: '4', isCorrect: false },
        { id: 'b', text: '6', isCorrect: true },
        { id: 'c', text: '8', isCorrect: false },
        { id: 'd', text: '12', isCorrect: false },
      ],
      explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus. Carbon is essential for life and forms the basis of organic chemistry. The atomic mass is approximately 12 (6 protons + 6 neutrons).',
    },
    {
      id: 5,
      text: 'Which gas is known as laughing gas?',
      subject: 'Chemistry',
      topic: 'Inorganic Chemistry',
      userAnswer: 'a',
      options: [
        { id: 'a', text: 'Nitrogen dioxide', isCorrect: false },
        { id: 'b', text: 'Nitrous oxide', isCorrect: true },
        { id: 'c', text: 'Carbon monoxide', isCorrect: false },
        { id: 'd', text: 'Sulfur dioxide', isCorrect: false },
      ],
      explanation: 'Nitrous oxide (N₂O) is known as laughing gas. It is used as an anesthetic and analgesic in medicine and dentistry. When inhaled, it can produce feelings of euphoria and laughter, hence the name.',
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
  const userSelectedOption = currentQuestion.options.find(opt => opt.id === currentQuestion.userAnswer);
  const isCorrect = currentQuestion.userAnswer === correctOption?.id;

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Results', {
              score,
              total,
              percentage,
              points: score * 10,
              syllabus: 'JEE',
              testId: 1,
              testName,
              timeSpent: 1800
            })}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Review Answers</Text>
            <Text style={styles.headerSubtitle}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>

          <View style={styles.scoreIndicator}>
            <Text style={styles.scoreText}>{score}/{total}</Text>
          </View>
        </View>

        {/* Navigation Arrows */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled
            ]}
            onPress={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentQuestionIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled
            ]}
            onPress={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentQuestionIndex === questions.length - 1 ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          {isCorrect ? (
            <View style={styles.correctBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.correctBadgeText}>Correct! Well Done!</Text>
            </View>
          ) : (
            <View style={styles.incorrectBadge}>
              <Ionicons name="close-circle" size={20} color="#EF4444" />
              <Text style={styles.incorrectBadgeText}>Wrong Answer, Right Spirit</Text>
            </View>
          )}
        </View>

        {/* Subject Tag */}
        <View style={styles.subjectTag}>
          <Text style={styles.subjectText}>{currentQuestion.subject}</Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questionGradient}
          >
            <Text style={styles.questionText}>
              Q{currentQuestionIndex + 1}. {currentQuestion.text}
            </Text>
            <Text style={styles.questionSubtext}>Choose wisely, genius!</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isUserAnswer = option.id === currentQuestion.userAnswer;
                const isCorrectAnswer = option.isCorrect;
                
                let optionStyle = styles.optionDefault;
                let iconName = 'radio-button-off';
                let iconColor = '#D1D5DB';

                if (isCorrectAnswer) {
                  optionStyle = styles.optionCorrect;
                  iconName = 'checkmark-circle';
                  iconColor = '#10B981';
                } else if (isUserAnswer && !isCorrectAnswer) {
                  optionStyle = styles.optionIncorrect;
                  iconName = 'close-circle';
                  iconColor = '#EF4444';
                }

                return (
                  <View
                    key={option.id}
                    style={[styles.optionButton, optionStyle]}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons name={iconName} size={24} color={iconColor} />
                      <Text style={styles.optionLabel}>
                        {option.id.toUpperCase()}.
                      </Text>
                      <Text style={styles.optionText}>{option.text}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        {/* Explanation Card */}
        <View style={styles.explanationCard}>
          <LinearGradient
            colors={['#F0F4FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.explanationGradient}
          >
            <View style={styles.explanationHeader}>
              <LinearGradient
                colors={['#5B8DEE', '#7BA7F7']}
                style={styles.explanationIcon}
              >
                <Ionicons name="bulb" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.explanationTitle}>Explanation</Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </LinearGradient>
        </View>

        {/* Answer Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Your Answer</Text>
              <View style={[
                styles.summaryBadge,
                isCorrect ? styles.summaryBadgeCorrect : styles.summaryBadgeIncorrect
              ]}>
                <Text style={[
                  styles.summaryBadgeText,
                  isCorrect ? styles.summaryBadgeTextCorrect : styles.summaryBadgeTextIncorrect
                ]}>
                  {userSelectedOption?.id.toUpperCase()}. {userSelectedOption?.text}
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Correct Answer</Text>
              <View style={styles.summaryBadgeCorrect}>
                <Text style={styles.summaryBadgeTextCorrect}>
                  {correctOption?.id.toUpperCase()}. {correctOption?.text}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // Fixed Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  scoreIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Navigation Row
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  // Scrollable Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  // Status Badge
  statusBadgeContainer: {
    marginBottom: 16,
  },
  correctBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  correctBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  incorrectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  incorrectBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  // Subject Tag
  subjectTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  // Question Card
  questionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  questionGradient: {
    padding: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 8,
  },
  questionSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  // Options
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  optionDefault: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  optionIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  // Explanation Card
  explanationCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  explanationGradient: {
    padding: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  explanationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  explanationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    gap: 12,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  summaryBadgeCorrect: {
    backgroundColor: '#D1FAE5',
  },
  summaryBadgeIncorrect: {
    backgroundColor: '#FEE2E2',
  },
  summaryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryBadgeTextCorrect: {
    color: '#10B981',
  },
  summaryBadgeTextIncorrect: {
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ResultDetailScreen;