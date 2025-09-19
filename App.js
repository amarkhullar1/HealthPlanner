import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import GoalScreen from './screens/GoalScreen';
import HomeScreen from './screens/HomeScreen';
import MonthlyCalendarScreen from './screens/MonthlyCalendarScreen';
import ProgressScreen from './screens/ProgressScreen';
import DayDetailScreen from './screens/DayDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main app with bottom tabs
function MainApp({ route }) {
  const { planData } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e1e8ed',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={{ planData }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={MonthlyCalendarScreen}
        initialParams={{ planData }}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        initialParams={{ planData }}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📊</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Authentication flow component
function AuthFlow() {
  const { currentUser } = useAuth();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {currentUser ? (
        // User is authenticated, show main app flow
        <>
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="GoalScreen" component={GoalScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="DayDetailScreen" component={DayDetailScreen} />
        </>
      ) : (
        // User is not authenticated, show auth screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AuthFlow />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
