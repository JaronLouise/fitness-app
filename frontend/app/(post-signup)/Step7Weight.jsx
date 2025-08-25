// Step7Weight.jsx - Weight measurement with unit toggle, scroll wheel, and confirm button
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView
} from 'react-native';

const Step7Weight = ({ onUpdateData, onBack, onNext, isLoading, currentStep, stepData, canProceed }) => {
  const [unit, setUnit] = useState(stepData.weight_unit || 'kg');
  const [weight, setWeight] = useState(stepData.weight_value || 70);
  const scrollRef = useRef(null);
  const ITEM_HEIGHT = 50;
  const VISIBLE_HEIGHT = 200;
  const CENTER_SPACER = (VISIBLE_HEIGHT - ITEM_HEIGHT) / 2; // 75

  useEffect(() => {
    // Load existing data if available
    if (stepData.weight_unit) {
      setUnit(stepData.weight_unit);
    }
    if (stepData.weight_value) {
      setWeight(stepData.weight_value);
    }
  }, [stepData]);

  // Keep wheel aligned when unit or value changes
  useEffect(() => {
    const index = items.findIndex(v => v === weight);
    if (index >= 0) {
      scrollToIndex(index, false);
    }
  }, [unit]);

  useEffect(() => {
    const index = items.findIndex(v => v === weight);
    if (index >= 0) {
      scrollToIndex(index, true);
    }
  }, [weight]);

  // Weight ranges for different units
  const weightRanges = {
    kg: { min: 30, max: 200, step: 0.5 },
    lb: { min: 66, max: 440, step: 1 }
  };

  const currentRange = weightRanges[unit];

  const items = useMemo(() => {
    const result = [];
    for (let i = currentRange.min; i <= currentRange.max; i += currentRange.step) {
      const value = Math.round(i * (1 / currentRange.step)) / (1 / currentRange.step);
      result.push(value);
    }
    return result;
  }, [currentRange.min, currentRange.max, currentRange.step]);

  const scrollToIndex = (index, animated = true) => {
    if (!scrollRef.current) return;
    const y = index * ITEM_HEIGHT;
    scrollRef.current.scrollTo({ y, animated });
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'kg' ? 'lb' : 'kg';
    let converted = weight;
    if (newUnit === 'lb') {
      converted = Math.round(weight * 2.20462); // kg -> lb, 1 step
    } else {
      converted = Math.round((weight / 2.20462) * 2) / 2; // lb -> kg, 0.5 step
    }
    setUnit(newUnit);
    setWeight(converted);
    onUpdateData(currentStep, { weight_unit: newUnit, weight_value: converted });
  };

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { 
      weight_unit: unit, 
      weight_value: newWeight 
    });
  };

  const handleConfirm = () => {
    if (canProceed) {
      onNext();
    }
  };

  const renderWeightPicker = () => {
    return (
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            style={styles.picker}
            contentContainerStyle={[styles.pickerContent, { paddingVertical: CENTER_SPACER }]}
            ref={scrollRef}
            onLayout={() => {
              const index = items.findIndex(v => v === weight);
              if (index >= 0) scrollToIndex(index, false);
            }}
            onMomentumScrollEnd={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              const index = Math.round(y / ITEM_HEIGHT);
              const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
              const value = items[clampedIndex];
              if (value !== weight) {
                setWeight(value);
                onUpdateData(currentStep, { weight_unit: unit, weight_value: value });
              }
              scrollToIndex(clampedIndex);
            }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={String(item)}
                style={[
                  styles.pickerItem,
                  weight === item && styles.pickerItemSelected
                ]}
                onPress={() => {
                  const idx = items.findIndex(v => v === item);
                  if (idx >= 0) scrollToIndex(idx);
                  handleWeightChange(item);
                }}
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

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            !canProceed && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={!canProceed || isLoading}
        >
          <Text style={[
            styles.confirmButtonText,
            !canProceed && styles.confirmButtonTextDisabled
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
    // paddingVertical dynamically set from component to center items
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // No vertical margin to keep exact item height for snapping
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
    pointerEvents: 'none',
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
  selectionHint: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#999999',
  },
});

export default Step7Weight;

