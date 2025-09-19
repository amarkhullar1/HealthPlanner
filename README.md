# Health Planner - Diet & Workout Planner App

A React Native app built with Expo SDK 54.0.0 for diet and workout planning.

## Features

- **User Onboarding**: Collect user details (age, gender, height, weight)
- **Goal Setting**: Set desired weight and plan end date
- **Home Dashboard**: Daily goals tracking with current week overview
- **Monthly Calendar**: Full month view with goal achievement visualization
- **Progress Tracking**: Weight over time and goal achievement analytics
- **Daily Planning**: View daily calorie goals and meal tracking

## Screens

1. **User Details Screen**: Input age, gender, height, and current weight
2. **Goal Screen**: Set target weight and plan timeline
3. **Home Screen**: Daily goals dashboard with current week overview
4. **Monthly Calendar Screen**: Full month view with color-coded goal achievement
5. **Progress Screen**: Weight tracking and goal achievement analytics
6. **Day Detail Screen**: Daily calorie goals, meal tracking, and recommendations

## Navigation

The app uses a bottom tab navigation with three main sections:
- **Home**: Daily goals and current week overview
- **Calendar**: Monthly calendar view with goal achievement
- **Progress**: Weight tracking and analytics

## Technical Details

- **Framework**: React Native with Expo SDK 54.0.0
- **Navigation**: React Navigation v6
- **Calendar**: Custom week view with gesture handling
- **Date Picker**: React Native Community DateTimePicker
- **Styling**: Modern UI with shadows, rounded corners, and responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or run `npm run ios` / `npm run android` for simulators

## App Flow

1. User enters personal details (age, gender, height, weight)
2. User sets weight loss goals and timeline
3. App calculates daily calorie targets based on BMR and weight loss goals
4. User navigates through weekly calendar view
5. User can tap on any day to see detailed calorie goals and meal planning

## Key Features

- **Smart Calorie Calculation**: Uses Mifflin-St Jeor equation for BMR calculation
- **Progressive Weight Loss**: Adjusts daily calories based on current progress
- **Meal Tracking**: Add/remove foods with calorie tracking
- **Workout Recommendations**: Suggests exercises based on weight loss goals
- **Visual Progress**: Progress bars and color-coded indicators

## Dependencies

- @react-navigation/native
- @react-navigation/stack
- @react-native-community/datetimepicker
- react-native-gesture-handler
- react-native-calendars
- react-native-safe-area-context
- react-native-screens
