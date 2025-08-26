// Step3Goals.jsx - Clean goals selection with proper symbols and layout
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { 
  MaterialIcons, 
  Ionicons, 
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons';

const Step3Goals = ({ onUpdateData, onBack, onNext, isLoading, currentStep, stepData, canProceed }) => {
  const [selectedGoals, setSelectedGoals] = useState(stepData.goals || []);

  useEffect(() => {
    // Load existing data if available
    if (stepData.goals) {
      setSelectedGoals(stepData.goals);
    }
  }, [stepData]);

  const goals = [
    { id: 'lose_weight', label: 'Lose Weight', icon: 'balance', iconFamily: 'MaterialIcons', description: 'Burn fat and reach your target weight' },
    { id: 'gain_muscle', label: 'Build Muscle', icon: 'fitness-center', iconFamily: 'MaterialIcons', description: 'Increase strength and muscle mass' },
    { id: 'improve_health', label: 'Improve Health', icon: 'heart', iconFamily: 'Ionicons', description: 'Boost overall wellness and energy' },
    { id: 'get_in_shape', label: 'Get in Shape', icon: 'run', iconFamily: 'MaterialCommunityIcons', description: 'Enhance fitness and endurance' }
  ];

  // Helper function to render the appropriate icon
  const renderIcon = (iconName, iconFamily, size, color, style) => {
    const iconProps = { name: iconName, size, color, style };
    
    switch (iconFamily) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };

  const handleGoalToggle = (goalId) => {
    const newGoals = selectedGoals.includes(goalId) 
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newGoals);
    
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { goals: newGoals });
  };

  const handleConfirm = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subtitle}>
          Select one or more goals. We'll create a personalized plan for you.
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
            activeOpacity={0.7}
          >
            <View style={styles.goalContent}>
              <View style={styles.goalMain}>
                {renderIcon(goal.icon, goal.iconFamily, 24, selectedGoals.includes(goal.id) ? '#007AFF' : '#718096', styles.goalIcon)}
                <View style={styles.goalText}>
                  <Text style={[
                    styles.goalLabel,
                    selectedGoals.includes(goal.id) && styles.goalLabelSelected
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={[
                    styles.goalDescription,
                    selectedGoals.includes(goal.id) && styles.goalDescriptionSelected
                  ]}>
                    {goal.description}
                  </Text>
                </View>
              </View>
              {selectedGoals.includes(goal.id) && (
                <View style={styles.checkmark}>
                  <MaterialIcons name="check" size={16} color="#ffffff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      

      {/* Navigation Controls */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.nextButton,
            !canProceed && styles.nextButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={!canProceed || isLoading}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed && styles.nextButtonTextDisabled
          ]}>
            {isLoading ? 'Loading...' : 'Continue →'}
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  goalsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  goalButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  goalButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 28,
    marginRight: 16,
    opacity: 0.8,
  },
  goalIconSelected: {
    opacity: 1,
  },
  goalText: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  goalLabelSelected: {
    color: '#007AFF',
  },
  goalDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },
  goalDescriptionSelected: {
    color: '#4299e1',
  },
  checkmark: {
    width: 28,
    height: 28,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#a0aec0',
  },
});

export default Step3Goals;