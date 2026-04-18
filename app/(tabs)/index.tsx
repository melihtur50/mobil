import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { fetchCategories, fetchDestinations, fetchTours, fetchRestaurants, Tour, Category, Destination, Restaurant, subscribeTours } from '../../services/tourApi';
import ProfessionalDatePicker from '../../components/ProfessionalDatePicker';
import GuestPicker from '../../components/GuestPicker';
import { Skeleton } from '../../components/Skeleton';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

// Refactored Components
import { SearchHeader } from '../../components/home/SearchHeader';
import { SearchForm } from '../../components/home/SearchForm';
import { ComboCarousel } from '../../components/home/ComboCarousel';
import { TourCard } from '../../components/home/TourCard';
import { RestaurantCardHome } from '../../components/home/RestaurantCardHome';
import { QuickPreviewModal } from '../../components/home/QuickPreviewModal';
import { useAppContext } from '../../context/AppContext';

export default function HomeScreen() {
  const { t, language } = useAppContext();
  const [tours, setTours] = useState<Tour[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchDate, setSearchDate] = useState<Date>(new Date());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Modals Visibility
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [guestPickerVisible, setGuestPickerVisible] = useState(false);

  const filteredTours = tours.filter(tour => {
    const term = searchText.toLowerCase();
    const isSpecialKeyword = (term.includes('atv') || term.includes('balon') || term.includes('doğumu')) && tour.title.toLowerCase().includes('kapadokya');
    return tour.title.toLowerCase().includes(term) || (tour.slug || '').toLowerCase().includes(term) || isSpecialKeyword;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedTours, fetchedDests, fetchedCats, fetchedRests] = await Promise.all([
          fetchTours(),
          fetchDestinations(),
          fetchCategories(),
          fetchRestaurants()
        ]);
        setTours(fetchedTours);
        setDestinations(fetchedDests);
        setCategories(fetchedCats);
        setRestaurants(fetchedRests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const unsubscribe = subscribeTours(async () => {
        const updated = await fetchTours();
        setTours(updated);
    });
    return unsubscribe;
  }, []);

  const handleComboSelect = (tour: Tour) => {
    setSelectedTour(tour);
    setPreviewVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
      
      <SearchHeader />

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} bounces={false}>
        
        <SearchForm 
          searchText={searchText}
          setSearchText={setSearchText}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          filteredTours={filteredTours}
          tours={tours}
          searchDate={searchDate}
          setDatePickerVisible={setDatePickerVisible}
          adults={adults}
          children={children}
          setGuestPickerVisible={setGuestPickerVisible}
        />

        {loading ? (
          <View style={styles.skeletonContainer}>
            <View style={styles.sectionHeader}>
              <Skeleton width={180} height={20} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16, marginBottom: 24 }}>
              {[1, 2, 3].map(i => <Skeleton key={'s1-'+i} width={260} height={160} borderRadius={20} />)}
            </ScrollView>
            
            <View style={styles.sectionHeader}>
              <Skeleton width={150} height={20} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16, marginBottom: 24 }}>
              {[1, 2, 3].map(i => <Skeleton key={'s2-'+i} width={180} height={120} borderRadius={16} />)}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Skeleton width={200} height={20} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
              {[1, 2].map(i => <Skeleton key={'s3-'+i} width={300} height={180} borderRadius={20} />)}
            </ScrollView>
          </View>
        ) : (
          <>
            {/* 1. Turlar (Horizontal) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{language === 'tr' ? 'Popüler Turlar' : 'Popular Tours'}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {tours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} index={index} />
              ))}
            </ScrollView>

            {/* 2. Lezzetler (Horizontal) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{language === 'tr' ? 'Lezzet Durakları' : 'Gourmet Spots'}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {restaurants.map((rest) => (
                <RestaurantCardHome key={rest.id} restaurant={rest} />
              ))}
            </ScrollView>

            {/* 3. Tur + Lezzet (Horizontal) */}
            <ComboCarousel tours={tours} onComboSelect={handleComboSelect} />

            {/* Rest of the UI (Vertical) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{language === 'tr' ? 'Trend Kategoriler' : 'Trending Categories'}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.bookingCatPill}>
                  <Text style={styles.bookingCatPillText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('recommended_tours')}</Text>
            </View>
            <View style={styles.verticalList}>
               {tours.slice(1).map(tour => (
                 <TourCard key={'v-'+tour.id} tour={tour} style={{ width: '100%', marginRight: 0, marginBottom: Spacing.md }} />
               ))}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Shared Modals */}
      <QuickPreviewModal 
        visible={previewVisible} 
        onClose={() => setPreviewVisible(false)} 
        tour={selectedTour} 
      />

      <ProfessionalDatePicker 
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelectDate={(date) => setSearchDate(date)}
        initialDate={searchDate}
      />

      <GuestPicker 
        visible={guestPickerVisible}
        onClose={() => setGuestPickerVisible(false)}
        onConfirm={(a, c) => {
          setAdults(a);
          setChildren(c);
        }}
        initialAdults={adults}
        initialChildren={children}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  mainScroll: { flex: 1, marginTop: -40 },
  skeletonContainer: { marginTop: Spacing.md },
  sectionHeader: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.light.primary },
  categoryScroll: { paddingHorizontal: Spacing.md, gap: 10, marginBottom: Spacing.xl },
  bookingCatPill: { borderWidth: 1, borderColor: Colors.light.secondary, borderRadius: BorderRadius.full, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff' },
  bookingCatPillText: { fontSize: 13, fontWeight: '800', color: Colors.light.primary },
  horizontalScroll: { paddingHorizontal: Spacing.md, paddingBottom: 10, marginBottom: Spacing.lg },
  verticalList: { paddingHorizontal: Spacing.md },
});
