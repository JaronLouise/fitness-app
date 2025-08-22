// Step5MealPlan.jsx - Meal plan preferences selection
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step5MealPlan = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [selectedMealPlans, setSelectedMealPlans] = useState(stepData.meal_plans || []);

  useEffect(() => {
    // Load existing data if available
    if (stepData.meal_plans) {
      setSelectedMealPlans(stepData.meal_plans);
    }
  }, [stepData]);

  const mealPlans = [
    { id: 'balanced_diet', label: 'Balanced Diet', icon: '🥗', description: 'Well-rounded nutrition' },
    { id: 'intermittent_fasting', label: 'Intermittent Fasting', icon: '⏰', description: 'Time-restricted eating' },
    { id: 'high_protein', label: 'High Protein Diet', icon: '🥩', description: 'Protein-focused meals' },
    { id: 'low_carb', label: 'Low Carb Diet', icon: '🥑', description: 'Reduced carbohydrates' },
    { id: 'low_fat', label: 'Low Fat Diet', icon: '🐟', description: 'Minimal fat intake' }
  ];

  const handleMealPlanToggle = (planId) => {
    setSelectedMealPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedMealPlans.length === 0) {
      // Show error that at least one meal plan must be selected
      return;
    }
    onContinue(currentStep, { meal_plans: selectedMealPlans });
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your preferred meal plan?</Text>
        <Text style={styles.subtitle}>
          Select the meal plans that interest you. We'll create personalized nutrition recommendations.
        </Text>
      </View>

      {/* Meal Plan Selection */}
      <View style={styles.plansContainer}>
        {mealPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planButton,
              selectedMealPlans.includes(plan.id) && styles.planButtonSelected
            ]}
            onPress={() => handleMealPlanToggle(plan.id)}
            activeOpacity={0.8}
          >
            <View style={styles.planContent}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View style={styles.planTextContainer}>
                <Text style={[
                  styles.planLabel,
                  selectedMealPlans.includes(plan.id) && styles.planLabelSelected
                ]}>
                  {plan.label}
                </Text>
                <Text style={[
                  styles.planDescription,
                  selectedMealPlans.includes(plan.id) && styles.planDescriptionSelected
                ]}>
                  {plan.description}
                </Text>
              </View>
            </View>
            {selectedMealPlans.includes(plan.id) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selection Summary */}
      {selectedMealPlans.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Selected: {selectedMealPlans.length} meal plan{selectedMealPlans.length !== 1 ? 's' : ''}
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
            (selectedMealPlans.length === 0 || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedMealPlans.length === 0 || isLoading}
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
    marginBottom: 30,
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
    maxWidth: 320,
  },
  plansContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  planButton: {
    height: 90,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  planButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  planContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  planIcon: {
    fontSize: 28,
    marginRight: 18,
  },
  planTextContainer: {
    flex: 1,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  planLabelSelected: {
    color: '#007AFF',
  },
  planDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  planDescriptionSelected: {
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

export default Step5MealPlan;




