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
        
        // Load existing step data
        if (profile.step_0_data) setStepData(prev => ({ ...prev, step0: profile.step_0_data }));
        if (profile.step_1_data) setStepData(prev => ({ ...prev, step1: profile.step_1_data }));
        if (profile.step_2_data) setStepData(prev => ({ ...prev, step2: profile.step_2_data }));
        if (profile.step_3_data) setStepData(prev => ({ ...prev, step3: profile.step_3_data }));
        if (profile.step_4_data) setStepData(prev => ({ ...prev, step4: profile.step_4_data }));
        if (profile.step_5_data) setStepData(prev => ({ ...prev, step5: profile.step_5_data }));
        if (profile.step_6_data) setStepData(prev => ({ ...prev, step6: profile.step_6_data }));
        if (profile.step_7_data) setStepData(prev => ({ ...prev, step7: profile.step_7_data }));
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

  const saveStepData = async (step, data) => {
    try {
      setIsLoading(true);
      
      // Update local state
      setStepData(prev => ({
        ...prev,
        [`step${step}`]: data
      }));

      // Save to backend
      const { error } = await supabase
        .from('user_profiles')
        .update({
          [`step_${step}_data`]: data,
          signup_step: step,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      // Move to next step
      if (step < TOTAL_STEPS - 1) {
        setCurrentStep(step + 1);
      } else {
        // Complete signup
        await completeSignup();
      }
    } catch (error) {
      console.error('Step save error:', error);
      Alert.alert('Error', 'Failed to save step data');
    } finally {
      setIsLoading(false);
    }
  };

  const completeSignup = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          signup_completed: true,
          signup_step: 7,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      Alert.alert('Welcome!', 'Your profile is complete!', [
        {
          text: 'Get Started',
          onPress: () => router.replace('/(main)')
        }
      ]);
    } catch (error) {
      console.error('Signup completion error:', error);
      Alert.alert('Error', 'Failed to complete signup');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      onContinue: saveStepData,
      onBack: goToPreviousStep,
      isLoading,
      stepData: stepData[`step${currentStep}`],
      currentStep
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




