import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Edit3, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DataService } from '@/core/services/dataService';
import { UserProfile } from '@/core/types';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await DataService.getUserProfile();
      setUserProfile(profile);
    };
    loadProfile();
  }, []);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const lastPeriodDate = userProfile.lastPeriodStartDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nextPeriodDate = new Date(
    userProfile.lastPeriodStartDate.getTime() + userProfile.cycleLength * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cycle Settings</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={20} color="#FF6B8B" />
          </TouchableOpacity>
        </View>

        {/* Cycle Metadata Card */}
        <LinearGradient
          colors={['#FF6B8B', '#FF8E8B']}
          style={styles.cycleCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.cycleCardContent}>
            <View style={styles.cycleMetricRow}>
              <View style={styles.cycleMetric}>
                <Text style={styles.metricLabel}>Cycle Length</Text>
                <Text style={styles.metricValue}>{userProfile.cycleLength}</Text>
                <Text style={styles.metricUnit}>days</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.cycleMetric}>
                <Text style={styles.metricLabel}>Period Length</Text>
                <Text style={styles.metricValue}>{userProfile.periodLength}</Text>
                <Text style={styles.metricUnit}>days</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Period Dates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Period Dates</Text>

          <View style={styles.dateCard}>
            <View style={styles.dateIconContainer}>
              <Calendar size={20} color="#FF6B8B" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Last Period Started</Text>
              <Text style={styles.dateValue}>{lastPeriodDate}</Text>
            </View>
          </View>

          <View style={styles.dateCard}>
            <View style={styles.dateIconContainer}>
              <Calendar size={20} color="#FF6B8B" />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Next Period Expected</Text>
              <Text style={styles.dateValue}>{nextPeriodDate}</Text>
            </View>
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Screen</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your cycle metadata helps calculate which phase you're in each day and derive
              insights about your patterns over time.
            </Text>
            <Text style={styles.infoTextSecondary}>
              All symptom logs are timestamped and phase-tagged automatically.
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cycleCardContent: {
    padding: 25,
  },
  cycleMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  metricUnit: {
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  infoTextSecondary: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  spacer: {
    height: 30,
  },
});


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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cycleCardContent: {
    padding: 25,
  },
  cycleMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  metricUnit: {
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  infoTextSecondary: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  spacer: {
    height: 30,
  },
});