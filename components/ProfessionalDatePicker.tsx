import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ProfessionalDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function ProfessionalDatePicker({
  visible,
  onClose,
  onSelectDate,
  initialDate = new Date(),
}: ProfessionalDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectionMode, setSelectionMode] = useState<'calendar' | 'month' | 'year'>('calendar');

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const renderMonthPicker = () => (
    <View style={styles.pickerGrid}>
      {MONTHS.map((month, index) => (
        <TouchableOpacity 
          key={month} 
          style={[styles.pickerCell, currentMonth === index && styles.selectedPickerCell]}
          onPress={() => {
            setCurrentMonth(index);
            setSelectionMode('calendar');
          }}
        >
          <Text style={[styles.pickerText, currentMonth === index && styles.selectedPickerText]}>{month.substring(0, 3)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderYearPicker = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return (
      <View style={styles.pickerGrid}>
        {years.map((year) => (
          <TouchableOpacity 
            key={year} 
            style={[styles.pickerCell, currentYear === year && styles.selectedPickerCell]}
            onPress={() => {
              setCurrentYear(year);
              setSelectionMode('calendar');
            }}
          >
            <Text style={[styles.pickerText, currentYear === year && styles.selectedPickerText]}>{year}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCalendar = () => {
    const totalDays = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let i = 1; i <= totalDays; i++) {
        const isSelected = 
            selectedDate.getDate() === i && 
            selectedDate.getMonth() === currentMonth && 
            selectedDate.getFullYear() === currentYear;
            
        const isToday = 
            new Date().getDate() === i && 
            new Date().getMonth() === currentMonth && 
            new Date().getFullYear() === currentYear;

      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={[styles.dayCell, isSelected && styles.selectedDayCell]}
          onPress={() => {
            const newDate = new Date(currentYear, currentMonth, i);
            setSelectedDate(newDate);
          }}
        >
          {isToday && !isSelected && <View style={styles.todayDot} />}
          <Text style={[
            styles.dayText, 
            isSelected && styles.selectedDayText,
            isToday && !isSelected && styles.todayText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <LinearGradient
            colors={['#003580', '#005f9e']}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesome name="times" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tarih Seçimi</Text>
            <View style={{ width: 40 }} />
          </LinearGradient>

          {/* Quick Year/Month Selector Bar */}
          <View style={styles.selectorBar}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                <FontAwesome name="chevron-left" size={16} color="#003580" />
            </TouchableOpacity>
            
            <View style={styles.monthYearDisplay}>
                <TouchableOpacity onPress={() => setSelectionMode(selectionMode === 'month' ? 'calendar' : 'month')}>
                    <Text style={styles.monthText}>{MONTHS[currentMonth]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectionMode(selectionMode === 'year' ? 'calendar' : 'year')}>
                    <Text style={styles.yearText}>{currentYear}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                <FontAwesome name="chevron-right" size={16} color="#003580" />
            </TouchableOpacity>
          </View>

          {selectionMode === 'calendar' ? (
            <>
              <View style={styles.daysLabelsRow}>
                {DAYS.map(day => (
                  <Text key={day} style={styles.dayLabelText}>{day}</Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
            </>
          ) : selectionMode === 'month' ? (
            renderMonthPicker()
          ) : (
            renderYearPicker()
          )}

          {/* Bottom Summary & Confirm */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Seçili Tarih</Text>
                    <Text style={styles.summaryValue}>
                        {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={styles.confirmBtn}
                    onPress={() => {
                        onSelectDate(selectedDate);
                        onClose();
                    }}
                >
                    <Text style={styles.confirmBtnText}>Seç ve Onayla</Text>
                </TouchableOpacity>
            </View>
            {/* Alt tarafta fazladan boşluk bırakıyoruz */}
            <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthYearDisplay: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#003580',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  daysLabelsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dayLabelText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  dayCell: {
    width: (width - 20) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: '#003580',
    shadowColor: '#003580',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '800',
  },
  todayDot: {
    position: 'absolute',
    top: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#003580',
  },
  todayText: {
    color: '#003580',
    fontWeight: '800',
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40, 
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryBox: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  confirmBtn: {
    backgroundColor: '#febb02',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#febb02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003580',
  },

  // Picker Styles
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  pickerCell: {
    width: (width - 40) / 3,
    height: 48,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  selectedPickerCell: {
    backgroundColor: '#003580',
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  selectedPickerText: {
    color: '#fff',
  },
});
