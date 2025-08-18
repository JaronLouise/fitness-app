// Step8Age.jsx - Age input with text input field
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const Step8Age = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [age, setAge] = useState(stepData.age || '');

  useEffect(() => {
    // Load existing data if available
    if (stepData.age) {
      setAge(stepData.age.toString());
    }
  }, [stepData]);

  const handleAgeChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setAge(numericText);
  };

  const validateAge = () => {
    const ageNum = parseInt(age);
    if (!age || ageNum < 13 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120 years.');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateAge()) {
      return;
    }
    onContinue(currentStep, { age: parseInt(age) });
  };

  const handleBack = () => {
    onBack();
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

      {/* Current Selection Display */}
      {age && (
        <View style={styles.selectionDisplay}>
          <Text style={styles.selectionText}>
            Your age: <Text style={styles.selectionValue}>{age}</Text> years
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
            (!age || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!age || isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving...' : 'Complete Setup'}
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
  selectionDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectionText: {
    fontSize: 18,
    color: '#666666',
  },
  selectionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
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

export default Step8Age;




