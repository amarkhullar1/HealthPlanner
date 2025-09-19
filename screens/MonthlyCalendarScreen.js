import React, { useState } from 'react';
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

const MonthlyCalendarScreen = ({ navigation, route }) => {
  const { planData } = route.params || {};
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getDayStatus = (date) => {
    if (!date) return null;
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today.setHours(0, 0, 0, 0);
    const isFuture = date > today;
    
    // Mock data for demonstration - in real app, this would come from stored data
    const mockGoals = {
      steps: Math.random() > 0.3,
      calories: Math.random() > 0.4,
      workout: Math.random() > 0.5,
      weight: Math.random() > 0.2,
    };
    
    const completedGoals = Object.values(mockGoals).filter(Boolean).length;
    const totalGoals = Object.keys(mockGoals).length;
    const completionRate = completedGoals / totalGoals;
    
    return {
      isToday,
      isPast,
      isFuture,
      completionRate,
      completedGoals,
      totalGoals,
    };
  };

  const getStatusColor = (completionRate) => {
    if (completionRate >= 0.8) return '#27ae60'; // Green - excellent
    if (completionRate >= 0.6) return '#f39c12'; // Orange - good
    if (completionRate >= 0.4) return '#e67e22'; // Dark orange - fair
    return '#e74c3c'; // Red - poor
  };

  const handleDayPress = (date) => {
    if (date) {
      const status = getDayStatus(date);
      if (status.isPast || status.isToday) {
        navigation.navigate('DayDetailScreen', {
          date,
          calories: 1800, // Mock data
          planData,
        });
      }
    }
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>{formatMonthYear(currentMonth)}</Text>
        </View>
        
        <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        {/* Week day headers */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            if (!day) {
              return <View key={index} style={styles.emptyDay} />;
            }
            
            const status = getDayStatus(day);
            const isToday = status.isToday;
            const isPast = status.isPast;
            const isFuture = status.isFuture;
            const completionRate = status.completionRate;
            const statusColor = getStatusColor(completionRate);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  isPast && styles.pastCell,
                  isFuture && styles.futureCell,
                ]}
                onPress={() => handleDayPress(day)}
                disabled={isFuture}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday && styles.todayText,
                    isPast && styles.pastText,
                    isFuture && styles.futureText,
                  ]}
                >
                  {day.getDate()}
                </Text>
                {isPast && (
                  <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                )}
                {isPast && (
                  <Text style={styles.completionText}>
                  {Math.round(completionRate * 100)}%
                </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Goal Achievement</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>Excellent (80%+)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
            <Text style={styles.legendText}>Good (60-79%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e67e22' }]} />
            <Text style={styles.legendText}>Fair (40-59%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Poor (&lt;40%)</Text>
          </View>
        </View>
      </View>

      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Monthly Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Days Completed:</Text>
          <Text style={styles.summaryValue}>
            {days.filter(day => day && day < new Date()).length} / {new Date().getDate()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Average Completion:</Text>
          <Text style={styles.summaryValue}>75%</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Best Streak:</Text>
          <Text style={styles.summaryValue}>5 days</Text>
        </View>
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
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: width / 7,
    height: width / 7,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e1e8ed',
  },
  dayCell: {
    width: width / 7,
    height: width / 7,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e1e8ed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#e3f2fd',
  },
  pastCell: {
    backgroundColor: '#f8f9fa',
  },
  futureCell: {
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  todayText: {
    color: '#3498db',
  },
  pastText: {
    color: '#2c3e50',
  },
  futureText: {
    color: '#bdc3c7',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  completionText: {
    fontSize: 8,
    color: '#7f8c8d',
    marginTop: 2,
  },
  legendCard: {
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
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
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
});

export default MonthlyCalendarScreen;
