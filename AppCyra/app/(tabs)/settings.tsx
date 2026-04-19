import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Bell, Lock, CircleHelp as HelpCircle, FileText, Share2, LogOut, ChevronRight, Moon, Sun } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [periodReminders, setPeriodReminders] = useState(true);
  const [fertilityAlerts, setFertilityAlerts] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(false);
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const theme = {
    background: darkMode ? '#121212' : '#F8F9FA',
    card: darkMode ? '#1E1E1E' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#333333',
    subtext: darkMode ? '#AAAAAA' : '#666666',
    border: darkMode ? '#333333' : '#F0F0F0',
    accent: '#FF6B8B',
    switchTrackFalse: darkMode ? '#333333' : '#E0E0E0',
    switchTrackTrue: '#FFCDD2',
    switchThumbFalse: darkMode ? '#666666' : '#F5F5F5',
    switchThumbTrue: '#FF6B8B'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        </View>
        
        <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={22} color={theme.accent} style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
              thumbColor={notifications ? theme.switchThumbTrue : theme.switchThumbFalse}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Period Reminders</Text>
            </View>
            <Switch
              value={periodReminders}
              onValueChange={setPeriodReminders}
              trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
              thumbColor={periodReminders ? theme.switchThumbTrue : theme.switchThumbFalse}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Fertility Alerts</Text>
            </View>
            <Switch
              value={fertilityAlerts}
              onValueChange={setFertilityAlerts}
              trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
              thumbColor={fertilityAlerts ? theme.switchThumbTrue : theme.switchThumbFalse}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Medication Reminders</Text>
            </View>
            <Switch
              value={medicationReminders}
              onValueChange={setMedicationReminders}
              trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
              thumbColor={medicationReminders ? theme.switchThumbTrue : theme.switchThumbFalse}
            />
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        </View>
        
        <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              {darkMode ? (
                <Moon size={22} color="#9C27B0" style={styles.settingIcon} />
              ) : (
                <Sun size={22} color="#FF9800" style={styles.settingIcon} />
              )}
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
              thumbColor={darkMode ? theme.switchThumbTrue : theme.switchThumbFalse}
            />
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
        </View>
        
        <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Lock size={22} color="#2196F3" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Privacy Settings</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <FileText size={22} color="#4CAF50" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Export Data</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Share2 size={22} color="#FF9800" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Share App</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
        </View>
        
        <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <HelpCircle size={22} color="#9C27B0" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <FileText size={22} color="#607D8B" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingButton, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <FileText size={22} color="#607D8B" style={styles.settingIcon} />
              <Text style={[styles.settingTitle, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.card }]}>
          <LogOut size={20} color="#FF5252" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: theme.subtext }]}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsGroup: {
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingSubtitle: {
    fontSize: 16,
    marginLeft: 37,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
  },
});