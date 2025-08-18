// Step6Height.jsx - Height measurement with unit toggle and scroll wheel
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

const Step6Height = ({ onContinue, onBack, isLoading, currentStep, stepData }) => {
  const [unit, setUnit] = useState(stepData.height_unit || 'cm');
  const [height, setHeight] = useState(stepData.height_value || 170);

  useEffect(() => {
    // Load existing data if available
    if (stepData.height_unit) {
      setUnit(stepData.height_unit);
    }
    if (stepData.height_value) {
      setHeight(stepData.height_value);
    }
  }, [stepData]);

  // Height ranges for different units
  const heightRanges = {
    cm: { min: 120, max: 220, step: 1 },
    in: { min: 47, max: 87, step: 0.5 }
  };

  const currentRange = heightRanges[unit];

  const handleUnitToggle = () => {
    const newUnit = unit === 'cm' ? 'in' : 'cm';
    setUnit(newUnit);
    
    // Convert height value between units
    if (newUnit === 'in') {
      setHeight(Math.round(height / 2.54 * 2) / 2); // Convert cm to inches, round to 0.5
    } else {
      setHeight(Math.round(height * 2.54)); // Convert inches to cm, round to whole number
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
  };

  const handleContinue = () => {
    onContinue(currentStep, { 
      height_unit: unit, 
      height_value: height 
    });
  };

  const handleBack = () => {
    onBack();
  };

  const renderHeightPicker = () => {
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
                  height === item && styles.pickerItemSelected
                ]}
                onPress={() => handleHeightChange(item)}
              >
                <Text style={[
                  styles.pickerItemText,
                  height === item && styles.pickerItemTextSelected
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
        <Text style={styles.title}>What's your height?</Text>
        <Text style={styles.subtitle}>
          This helps us calculate your BMI and create personalized recommendations
        </Text>
      </View>

      {/* Unit Toggle */}
      <View style={styles.unitToggleContainer}>
        <Text style={styles.unitLabel}>Unit of measurement:</Text>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'cm' && styles.unitButtonActive
            ]}
            onPress={() => setUnit('cm')}
          >
            <Text style={[
              styles.unitButtonText,
              unit === 'cm' && styles.unitButtonTextActive
            ]}>
              cm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'in' && styles.unitButtonActive
            ]}
            onPress={() => setUnit('in')}
          >
            <Text style={[
              styles.unitButtonText,
              unit === 'in' && styles.unitButtonTextActive
            ]}>
              in
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Height Picker */}
      <View style={styles.heightContainer}>
        <Text style={styles.heightLabel}>Height</Text>
        {renderHeightPicker()}
        <Text style={styles.heightUnit}>{unit}</Text>
      </View>

      {/* Current Selection Display */}
      <View style={styles.selectionDisplay}>
        <Text style={styles.selectionText}>
          Your height: <Text style={styles.selectionValue}>{height}</Text> {unit}
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
  heightContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heightLabel: {
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
  heightUnit: {
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

export default Step6Height;




