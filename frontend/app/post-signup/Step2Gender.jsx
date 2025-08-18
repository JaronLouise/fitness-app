// Step2Gender.jsx - Gender selection with toggle buttons
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step2Gender = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [selectedGender, setSelectedGender] = useState(stepData.gender || '');

  useEffect(() => {
    // Load existing data if available
    if (stepData.gender) {
      setSelectedGender(stepData.gender);
    }
  }, [stepData]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (!selectedGender) {
      // Show error or alert that selection is required
      return;
    }
    onContinue(currentStep, { gender: selectedGender });
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your gender?</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your fitness and nutrition recommendations
        </Text>
      </View>

      {/* Gender Selection */}
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'male' && styles.genderButtonSelected
          ]}
          onPress={() => handleGenderSelect('male')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.genderButtonText,
            selectedGender === 'male' && styles.genderButtonTextSelected
          ]}>
            Male
          </Text>
          {selectedGender === 'male' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'female' && styles.genderButtonSelected
          ]}
          onPress={() => handleGenderSelect('female')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.genderButtonText,
            selectedGender === 'female' && styles.genderButtonTextSelected
          ]}>
            Female
          </Text>
          {selectedGender === 'female' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

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
            (!selectedGender || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedGender || isLoading}
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
    maxWidth: 280,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  genderButton: {
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
  genderButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  genderButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  genderButtonTextSelected: {
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

export default Step2Gender;




