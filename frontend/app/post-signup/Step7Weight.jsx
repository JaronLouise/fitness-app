// Step7Weight.jsx - Weight measurement with unit toggle and scroll wheel
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView
} from 'react-native';

const Step7Weight = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [unit, setUnit] = useState(stepData.weight_unit || 'kg');
  const [weight, setWeight] = useState(stepData.weight_value || 70);

  useEffect(() => {
    // Load existing data if available
    if (stepData.weight_unit) {
      setUnit(stepData.weight_unit);
    }
    if (stepData.weight_value) {
      setWeight(stepData.weight_value);
    }
  }, [stepData]);

  // Weight ranges for different units
  const weightRanges = {
    kg: { min: 30, max: 200, step: 0.5 },
    lb: { min: 66, max: 440, step: 1 }
  };

  const currentRange = weightRanges[unit];

  const handleUnitToggle = () => {
    const newUnit = unit === 'kg' ? 'lb' : 'kg';
    setUnit(newUnit);
    
    // Convert weight value between units
    if (newUnit === 'lb') {
      setWeight(Math.round(weight * 2.20462)); // Convert kg to lbs, round to whole number
    } else {
      setWeight(Math.round(weight / 2.20462 * 2) / 2); // Convert lbs to kg, round to 0.5
    }
  };

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
  };

  const handleContinue = () => {
    onContinue(currentStep, { 
      weight_unit: unit, 
      weight_value: weight 
    });
  };

  const handleBack = () => {
    onBack();
  };

  const renderWeightPicker = () => {
    const items = [];
    for (let i = currentRange.min; i <= currentRange.max; i += currentRange.step) {
      items.push(i);
    }

    return (
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={50}
            decelerationRate="fast"
            style={styles.picker}
            contentContainerStyle={styles.pickerContent}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.pickerItem,
                  weight === item && styles.pickerItemSelected
                ]}
                onPress={() => handleWeightChange(item)}
              >
                <Text style={[
                  styles.pickerItemText,
                  weight === item && styles.pickerItemTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pickerIndicator} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's your weight?</Text>
        <Text style={styles.subtitle}>
          This helps us calculate your BMI and create personalized nutrition plans
        </Text>
      </View>

      {/* Unit Toggle */}
      <View style={styles.unitToggleContainer}>
        <Text style={styles.unitLabel}>Unit of measurement:</Text>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'kg' && styles.unitButtonActive
            ]}
            onPress={() => setUnit('kg')}
          >
            <Text style={[
              styles.unitButtonText,
              unit === 'kg' && styles.unitButtonTextActive
            ]}>
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'lb' && styles.unitButtonActive
            ]}
            onPress={() => setUnit('lb')}
          >
            <Text style={[
              styles.unitButtonText,
              unit === 'lb' && styles.unitButtonTextActive
            ]}>
              lb
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weight Picker */}
      <View style={styles.weightContainer}>
        <Text style={styles.weightLabel}>Weight</Text>
        {renderWeightPicker()}
        <Text style={styles.weightUnit}>{unit}</Text>
      </View>

      {/* Current Selection Display */}
      <View style={styles.selectionDisplay}>
        <Text style={styles.selectionText}>
          Your weight: <Text style={styles.selectionValue}>{weight}</Text> {unit}
        </Text>
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
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
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
    marginBottom: 30,
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
  unitToggleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  unitLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  unitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: '#007AFF',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  unitButtonTextActive: {
    color: '#ffffff',
  },
  weightContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  pickerContainer: {
    alignItems: 'center',
  },
  pickerWrapper: {
    position: 'relative',
    height: 200,
    width: 120,
  },
  picker: {
    height: '100%',
  },
  pickerContent: {
    paddingVertical: 75, // Center the selected item
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  pickerItemText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666666',
  },
  pickerItemTextSelected: {
    color: '#007AFF',
  },
  pickerIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 50,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginTop: -25,
  },
  weightUnit: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 16,
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

export default Step7Weight;

