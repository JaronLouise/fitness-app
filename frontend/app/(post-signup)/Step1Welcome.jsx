// Step1Welcome.jsx - Clean, minimal welcome banner
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Step1Welcome = ({ onNext, onBack, canProceed, currentStep, isLoading }) => {
  return (
    <View style={styles.container}>
      {/* Welcome Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="fitness-center" size={32} color="#007AFF" /> 
        </View>
        
        <Text style={styles.title}>
          Welcome to Your{'\n'}
          <Text style={styles.titleAccent}>Fitness Journey</Text>
        </Text>
        
        <Text style={styles.subtitle}>
          Let's get to know you better so we can create a personalized fitness plan just for you.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialIcons name="handyman" size={16} color="#007AFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Personalized workout plans</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="analytics" size={16} color="#007AFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Progress tracking & analytics</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="dining" size={16} color="#007AFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Custom nutrition guidance</Text>
          </View>
        </View>
        
        <Text style={styles.description}>
          This will only take a few minutes.
        </Text>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[
            styles.nextButton,
            currentStep === 0 && styles.fullWidth
          ]}
          onPress={onNext}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Loading...' : 'Get Started →'}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f8faff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  titleAccent: {
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  features: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#2d3748',
    fontWeight: '500',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    fontStyle: 'italic',
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
  fullWidth: {
    width: width - 48,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Step1Welcome;