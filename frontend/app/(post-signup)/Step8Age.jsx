// Step8Age.jsx - Age input with text input field, confirm button, and navigation controls
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const Step8Age = ({ onUpdateData, onBack, onNext, onComplete, isLoading, currentStep, stepData, canProceed, canComplete, isLastStep }) => {
  const [age, setAge] = useState(stepData.age || '');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Load existing data if available
    if (stepData.age) {
      setAge(stepData.age.toString());
      setIsConfirmed(true);
    }
  }, [stepData]);

  const handleAgeChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setAge(numericText);
    // Reset confirmation when age changes
    setIsConfirmed(false);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { age: numericText ? parseInt(numericText) : null });
  };

  const validateAge = () => {
    const ageNum = parseInt(age);
    if (!age || ageNum < 13 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120 years.');
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!validateAge()) {
      return;
    }
    setIsConfirmed(true);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { age: parseInt(age) });
  };

  const handleContinue = () => {
    if (!isConfirmed) {
      Alert.alert('Please Confirm', 'Please confirm your age before proceeding.');
      return;
    }
    
    if (isLastStep && canComplete) {
      // This is the final step and all data is complete, save everything to database
      onComplete();
    } else {
      // Move to next step
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your age?</Text>
        <Text style={styles.subtitle}>
          This helps us create age-appropriate fitness and nutrition recommendations
        </Text>
      </View>

      {/* Age Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Age</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.ageInput}
            value={age}
            onChangeText={handleAgeChange}
            placeholder="Enter your age"
            keyboardType="numeric"
            maxLength={3}
            autoFocus={true}
          />
          <Text style={styles.ageUnit}>years</Text>
        </View>
        <Text style={styles.inputHint}>
          Must be between 13 and 120 years old
        </Text>
      </View>

      {/* Confirm Button */}
      {age && !isConfirmed && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>
              {isLoading ? 'Confirming...' : 'Confirm Age'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Selection Display */}
      {age && isConfirmed && (
        <View style={styles.selectionDisplay}>
          <Text style={styles.selectionText}>
            Your age: <Text style={styles.selectionValue}>{age}</Text> years
          </Text>
        </View>
      )}

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Continue/Complete Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            (!canProceed || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canProceed || isLoading}
          activeOpacity={0.9}
        >
          <Text style={[
            styles.continueButtonText,
            (!canProceed || isLoading) && styles.continueButtonTextDisabled
          ]}>
            {isLoading ? 'Loading...' : 
             isLastStep && canComplete ? 'Complete Profile' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {!age ? 'Enter your age above' : 
           !isConfirmed ? 'Click "Confirm Age" to proceed' : 
           isLastStep && canComplete ? 'All steps completed! Click "Complete Profile" to finish.' :
           'Age confirmed! You can now proceed to the next step.'}
        </Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
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
  inputContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ageInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    minWidth: 80,
    marginRight: 12,
  },
  ageUnit: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  inputHint: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  confirmContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmButton: {
    height: 56,
    backgroundColor: '#28a745',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  selectionDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectionText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 12,
  },
  selectionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  confirmedBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  confirmedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: '#e1e5e9',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  instructionsText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Step8Age;





