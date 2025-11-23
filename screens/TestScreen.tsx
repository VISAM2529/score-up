import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  image?: string;
};

type Question = {
  _id: string;
  text: string;
  topic: string;
  difficulty: string;
  options: Option[];
  image?: string;
};

type Feedback = {
  isCorrect: boolean | null;
  correctId: string | null;
};

const TestScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { testId } = route.params;
  console.log("Test ID:", testId);
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: Feedback }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());

  /* ==================== FETCH TEST DATA ==================== */
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://scoreup-admin.vercel.app/api/admin/tests/${testId}`);
        const data = await res.json();

        if (data.success) {
          setTest(data.test);
          setQuestions(data.test.questions || []);
          setTimeRemaining((data.test.duration || 10) * 60);
        } else {
          Alert.alert("Error", "Failed to load test.");
        }
      } catch (err) {
        console.error("Fetch Test Error:", err);
        Alert.alert("Error", "Unable to fetch test data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  /* ==================== TIMER ==================== */
  useEffect(() => {
    if (!test) return;
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
  }, [test]);

  const handleAutoSubmit = () => {
    Alert.alert("Time Up!", "Your test has been submitted automatically.", [
      { text: "OK", onPress: submitTest },
    ]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /* ==================== ANSWER SELECTION ==================== */
  const selectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    const q = questions.find((q) => q._id === questionId)!;
    const correctOption = q.options.find((o) => o.isCorrect)!;
    const isCorrect = optionId === correctOption.id;

    setFeedback((prev) => ({
      ...prev,
      [questionId]: { isCorrect, correctId: correctOption.id },
    }));
  };

  /* ==================== SUBMIT TEST ==================== */
  const submitTest = () => {
    let score = 0;
    questions.forEach((q) => {
      const sel = selectedAnswers[q._id];
      if (sel && q.options.find((o) => o.id === sel)?.isCorrect) score++;
    });
    const percentage = Math.round((score / questions.length) * 100);

    navigation.navigate("My Results", {
      screen: "Results",
      params: {
        score,
        total: questions.length,
        percentage,
        testId: test._id,
        testName: test.name,
        timeSpent: test.duration * 60 - timeRemaining,
      },
    });
    setShowSubmitModal(false);
  };

  /* ==================== UI HELPERS ==================== */
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const toggleMarkForReview = (questionId: string) => {
    const newMarked = new Set(markedForReview);
    newMarked.has(questionId) ? newMarked.delete(questionId) : newMarked.add(questionId);
    setMarkedForReview(newMarked);
  };

  const syllabusColor = "#4F46E5";
  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 8, color: "#6B7280" }}>Loading test...</Text>
      </View>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text style={{ marginTop: 12, color: "#6B7280" }}>No questions found for this test.</Text>
      </View>
    );
  }

  /* ==================== RENDER ==================== */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.timerCard}>
          <Ionicons name="time-outline" size={20} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>

        <Text style={styles.testTitle}>{test.name}</Text>
      </View>

      {/* Question */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionCount}>
          Q{currentQuestionIndex + 1} / {questions.length}
        </Text>

        {/* Question Text + Image */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          {currentQuestion.image && (
            <Image
              source={{ uri: currentQuestion.image }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers[currentQuestion._id] === option.id;
            const fb = feedback[currentQuestion._id];

            const isCorrect = fb?.correctId === option.id;
            const isWrong = fb && isSelected && !isCorrect;

            let borderColor = "#E5E7EB";
            if (isCorrect) borderColor = "#10B981";
            else if (isWrong) borderColor = "#EF4444";
            else if (isSelected) borderColor = syllabusColor;

            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => selectOption(currentQuestion._id, option.id)}
                disabled={!!fb}
                activeOpacity={0.8}
                style={[styles.optionButton, { borderColor }]}
              >
                <Text style={styles.optionLabel}>{option.id.toUpperCase()}.</Text>
                <Text style={styles.optionText}>{option.text}</Text>

                {option.image && (
                  <Image
                    source={{ uri: option.image }}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.navButtonText}>Prev</Text>
        </TouchableOpacity>

        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#10B981" }]}
            onPress={() => setShowSubmitModal(true)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.navButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Submit Test?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to submit? You won’t be able to change your answers.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E5E7EB" }]}
                onPress={() => setShowSubmitModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#374151" }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#10B981" }]}
                onPress={submitTest}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
  },
  closeButton: {
    position: "absolute",
    left: 20,
    top: 60,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 6,
  },
  timerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  timerText: { fontSize: 18, fontWeight: "700", color: "#EF4444" },
  testTitle: { marginTop: 20, fontSize: 22, fontWeight: "700", color: "#111827" },
  questionCount: { textAlign: "center", marginTop: 12, color: "#6B7280" },
  questionContainer: { marginTop: 20, paddingHorizontal: 20 },
  questionText: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 10 },
  questionImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  optionsContainer: { paddingHorizontal: 20, marginTop: 10, gap: 12 },
  optionButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFF",
  },
  optionLabel: { fontSize: 15, fontWeight: "700", color: "#6B7280" },
  optionText: { fontSize: 15, color: "#111827", marginVertical: 4 },
  optionImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 8 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#4F46E5",
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  navButtonDisabled: { backgroundColor: "#9CA3AF" },
  navButtonText: { color: "#FFF", fontWeight: "600", fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 10 },
  modalText: { color: "#6B7280", textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 10 },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});

export default TestScreen;
