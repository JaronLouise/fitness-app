// app/post-signup.jsx - Post-signup wizard with 8 steps
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../backend/config/supabase.js';

// Import step components
import Step1Welcome from './Step1Welcome';
import Step2Gender from './Step2Gender';
import Step3Goals from './Step3Goals';
import Step4FitnessLevel from './Step4FitnessLevel';
import Step5MealPlan from './Step5MealPlan';
import Step6Height from './Step6Height';
import Step7Weight from './Step7Weight';
import Step8Age from './Step8Age';

const PostSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [stepData, setStepData] = useState({
    step0: {}, // Welcome step (no data to save)
    step1: {}, // Gender
    step2: {}, // Goals
    step3: {}, // Fitness level
    step4: {}, // Meal plan
    step5: {}, // Height
    step6: {}, // Weight
    step7: {}  // Age
  });

  // Total steps
  const TOTAL_STEPS = 8;

  useEffect(() => {
    // Check if user is authenticated and get their profile
    checkUserAndProfile();
  }, []);

  const checkUserAndProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        Alert.alert('Error', 'Please sign in to continue');
        router.replace('/(auth)/login');
        return;
      }

      // Get or create user profile
      await getOrCreateProfile(user);
    } catch (error) {
      console.error('Profile check error:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const getOrCreateProfile = async (user) => {
    try {
      setIsLoading(true);
      
      // Try to get existing profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        setUserProfile(profile);
        setCurrentStep(profile.signup_step || 0);
        
        // Load existing step data with descriptive column names
        if (profile.gender_data) setStepData(prev => ({ ...prev, step1: profile.gender_data }));
        if (profile.goals_data) setStepData(prev => ({ ...prev, step2: profile.goals_data }));
        if (profile.fitness_level_data) setStepData(prev => ({ ...prev, step3: profile.fitness_level_data }));
        if (profile.meal_plan_data) setStepData(prev => ({ ...prev, step4: profile.meal_plan_data }));
        if (profile.height_data) setStepData(prev => ({ ...prev, step5: profile.height_data }));
        if (profile.weight_data) setStepData(prev => ({ ...prev, step6: profile.weight_data }));
        if (profile.age_data) setStepData(prev => ({ ...prev, step7: profile.age_data }));
      } else {
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            signup_completed: false,
            signup_step: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepData = (step, data) => {
    // Only update local state, don't save to database yet
    setStepData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));
  };

  const saveAllDataToDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Map step to appropriate database column name with descriptive names
      // Note: step_0 is welcome step with no data to save
      const columnMap = {
        1: 'gender_data',
        2: 'goals_data', 
        3: 'fitness_level_data',
        4: 'meal_plan_data',
        5: 'height_data',
        6: 'weight_data',
        7: 'age_data'
      };

      // Prepare all data for database update
      const updateData = {};
      // Start from step 1 (skip step 0 which is welcome)
      for (let step = 1; step < TOTAL_STEPS; step++) {
        const columnName = columnMap[step];
        const stepDataKey = `step${step}`;
        if (stepData[stepDataKey] && Object.keys(stepData[stepDataKey]).length > 0) {
          updateData[columnName] = stepData[stepDataKey];
        }
      }

      // Add completion status
      updateData.signup_completed = true;
      updateData.signup_step = 7;
      updateData.updated_at = new Date().toISOString();

      // Save all data to backend at once
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      Alert.alert('Welcome!', 'Your profile is complete!', [
        {
          text: 'Get Started',
          onPress: () => router.replace('/(main)')
        }
      ]);
    } catch (error) {
      console.error('Data save error:', error);
      Alert.alert('Error', 'Failed to save profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceedToNext = (step) => {
    // Welcome step (step 0) can always proceed - no data required
    if (step === 0) return true;
    
    const currentStepData = stepData[`step${step}`];
    
    // Check if current step has required data
    switch (step) {
      case 1: // Gender
        return currentStepData.gender;
      case 2: // Goals
        return currentStepData.goals && currentStepData.goals.length > 0;
      case 3: // Fitness level
        return currentStepData.fitness_level;
      case 4: // Meal plan
        return currentStepData.meal_plan;
      case 5: // Height
        return currentStepData.height_value && currentStepData.height_unit;
      case 6: // Weight
        return currentStepData.weight_value && currentStepData.weight_unit;
      case 7: // Age
        return currentStepData.age;
      default:
        return false;
    }
  };

  const canCompleteSignup = () => {
    // Check if all required steps (1-7) have data
    // Skip step 0 (welcome step) as it doesn't require data
    for (let step = 1; step < TOTAL_STEPS; step++) {
      if (!canProceedToNext(step)) {
        return false;
      }
    }
    return true;
  };

  const renderCurrentStep = () => {
    const commonProps = {
      onUpdateData: updateStepData,
      onBack: goToPreviousStep,
      onNext: goToNextStep,
      onComplete: saveAllDataToDatabase,
      isLoading,
      stepData: stepData[`step${currentStep}`],
      currentStep,
      canProceed: canProceedToNext(currentStep),
      canComplete: canCompleteSignup(),
      isLastStep: currentStep === TOTAL_STEPS - 1
    };

    switch (currentStep) {
      case 0:
        return <Step1Welcome {...commonProps} />;
      case 1:
        return <Step2Gender {...commonProps} />;
      case 2:
        return <Step3Goals {...commonProps} />;
      case 3:
        return <Step4FitnessLevel {...commonProps} />;
      case 4:
        return <Step5MealPlan {...commonProps} />;
      case 5:
        return <Step6Height {...commonProps} />;
      case 6:
        return <Step7Weight {...commonProps} />;
      case 7:
        return <Step8Age {...commonProps} />;
      default:
        return <Step1Welcome {...commonProps} />;
    }
  };

  if (isLoading && !userProfile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {TOTAL_STEPS}
        </Text>
      </View>

      {/* Step Content */}
      <View style={styles.stepContainer}>
        {renderCurrentStep()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e1e5e9',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
});

export default PostSignup;




