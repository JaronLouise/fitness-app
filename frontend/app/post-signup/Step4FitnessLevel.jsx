// Step4FitnessLevel.jsx - Fitness level selection (single choice)
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';

const Step4FitnessLevel = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [selectedLevel, setSelectedLevel] = useState(stepData.fitness_level || '');

  useEffect(() => {
    // Load existing data if available
    if (stepData.fitness_level) {
      setSelectedLevel(stepData.fitness_level);
    }
  }, [stepData]);

  const fitnessLevels = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      icon: '🌱',
      description: 'New to fitness or getting back into it'
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      icon: '🔥',
      description: 'Regular workouts, some experience'
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      icon: '💪',
      description: 'Experienced, looking for challenges'
    }
  ];

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleContinue = () => {
    if (!selectedLevel) {
      // Show error that selection is required
      return;
    }
    onContinue(currentStep, { fitness_level: selectedLevel });
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your fitness level?</Text>
        <Text style={styles.subtitle}>
          Choose the level that best describes your current fitness experience
        </Text>
      </View>

      {/* Fitness Level Selection */}
      <View style={styles.levelsContainer}>
        {fitnessLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelButton,
              selectedLevel === level.id && styles.levelButtonSelected
            ]}
            onPress={() => handleLevelSelect(level.id)}
            activeOpacity={0.8}
          >
            <View style={styles.levelContent}>
              <Text style={styles.levelIcon}>{level.icon}</Text>
              <View style={styles.levelTextContainer}>
                <Text style={[
                  styles.levelLabel,
                  selectedLevel === level.id && styles.levelLabelSelected
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.levelDescription,
                  selectedLevel === level.id && styles.levelDescriptionSelected
                ]}>
                  {level.description}
                </Text>
              </View>
            </View>
            {selectedLevel === level.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
            (!selectedLevel || isLoading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedLevel || isLoading}
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
    maxWidth: 300,
  },
  levelsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  levelButton: {
    height: 100,
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
  levelButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  levelContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: 20,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  levelLabelSelected: {
    color: '#007AFF',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  levelDescriptionSelected: {
    color: '#007AFF',
  },
  checkmark: {
    position: 'absolute',
    right: 20,
    width: 28,
    height: 28,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 18,
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

export default Step4FitnessLevel;




