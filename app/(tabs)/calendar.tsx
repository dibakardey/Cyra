import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [symptoms, setSymptoms] = useState({});
  
  // Mock data for symptoms
  const mockSymptoms = {
    '2025-01-10': ['Cramps', 'Bloating', 'Headache'],
    '2025-01-11': ['Cramps', 'Fatigue'],
    '2025-01-12': ['Fatigue', 'Mood swings'],
    '2025-01-15': ['Breast tenderness'],
    '2025-01-25': ['Increased energy', 'Better mood'],
  };
  
  // Mock data for period days
  const periodDays = ['2025-01-10', '2025-01-11', '2025-01-12', '2025-01-13', '2025-01-14'];
  
  // Mock data for fertile days
  const fertileDays = ['2025-01-23', '2025-01-24', '2025-01-25', '2025-01-26', '2025-01-27'];
  
  // Mock data for ovulation day
  const ovulationDay = '2025-01-25';
  
  useEffect(() => {
    setSymptoms(mockSymptoms);
    generateCalendarDays(currentMonth);
  }, [currentMonth]);
  
  const generateCalendarDays = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, monthIndex, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the last day of the previous month
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    
    const days = [];
    
    // Add days from previous month to fill the first row
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      days.push({
        day,
        month: monthIndex - 1,
        year,
        isCurrentMonth: false,
        date: new Date(year, monthIndex - 1, day),
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: monthIndex,
        year,
        isCurrentMonth: true,
        date: new Date(year, monthIndex, i),
      });
    }
    
    // Add days from next month to complete the last row
    const remainingDays = 42 - days.length; // 6 rows x 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: monthIndex + 1,
        year,
        isCurrentMonth: false,
        date: new Date(year, monthIndex + 1, i),
      });
    }
    
    setCalendarDays(days);
  };
  
  const formatDateString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const isPeriodDay = (date) => {
    const dateString = formatDateString(date);
    return periodDays.includes(dateString);
  };
  
  const isFertileDay = (date) => {
    const dateString = formatDateString(date);
    return fertileDays.includes(dateString);
  };
  
  const isOvulationDay = (date) => {
    const dateString = formatDateString(date);
    return dateString === ovulationDay;
  };
  
  const hasSymptoms = (date) => {
    const dateString = formatDateString(date);
    return symptoms[dateString] && symptoms[dateString].length > 0;
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const selectDate = (date) => {
    setSelectedDate(date);
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const renderDayCell = (day) => {
    const isPeriod = isPeriodDay(day.date);
    const isFertile = isFertileDay(day.date);
    const isOvulation = isOvulationDay(day.date);
    const hasSymptom = hasSymptoms(day.date);
    
    let backgroundColor = 'transparent';
    let dotColor = 'transparent';
    
    if (isPeriod) {
      backgroundColor = 'rgba(255, 107, 139, 0.1)';
      dotColor = '#FF6B8B';
    } else if (isOvulation) {
      backgroundColor = 'rgba(76, 175, 80, 0.1)';
      dotColor = '#4CAF50';
    } else if (isFertile) {
      backgroundColor = 'rgba(76, 175, 80, 0.05)';
      dotColor = '#81C784';
    }
    
    return (
      <TouchableOpacity
        key={`${day.day}-${day.month}`}
        style={[
          styles.dayCell,
          !day.isCurrentMonth && styles.otherMonthDay,
          isToday(day.date) && styles.todayCell,
          isSelected(day.date) && styles.selectedCell,
          { backgroundColor },
        ]}
        onPress={() => selectDate(day.date)}
      >
        <Text
          style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthDayText,
            isToday(day.date) && styles.todayText,
            isSelected(day.date) && styles.selectedDayText,
            isPeriod && styles.periodDayText,
          ]}
        >
          {day.day}
        </Text>
        {hasSymptom && (
          <View style={[styles.symptomDot, { backgroundColor: dotColor }]} />
        )}
      </TouchableOpacity>
    );
  };
  
  const renderWeekDays = () => {
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return weekDays.map((day, index) => (
      <View key={index} style={styles.weekDayCell}>
        <Text style={styles.weekDayText}>{day}</Text>
      </View>
    ));
  };
  
  const renderCalendarGrid = () => {
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const row = calendarDays.slice(i, i + 7);
      rows.push(
        <View key={i} style={styles.calendarRow}>
          {row.map(day => renderDayCell(day))}
        </View>
      );
    }
    return rows;
  };
  
  const renderSelectedDateSymptoms = () => {
    const dateString = formatDateString(selectedDate);
    const dateSymptoms = symptoms[dateString] || [];
    
    if (dateSymptoms.length === 0) {
      return (
        <View style={styles.noSymptomsContainer}>
          <Text style={styles.noSymptomsText}>No symptoms logged for this day</Text>
          <TouchableOpacity 
            style={styles.addSymptomButton}
            onPress={() => router.push('/log-symptoms')}
          >
            <Plus size={20} color="#FF6B8B" />
            <Text style={styles.addSymptomText}>Add Symptoms</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.symptomsListContainer}>
        <View style={styles.symptomsHeader}>
          <Text style={styles.symptomsTitle}>Symptoms</Text>
          <TouchableOpacity onPress={() => router.push('/log-symptoms')}>
            <Plus size={20} color="#FF6B8B" />
          </TouchableOpacity>
        </View>
        {dateSymptoms.map((symptom, index) => (
          <View key={index} style={styles.symptomItem}>
            <View style={styles.symptomDotLarge} />
            <Text style={styles.symptomText}>{symptom}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>
      
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthNavButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.monthNavButton}>
          <ChevronRight size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarContainer}>
        <View style={styles.weekDaysRow}>
          {renderWeekDays()}
        </View>
        {renderCalendarGrid()}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B8B' }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#81C784' }]} />
          <Text style={styles.legendText}>Fertile Window</Text>
        </View>
      </View>
      
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>
      
      <ScrollView style={styles.symptomsContainer}>
        {renderSelectedDateSymptoms()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthNavButton: {
    padding: 5,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarContainer: {
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 2,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: '#999',
  },
  todayCell: {
    backgroundColor: '#F0F0F0',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: '#FF6B8B',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  periodDayText: {
    fontWeight: '500',
  },
  symptomDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  selectedDateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  symptomsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noSymptomsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noSymptomsText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  addSymptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addSymptomText: {
    marginLeft: 5,
    color: '#FF6B8B',
    fontWeight: '500',
  },
  symptomsListContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  symptomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  symptomDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B8B',
    marginRight: 10,
  },
  symptomText: {
    fontSize: 16,
    color: '#555',
  },
});