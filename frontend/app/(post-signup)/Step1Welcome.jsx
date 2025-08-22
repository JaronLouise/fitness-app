// Step1Welcome.jsx - Welcome banner with continue button
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step1Welcome = ({ onContinue, isLoading, currentStep }) => {
  const handleContinue = () => {
    onContinue(currentStep, {}); // No data to save for welcome step
  };

  return (
    <View style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.welcomeTitle}>Welcome to Your Fitness Journey! 🎉</Text>
        <Text style={styles.welcomeSubtitle}>
          Let's get to know you better so we can create a personalized fitness plan just for you.
        </Text>
        <Text style={styles.welcomeDescription}>
          We'll ask you a few questions about your goals, experience, and preferences. 
          This will only take a few minutes and will help us tailor your experience perfectly.
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? 'Setting up...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  bannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '600',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  continueButton: {
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Step1Welcome;




