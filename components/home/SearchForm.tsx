import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Tour } from '../../services/tourApi';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedButton } from '../common/AnimatedButton';
import { useAppContext } from '../../context/AppContext';

interface SearchFormProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  filteredTours: Tour[];
  tours: Tour[];
  searchDate: Date;
  setDatePickerVisible: (visible: boolean) => void;
  adults: number;
  children: number;
  setGuestPickerVisible: (visible: boolean) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchText,
  setSearchText,
  searchFocused,
  setSearchFocused,
  filteredTours,
  tours,
  searchDate,
  setDatePickerVisible,
  adults,
  children,
  setGuestPickerVisible,
}) => {
  const router = useRouter();
  const { t } = useAppContext();
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        {/* Destination Search */}
        <View style={styles.inputGroup}>
          <FontAwesome name="map-marker" size={18} color={Colors.light.secondary} style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder={t('search_placeholder')}
            placeholderTextColor={Colors.light.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setSearchFocused(true)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <FontAwesome name="times-circle" size={18} color={Colors.light.border} />
            </TouchableOpacity>
          )}
        </View>

        {searchFocused && (
          <View style={styles.dropdown}>
            {searchText.length === 0 ? (
              <View style={styles.suggestions}>
                <Text style={styles.dropdownTitle}>POPÜLER ROTALAR</Text>
                <View style={styles.tagList}>
                  {['Kapadokya', 'Antalya', 'Fethiye', 'Efes'].map(tag => (
                    <AnimatedButton key={tag} style={styles.tag} onPress={() => {setSearchText(tag); setSearchFocused(false);}} haptic="light">
                      <Text style={styles.tagText}>{tag}</Text>
                    </AnimatedButton>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.results}>
                {filteredTours.slice(0, 5).map(tour => (
                  <TouchableOpacity key={tour.id} style={styles.resultItem} onPress={() => { router.push(`/tour/${tour.id}`); setSearchFocused(false); }}>
                    <FontAwesome name="search" size={12} color={Colors.light.textMuted} />
                    <Text style={styles.resultText}>{tour.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Date & Guests Row */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.inputGroup, { flex: 1.2 }]} onPress={() => setDatePickerVisible(true)}>
            <FontAwesome name="calendar" size={18} color={Colors.light.secondary} style={styles.icon} />
            <Text style={styles.inputText}>
              {searchDate.getDate()} {monthNames[searchDate.getMonth()]}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.inputGroup, { flex: 1 }]} onPress={() => setGuestPickerVisible(true)}>
            <FontAwesome name="users" size={18} color={Colors.light.secondary} style={styles.icon} />
            <Text style={styles.inputText}>{adults + children} Kişi</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <AnimatedButton 
          style={styles.searchButton} 
          onPress={() => setSearchFocused(false)}
          haptic="heavy"
        >
          <Text style={styles.searchButtonText}>{t('discover_tours')}</Text>
          <FontAwesome name="arrow-right" size={14} color={Colors.light.primary} />
        </AnimatedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  formCard: { 
    backgroundColor: '#fff', 
    borderRadius: BorderRadius.xl, 
    padding: Spacing.sm,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 56, 
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    margin: 4,
  },
  icon: { marginRight: 12, width: 20, textAlign: 'center' },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.light.primary },
  inputText: { fontSize: 15, fontWeight: '600', color: Colors.light.primary },
  row: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.05)' },
  
  dropdown: { backgroundColor: '#fff', padding: Spacing.md, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  suggestions: { marginBottom: Spacing.sm },
  dropdownTitle: { fontSize: 11, fontWeight: '800', color: Colors.light.textMuted, marginBottom: 12, letterSpacing: 1 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.md },
  tagText: { fontSize: 13, fontWeight: '700', color: Colors.light.primary },
  results: { gap: 4 },
  resultItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  resultText: { fontSize: 14, fontWeight: '600', color: Colors.light.primary },

  searchButton: { 
    backgroundColor: Colors.light.secondary, 
    height: 60, 
    borderRadius: BorderRadius.lg, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 4,
    gap: 12,
    margin: 4,
  },
  searchButtonText: { color: Colors.light.primary, fontSize: 16, fontWeight: '900' },
});
