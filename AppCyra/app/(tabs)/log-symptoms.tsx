import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, X, Save, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DataService } from '@/core/services/dataService';
import { Symptom, SymptomIntensity } from '@/core/types';

export default function LogSymptomsScreen() {
  const router = useRouter();
  const today = new Date();
  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Array<{ symptomName: string; intensity: SymptomIntensity }>
  >([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSymptoms = async () => {
      const symptoms = DataService.getSymptomTaxonomy();
      setAvailableSymptoms(symptoms);
      
      // Load today's symptoms if any
      const todaySymptoms = await DataService.getSymptomsByDate('user-1', today);
      if (todaySymptoms.length > 0) {
        setSelectedSymptoms(
          todaySymptoms.map((log) => ({
            symptomName: log.symptomName,
            intensity: log.intensity,
          }))
        );
      }
      
      setLoading(false);
    };
    initSymptoms();
  }, []);

  const saveSymptoms = async () => {
    try {
      for (const symptom of selectedSymptoms) {
        await DataService.logSymptom('user-1', today, symptom.symptomName, symptom.intensity);
      }
      router.back();
    } catch (error) {
      console.error('Error saving symptoms:', error);
    }
  };

  const addCustomSymptom = () => {
    if (
      customSymptom.trim() !== '' &&
      !selectedSymptoms.some((s) => s.symptomName === customSymptom.trim())
    ) {
      setSelectedSymptoms([
        ...selectedSymptoms,
        {
          symptomName: customSymptom.trim(),
          intensity: SymptomIntensity.MODERATE,
        },
      ]);
      setCustomSymptom('');
    }
  };

  const toggleSymptom = (symptomName: string) => {
    const exists = selectedSymptoms.find((s) => s.symptomName === symptomName);

    if (exists) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s.symptomName !== symptomName));
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        {
          symptomName,
          intensity: SymptomIntensity.MODERATE,
        },
      ]);
    }
  };

  const changeIntensity = (symptomName: string, intensity: SymptomIntensity) => {
    setSelectedSymptoms(
      selectedSymptoms.map((s) =>
        s.symptomName === symptomName ? { ...s, intensity } : s
      )
    );
  };

  const removeSymptom = (symptomName: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.symptomName !== symptomName));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Symptoms</Text>
        <TouchableOpacity onPress={saveSymptoms} style={styles.saveButton}>
          <Save size={22} color="#FF6B8B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Symptoms ({selectedSymptoms.length})</Text>

            <View style={styles.selectedSymptomsContainer}>
              {selectedSymptoms.map((symptom) => (
                <View key={symptom.symptomName} style={styles.selectedSymptomItem}>
                  <View style={styles.symptomHeader}>
                    <Text style={styles.selectedSymptomName}>{symptom.symptomName}</Text>
                    <TouchableOpacity onPress={() => removeSymptom(symptom.symptomName)}>
                      <X size={18} color="#999" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.intensityContainer}>
                    {Object.values(SymptomIntensity).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.intensityButton,
                          symptom.intensity === level && styles.intensityButtonActive,
                        ]}
                        onPress={() => changeIntensity(symptom.symptomName, level)}
                      >
                        <Text
                          style={[
                            styles.intensityText,
                            symptom.intensity === level && styles.intensityTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Common Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Symptoms</Text>
          <View style={styles.commonSymptomsContainer}>
            {availableSymptoms
              .filter((s) => !s.isCustom)
              .map((symptom) => {
                const isSelected = selectedSymptoms.some((s) => s.symptomName === symptom.name);
                return (
                  <TouchableOpacity
                    key={symptom.id}
                    style={[
                      styles.symptomChip,
                      isSelected && styles.symptomChipSelected,
                    ]}
                    onPress={() => toggleSymptom(symptom.name)}
                  >
                    <Text
                      style={[
                        styles.symptomChipText,
                        isSelected && styles.symptomChipTextSelected,
                      ]}
                    >
                      {symptom.name}
                    </Text>
                    {isSelected && <Check size={14} color="#fff" style={styles.checkIcon} />}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Custom Symptom */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Custom Symptom</Text>
          <View style={styles.customSymptomContainer}>
            <TextInput
              style={styles.customSymptomInput}
              value={customSymptom}
              onChangeText={setCustomSymptom}
              placeholder="Enter symptom name"
              placeholderTextColor="#999"
              returnKeyType="done"
              onSubmitEditing={addCustomSymptom}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                !customSymptom.trim() && styles.addButtonDisabled,
              ]}
              onPress={addCustomSymptom}
              disabled={!customSymptom.trim()}
            >
              <Plus
                size={20}
                color={customSymptom.trim() ? '#FF6B8B' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes about how you're feeling..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButtonLarge} onPress={saveSymptoms}>
          <Text style={styles.saveButtonText}>Save Log</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  selectedSymptomsContainer: {
    marginBottom: 10,
  },
  selectedSymptomItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedSymptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 3,
  },
  intensityButtonActive: {
    backgroundColor: '#FF6B8B',
  },
  intensityText: {
    fontSize: 14,
    color: '#666',
  },
  intensityTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  commonSymptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  symptomChipSelected: {
    backgroundColor: '#FF6B8B',
  },
  symptomChipText: {
    fontSize: 14,
    color: '#555',
  },
  symptomChipTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 5,
  },
  customSymptomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customSymptomInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  addButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  saveButtonLarge: {
    backgroundColor: '#FF6B8B',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
