// // screens/TestScreen.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Ionicons from '@expo/vector-icons/Ionicons';

// interface Option {
//   id: string;
//   text: string;
//   isCorrect: boolean;
// }

// interface Question {
//   id: number;
//   text: string;
//   options: Option[];
//   subject: string;
//   topic: string;
// }

// const TestScreen = () => {
//   const route = useRoute<any>();
//   const { syllabus, testId, testName } = route.params;
//   const navigation = useNavigation<any>();

//   // Rich question set with various subjects
//   const questions: Question[] = [
//     // Physics Questions
//     {
//       id: 1,
//       text: 'What is the SI unit of force?',
//       subject: 'Physics',
//       topic: 'Mechanics',
//       options: [
//         { id: 'a', text: 'Joule', isCorrect: false },
//         { id: 'b', text: 'Newton', isCorrect: true },
//         { id: 'c', text: 'Watt', isCorrect: false },
//         { id: 'd', text: 'Pascal', isCorrect: false },
//       ],
//     },
//     {
//       id: 2,
//       text: 'The velocity of light in vacuum is approximately:',
//       subject: 'Physics',
//       topic: 'Optics',
//       options: [
//         { id: 'a', text: '3 × 10⁸ m/s', isCorrect: true },
//         { id: 'b', text: '3 × 10⁶ m/s', isCorrect: false },
//         { id: 'c', text: '3 × 10⁷ m/s', isCorrect: false },
//         { id: 'd', text: '3 × 10⁹ m/s', isCorrect: false },
//       ],
//     },
//     {
//       id: 3,
//       text: 'Which of the following is a scalar quantity?',
//       subject: 'Physics',
//       topic: 'Vectors',
//       options: [
//         { id: 'a', text: 'Velocity', isCorrect: false },
//         { id: 'b', text: 'Force', isCorrect: false },
//         { id: 'c', text: 'Energy', isCorrect: true },
//         { id: 'd', text: 'Acceleration', isCorrect: false },
//       ],
//     },
//     // Chemistry Questions
//     {
//       id: 4,
//       text: 'What is the atomic number of Carbon?',
//       subject: 'Chemistry',
//       topic: 'Periodic Table',
//       options: [
//         { id: 'a', text: '4', isCorrect: false },
//         { id: 'b', text: '6', isCorrect: true },
//         { id: 'c', text: '8', isCorrect: false },
//         { id: 'd', text: '12', isCorrect: false },
//       ],
//     },
//     {
//       id: 5,
//       text: 'Which gas is known as laughing gas?',
//       subject: 'Chemistry',
//       topic: 'Inorganic Chemistry',
//       options: [
//         { id: 'a', text: 'Nitrogen dioxide', isCorrect: false },
//         { id: 'b', text: 'Nitrous oxide', isCorrect: true },
//         { id: 'c', text: 'Carbon monoxide', isCorrect: false },
//         { id: 'd', text: 'Sulfur dioxide', isCorrect: false },
//       ],
//     },
//     {
//       id: 6,
//       text: 'The pH of pure water at 25°C is:',
//       subject: 'Chemistry',
//       topic: 'Acids and Bases',
//       options: [
//         { id: 'a', text: '6', isCorrect: false },
//         { id: 'b', text: '7', isCorrect: true },
//         { id: 'c', text: '8', isCorrect: false },
//         { id: 'd', text: '14', isCorrect: false },
//       ],
//     },
//     // Mathematics Questions
//     {
//       id: 7,
//       text: 'What is the value of π (pi) approximately?',
//       subject: 'Mathematics',
//       topic: 'Constants',
//       options: [
//         { id: 'a', text: '3.14', isCorrect: true },
//         { id: 'b', text: '2.71', isCorrect: false },
//         { id: 'c', text: '1.61', isCorrect: false },
//         { id: 'd', text: '4.14', isCorrect: false },
//       ],
//     },
//     {
//       id: 8,
//       text: 'The derivative of x² is:',
//       subject: 'Mathematics',
//       topic: 'Calculus',
//       options: [
//         { id: 'a', text: 'x', isCorrect: false },
//         { id: 'b', text: '2x', isCorrect: true },
//         { id: 'c', text: 'x²', isCorrect: false },
//         { id: 'd', text: '2x²', isCorrect: false },
//       ],
//     },
//     {
//       id: 9,
//       text: 'What is the sum of angles in a triangle?',
//       subject: 'Mathematics',
//       topic: 'Geometry',
//       options: [
//         { id: 'a', text: '90°', isCorrect: false },
//         { id: 'b', text: '180°', isCorrect: true },
//         { id: 'c', text: '270°', isCorrect: false },
//         { id: 'd', text: '360°', isCorrect: false },
//       ],
//     },
//     {
//       id: 10,
//       text: 'Which of the following is a prime number?',
//       subject: 'Mathematics',
//       topic: 'Number Theory',
//       options: [
//         { id: 'a', text: '15', isCorrect: false },
//         { id: 'b', text: '21', isCorrect: false },
//         { id: 'c', text: '17', isCorrect: true },
//         { id: 'd', text: '25', isCorrect: false },
//       ],
//     },
//   ];

//   const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleAutoSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const handleAutoSubmit = () => {
//     Alert.alert('Time Up!', 'Your test has been submitted automatically.', [
//       { text: 'OK', onPress: submitTest }
//     ]);
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const selectOption = (questionId: number, optionId: string) => {
//     setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
//   };

//   const toggleMarkForReview = (questionId: number) => {
//     const newMarked = new Set(markedForReview);
//     if (newMarked.has(questionId)) {
//       newMarked.delete(questionId);
//     } else {
//       newMarked.add(questionId);
//     }
//     setMarkedForReview(newMarked);
//   };

//   const submitTest = () => {
//     let score = 0;
//     questions.forEach((q) => {
//       const selected = selectedAnswers[q.id];
//       if (selected && q.options.find(o => o.id === selected)?.isCorrect) {
//         score++;
//       }
//     });
//     const percentage = Math.round((score / questions.length) * 100);
//     const points = score * 10;
    
//     // Navigate to the Results tab and then to the Results screen
//     // navigation.navigate('My Results', {
//     //   screen: 'ResultDetail',
//     //   params: {
//     //     score, 
//     //     total: questions.length, 
//     //     percentage,
//     //     points, 
//     //     syllabus, 
//     //     testId,
//     //     testName,
//     //     timeSpent: 1800 - timeRemaining
//     //   }
//     // });
//     // In TestScreen.tsx submitTest function
// navigation.navigate('ResultDetail', {
//   score, 
//   total: questions.length, 
//   percentage,
//   points, 
//   syllabus, 
//   testId,
//   testName,
//   timeSpent: 1800 - timeRemaining
// });
//     setShowSubmitModal(false);
//   };

//   const currentQuestion = questions[currentQuestionIndex];
//   const answeredCount = Object.keys(selectedAnswers).length;
//   const unansweredCount = questions.length - answeredCount;
//   const allQuestionsAnswered = answeredCount === questions.length;

//   const nextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const getSubjectColor = (subject: string) => {
//     switch(subject) {
//       case 'Physics': return '#3B82F6';
//       case 'Chemistry': return '#8B5CF6';
//       case 'Mathematics': return '#10B981';
//       case 'Biology': return '#EC4899';
//       default: return '#6B7280';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Compact Header */}
//       <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.closeButton}
//           >
//             <Ionicons name="close" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
          
//           <View style={styles.headerCenter}>
//             <Text style={styles.questionCounter}>
//               {currentQuestionIndex + 1}/{questions.length}
//             </Text>
//             <View style={styles.progressBarMini}>
//               <View 
//                 style={[
//                   styles.progressBarMiniFill, 
//                   { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
//                 ]}
//               />
//             </View>
//           </View>

//           <View style={styles.timerBadge}>
//             <Ionicons name="time" size={16} color="#FFFFFF" />
//             <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
//           </View>
//         </View>

//         <View style={styles.statsRowCompact}>
//           <View style={styles.statBadgeCompact}>
//             <Ionicons name="checkmark-circle" size={14} color="#10B981" />
//             <Text style={styles.statTextCompact}>{answeredCount} Done</Text>
//           </View>
//           <View style={styles.statBadgeCompact}>
//             <Ionicons name="help-circle" size={14} color="#9CA3AF" />
//             <Text style={styles.statTextCompact}>{unansweredCount} Left</Text>
//           </View>
//           <View style={styles.statBadgeCompact}>
//             <Ionicons name="bookmark" size={14} color="#F59E0B" />
//             <Text style={styles.statTextCompact}>{markedForReview.size} Marked</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Question Section */}
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Subject & Topic Badge */}
//         <View style={styles.badgesRow}>
//           <View 
//             style={[
//               styles.subjectBadge, 
//               { backgroundColor: `${getSubjectColor(currentQuestion.subject)}15` }
//             ]}
//           >
//             <Text 
//               style={[
//                 styles.subjectBadgeText,
//                 { color: getSubjectColor(currentQuestion.subject) }
//               ]}
//             >
//               {currentQuestion.subject}
//             </Text>
//           </View>
//           <View style={styles.topicBadge}>
//             <Text style={styles.topicBadgeText}>{currentQuestion.topic}</Text>
//           </View>
//         </View>

//         {/* Question Card */}
//         <View style={styles.questionCard}>
//           <LinearGradient
//             colors={['#FFFFFF', '#FAFBFF']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.questionCardGradient}
//           >
//             <View style={styles.questionHeader}>
//               <Text style={styles.questionText}>
//                 Q{currentQuestionIndex + 1}. {currentQuestion.text}
//               </Text>
//               <TouchableOpacity 
//                 onPress={() => toggleMarkForReview(currentQuestion.id)}
//                 style={[
//                   styles.bookmarkButton,
//                   markedForReview.has(currentQuestion.id) && styles.bookmarkButtonActive
//                 ]}
//               >
//                 <Ionicons 
//                   name={markedForReview.has(currentQuestion.id) ? 'bookmark' : 'bookmark-outline'} 
//                   size={20} 
//                   color={markedForReview.has(currentQuestion.id) ? '#F59E0B' : '#9CA3AF'} 
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Options */}
//             <View style={styles.optionsContainer}>
//               {currentQuestion.options.map((option) => {
//                 const isSelected = selectedAnswers[currentQuestion.id] === option.id;
//                 return (
//                   <TouchableOpacity
//                     key={option.id}
//                     style={[
//                       styles.optionButton,
//                       isSelected && styles.optionButtonSelected
//                     ]}
//                     onPress={() => selectOption(currentQuestion.id, option.id)}
//                     activeOpacity={0.7}
//                   >
//                     {isSelected ? (
//                       <LinearGradient
//                         colors={['#5B8DEE15', '#FFFFFF']}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 0 }}
//                         style={styles.optionContent}
//                       >
//                         <View style={styles.radioButtonSelected}>
//                           <Ionicons name="checkmark-circle" size={22} color="#5B8DEE" />
//                         </View>
//                         <Text style={styles.optionLabel}>
//                           {option.id.toUpperCase()}.
//                         </Text>
//                         <Text style={styles.optionTextSelected}>
//                           {option.text}
//                         </Text>
//                       </LinearGradient>
//                     ) : (
//                       <View style={styles.optionContent}>
//                         <View style={styles.radioButton} />
//                         <Text style={styles.optionLabel}>
//                           {option.id.toUpperCase()}.
//                         </Text>
//                         <Text style={styles.optionText}>
//                           {option.text}
//                         </Text>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </LinearGradient>
//         </View>

//         {/* Clear Selection */}
//         {selectedAnswers[currentQuestion.id] && (
//           <TouchableOpacity 
//             onPress={() => {
//               const newAnswers = { ...selectedAnswers };
//               delete newAnswers[currentQuestion.id];
//               setSelectedAnswers(newAnswers);
//             }}
//             style={styles.clearButton}
//           >
//             <Ionicons name="close-circle" size={18} color="#EF4444" />
//             <Text style={styles.clearButtonText}>Clear Selection</Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Bottom Navigation - Compact with Arrows */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity
//           style={[
//             styles.arrowButton,
//             currentQuestionIndex === 0 && styles.arrowButtonDisabled
//           ]}
//           onPress={prevQuestion}
//           disabled={currentQuestionIndex === 0}
//         >
//           <Ionicons 
//             name="chevron-back" 
//             size={28} 
//             color={currentQuestionIndex === 0 ? '#D1D5DB' : '#5B8DEE'} 
//           />
//         </TouchableOpacity>

//         {allQuestionsAnswered ? (
//           <TouchableOpacity
//             style={styles.submitButton}
//             onPress={() => setShowSubmitModal(true)}
//           >
//             <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
//             <Text style={styles.submitButtonText}>Submit Test</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.centerInfo}>
//             <Text style={styles.centerInfoText}>
//               {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} remaining
//             </Text>
//           </View>
//         )}

//         <TouchableOpacity
//           style={[
//             styles.arrowButton,
//             currentQuestionIndex === questions.length - 1 && styles.arrowButtonDisabled
//           ]}
//           onPress={nextQuestion}
//           disabled={currentQuestionIndex === questions.length - 1}
//         >
//           <Ionicons 
//             name="chevron-forward" 
//             size={28} 
//             color={currentQuestionIndex === questions.length - 1 ? '#D1D5DB' : '#5B8DEE'} 
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Submit Confirmation Modal */}
//       <Modal
//         visible={showSubmitModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowSubmitModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <LinearGradient
//                 colors={['#F59E0B', '#F97316']}
//                 style={styles.modalIcon}
//               >
//                 <Ionicons name="warning" size={32} color="#FFFFFF" />
//               </LinearGradient>
//               <Text style={styles.modalTitle}>Submit Test?</Text>
//               <Text style={styles.modalSubtitle}>
//                 Are you sure you want to submit? You won't be able to change your answers.
//               </Text>
//             </View>

//             <View style={styles.modalStats}>
//               <View style={styles.modalStatRow}>
//                 <View style={styles.modalStatLeft}>
//                   <Ionicons name="checkmark-circle" size={18} color="#10B981" />
//                   <Text style={styles.modalStatLabel}>Answered</Text>
//                 </View>
//                 <Text style={styles.modalStatValue}>{answeredCount}/{questions.length}</Text>
//               </View>
//               {markedForReview.size > 0 && (
//                 <View style={styles.modalStatRow}>
//                   <View style={styles.modalStatLeft}>
//                     <Ionicons name="bookmark" size={18} color="#F59E0B" />
//                     <Text style={styles.modalStatLabel}>Marked for Review</Text>
//                   </View>
//                   <Text style={[styles.modalStatValue, { color: '#F59E0B' }]}>{markedForReview.size}</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setShowSubmitModal(false)}
//               >
//                 <Text style={styles.modalCancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSubmitButton}
//                 onPress={submitTest}
//               >
//                 <Text style={styles.modalSubmitButtonText}>Submit Now</Text>
//                 <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   // Compact Header
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 24,
//     paddingBottom: 16,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginBottom: 12,
//   },
//   closeButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerCenter: {
//     flex: 1,
//   },
//   questionCounter: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 6,
//     textAlign: 'center',
//   },
//   progressBarMini: {
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressBarMiniFill: {
//     height: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 2,
//   },
//   timerBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(239, 68, 68, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     gap: 6,
//   },
//   timerText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   statsRowCompact: {
//     flexDirection: 'row',
//     gap: 8,
//     justifyContent: 'center',
//   },
//   statBadgeCompact: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 4,
//   },
//   statTextCompact: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 20,
//   },
//   badgesRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   subjectBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   subjectBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   topicBadge: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   topicBadgeText: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   questionCard: {
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   questionCardGradient: {
//     padding: 20,
//   },
//   questionHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     flex: 1,
//     lineHeight: 24,
//     marginRight: 12,
//   },
//   bookmarkButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bookmarkButtonActive: {
//     backgroundColor: '#FEF3C7',
//   },
//   optionsContainer: {
//     gap: 12,
//   },
//   optionButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//   },
//   optionButtonSelected: {
//     borderColor: '#5B8DEE',
//   },
//   optionContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//   },
//   radioButton: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     backgroundColor: '#FFFFFF',
//     marginRight: 12,
//   },
//   radioButtonSelected: {
//     marginRight: 12,
//   },
//   optionLabel: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#6B7280',
//     marginRight: 8,
//   },
//   optionText: {
//     fontSize: 15,
//     color: '#374151',
//     flex: 1,
//     fontWeight: '500',
//   },
//   optionTextSelected: {
//     fontSize: 15,
//     color: '#111827',
//     flex: 1,
//     fontWeight: '600',
//   },
//   clearButton: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FECACA',
//     borderRadius: 10,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     marginBottom: 16,
//   },
//   clearButtonText: {
//     color: '#EF4444',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // Compact Bottom Navigation with Arrows
//   bottomNav: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     gap: 16,
//   },
//   arrowButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrowButtonDisabled: {
//     backgroundColor: '#F9FAFB',
//   },
//   centerInfo: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   centerInfoText: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   submitButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#10B981',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 24,
//     width: '100%',
//     maxWidth: 400,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   modalIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   modalStats: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     gap: 12,
//   },
//   modalStatRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   modalStatLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   modalStatLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   modalStatValue: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   modalCancelButton: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   modalCancelButtonText: {
//     color: '#6B7280',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   modalSubmitButton: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#10B981',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   modalSubmitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });

// export default TestScreen;
// screens/TestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
    
    // Navigate to the Results tab and then to the ResultDetail screen
    navigation.navigate('My Results', {
      screen: 'ResultDetail',
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
  const allQuestionsAnswered = answeredCount === questions.length;

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

  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case 'Physics': return '#3B82F6';
      case 'Chemistry': return '#8B5CF6';
      case 'Mathematics': return '#10B981';
      case 'Biology': return '#EC4899';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <LinearGradient colors={['#5B8DEE', '#5B8DEE']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.questionCounter}>
              {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <View style={styles.progressBarMini}>
              <View 
                style={[
                  styles.progressBarMiniFill, 
                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
                ]}
              />
            </View>
          </View>

          <View style={styles.timerBadge}>
            <Ionicons name="time" size={16} color="#FFFFFF" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        <View style={styles.statsRowCompact}>
          <View style={styles.statBadgeCompact}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.statTextCompact}>{answeredCount} Done</Text>
          </View>
          <View style={styles.statBadgeCompact}>
            <Ionicons name="help-circle" size={14} color="#9CA3AF" />
            <Text style={styles.statTextCompact}>{unansweredCount} Left</Text>
          </View>
          <View style={styles.statBadgeCompact}>
            <Ionicons name="bookmark" size={14} color="#F59E0B" />
            <Text style={styles.statTextCompact}>{markedForReview.size} Marked</Text>
          </View>
        </View>
      </LinearGradient>

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
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questionCardGradient}
          >
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
                  color={markedForReview.has(currentQuestion.id) ? '#F59E0B' : '#9CA3AF'} 
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
                      isSelected && styles.optionButtonSelected
                    ]}
                    onPress={() => selectOption(currentQuestion.id, option.id)}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={['#5B8DEE15', '#FFFFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.optionContent}
                      >
                        <View style={styles.radioButtonSelected}>
                          <Ionicons name="checkmark-circle" size={22} color="#5B8DEE" />
                        </View>
                        <Text style={styles.optionLabel}>
                          {option.id.toUpperCase()}.
                        </Text>
                        <Text style={styles.optionTextSelected}>
                          {option.text}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.optionContent}>
                        <View style={styles.radioButton} />
                        <Text style={styles.optionLabel}>
                          {option.id.toUpperCase()}.
                        </Text>
                        <Text style={styles.optionText}>
                          {option.text}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </LinearGradient>
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
            <Ionicons name="close-circle" size={18} color="#EF4444" />
            <Text style={styles.clearButtonText}>Clear Selection</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation - Compact with Arrows */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.arrowButton,
            currentQuestionIndex === 0 && styles.arrowButtonDisabled
          ]}
          onPress={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={28} 
            color={currentQuestionIndex === 0 ? '#D1D5DB' : '#5B8DEE'} 
          />
        </TouchableOpacity>

        {allQuestionsAnswered ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setShowSubmitModal(true)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Test</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.centerInfo}>
            <Text style={styles.centerInfoText}>
              {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} remaining
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.arrowButton,
            currentQuestionIndex === questions.length - 1 && styles.arrowButtonDisabled
          ]}
          onPress={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <Ionicons 
            name="chevron-forward" 
            size={28} 
            color={currentQuestionIndex === questions.length - 1 ? '#D1D5DB' : '#5B8DEE'} 
          />
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
              <LinearGradient
                colors={['#F59E0B', '#F97316']}
                style={styles.modalIcon}
              >
                <Ionicons name="warning" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.modalTitle}>Submit Test?</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to submit? You won't be able to change your answers.
              </Text>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.modalStatRow}>
                <View style={styles.modalStatLeft}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.modalStatLabel}>Answered</Text>
                </View>
                <Text style={styles.modalStatValue}>{answeredCount}/{questions.length}</Text>
              </View>
              {markedForReview.size > 0 && (
                <View style={styles.modalStatRow}>
                  <View style={styles.modalStatLeft}>
                    <Ionicons name="bookmark" size={18} color="#F59E0B" />
                    <Text style={styles.modalStatLabel}>Marked for Review</Text>
                  </View>
                  <Text style={[styles.modalStatValue, { color: '#F59E0B' }]}>{markedForReview.size}</Text>
                </View>
              )}
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
                <Text style={styles.modalSubmitButtonText}>Submit Now</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  // Compact Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  progressBarMini: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarMiniFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRowCompact: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  statBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statTextCompact: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
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
    fontWeight: '700',
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
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionCardGradient: {
    padding: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    lineHeight: 24,
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
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    borderColor: '#5B8DEE',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  radioButtonSelected: {
    marginRight: 12,
  },
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
    fontWeight: '500',
  },
  optionTextSelected: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  // Compact Bottom Navigation with Arrows
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonDisabled: {
    backgroundColor: '#F9FAFB',
  },
  centerInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfoText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  modalStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
    fontWeight: '700',
  },
  modalSubmitButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default TestScreen;