import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import UserDetailsScreen from './screens/UserDetailsScreen';
import GoalScreen from './screens/GoalScreen';
import CalendarScreen from './screens/CalendarScreen';
import DayDetailScreen from './screens/DayDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="UserDetails"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="GoalScreen" component={GoalScreen} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
          <Stack.Screen name="DayDetailScreen" component={DayDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
