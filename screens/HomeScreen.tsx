// // screens/HomeScreen.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Ionicons from '@expo/vector-icons/Ionicons';

// const HomeScreen = () => {
//   const navigation = useNavigation<any>();
//   const [selectedExam, setSelectedExam] = useState('JEE');

//   const examTabs = ['JEE', 'CET', 'NEET'];

//   const stats = [
//     { label: 'Tests', value: '24', icon: 'checkmark-circle-outline', color: '#10B981' },
//     { label: 'Avg Score', value: '78%', icon: 'trending-up-outline', color: '#5B8DEE' },
//     { label: 'Streak', value: '7d', icon: 'flame-outline', color: '#F59E0B' },
//     { label: 'Rank', value: '#156', icon: 'trophy-outline', color: '#EC4899' },
//   ];

//   const recentTests = [
//     { 
//       id: 1, 
//       subject: 'Physics', 
//       chapter: 'Mechanics', 
//       questions: 30, 
//       duration: '45 min', 
//       difficulty: 'Medium', 
//       icon: 'flask-outline',
//       color: '#5B8DEE'
//     },
//     { 
//       id: 2, 
//       subject: 'Chemistry', 
//       chapter: 'Organic Chemistry', 
//       questions: 25, 
//       duration: '40 min', 
//       difficulty: 'Hard', 
//       icon: 'beaker-outline',
//       color: '#EC4899'
//     },
//     { 
//       id: 3, 
//       subject: 'Mathematics', 
//       chapter: 'Calculus', 
//       questions: 35, 
//       duration: '50 min', 
//       difficulty: 'Easy', 
//       icon: 'calculator-outline',
//       color: '#10B981'
//     },
//   ];

//   const quickActions = [
//     { 
//       id: 1, 
//       title: 'Practice', 
//       subtitle: 'Quick Test', 
//       icon: 'flash-outline', 
//       color: '#5B8DEE', 
//       screen: 'Tests' 
//     },
//     { 
//       id: 2, 
//       title: 'Results', 
//       subtitle: 'Performance', 
//       icon: 'stats-chart-outline', 
//       color: '#EC4899', 
//       screen: 'My Results' 
//     },
//     { 
//       id: 3, 
//       title: 'Syllabus', 
//       subtitle: 'Topics', 
//       icon: 'book-outline', 
//       color: '#10B981', 
//       screen: 'Tests' 
//     },
//     { 
//       id: 4, 
//       title: 'Profile', 
//       subtitle: 'Account', 
//       icon: 'person-outline', 
//       color: '#F59E0B', 
//       screen: 'Profile' 
//     },
//   ];

//   const getDifficultyColor = (difficulty: string) => {
//     switch(difficulty) {
//       case 'Easy': return '#10B981';
//       case 'Medium': return '#F59E0B';
//       case 'Hard': return '#EF4444';
//       default: return '#6B7280';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Header Section */}
//         <LinearGradient 
//           colors={['#5B8DEE', '#5B8DEE']} 
//           style={styles.header}
//         >
//           <View style={styles.headerTop}>
//             <View style={styles.headerLeft}>
//               <View style={styles.logoContainer}>
//                 <View style={styles.bookIcon}>
//                   <View style={styles.bookLeftPage}>
//                     <View style={styles.bookLeftStripe1} />
//                     <View style={styles.bookLeftStripe2} />
//                   </View>
//                   <View style={styles.bookRightPage}>
//                     <View style={styles.bookRightStripe} />
//                   </View>
//                 </View>
//               </View>
//               <Text style={styles.logoText}>ScoreUp</Text>
//             </View>
//             <TouchableOpacity style={styles.notificationButton}>
//               <Ionicons name="notifications" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         {/* Greeting Card with Extra Top Margin */}
//         <View style={styles.greetingCard}>
//           <Text style={styles.greetingText}>Hello Rajesh...! 👋</Text>
//           <Text style={styles.greetingSubtitle}>Keep practicing, your next test is waiting</Text>
//         </View>

//         {/* Exam Tabs */}
//         <View style={styles.examTabsContainer}>
//           <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.examTabsContent}
//           >
//             {examTabs.map((exam) => (
//               <TouchableOpacity
//                 key={exam}
//                 style={styles.examTabWrapper}
//                 onPress={() => setSelectedExam(exam)}
//               >
//                 {selectedExam === exam ? (
//                   <LinearGradient
//                     colors={['#5B8DEE', '#7BA7F7']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.examTabActive}
//                   >
//                     <Ionicons name="school" size={20} color="#FFFFFF" />
//                     <Text style={styles.examTabTextActive}>{exam}</Text>
//                   </LinearGradient>
//                 ) : (
//                   <View style={styles.examTab}>
//                     <Ionicons name="school-outline" size={20} color="#5B8DEE" />
//                     <Text style={styles.examTabText}>{exam}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity style={styles.viewAllTab}>
//               <Ionicons name="grid-outline" size={18} color="#6B7280" />
//               <Text style={styles.viewAllTabText}>View All</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>

//         {/* Stats Section */}
//         <View style={styles.statsSection}>
//           <View style={styles.statsCard}>
//             {stats.map((stat, index) => (
//               <View key={index} style={styles.statItem}>
//                 <View style={[styles.statIconCircle, { backgroundColor: `${stat.color}15` }]}>
//                   <Ionicons name={stat.icon} size={20} color={stat.color} />
//                 </View>
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statLabel}>{stat.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeaderWithIcon}>
//             <View style={styles.sectionTitleContainer}>
//               <View style={styles.sectionIconCircle}>
//                 <Ionicons name="flash" size={18} color="#5B8DEE" />
//               </View>
//               <Text style={styles.sectionTitle}>Quick Actions</Text>
//             </View>
//           </View>
//           <View style={styles.quickActionsGrid}>
//             {quickActions.map((action) => (
//               <TouchableOpacity
//                 key={action.id}
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate(action.screen)}
//               >
//                 <LinearGradient
//                   colors={[`${action.color}20`, `${action.color}05`]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.quickActionGradient}
//                 >
//                   <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
//                     <Ionicons name={action.icon} size={24} color="#FFFFFF" />
//                   </View>
//                   <View style={styles.quickActionInfo}>
//                     <Text style={styles.quickActionTitle}>{action.title}</Text>
//                     <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
//                   </View>
//                   <View style={styles.quickActionArrow}>
//                     <Ionicons name="chevron-forward" size={20} color={action.color} />
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Recent Tests */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionTitleContainer}>
//               <View style={styles.sectionIconCircle}>
//                 <Ionicons name="trophy" size={18} color="#5B8DEE" />
//               </View>
//               <Text style={styles.sectionTitle}>Recommended Tests</Text>
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('Tests')}>
//               <Text style={styles.viewAllButton}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           {recentTests.map((test) => (
//             <TouchableOpacity
//               key={test.id}
//               style={styles.testCard}
//               onPress={() => navigation.navigate('Tests')}
//             >
//               <LinearGradient
//                 colors={['#FFFFFF', '#FAFBFF']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.testCardGradient}
//               >
//                 <View style={styles.testCardContent}>
//                   <LinearGradient
//                     colors={[test.color, `${test.color}CC`]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.testIcon}
//                   >
//                     <Ionicons name={test.icon} size={28} color="#FFFFFF" />
//                   </LinearGradient>
                  
//                   <View style={styles.testInfo}>
//                     <Text style={styles.testSubject}>{test.subject}</Text>
//                     <Text style={styles.testChapter}>{test.chapter}</Text>
                    
//                     <View style={styles.testMeta}>
//                       <View style={styles.testMetaItem}>
//                         <View style={styles.metaIconCircle}>
//                           <Ionicons name="document-text" size={12} color="#5B8DEE" />
//                         </View>
//                         <Text style={styles.testMetaText}>{test.questions} Qs</Text>
//                       </View>
//                       <View style={styles.testMetaItem}>
//                         <View style={styles.metaIconCircle}>
//                           <Ionicons name="time" size={12} color="#5B8DEE" />
//                         </View>
//                         <Text style={styles.testMetaText}>{test.duration}</Text>
//                       </View>
//                       <View 
//                         style={[
//                           styles.difficultyBadge, 
//                           { backgroundColor: getDifficultyColor(test.difficulty) }
//                         ]}
//                       >
//                         <Text style={styles.difficultyText}>
//                           {test.difficulty}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>

//                   <View style={styles.testArrowContainer}>
//                     <Ionicons name="arrow-forward-circle" size={32} color="#5B8DEE" />
//                   </View>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Bottom Spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 100,
//   },
  
//   // Header Styles
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 24,
//     paddingBottom: 20,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     marginRight: 10,
//   },
//   bookIcon: {
//     width: 36,
//     height: 32,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bookLeftPage: {
//     width: 16,
//     height: 28,
//     backgroundColor: '#2463EB',
//     borderTopLeftRadius: 3,
//     borderBottomLeftRadius: 3,
//     justifyContent: 'space-evenly',
//     paddingHorizontal: 3,
//   },
//   bookLeftStripe1: {
//     width: '100%',
//     height: 2,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 1,
//   },
//   bookLeftStripe2: {
//     width: '100%',
//     height: 2,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 1,
//   },
//   bookRightPage: {
//     width: 16,
//     height: 28,
//     backgroundColor: '#F97316',
//     borderTopRightRadius: 3,
//     borderBottomRightRadius: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bookRightStripe: {
//     width: '70%',
//     height: 2,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 1,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Greeting Card
//   greetingCard: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 24,
//     marginTop: 20,
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   greetingText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 6,
//   },
//   greetingSubtitle: {
//     fontSize: 13,
//     color: '#6B7280',
//     lineHeight: 19,
//   },
  
//   // Exam Tabs
//   examTabsContainer: {
//     marginTop: 20,
//     paddingLeft: 24,
//   },
//   examTabsContent: {
//     paddingRight: 24,
//     gap: 12,
//   },
//   examTabWrapper: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   examTab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     gap: 8,
//     minWidth: 100,
//     justifyContent: 'center',
//   },
//   examTabActive: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 16,
//     gap: 8,
//     minWidth: 100,
//     justifyContent: 'center',
//   },
//   examTabText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#5B8DEE',
//   },
//   examTabTextActive: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   viewAllTab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     gap: 6,
//   },
//   viewAllTabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
  
//   // Stats Section
//   statsSection: {
//     paddingHorizontal: 24,
//     marginTop: 20,
//   },
//   statsCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statIconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
  
//   // Sections
//   section: {
//     paddingHorizontal: 24,
//     marginTop: 28,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionHeaderWithIcon: {
//     marginBottom: 16,
//   },
//   sectionTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   sectionIconCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#EEF2FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     letterSpacing: -0.3,
//   },
//   viewAllButton: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#5B8DEE',
//   },
  
//   // Quick Actions
//   quickActionsGrid: {
//     flexDirection: 'column',
//     marginTop: 12,
//     gap: 12,
//   },
//   quickActionCard: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   quickActionGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 14,
//   },
//   quickActionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quickActionInfo: {
//     flex: 1,
//   },
//   quickActionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   quickActionSubtitle: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   quickActionArrow: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Test Cards
//   testCard: {
//     borderRadius: 18,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   testCardGradient: {
//     padding: 18,
//   },
//   testCardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   testIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   testInfo: {
//     flex: 1,
//   },
//   testSubject: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 5,
//   },
//   testChapter: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 10,
//     fontWeight: '500',
//   },
//   testMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   testMetaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   metaIconCircle: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: '#EEF2FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   testMetaText: {
//     fontSize: 13,
//     color: '#374151',
//     fontWeight: '600',
//   },
//   difficultyBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 10,
//   },
//   difficultyText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   testArrowContainer: {
//     marginLeft: 8,
//   },
//   bottomSpacing: {
//     height: 20,
//   },
// });

// export default HomeScreen;
// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedExam, setSelectedExam] = useState('JEE');

  const examTabs = ['JEE', 'CET', 'NEET'];

  const stats = [
    { label: 'Tests', value: '24', icon: 'checkmark-circle-outline', color: '#10B981' },
    { label: 'Avg Score', value: '78%', icon: 'trending-up-outline', color: '#5B8DEE' },
    { label: 'Streak', value: '7d', icon: 'flame-outline', color: '#F59E0B' },
    { label: 'Rank', value: '#156', icon: 'trophy-outline', color: '#EC4899' },
  ];

  const recentTests = [
    { 
      id: 1, 
      subject: 'Physics', 
      chapter: 'Mechanics', 
      questions: 30, 
      duration: '45 min', 
      difficulty: 'Medium', 
      icon: 'flask-outline',
      color: '#5B8DEE'
    },
    { 
      id: 2, 
      subject: 'Chemistry', 
      chapter: 'Organic Chemistry', 
      questions: 25, 
      duration: '40 min', 
      difficulty: 'Hard', 
      icon: 'beaker-outline',
      color: '#EC4899'
    },
    { 
      id: 3, 
      subject: 'Mathematics', 
      chapter: 'Calculus', 
      questions: 35, 
      duration: '50 min', 
      difficulty: 'Easy', 
      icon: 'calculator-outline',
      color: '#10B981'
    },
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Practice', 
      subtitle: 'Quick Test', 
      icon: 'flash-outline', 
      color: '#5B8DEE', 
      screen: 'Tests' 
    },
    { 
      id: 2, 
      title: 'Results', 
      subtitle: 'Performance', 
      icon: 'stats-chart-outline', 
      color: '#EC4899', 
      screen: 'My Results' 
    },
    { 
      id: 3, 
      title: 'Syllabus', 
      subtitle: 'Topics', 
      icon: 'book-outline', 
      color: '#10B981', 
      screen: 'Tests' 
    },
    { 
      id: 4, 
      title: 'Profile', 
      subtitle: 'Account', 
      icon: 'person-outline', 
      color: '#F59E0B', 
      screen: 'Profile' 
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header Section */}
      <LinearGradient 
        colors={['#5B8DEE', '#5B8DEE']} 
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
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
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Card with Extra Top Margin */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>Hello Rajesh...! 👋</Text>
          <Text style={styles.greetingSubtitle}>Keep practicing, your next test is waiting</Text>
        </View>

        {/* Exam Tabs */}
        <View style={styles.examTabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.examTabsContent}
          >
            {examTabs.map((exam) => (
              <TouchableOpacity
                key={exam}
                style={styles.examTabWrapper}
                onPress={() => setSelectedExam(exam)}
              >
                {selectedExam === exam ? (
                  <LinearGradient
                    colors={['#4F7FE5', '#6B9AF0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.examTabActive}
                  >
                    <Ionicons name="school" size={20} color="#FFFFFF" />
                    <Text style={styles.examTabTextActive}>{exam}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.examTab}>
                    <Ionicons name="school-outline" size={20} color="#5B8DEE" />
                    <Text style={styles.examTabText}>{exam}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.viewAllTab}>
              <Ionicons name="grid-outline" size={18} color="#6B7280" />
              <Text style={styles.viewAllTabText}>View All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIconCircle, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="flash" size={18} color="#5B8DEE" />
              </View>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <LinearGradient
                  colors={[`${action.color}20`, `${action.color}05`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionGradient}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.quickActionInfo}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <View style={styles.quickActionArrow}>
                    <Ionicons name="chevron-forward" size={20} color={action.color} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="trophy" size={18} color="#5B8DEE" />
              </View>
              <Text style={styles.sectionTitle}>Recommended Tests</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Tests')}>
              <Text style={styles.viewAllButton}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={styles.testCard}
              onPress={() => navigation.navigate('Tests')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#FAFBFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.testCardGradient}
              >
                <View style={styles.testCardContent}>
                  <LinearGradient
                    colors={[test.color, `${test.color}CC`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.testIcon}
                  >
                    <Ionicons name={test.icon} size={28} color="#FFFFFF" />
                  </LinearGradient>
                  
                  <View style={styles.testInfo}>
                    <Text style={styles.testSubject}>{test.subject}</Text>
                    <Text style={styles.testChapter}>{test.chapter}</Text>
                    
                    <View style={styles.testMeta}>
                      <View style={styles.testMetaItem}>
                        <View style={styles.metaIconCircle}>
                          <Ionicons name="document-text" size={12} color="#5B8DEE" />
                        </View>
                        <Text style={styles.testMetaText}>{test.questions} Qs</Text>
                      </View>
                      <View style={styles.testMetaItem}>
                        <View style={styles.metaIconCircle}>
                          <Ionicons name="time" size={12} color="#5B8DEE" />
                        </View>
                        <Text style={styles.testMetaText}>{test.duration}</Text>
                      </View>
                      <View 
                        style={[
                          styles.difficultyBadge, 
                          { backgroundColor: getDifficultyColor(test.difficulty) }
                        ]}
                      >
                        <Text style={styles.difficultyText}>
                          {test.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.testArrowContainer}>
                    <Ionicons name="arrow-forward-circle" size={32} color="#5B8DEE" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 10,
  },
  bookIcon: {
    width: 36,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookLeftPage: {
    width: 16,
    height: 28,
    backgroundColor: '#2463EB',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
  },
  bookLeftStripe1: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  bookLeftStripe2: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  bookRightPage: {
    width: 16,
    height: 28,
    backgroundColor: '#F97316',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookRightStripe: {
    width: '70%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Greeting Card
  greetingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  
  // Exam Tabs
  examTabsContainer: {
    marginTop: 20,
    paddingLeft: 24,
  },
  examTabsContent: {
    paddingRight: 24,
    gap: 12,
  },
  examTabWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  examTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    gap: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  examTabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  examTabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  examTabTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewAllTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    gap: 6,
  },
  viewAllTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Sections
  section: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderWithIcon: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'column',
    marginTop: 12,
    gap: 12,
  },
  quickActionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  quickActionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Test Cards
  testCard: {
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testCardGradient: {
    padding: 18,
  },
  testCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  testInfo: {
    flex: 1,
  },
  testSubject: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },
  testChapter: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
    fontWeight: '500',
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testMetaText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  testArrowContainer: {
    marginLeft: 8,
    marginTop: 2,
  },
});

export default HomeScreen;