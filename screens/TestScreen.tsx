// screens/TestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  subject: string;
  topic: string;
}

const TestScreen = () => {
  const route = useRoute<any>();
  const { syllabus, testId, testName } = route.params;
  const navigation = useNavigation<any>();

  // Rich question set with various subjects
  const questions: Question[] = [
    // Physics Questions
    {
      id: 1,
      text: 'What is the SI unit of force?',
      subject: 'Physics',
      topic: 'Mechanics',
      options: [
        { id: 'a', text: 'Joule', isCorrect: false },
        { id: 'b', text: 'Newton', isCorrect: true },
        { id: 'c', text: 'Watt', isCorrect: false },
        { id: 'd', text: 'Pascal', isCorrect: false },
      ],
    },
    {
      id: 2,
      text: 'The velocity of light in vacuum is approximately:',
      subject: 'Physics',
      topic: 'Optics',
      options: [
        { id: 'a', text: '3 × 10⁸ m/s', isCorrect: true },
        { id: 'b', text: '3 × 10⁶ m/s', isCorrect: false },
        { id: 'c', text: '3 × 10⁷ m/s', isCorrect: false },
        { id: 'd', text: '3 × 10⁹ m/s', isCorrect: false },
      ],
    },
    {
      id: 3,
      text: 'Which of the following is a scalar quantity?',
      subject: 'Physics',
      topic: 'Vectors',
      options: [
        { id: 'a', text: 'Velocity', isCorrect: false },
        { id: 'b', text: 'Force', isCorrect: false },
        { id: 'c', text: 'Energy', isCorrect: true },
        { id: 'd', text: 'Acceleration', isCorrect: false },
      ],
    },
    // Chemistry Questions
    {
      id: 4,
      text: 'What is the atomic number of Carbon?',
      subject: 'Chemistry',
      topic: 'Periodic Table',
      options: [
        { id: 'a', text: '4', isCorrect: false },
        { id: 'b', text: '6', isCorrect: true },
        { id: 'c', text: '8', isCorrect: false },
        { id: 'd', text: '12', isCorrect: false },
      ],
    },
    {
      id: 5,
      text: 'Which gas is known as laughing gas?',
      subject: 'Chemistry',
      topic: 'Inorganic Chemistry',
      options: [
        { id: 'a', text: 'Nitrogen dioxide', isCorrect: false },
        { id: 'b', text: 'Nitrous oxide', isCorrect: true },
        { id: 'c', text: 'Carbon monoxide', isCorrect: false },
        { id: 'd', text: 'Sulfur dioxide', isCorrect: false },
      ],
    },
    {
      id: 6,
      text: 'The pH of pure water at 25°C is:',
      subject: 'Chemistry',
      topic: 'Acids and Bases',
      options: [
        { id: 'a', text: '6', isCorrect: false },
        { id: 'b', text: '7', isCorrect: true },
        { id: 'c', text: '8', isCorrect: false },
        { id: 'd', text: '14', isCorrect: false },
      ],
    },
    // Mathematics Questions
    {
      id: 7,
      text: 'What is the value of π (pi) approximately?',
      subject: 'Mathematics',
      topic: 'Constants',
      options: [
        { id: 'a', text: '3.14', isCorrect: true },
        { id: 'b', text: '2.71', isCorrect: false },
        { id: 'c', text: '1.61', isCorrect: false },
        { id: 'd', text: '4.14', isCorrect: false },
      ],
    },
    {
      id: 8,
      text: 'The derivative of x² is:',
      subject: 'Mathematics',
      topic: 'Calculus',
      options: [
        { id: 'a', text: 'x', isCorrect: false },
        { id: 'b', text: '2x', isCorrect: true },
        { id: 'c', text: 'x²', isCorrect: false },
        { id: 'd', text: '2x²', isCorrect: false },
      ],
    },
    {
      id: 9,
      text: 'What is the sum of angles in a triangle?',
      subject: 'Mathematics',
      topic: 'Geometry',
      options: [
        { id: 'a', text: '90°', isCorrect: false },
        { id: 'b', text: '180°', isCorrect: true },
        { id: 'c', text: '270°', isCorrect: false },
        { id: 'd', text: '360°', isCorrect: false },
      ],
    },
    {
      id: 10,
      text: 'Which of the following is a prime number?',
      subject: 'Mathematics',
      topic: 'Number Theory',
      options: [
        { id: 'a', text: '15', isCorrect: false },
        { id: 'b', text: '21', isCorrect: false },
        { id: 'c', text: '17', isCorrect: true },
        { id: 'd', text: '25', isCorrect: false },
      ],
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    Alert.alert('Time Up!', 'Your test has been submitted automatically.', [
      { text: 'OK', onPress: submitTest }
    ]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectOption = (questionId: number, optionId: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const toggleMarkForReview = (questionId: number) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const submitTest = () => {
    let score = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected && q.options.find(o => o.id === selected)?.isCorrect) {
        score++;
      }
    });
    const percentage = Math.round((score / questions.length) * 100);
    const points = score * 10;
    
    // Navigate to the Results tab and then to the Results screen
    navigation.navigate('My Results', {
      screen: 'Results',
      params: {
        score, 
        total: questions.length, 
        percentage,
        points, 
        syllabus, 
        testId,
        testName,
        timeSpent: 1800 - timeRemaining
      }
    });
    setShowSubmitModal(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;

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

  const getSyllabusColor = () => {
    switch(syllabus) {
      case 'JEE': return '#4F46E5';
      case 'NEET': return '#EC4899';
      case 'CET': return '#10B981';
      default: return '#4F46E5';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case 'Physics': return '#3B82F6';
      case 'Chemistry': return '#8B5CF6';
      case 'Mathematics': return '#10B981';
      case 'Biology': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const syllabusColor = getSyllabusColor();

  return (
    <View style={styles.container}>
      {/* Header with Timer */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          
          <View style={styles.timerCard}>
            <Ionicons name="time-outline" size={20} color="#EF4444" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Question Progress</Text>
            <Text style={styles.progressValue}>
              {currentQuestionIndex + 1} / {questions.length}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <View style={[styles.statCircle, { backgroundColor: '#10B981' }]}>
                <Text style={styles.statCircleText}>{answeredCount}</Text>
              </View>
              <Text style={styles.statLabel}>Answered</Text>
            </View>
            <View style={styles.statBadge}>
              <View style={[styles.statCircle, { backgroundColor: '#E5E7EB' }]}>
                <Text style={[styles.statCircleText, { color: '#6B7280' }]}>{unansweredCount}</Text>
              </View>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: syllabusColor 
              }
            ]}
          />
        </View>
      </View>

      {/* Question Section */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject & Topic Badge */}
        <View style={styles.badgesRow}>
          <View 
            style={[
              styles.subjectBadge, 
              { backgroundColor: `${getSubjectColor(currentQuestion.subject)}15` }
            ]}
          >
            <Text 
              style={[
                styles.subjectBadgeText,
                { color: getSubjectColor(currentQuestion.subject) }
              ]}
            >
              {currentQuestion.subject}
            </Text>
          </View>
          <View style={styles.topicBadge}>
            <Text style={styles.topicBadgeText}>{currentQuestion.topic}</Text>
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>
              Q{currentQuestionIndex + 1}. {currentQuestion.text}
            </Text>
            <TouchableOpacity 
              onPress={() => toggleMarkForReview(currentQuestion.id)}
              style={[
                styles.bookmarkButton,
                markedForReview.has(currentQuestion.id) && styles.bookmarkButtonActive
              ]}
            >
              <Ionicons 
                name={markedForReview.has(currentQuestion.id) ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={markedForReview.has(currentQuestion.id) ? '#F59E0B' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected && [styles.optionButtonSelected, { borderColor: syllabusColor }]
                  ]}
                  onPress={() => selectOption(currentQuestion.id, option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View 
                      style={[
                        styles.radioButton,
                        isSelected && [styles.radioButtonSelected, { backgroundColor: syllabusColor, borderColor: syllabusColor }]
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.optionLabel}>
                      {option.id.toUpperCase()}.
                    </Text>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected
                    ]}>
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Clear Selection */}
        {selectedAnswers[currentQuestion.id] && (
          <TouchableOpacity 
            onPress={() => {
              const newAnswers = { ...selectedAnswers };
              delete newAnswers[currentQuestion.id];
              setSelectedAnswers(newAnswers);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.clearButtonText}>Clear Selection</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navButtonsRow}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled
            ]}
            onPress={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={currentQuestionIndex === 0 ? '#9CA3AF' : '#FFFFFF'} 
            />
            <Text style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled
            ]}
            onPress={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestionIndex === questions.length - 1 && styles.navButtonTextDisabled
            ]}>
              Next
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={currentQuestionIndex === questions.length - 1 ? '#9CA3AF' : '#FFFFFF'} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setShowSubmitModal(true)}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Test</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="warning-outline" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.modalTitle}>Submit Test?</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to submit? You won't be able to change your answers.
              </Text>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Answered:</Text>
                <Text style={styles.modalStatValue}>{answeredCount} / {questions.length}</Text>
              </View>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Unanswered:</Text>
                <Text style={[styles.modalStatValue, { color: '#EF4444' }]}>{unansweredCount}</Text>
              </View>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Marked for Review:</Text>
                <Text style={[styles.modalStatValue, { color: '#F59E0B' }]}>{markedForReview.size}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSubmitModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={submitTest}
              >
                <Text style={styles.modalSubmitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {},
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statBadge: {
    alignItems: 'center',
  },
  statCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  topicBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    lineHeight: 26,
    marginRight: 12,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: '#FEF3C7',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    backgroundColor: '#F5F3FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {},
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  optionTextSelected: {
    color: '#111827',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalStats: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TestScreen;