import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const CalendarScreen = ({ navigation, route }) => {
  const { planData } = route.params;
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate daily calorie goal based on user data
  const calculateDailyCalories = (date) => {
    const startDate = new Date();
    const endDate = planData.endDate;
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((date - startDate) / (1000 * 60 * 60 * 24));
    
    // Calculate weight loss per day
    const weightLossPerDay = planData.weightLoss / totalDays;
    const currentWeight = planData.userDetails.weight - (weightLossPerDay * daysPassed);
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    const { age, gender, height } = planData.userDetails;
    let bmr;
    if (gender === 'Male') {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure) - assuming sedentary lifestyle
    const tdee = bmr * 1.2;
    
    // Create calorie deficit for weight loss (500 calorie deficit per day for 0.5kg/week)
    const calorieDeficit = 500;
    const dailyCalories = Math.max(tdee - calorieDeficit, 1200); // Minimum 1200 calories
    
    return Math.round(dailyCalories);
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const onSwipeGesture = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        navigateWeek(-1); // Swipe right - previous week
      } else if (translationX < -50) {
        navigateWeek(1); // Swipe left - next week
      }
    }
  };

  const handleDayPress = (date) => {
    setSelectedDate(date);
    navigation.navigate('DayDetailScreen', {
      date,
      calories: calculateDailyCalories(date),
      planData,
    });
  };

  const weekDates = getWeekDates(currentWeek);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateWeek(-1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>{formatMonthYear(currentWeek)}</Text>
        </View>
        
        <TouchableOpacity onPress={() => navigateWeek(1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <PanGestureHandler onHandlerStateChange={onSwipeGesture}>
        <View style={styles.calendarContainer}>
          <View style={styles.weekHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Text key={index} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.weekContainer}>
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isPast = date < new Date().setHours(0, 0, 0, 0);
              const calories = calculateDailyCalories(date);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    isToday && styles.todayButton,
                    isSelected && styles.selectedButton,
                    isPast && styles.pastButton,
                  ]}
                  onPress={() => handleDayPress(date)}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.todayText,
                      isSelected && styles.selectedText,
                      isPast && styles.pastText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  <Text style={styles.calorieText}>{calories} cal</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </PanGestureHandler>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Plan Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Target Weight Loss:</Text>
          <Text style={styles.summaryValue}>{planData.weightLoss} kg</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Plan Duration:</Text>
          <Text style={styles.summaryValue}>
            {Math.ceil((planData.endDate - new Date()) / (1000 * 60 * 60 * 24))} days
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Today's Target:</Text>
          <Text style={styles.summaryValue}>
            {calculateDailyCalories(new Date())} calories
          </Text>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe left/right to navigate weeks • Tap a day to view details
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  weekContainer: {
    flexDirection: 'row',
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e1e8ed',
  },
  todayButton: {
    backgroundColor: '#e3f2fd',
  },
  selectedButton: {
    backgroundColor: '#3498db',
  },
  pastButton: {
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  todayText: {
    color: '#3498db',
  },
  selectedText: {
    color: 'white',
  },
  pastText: {
    color: '#bdc3c7',
  },
  calorieText: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default CalendarScreen;
