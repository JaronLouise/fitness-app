// Step5MealPlan.jsx - Clean meal plan selection with hidden scroll
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView
} from 'react-native';

const Step5MealPlan = ({ onUpdateData, onBack, onNext, isLoading, currentStep, stepData, canProceed }) => {
  const [selectedMealPlan, setSelectedMealPlan] = useState(stepData.meal_plan || '');

  useEffect(() => {
    // Load existing data if available
    if (stepData.meal_plan) {
      setSelectedMealPlan(stepData.meal_plan);
    }
  }, [stepData]);

  const mealPlans = [
    { id: 'balanced_diet', label: 'Balanced Diet', icon: '🥗', description: 'Well-rounded nutrition for overall health' },
    { id: 'high_protein', label: 'High Protein', icon: '🥩', description: 'Protein-focused for muscle building' },
    { id: 'low_carb', label: 'Low Carb', icon: '🥑', description: 'Reduced carbs for weight management' },
    { id: 'intermittent_fasting', label: 'Intermittent Fasting', icon: '⏰', description: 'Time-restricted eating windows' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒', description: 'Heart-healthy Mediterranean foods' },
    { id: 'plant_based', label: 'Plant-Based', icon: '🌱', description: 'Vegetarian and vegan options' },
    { id: 'keto', label: 'Ketogenic', icon: '🧈', description: 'High-fat, very low-carb approach' }
  ];

  const handleMealPlanSelect = (planId) => {
    setSelectedMealPlan(planId);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { meal_plan: planId });
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
        <Text style={styles.title}>Choose your meal plan</Text>
        <Text style={styles.subtitle}>
          Select the approach that best fits your lifestyle and goals.
        </Text>
      </View>

      {/* Meal Plan Selection - Scrollable */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {mealPlans.map((plan, index) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planButton,
              selectedMealPlan === plan.id && styles.planButtonSelected,
              index === mealPlans.length - 1 && styles.lastButton
            ]}
            onPress={() => handleMealPlanSelect(plan.id)}
            activeOpacity={0.7}
          >
            <View style={styles.planContent}>
              <View style={styles.planMain}>
                <Text style={[
                  styles.planIcon,
                  selectedMealPlan === plan.id && styles.planIconSelected
                ]}>
                  {plan.icon}
                </Text>
                <View style={styles.planText}>
                  <Text style={[
                    styles.planLabel,
                    selectedMealPlan === plan.id && styles.planLabelSelected
                  ]}>
                    {plan.label}
                  </Text>
                  <Text style={[
                    styles.planDescription,
                    selectedMealPlan === plan.id && styles.planDescriptionSelected
                  ]}>
                    {plan.description}
                  </Text>
                </View>
              </View>
              {selectedMealPlan === plan.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  planButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  planButtonSelected: {
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
  lastButton: {
    marginBottom: 0,
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planIcon: {
    fontSize: 24,
    marginRight: 16,
    opacity: 0.8,
    width: 32,
    textAlign: 'center',
  },
  planIconSelected: {
    opacity: 1,
  },
  planText: {
    flex: 1,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  planLabelSelected: {
    color: '#007AFF',
  },
  planDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },
  planDescriptionSelected: {
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

export default Step5MealPlan;