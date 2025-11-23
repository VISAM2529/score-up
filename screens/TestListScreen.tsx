// screens/TestListScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Test {
  _id: string;
  name: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  syllabusId: { _id: string; name: string };
  subjectId?: { _id: string; name: string; icon?: string; color?: string };
  attemptCount: number;
}

const TestListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const syllabusId = route.params?.syllabusId || null;
  console.log("Syllabus ID:", syllabusId);  
  const syllabusName = route.params?.syllabusName || "Syllabus";

  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [userData,setUserData] = useState<any>(null);
  const filters = ["All", "Mock", "Practice", "Chapter", "Previous Year"];

  // ✅ Fetch Tests from your API
  const fetchTests = async () => {
    try {
      setLoading(true);
      let url = `https://scoreup-admin.vercel.app/api/tests`;

      const params = new URLSearchParams();
      if (syllabusId) params.append("syllabusId", syllabusId);

      // Optional filters (type, difficulty etc.)
      if (selectedFilter !== "All") params.append("type", selectedFilter);

      url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.tests)) {
        setTests(data.tests);
        const userInfo = await AsyncStorage.getItem('@user_subscription');
        setUserData(userInfo != null ? JSON.parse(userInfo) : null);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error("Fetch Tests Error:", error);
      setTests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  console.log("User Data:",userData);
  useEffect(() => {
    fetchTests();
  }, [syllabusId, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTests();
  };

  const handleTestSelect = (test: Test) => {
    console.log("Selected Test:", test);
    const testId = test._id;
    navigation.navigate("Test", {testId});
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10B981";
      case "Medium":
        return "#F59E0B";
      case "Hard":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getSyllabusColor = () => {
    switch (syllabusName) {
      case "JEE":
        return "#4F46E5";
      case "NEET":
        return "#EC4899";
      case "CET":
        return "#10B981";
      default:
        return "#4F46E5";
    }
  };

  const syllabusColor = getSyllabusColor();

  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={syllabusColor} />
        <Text style={{ color: "#6B7280", marginTop: 10 }}>Loading tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#FFFFFF" }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View
            style={[styles.headerIcon, { backgroundColor: `${syllabusColor}15` }]}
          >
            <Ionicons name="book-outline" size={28} color={syllabusColor} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{syllabusName} Tests</Text>
            <Text style={styles.headerSubtitle}>
              Choose your test and start practicing
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{tests.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={styles.statValue}>0%</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter
                ? [styles.filterButtonActive, { backgroundColor: syllabusColor }]
                : styles.filterButtonInactive,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter
                  ? styles.filterButtonTextActive
                  : styles.filterButtonTextInactive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Test List */}
      <FlatList
        data={tests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testCard}
            onPress={() => handleTestSelect(item)}
            activeOpacity={0.7}
          >
            {/* Header */}
            <View style={styles.testHeader}>
              <View
                style={[
                  styles.testIconCircle,
                  { backgroundColor: `${syllabusColor}15` },
                ]}
              >
                <Ionicons
                  name={item.subjectId?.icon || "document-text-outline"}
                  size={22}
                  color={item.subjectId?.color || syllabusColor}
                />
              </View>
              <View style={styles.testHeaderText}>
                <Text style={styles.testName}>{item.name}</Text>
                <Text style={styles.testSubject}>
                  {item.subjectId?.name || "General"}
                </Text>
              </View>
            </View>

            {/* Meta Info */}
            <View style={styles.testMeta}>
              <Text style={styles.testMetaText}>{item.totalQuestions} Qs</Text>
              <Text style={styles.testMetaText}>• {item.duration} min</Text>
              <Text style={styles.testMetaText}>
                • {item.pointsPerQuestion} pts/Q
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.testFooter}>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: `${getDifficultyColor(item.difficulty)}15` },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(item.difficulty) },
                  ]}
                >
                  {item.difficulty}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: syllabusColor }]}
                onPress={() => handleTestSelect(item)}
              >
                <Text style={styles.startButtonText}>Start</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No tests available</Text>
            <Text style={styles.emptyStateSubtitle}>Try another filter</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerContent: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#111827" },
  headerSubtitle: { fontSize: 14, color: "#6B7280" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statLabel: { fontSize: 11, color: "#6B7280", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "700", color: "#111827" },
  filterScrollView: { marginTop: 16, marginBottom: 12 },
  filterContainer: { paddingHorizontal: 24, gap: 8 },
  filterButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  filterButtonInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: { fontSize: 14, fontWeight: "600" },
  filterButtonTextActive: { color: "#FFFFFF" },
  filterButtonTextInactive: { color: "#6B7280" },
  listContent: { paddingHorizontal: 24, paddingBottom: 100 },
  testCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  testHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  testIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  testHeaderText: { flex: 1 },
  testName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  testSubject: { fontSize: 13, color: "#6B7280" },
  testMeta: { flexDirection: "row", gap: 8, marginBottom: 12 },
  testMetaText: { fontSize: 12, color: "#6B7280" },
  testFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  difficultyText: { fontSize: 11, fontWeight: "600" },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startButtonText: { color: "#FFF", fontWeight: "600" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  emptyStateTitle: { fontSize: 16, color: "#9CA3AF", marginTop: 16, fontWeight: "600" },
  emptyStateSubtitle: { fontSize: 14, color: "#D1D5DB", marginTop: 4 },
});

export default TestListScreen;
