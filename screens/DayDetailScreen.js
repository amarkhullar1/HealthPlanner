import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const DayDetailScreen = ({ navigation, route }) => {
  const { date, calories, planData } = route.params;
  const [meals, setMeals] = useState({
    breakfast: { calories: 0, foods: [] },
    lunch: { calories: 0, foods: [] },
    dinner: { calories: 0, foods: [] },
    snacks: { calories: 0, foods: [] },
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRemainingCalories = () => {
    const totalConsumed = Object.values(meals).reduce((sum, meal) => sum + meal.calories, 0);
    return Math.max(0, calories - totalConsumed);
  };

  const getProgressPercentage = () => {
    const totalConsumed = Object.values(meals).reduce((sum, meal) => sum + meal.calories, 0);
    return Math.min(100, (totalConsumed / calories) * 100);
  };

  const addFoodToMeal = (mealType) => {
    Alert.prompt(
      'Add Food',
      'Enter food item and calories (e.g., "Apple, 80")',
      (text) => {
        if (text) {
          const [foodName, calorieStr] = text.split(',').map(s => s.trim());
          const foodCalories = parseInt(calorieStr) || 0;
          
          if (foodName && foodCalories > 0) {
            setMeals(prev => ({
              ...prev,
              [mealType]: {
                calories: prev[mealType].calories + foodCalories,
                foods: [...prev[mealType].foods, { name: foodName, calories: foodCalories }],
              },
            }));
          }
        }
      }
    );
  };

  const removeFoodFromMeal = (mealType, foodIndex) => {
    setMeals(prev => {
      const meal = prev[mealType];
      const foodToRemove = meal.foods[foodIndex];
      return {
        ...prev,
        [mealType]: {
          calories: meal.calories - foodToRemove.calories,
          foods: meal.foods.filter((_, index) => index !== foodIndex),
        },
      };
    });
  };

  const getMealRecommendations = () => {
    const remaining = getRemainingCalories();
    const recommendations = [];
    
    if (remaining > 0) {
      if (remaining >= 500) {
        recommendations.push('Add a substantial meal (400-500 calories)');
      }
      if (remaining >= 200) {
        recommendations.push('Include a healthy snack (150-200 calories)');
      }
      if (remaining >= 100) {
        recommendations.push('Add fruits or vegetables (50-100 calories)');
      }
    } else if (remaining < 0) {
      recommendations.push('Consider reducing portion sizes');
      recommendations.push('Add more physical activity');
    }
    
    return recommendations;
  };

  const getWorkoutRecommendations = () => {
    const weightLoss = planData.weightLoss;
    const totalDays = Math.ceil((planData.endDate - new Date()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysPassed < 0) return ['Plan your workout routine'];
    
    const targetWeightLoss = (weightLoss / totalDays) * daysPassed;
    const currentWeight = planData.userDetails.weight - targetWeightLoss;
    
    const recommendations = [
      '30 minutes of cardio (burns 200-300 calories)',
      'Strength training 3x per week',
      'Daily walking (10,000 steps)',
    ];
    
    if (currentWeight > planData.userDetails.weight * 0.9) {
      recommendations.unshift('Focus on cardio for initial weight loss');
    }
    
    return recommendations;
  };

  const progressPercentage = getProgressPercentage();
  const remainingCalories = getRemainingCalories();
  const isOverTarget = remainingCalories < 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>

        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Daily Calorie Goal</Text>
          <Text style={styles.calorieNumber}>{calories}</Text>
          <Text style={styles.calorieSubtext}>calories</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` },
                  isOverTarget && styles.progressOver
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressPercentage.toFixed(1)}% complete
            </Text>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Consumed</Text>
              <Text style={styles.statValue}>
                {Object.values(meals).reduce((sum, meal) => sum + meal.calories, 0)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statValue, isOverTarget && styles.overTarget]}>
                {Math.abs(remainingCalories)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Meals & Snacks</Text>
          
          {Object.entries(meals).map(([mealType, meal]) => (
            <View key={mealType} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addFoodToMeal(mealType)}
                >
                  <Text style={styles.addButtonText}>+ Add Food</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.mealCalories}>{meal.calories} calories</Text>
              
              {meal.foods.map((food, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <View style={styles.foodCalories}>
                    <Text style={styles.foodCalorieText}>{food.calories} cal</Text>
                    <TouchableOpacity
                      onPress={() => removeFoodFromMeal(mealType, index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Nutrition Tips</Text>
            {getMealRecommendations().map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
          </View>

          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Workout Suggestions</Text>
            {getWorkoutRecommendations().map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  calorieCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
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
  calorieTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3498db',
  },
  calorieSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  progressOver: {
    backgroundColor: '#e74c3c',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  overTarget: {
    color: '#e74c3c',
  },
  mealsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  foodName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  foodCalories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodCalorieText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationsSection: {
    marginBottom: 20,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default DayDetailScreen;
