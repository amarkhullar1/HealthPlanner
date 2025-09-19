import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const { planData } = route.params || {};
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyWeight, setDailyWeight] = useState('');
  const [goals, setGoals] = useState({
    steps: 10000,
    calories: 1800,
    workout: false,
    weight: null,
  });

  // Calculate daily calorie goal based on user data
  const calculateDailyCalories = (date) => {
    if (!planData) return 1800;
    
    const startDate = new Date();
    const endDate = planData.endDate;
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((date - startDate) / (1000 * 60 * 60 * 24));
    
    const weightLossPerDay = planData.weightLoss / totalDays;
    const currentWeight = planData.userDetails.weight - (weightLossPerDay * daysPassed);
    
    const { age, gender, height } = planData.userDetails;
    let bmr;
    if (gender === 'Male') {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }
    
    const tdee = bmr * 1.2;
    const calorieDeficit = 500;
    const dailyCalories = Math.max(tdee - calorieDeficit, 1200);
    
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

  const handleWeightSubmit = () => {
    if (dailyWeight && !isNaN(parseFloat(dailyWeight))) {
      setGoals(prev => ({
        ...prev,
        weight: parseFloat(dailyWeight),
      }));
      setDailyWeight('');
      Alert.alert('Success', 'Weight recorded for today!');
    } else {
      Alert.alert('Error', 'Please enter a valid weight');
    }
  };

  const toggleWorkout = () => {
    setGoals(prev => ({
      ...prev,
      workout: !prev.workout,
    }));
  };

  const getGoalStatus = (goalType, value) => {
    switch (goalType) {
      case 'steps':
        return value >= goals.steps;
      case 'calories':
        return value <= goals.calories;
      case 'workout':
        return value;
      case 'weight':
        return value !== null;
      default:
        return false;
    }
  };

  const weekDates = getWeekDates(currentDate);
  const todayCalories = calculateDailyCalories(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today's Goals</Text>
          <Text style={styles.headerDate}>{formatMonthYear(currentDate)}</Text>
        </View>

        {/* Current Week */}
        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>This Week</Text>
          <View style={styles.weekContainer}>
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const calories = calculateDailyCalories(date);
              
              return (
                <View
                  key={index}
                  style={[
                    styles.dayCard,
                    isToday && styles.todayCard,
                  ]}
                >
                  <Text style={[styles.dayName, isToday && styles.todayText]}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                    {date.getDate()}
                  </Text>
                  <Text style={styles.dayCalories}>{calories} cal</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Goals */}
        <View style={styles.goalsCard}>
          <Text style={styles.goalsTitle}>Today's Progress</Text>
          
          {/* Steps Goal */}
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Steps</Text>
              <Text style={styles.goalTarget}>Target: {goals.steps.toLocaleString()}</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(100, (goals.steps / goals.steps) * 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {goals.steps.toLocaleString()} / {goals.steps.toLocaleString()}
              </Text>
            </View>
            <View style={styles.goalStatus}>
              <Text style={[
                styles.statusText,
                getGoalStatus('steps', goals.steps) ? styles.statusComplete : styles.statusIncomplete
              ]}>
                {getGoalStatus('steps', goals.steps) ? '✓ Complete' : '○ Incomplete'}
              </Text>
            </View>
          </View>

          {/* Calories Goal */}
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Calories</Text>
              <Text style={styles.goalTarget}>Target: {todayCalories}</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(100, (goals.calories / todayCalories) * 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {goals.calories} / {todayCalories}
              </Text>
            </View>
            <View style={styles.goalStatus}>
              <Text style={[
                styles.statusText,
                getGoalStatus('calories', goals.calories) ? styles.statusComplete : styles.statusIncomplete
              ]}>
                {getGoalStatus('calories', goals.calories) ? '✓ Complete' : '○ Incomplete'}
              </Text>
            </View>
          </View>

          {/* Workout Goal */}
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Workout</Text>
              <Text style={styles.goalTarget}>Target: Complete</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.workoutButton,
                goals.workout && styles.workoutButtonComplete
              ]}
              onPress={toggleWorkout}
            >
              <Text style={[
                styles.workoutButtonText,
                goals.workout && styles.workoutButtonTextComplete
              ]}>
                {goals.workout ? '✓ Complete' : '○ Not Complete'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Daily Weight */}
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Daily Weight</Text>
              <Text style={styles.goalTarget}>Record your weight</Text>
            </View>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.weightInput}
                value={dailyWeight}
                onChangeText={setDailyWeight}
                placeholder="Enter weight (kg)"
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.weightSubmitButton}
                onPress={handleWeightSubmit}
              >
                <Text style={styles.weightSubmitText}>Record</Text>
              </TouchableOpacity>
            </View>
            {goals.weight && (
              <View style={styles.goalStatus}>
                <Text style={styles.statusText}>
                  ✓ Recorded: {goals.weight} kg
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.workout ? 'Yes' : 'No'}</Text>
              <Text style={styles.statLabel}>Workout</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerDate: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  weekCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minWidth: 40,
  },
  todayCard: {
    backgroundColor: '#e3f2fd',
  },
  dayName: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  todayText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  dayCalories: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  goalTarget: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  goalProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  goalStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusComplete: {
    color: '#27ae60',
  },
  statusIncomplete: {
    color: '#e74c3c',
  },
  workoutButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  workoutButtonComplete: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
  },
  workoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  workoutButtonTextComplete: {
    color: '#27ae60',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  weightSubmitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 20,
  },
  weightSubmitText: {
    color: 'white',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default HomeScreen;
