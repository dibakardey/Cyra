import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DataService } from '@/core/services/dataService';
import { UserProfile, CyclePhase, Insight } from '@/core/types';
import { getPhaseColors, getPhaseDescription, calculateDayOfCycle, calculatePhase } from '@/core/utils/cycleCalculations';

export default function HomeScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [phase, setPhase] = useState<CyclePhase>(CyclePhase.MENSTRUATION);
  const [symptomCount, setSymptomCount] = useState<number>(0);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get user profile
        const profile = await DataService.getUserProfile();
        
        // If no profile, create demo one
        if (!profile) {
          const demoProfile: UserProfile = {
            id: 'user-1',
            name: 'Sarah',
            age: 28,
            lastPeriodStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            cycleLength: 28,
            periodLength: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await DataService.initializeUser(demoProfile);
          setUserProfile(demoProfile);
        } else {
          setUserProfile(profile);
        }

        // Calculate current cycle day
        const today = new Date();
        const profile_to_use = profile || { lastPeriodStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), cycleLength: 28 };
        const dayOfCycle = calculateDayOfCycle(today, profile_to_use.lastPeriodStartDate, profile_to_use.cycleLength);
        const cyclePhase = calculatePhase(dayOfCycle, profile_to_use.cycleLength);
        
        setCurrentDay(dayOfCycle);
        setPhase(cyclePhase);

        // Get today's symptoms
        const todaySymptoms = await DataService.getSymptomsByDate('user-1', today);
        setSymptomCount(todaySymptoms.length);

        // Generate insights
        const generatedInsights = await DataService.generateInsights('user-1');
        setInsights(generatedInsights);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing home screen:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const colors = getPhaseColors(phase);
  const phaseDescription = getPhaseDescription(phase);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userProfile?.name || 'Sarah'}</Text>
        </View>

        {/* Cycle Status Card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.cycleCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.cycleCardContent}>
            <Text style={styles.cycleDay}>Day {currentDay}</Text>
            <Text style={styles.cyclePhase}>{phase}</Text>
            <Text style={styles.cycleDescription}>{phaseDescription}</Text>

            {/* Progress bar */}
            <View style={styles.cycleProgress}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${(currentDay / (userProfile?.cycleLength || 28)) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Day 1</Text>
                <Text style={styles.progressLabel}>Day {userProfile?.cycleLength || 28}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Logged Symptoms Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Log</Text>
            {symptomCount > 0 && (
              <View style={styles.symptomBadge}>
                <Text style={styles.symptomBadgeText}>{symptomCount} logged</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.logButton}
            onPress={() => router.push('/log-symptoms')}
          >
            <Text style={styles.logButtonText}>+ Log Symptoms</Text>
            <ChevronRight size={20} color="#FF6B8B" />
          </TouchableOpacity>
        </View>

        {/* Pattern Insights */}
        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emerging Patterns</Text>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <View
                    style={[
                      styles.confidenceBadge,
                      insight.confidence === 'HIGH' && styles.confidenceHigh,
                      insight.confidence === 'MEDIUM' && styles.confidenceMedium,
                      insight.confidence === 'LOW' && styles.confidenceLow,
                    ]}
                  >
                    <Text style={styles.confidenceText}>{insight.confidence}</Text>
                  </View>
                </View>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/calendar')}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Calendar</Text>
              <Text style={styles.actionDescription}>See your full cycle overview</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/profile')}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Cycle Settings</Text>
              <Text style={styles.actionDescription}>Update cycle length or dates</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Footer Spacing */}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    padding: 20,
  },
  cycleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
  },
  cyclePhase: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cycleDescription: {
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 20,
  },
  cycleProgress: {
    marginTop: 15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomBadge: {
    backgroundColor: '#FF6B8B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  symptomBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  logButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B8B',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  confidenceHigh: {
    backgroundColor: '#E8F5E9',
  },
  confidenceMedium: {
    backgroundColor: '#FFF3E0',
  },
  confidenceLow: {
    backgroundColor: '#FFEBEE',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    padding: 20,
  },
  cycleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
  },
  cyclePhase: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cycleDescription: {
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 20,
  },
  cycleProgress: {
    marginTop: 15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomBadge: {
    backgroundColor: '#FF6B8B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  symptomBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  logButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B8B',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  confidenceHigh: {
    backgroundColor: '#E8F5E9',
  },
  confidenceMedium: {
    backgroundColor: '#FFF3E0',
  },
  confidenceLow: {
    backgroundColor: '#FFEBEE',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  spacer: {
    height: 30,
  },
});