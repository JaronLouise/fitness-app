// Step3Goals.jsx - Primary fitness goals selection
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step3Goals = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [selectedGoals, setSelectedGoals] = useState(stepData.goals || []);

  useEffect(() => {
    // Load existing data if available
    if (stepData.goals) {
      setSelectedGoals(stepData.goals);
    }
  }, [stepData]);

  const goals = [
    { id: 'lose_weight', label: 'Lose Weight', icon: '⚖️' },
    { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
    { id: 'improve_health', label: 'Improve Health', icon: '❤️' },
    { id: 'get_in_shape', label: 'Get in Shape', icon: '🏃‍♂️' }
  ];

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      // Show error that at least one goal must be selected
      return;
    }
    onContinue(currentStep, { goals: selectedGoals });
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your primary goal?</Text>
        <Text style={styles.subtitle}>
          You can select multiple goals. We'll create a plan that addresses all of them.
        </Text>
      </View>

      {/* Goals Selection */}
      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalButton,
              selectedGoals.includes(goal.id) && styles.goalButtonSelected
            ]}
            onPress={() => handleGoalToggle(goal.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.goalIcon}>{goal.icon}</Text>
            <Text style={[
              styles.goalLabel,
              selectedGoals.includes(goal.id) && styles.goalLabelSelected
            ]}>
              {goal.label}
            </Text>
            {selectedGoals.includes(goal.id) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selection Summary */}
      {selectedGoals.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Selected: {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            (selectedGoals.length === 0 || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedGoals.length === 0 || isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  goalsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  goalButton: {
    height: 80,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  goalLabelSelected: {
    color: '#007AFF',
  },
  checkmark: {
    position: 'absolute',
    right: 20,
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    height: 56,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.48,
  },
  backButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Step3Goals;




