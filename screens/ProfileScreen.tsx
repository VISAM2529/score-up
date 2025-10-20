// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = {
    name: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    joinDate: 'January 2025',
    subscription: 'Premium',
    subscriptionDate: '15 Jan 2025',
    expiryDate: 'Lifetime',
    points: 2450,
    initials: 'RS',
  };

  const stats = [
    { label: 'Tests Taken', value: '24', icon: 'document-text-outline', color: '#4F46E5' },
    { label: 'Hours Studied', value: '42', icon: 'time-outline', color: '#10B981' },
    { label: 'Accuracy', value: '78%', icon: 'checkmark-circle-outline', color: '#F59E0B' },
    { label: 'Streak', value: '7 days', icon: 'flame-outline', color: '#EF4444' },
  ];

  const achievements = [
    { title: 'First Test', subtitle: 'Completed your first test', icon: 'rocket-outline', unlocked: true, color: '#4F46E5' },
    { title: 'Perfect Score', subtitle: 'Scored 100% in a test', icon: 'trophy-outline', unlocked: true, color: '#10B981' },
    { title: 'Week Warrior', subtitle: '7-day practice streak', icon: 'flame-outline', unlocked: true, color: '#F59E0B' },
    { title: 'Century Club', subtitle: 'Take 100 tests', icon: 'medal-outline', unlocked: false, color: '#8B5CF6' },
    { title: 'Speed Master', subtitle: 'Complete test in half time', icon: 'flash-outline', unlocked: false, color: '#3B82F6' },
    { title: 'Knowledge King', subtitle: 'Score 90%+ in 10 tests', icon: 'school-outline', unlocked: false, color: '#EC4899' },
  ];

  const menuItems = [
    { 
      title: 'Edit Profile', 
      subtitle: 'Update your personal information',
      icon: 'person-outline', 
      color: '#4F46E5',
      action: () => Alert.alert('Edit Profile', 'This feature will be available soon!')
    },
    { 
      title: 'Subscription Details', 
      subtitle: 'Manage your subscription',
      icon: 'card-outline', 
      color: '#10B981',
      action: () => Alert.alert('Subscription', 'You have lifetime access!')
    },
    { 
      title: 'My Achievements', 
      subtitle: 'View all badges & awards',
      icon: 'trophy-outline', 
      color: '#F59E0B',
      action: () => Alert.alert('Achievements', 'Keep practicing to unlock more!')
    },
    { 
      title: 'Download Certificate', 
      subtitle: 'Get your progress certificate',
      icon: 'document-outline', 
      color: '#EC4899',
      action: () => Alert.alert('Certificate', 'Download feature coming soon!')
    },
    { 
      title: 'Redeem Points', 
      subtitle: 'Use your points for rewards',
      icon: 'gift-outline', 
      color: '#8B5CF6',
      action: () => Alert.alert('Redeem Points', 'Rewards store opening soon!')
    },
    { 
      title: 'Settings', 
      subtitle: 'App preferences & notifications',
      icon: 'settings-outline', 
      color: '#6B7280',
      action: () => Alert.alert('Settings', 'Settings panel coming soon!')
    },
    { 
      title: 'Help & Support', 
      subtitle: 'Get help or contact us',
      icon: 'help-circle-outline', 
      color: '#3B82F6',
      action: () => Alert.alert('Support', 'Email: support@mcqprep.com')
    },
    { 
      title: 'Share App', 
      subtitle: 'Invite friends to join',
      icon: 'share-social-outline', 
      color: '#10B981',
      action: () => Alert.alert('Share', 'Share feature coming soon!')
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    Alert.alert('Logged Out', 'You have been successfully logged out!');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Profile Card */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.initials}</Text>
              </View>
            </View>
            
            {/* User Info */}
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text style={styles.phoneText}>{user.mobile}</Text>
            </View>

            {/* Member Since */}
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Member since {user.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Points Card */}
        <View style={styles.section}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsContent}>
              <View style={styles.pointsLeft}>
                <View style={styles.pointsIcon}>
                  <Ionicons name="star" size={32} color="#F59E0B" />
                </View>
                <View style={styles.pointsInfo}>
                  <Text style={styles.pointsLabel}>Total Points</Text>
                  <Text style={styles.pointsValue}>{user.points}</Text>
                  <Text style={styles.pointsSubtext}>Keep practicing to earn more!</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscription Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View style={styles.subscriptionLeft}>
                <View style={styles.subscriptionIcon}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.subscriptionTitle}>{user.subscription} Plan</Text>
                  <Text style={styles.subscriptionStatus}>Active</Text>
                </View>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>₹99</Text>
              </View>
            </View>

            <View style={styles.subscriptionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Activated on:</Text>
                <Text style={styles.detailValue}>{user.subscriptionDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Valid until:</Text>
                <Text style={styles.detailValueGreen}>{user.expiryDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.achievementsCount}>3/6 Unlocked</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View 
                key={index}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  achievement.unlocked 
                    ? { backgroundColor: `${achievement.color}15` }
                    : styles.achievementIconLocked
                ]}>
                  <Ionicons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.unlocked ? achievement.color : '#D1D5DB'} 
                  />
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementSubtitle,
                  !achievement.unlocked && styles.achievementSubtitleLocked
                ]}>
                  {achievement.subtitle}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MCQ Prep App v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for students</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="log-out-outline" size={32} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Logout?</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to logout? You'll need to login again to access your account.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalLogoutButtonText}>Logout</Text>
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
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4F46E5',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  phoneText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  memberBadge: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberText: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  pointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 20,
    marginTop: -100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pointsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pointsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  pointsSubtext: {
    fontSize: 11,
    color: '#92400E',
  },
  redeemButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  redeemButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  priceBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  subscriptionDetails: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detailValueGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  achievementCardLocked: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  achievementSubtitleLocked: {
    color: '#9CA3AF',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FECACA',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
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
    marginBottom: 24,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
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
  modalLogoutButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalLogoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProfileScreen;