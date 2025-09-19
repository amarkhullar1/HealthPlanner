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

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation, route }) => {
  const { planData } = route.params || {};
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'all'
  const [weightData, setWeightData] = useState([]);
  const [goalData, setGoalData] = useState([]);

  // Generate mock data for demonstration
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 days ago
    
    const weights = [];
    const goals = [];
    let currentWeight = planData?.userDetails?.weight || 70;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Simulate weight loss with some fluctuation
      const weightLoss = (i / 30) * 2; // 2kg loss over 30 days
      const fluctuation = (Math.random() - 0.5) * 0.5; // ±0.25kg daily fluctuation
      const weight = currentWeight - weightLoss + fluctuation;
      
      weights.push({
        date,
        weight: Math.round(weight * 10) / 10,
      });
      
      // Simulate goal achievement
      const stepsGoal = Math.random() > 0.3;
      const caloriesGoal = Math.random() > 0.4;
      const workoutGoal = Math.random() > 0.5;
      const weightGoal = Math.random() > 0.2;
      
      const completedGoals = [stepsGoal, caloriesGoal, workoutGoal, weightGoal].filter(Boolean).length;
      const totalGoals = 4;
      
      goals.push({
        date,
        completedGoals,
        totalGoals,
        completionRate: completedGoals / totalGoals,
        goals: {
          steps: stepsGoal,
          calories: caloriesGoal,
          workout: workoutGoal,
          weight: weightGoal,
        },
      });
    }
    
    setWeightData(weights);
    setGoalData(goals);
  };

  const getFilteredData = () => {
    const now = new Date();
    let startDate;
    
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        return { weights: weightData, goals: goalData };
    }
    
    return {
      weights: weightData.filter(item => item.date >= startDate),
      goals: goalData.filter(item => item.date >= startDate),
    };
  };

  const getWeightChange = () => {
    const { weights } = getFilteredData();
    if (weights.length < 2) return 0;
    
    const firstWeight = weights[0].weight;
    const lastWeight = weights[weights.length - 1].weight;
    return Math.round((lastWeight - firstWeight) * 10) / 10;
  };

  const getAverageCompletion = () => {
    const { goals } = getFilteredData();
    if (goals.length === 0) return 0;
    
    const totalCompletion = goals.reduce((sum, goal) => sum + goal.completionRate, 0);
    return Math.round((totalCompletion / goals.length) * 100);
  };

  const getBestStreak = () => {
    const { goals } = getFilteredData();
    let maxStreak = 0;
    let currentStreak = 0;
    
    goals.forEach(goal => {
      if (goal.completionRate >= 0.8) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (completionRate) => {
    if (completionRate >= 0.8) return '#27ae60';
    if (completionRate >= 0.6) return '#f39c12';
    if (completionRate >= 0.4) return '#e67e22';
    return '#e74c3c';
  };

  const { weights, goals } = getFilteredData();
  const weightChange = getWeightChange();
  const averageCompletion = getAverageCompletion();
  const bestStreak = getBestStreak();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress Tracking</Text>
          <Text style={styles.headerSubtitle}>Monitor your journey</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'all'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weight Progress</Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInfo}>
              <Text style={styles.weightLabel}>Current Weight</Text>
              <Text style={styles.weightValue}>
                {weights.length > 0 ? weights[weights.length - 1].weight : 'N/A'} kg
              </Text>
            </View>
            <View style={styles.weightInfo}>
              <Text style={styles.weightLabel}>Change</Text>
              <Text style={[
                styles.weightChange,
                weightChange < 0 ? styles.weightLoss : styles.weightGain
              ]}>
                {weightChange > 0 ? '+' : ''}{weightChange} kg
              </Text>
            </View>
          </View>
          
          {/* Weight Chart Placeholder */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weight Over Time</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>
                📈 Weight tracking chart would go here
              </Text>
              <Text style={styles.chartSubtext}>
                {weights.length} data points
              </Text>
            </View>
          </View>
        </View>

        {/* Goal Achievement */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Goal Achievement</Text>
          <View style={styles.goalStats}>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatValue}>{averageCompletion}%</Text>
              <Text style={styles.goalStatLabel}>Average Completion</Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatValue}>{bestStreak}</Text>
              <Text style={styles.goalStatLabel}>Best Streak (days)</Text>
            </View>
          </View>
          
          {/* Goal Achievement Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Daily Goal Completion</Text>
            <View style={styles.goalChart}>
              {goals.slice(-14).map((goal, index) => (
                <View key={index} style={styles.goalBar}>
                  <View
                    style={[
                      styles.goalBarFill,
                      { 
                        height: `${goal.completionRate * 100}%`,
                        backgroundColor: getStatusColor(goal.completionRate),
                      }
                    ]}
                  />
                  <Text style={styles.goalBarLabel}>
                    {formatDate(goal.date)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Performance</Text>
          {goals.slice(-7).map((goal, index) => (
            <View key={index} style={styles.performanceItem}>
              <View style={styles.performanceDate}>
                <Text style={styles.performanceDateText}>
                  {formatDate(goal.date)}
                </Text>
              </View>
              <View style={styles.performanceGoals}>
                <View style={styles.goalRow}>
                  <Text style={styles.goalName}>Steps</Text>
                  <Text style={[styles.goalStatus, goal.goals.steps ? styles.goalComplete : styles.goalIncomplete]}>
                    {goal.goals.steps ? '✓' : '○'}
                  </Text>
                </View>
                <View style={styles.goalRow}>
                  <Text style={styles.goalName}>Calories</Text>
                  <Text style={[styles.goalStatus, goal.goals.calories ? styles.goalComplete : styles.goalIncomplete]}>
                    {goal.goals.calories ? '✓' : '○'}
                  </Text>
                </View>
                <View style={styles.goalRow}>
                  <Text style={styles.goalName}>Workout</Text>
                  <Text style={[styles.goalStatus, goal.goals.workout ? styles.goalComplete : styles.goalIncomplete]}>
                    {goal.goals.workout ? '✓' : '○'}
                  </Text>
                </View>
                <View style={styles.goalRow}>
                  <Text style={styles.goalName}>Weight</Text>
                  <Text style={[styles.goalStatus, goal.goals.weight ? styles.goalComplete : styles.goalIncomplete]}>
                    {goal.goals.weight ? '✓' : '○'}
                  </Text>
                </View>
              </View>
              <View style={styles.performanceCompletion}>
                <Text style={styles.completionText}>
                  {Math.round(goal.completionRate * 100)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>💪</Text>
            <Text style={styles.insightText}>
              You've been consistent with your workouts this week!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>📊</Text>
            <Text style={styles.insightText}>
              Your weight loss is on track with your goals.
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>🎯</Text>
            <Text style={styles.insightText}>
              Try to improve your calorie tracking consistency.
            </Text>
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
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
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
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#3498db',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  weightInfo: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weightChange: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weightLoss: {
    color: '#27ae60',
  },
  weightGain: {
    color: '#e74c3c',
  },
  chartContainer: {
    marginTop: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  chartPlaceholder: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  goalStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  goalChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  goalBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  goalBarFill: {
    width: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
    marginBottom: 5,
  },
  goalBarLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  performanceDate: {
    width: 60,
  },
  performanceDateText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  performanceGoals: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalRow: {
    alignItems: 'center',
  },
  goalName: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  goalStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalComplete: {
    color: '#27ae60',
  },
  goalIncomplete: {
    color: '#e74c3c',
  },
  performanceCompletion: {
    width: 40,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
});

export default ProgressScreen;
