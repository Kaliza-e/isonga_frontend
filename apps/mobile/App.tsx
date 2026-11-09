import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useMobileAuth } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { colors } from './src/theme/colors';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AuthSelectScreen } from './src/screens/AuthSelectScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ResidentRegisterScreen } from './src/screens/ResidentRegisterScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AnnouncementsScreen } from './src/screens/AnnouncementsScreen';
import { AnnouncementDetailScreen } from './src/screens/AnnouncementDetailScreen';
import { LocationSelectorScreen } from './src/screens/LocationSelectorScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ChiefPortalScreen } from './src/screens/ChiefPortalScreen';

import { House, Megaphone, Bell, User } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AnnouncementsTab"
        component={AnnouncementsScreen}
        options={{
          tabBarLabel: 'Announcements',
          tabBarIcon: ({ color, size }) => <Megaphone size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, isAuthenticated, hasSeenOnboarding } = useMobileAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string>('Onboarding');

  const handleSplashFinish = (target?: string) => {
    if (target) {
      setInitialRoute(target);
    } else if (isAuthenticated && user) {
      const adminRoles = ['CELL_ADMIN', 'SECTOR_ADMIN', 'DISTRICT_ADMIN', 'SUPER_ADMIN'];
      setInitialRoute(adminRoles.includes(user.role) ? 'ChiefPortal' : 'MainTabs');
    } else {
      setInitialRoute(hasSeenOnboarding ? 'AuthSelect' : 'Onboarding');
    }
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* Onboarding & Authentication Flow */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AuthSelect" component={AuthSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResidentRegister" component={ResidentRegisterScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Main Resident Experience */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="LocationSelector"
        component={LocationSelectorScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Chief & Local Administrator Experience */}
      <Stack.Screen
        name="ChiefPortal"
        component={ChiefPortalScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AuthProvider>
        <LocationProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
