import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const GoalScreen = ({ navigation, route }) => {
  const { userDetails } = route.params;
  const [desiredWeight, setDesiredWeight] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateInputs = () => {
    if (!desiredWeight) {
      Alert.alert('Error', 'Please enter your desired weight');
      return false;
    }
    
    const desiredWeightNum = parseFloat(desiredWeight);
    
    if (desiredWeightNum < 30 || desiredWeightNum > 300) {
      Alert.alert('Error', 'Please enter a valid desired weight (30-300 kg)');
      return false;
    }
    
    if (desiredWeightNum >= userDetails.weight) {
      Alert.alert('Error', 'Desired weight should be less than current weight for weight loss');
      return false;
    }
    
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from today
    
    if (endDate <= minDate) {
      Alert.alert('Error', 'Plan end date should be at least 1 week from today');
      return false;
    }
    
    return true;
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateWeightLoss = () => {
    return (userDetails.weight - parseFloat(desiredWeight)).toFixed(1);
  };

  const handleNext = () => {
    if (validateInputs()) {
      const planData = {
        userDetails,
        desiredWeight: parseFloat(desiredWeight),
        endDate,
        weightLoss: calculateWeightLoss(),
        currentBMI: calculateBMI(userDetails.weight, userDetails.height),
        targetBMI: calculateBMI(parseFloat(desiredWeight), userDetails.height),
      };
      
      navigation.navigate('Login', { planData });
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Goals</Text>
          <Text style={styles.subtitle}>Define your target weight and timeline</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Current Stats</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Current Weight:</Text>
            <Text style={styles.summaryValue}>{userDetails.weight} kg</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Current BMI:</Text>
            <Text style={styles.summaryValue}>{calculateBMI(userDetails.weight, userDetails.height)}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Desired Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={desiredWeight}
              onChangeText={setDesiredWeight}
              placeholder="Enter your target weight"
              keyboardType="numeric"
              maxLength={6}
            />
            {desiredWeight && (
              <Text style={styles.helperText}>
                Target weight loss: {calculateWeightLoss()} kg
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plan End Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              />
            )}
          </View>
        </View>

        {desiredWeight && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Plan Preview</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Weight Loss Goal:</Text>
              <Text style={styles.previewValue}>{calculateWeightLoss()} kg</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Target BMI:</Text>
              <Text style={styles.previewValue}>
                {calculateBMI(parseFloat(desiredWeight), userDetails.height)}
              </Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Timeline:</Text>
              <Text style={styles.previewValue}>
                {Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))} days
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Create My Plan</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
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
  form: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  helperText: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 5,
    fontWeight: '500',
  },
  dateButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  previewCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  nextButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalScreen;
