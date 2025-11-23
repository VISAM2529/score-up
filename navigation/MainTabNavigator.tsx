import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Platform, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SyllabusScreen from '../screens/SyllabusScreen';
import ResultsListScreen from '../screens/ResultsListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TestListScreen from '../screens/TestListScreen';
import TestScreen from '../screens/TestScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SubscriptionScreen from 'screens/SubscriptionScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Navigation constants for consistency
const ROUTES = {
  HOME: 'Home',
  TESTS: 'Tests',
  RESULTS: 'My Results',
  PROFILE: 'Profile',
  SUBSCRIPTION : "Subscription",
};

const TAB_CONFIG = {
  [ROUTES.HOME]: {
    iconActive: 'home',
    iconInactive: 'home-outline',
    label: 'Home',
  },
  [ROUTES.TESTS]: {
    iconActive: 'book',
    iconInactive: 'book-outline',
    label: 'Tests',
  },
  [ROUTES.RESULTS]: {
    iconActive: 'bar-chart',
    iconInactive: 'bar-chart-outline',
    label: 'Results',
  },
  [ROUTES.PROFILE]: {
    iconActive: 'person',
    iconInactive: 'person-outline',
    label: 'Profile',
  },
   [ROUTES.SUBSCRIPTION]: {
    iconActive: 'person',
    iconInactive: 'person-outline',
    label: 'Profile',
  },
};

// Theme colors matching the app design
const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  textPrimary: '#111827',
  textSecondary: '#9CA3AF',
  background: '#FFFFFF',
  border: '#F3F4F6',
  shadow: '#000000',
};

function TestsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Syllabus" component={SyllabusScreen} />
      <Stack.Screen name="TestList" component={TestListScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
    </Stack.Navigator>
  );
}

function ResultsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResultsList" component={ResultsListScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const getTabBarIcon = (routeName, focused, color, size) => {
    const config = TAB_CONFIG[routeName];
    if (!config) return null;

    const iconName = focused ? config.iconActive : config.iconInactive;
    
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <Ionicons name={iconName} size={24} color={color} />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => 
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ 
          tabBarLabel: TAB_CONFIG[ROUTES.HOME].label,
        }}
      />
      <Tab.Screen 
        name={ROUTES.TESTS}
        component={TestsStack}
        options={{ 
          tabBarLabel: TAB_CONFIG[ROUTES.TESTS].label,
        }}
      />
      <Tab.Screen 
        name={ROUTES.RESULTS}
        component={ResultsStack}
        options={{ 
          tabBarLabel: TAB_CONFIG[ROUTES.RESULTS].label,
        }}
      />
      <Tab.Screen 
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ 
          tabBarLabel: TAB_CONFIG[ROUTES.PROFILE].label,
        }}
      />
       <Tab.Screen 
        name={ROUTES.SUBSCRIPTION}
        component={SubscriptionScreen}
        options={{ 
          tabBarLabel: TAB_CONFIG[ROUTES.SUBSCRIPTION].label,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 68,
    marginBottom: 24,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primaryLight,
  },
});