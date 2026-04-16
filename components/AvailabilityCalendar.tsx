import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TourAvailability } from '../services/tourApi';

interface Props {
  availabilities: TourAvailability[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function AvailabilityCalendar({ availabilities, selectedDate, onSelectDate }: Props) {
  if (!availabilities || availabilities.length === 0) {
    return <Text style={styles.noData}>Müsaitlik durumu henüz açılmadı.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {availabilities.map((item, index) => {
          const parts = item.date.split('-');
          const year = parts[0];
          const month = parts[1];
          const day = parts[2];
          const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
          const formattedDate = `${day} ${monthNames[parseInt(month) - 1]}`;
          
          const isDisabled = item.isClosed || item.capacity === 0;
          const isSelected = selectedDate === item.date;

          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayCard, 
                isDisabled && styles.dayCardDisabled,
                isSelected && styles.dayCardSelected
              ]}
              disabled={isDisabled}
              onPress={() => onSelectDate(item.date)}
            >
              <Text style={[styles.dayText, isDisabled && styles.textDisabled, isSelected && styles.textSelected]}>
                {formattedDate}
              </Text>
              
              {isDisabled ? (
                 <Text style={styles.fullStatus}>KAPALI / DOLU</Text>
              ) : (
                 <Text style={[styles.capacityText, isSelected && styles.capacitySelected]}>Son {item.capacity} yer</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  noData: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    paddingVertical: 10
  },
  dayCard: {
    width: 90,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayCardDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    elevation: 0,
    shadowOpacity: 0
  },
  dayCardSelected: {
    backgroundColor: '#0071c2',
    borderColor: '#0071c2',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981'
  },
  capacitySelected: {
    color: '#a7f3d0'
  },
  fullStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ef4444'
  },
  textDisabled: {
    color: '#94a3b8'
  },
  textSelected: {
    color: '#fff'
  }
});
