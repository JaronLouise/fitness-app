// Step6Height.jsx - Height measurement with unit toggle, scroll wheel, and confirm button
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

const Step6Height = ({ onUpdateData, onBack, onNext, isLoading, currentStep, stepData, canProceed }) => {
  const [unit, setUnit] = useState(stepData.height_unit || 'cm');
  const [height, setHeight] = useState(stepData.height_value || 170);
  const scrollRef = useRef(null);
  const ITEM_HEIGHT = 50;
  const VISIBLE_HEIGHT = 200;
  const CENTER_SPACER = (VISIBLE_HEIGHT - ITEM_HEIGHT) / 2; // 75

  useEffect(() => {
    // Load existing data if available
    if (stepData.height_unit) {
      setUnit(stepData.height_unit);
    }
    if (stepData.height_value) {
      setHeight(stepData.height_value);
    }
  }, [stepData]);

  // Keep wheel aligned when unit or value changes
  useEffect(() => {
    // Align to current height in list
    const index = items.findIndex(v => v === height);
    if (index >= 0) {
      scrollToIndex(index, false);
    }
  }, [unit]);

  useEffect(() => {
    const index = items.findIndex(v => v === height);
    if (index >= 0) {
      scrollToIndex(index, true);
    }
  }, [height]);

  // Height ranges for different units
  const heightRanges = {
    cm: { min: 120, max: 220, step: 1 },
    in: { min: 47, max: 87, step: 0.5 }
  };

  const currentRange = heightRanges[unit];

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

  const syncScrollToValue = (value) => {
    const closestIndex = items.reduce((bestIdx, v, idx) => {
      return Math.abs(v - value) < Math.abs(items[bestIdx] - value) ? idx : bestIdx;
    }, 0);
    scrollToIndex(closestIndex, false);
  };

  // Initialize scroll position once content is laid out
  const handlePickerLayout = () => {
    const index = items.findIndex(v => v === height);
    if (index >= 0) scrollToIndex(index, false);
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'cm' ? 'in' : 'cm';
    let converted = height;
    if (newUnit === 'in') {
      converted = Math.round((height / 2.54) * 2) / 2; // cm -> in (0.5 step)
    } else {
      converted = Math.round(height * 2.54); // in -> cm (1 step)
    }
    setUnit(newUnit);
    setHeight(converted);
    onUpdateData(currentStep, { height_unit: newUnit, height_value: converted });
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    // Update local state but don't save to database yet
    onUpdateData(currentStep, { 
      height_unit: unit, 
      height_value: newHeight 
    });
  };

  const handleConfirm = () => {
    if (canProceed) {
      onNext();
    }
  };

  const renderHeightPicker = () => {
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
            onLayout={handlePickerLayout}
            onMomentumScrollEnd={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              const index = Math.round(y / ITEM_HEIGHT);
              const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
              const value = items[clampedIndex];
              if (value !== height) {
                setHeight(value);
                onUpdateData(currentStep, { height_unit: unit, height_value: value });
              }
              // ensure exact alignment after rounding
              scrollToIndex(clampedIndex);
            }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={String(item)}
                style={[
                  styles.pickerItem,
                  height === item && styles.pickerItemSelected
                ]}
                onPress={() => {
                  const idx = items.findIndex(v => v === item);
                  if (idx >= 0) scrollToIndex(idx);
                  handleHeightChange(item);
                }}
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
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  confirmButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  confirmButtonTextDisabled: {
    color: '#999999',
  },
});

export default Step6Height;




