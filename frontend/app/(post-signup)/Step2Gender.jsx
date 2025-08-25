// Step2Gender.jsx - Clean gender selection with symbols
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step2Gender = ({ onUpdateData, onBack, onNext, isLoading, currentStep, stepData, canProceed }) => {
  const [selectedGender, setSelectedGender] = useState(stepData.gender || '');

  useEffect(() => {
    // Load existing data if available
    if (stepData.gender) {
      setSelectedGender(stepData.gender);
    }
  }, [stepData]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { gender });
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
          activeOpacity={0.7}
        >
          <View style={styles.genderContent}>
            <Text style={[
              styles.genderSymbol,
              selectedGender === 'male' && styles.genderSymbolSelected
            ]}>
              ♂
            </Text>
            <Text style={[
              styles.genderLabel,
              selectedGender === 'male' && styles.genderLabelSelected
            ]}>
              Male
            </Text>
          </View>
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
          activeOpacity={0.7}
        >
          <View style={styles.genderContent}>
            <Text style={[
              styles.genderSymbol,
              selectedGender === 'female' && styles.genderSymbolSelected
            ]}>
              ♀
            </Text>
            <Text style={[
              styles.genderLabel,
              selectedGender === 'female' && styles.genderLabelSelected
            ]}>
              Female
            </Text>
          </View>
          {selectedGender === 'female' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
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
    marginBottom: 48,
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
    maxWidth: 300,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  genderButton: {
    height: 88,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  genderButtonSelected: {
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
  genderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderSymbol: {
    fontSize: 32,
    color: '#718096',
    marginRight: 16,
    fontWeight: '400',
  },
  genderSymbolSelected: {
    color: '#007AFF',
  },
  genderLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
  },
  genderLabelSelected: {
    color: '#007AFF',
  },
  checkmark: {
    width: 28,
    height: 28,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Step2Gender;