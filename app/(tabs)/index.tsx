import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category, Destination, fetchCategories, fetchDestinations, fetchTours, Tour } from '../../services/tourApi';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedTours, fetchedDests, fetchedCats] = await Promise.all([
          fetchTours(),
          fetchDestinations(),
          fetchCategories()
        ]);
        setTours(fetchedTours);
        setDestinations(fetchedDests);
        setCategories(fetchedCats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003580" />
        <Text style={styles.loadingText}>Fiyatlar aranıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003580" />
      
      {/* Booking.com Style Header & Search */}
      <View style={styles.topBlueHeader}>
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          {/* Logo & Icons */}
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>Tourkia.com</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconBtn}><FontAwesome name="bell-o" size={20} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><FontAwesome name="user-o" size={20} color="#fff" /></TouchableOpacity>
            </View>
          </View>

          {/* Service Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'tours' && styles.tabItemActive]} onPress={() => setActiveTab('tours')}>
              <FontAwesome name="globe" size={16} color={activeTab === 'tours' ? '#fff' : '#bbccdd'} />
              <Text style={[styles.tabText, activeTab === 'tours' && styles.tabTextActive]}>Turlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'hotels' && styles.tabItemActive]} onPress={() => setActiveTab('hotels')}>
              <FontAwesome name="bed" size={16} color={activeTab === 'hotels' ? '#fff' : '#bbccdd'} />
              <Text style={[styles.tabText, activeTab === 'hotels' && styles.tabTextActive]}>Konaklama</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'flights' && styles.tabItemActive]} onPress={() => setActiveTab('flights')}>
              <FontAwesome name="plane" size={16} color={activeTab === 'flights' ? '#fff' : '#bbccdd'} />
              <Text style={[styles.tabText, activeTab === 'flights' && styles.tabTextActive]}>Uçuşlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'taxi' && styles.tabItemActive]} onPress={() => setActiveTab('taxi')}>
              <FontAwesome name="car" size={16} color={activeTab === 'taxi' ? '#fff' : '#bbccdd'} />
              <Text style={[styles.tabText, activeTab === 'taxi' && styles.tabTextActive]}>Havalimanı Taksi</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Massive Booking Style Search Form */}
        <View style={styles.searchFormWrapper}>
          <View style={styles.searchForm}>
            {/* Destination */}
            <TouchableOpacity style={styles.formRow}>
              <FontAwesome name="search" size={20} color="#333" style={styles.formIcon} />
              <Text style={styles.formTextActive}>Kapadokya, Nevşehir</Text>
            </TouchableOpacity>
            <View style={styles.formDivider} />
            
            {/* Dates */}
            <TouchableOpacity style={styles.formRow}>
              <FontAwesome name="calendar-o" size={20} color="#333" style={styles.formIcon} />
              <Text style={styles.formText}>15 Eyl Paz - 18 Eyl Çar</Text>
            </TouchableOpacity>
            <View style={styles.formDivider} />
            
            {/* Guests */}
            <TouchableOpacity style={styles.formRow}>
              <FontAwesome name="user-o" size={20} color="#333" style={styles.formIcon} />
              <Text style={styles.formText}>2 yetişkin · 0 çocuk · 1 oda</Text>
            </TouchableOpacity>

            {/* Giant Yellow Search Button */}
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Ara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel More For Less (Genius Box Equivalent) */}
        <View style={styles.geniusBox}>
          <View style={styles.geniusContent}>
            <Text style={styles.geniusTitle}>Gezdikçe Kazanın 💎</Text>
            <Text style={styles.geniusDesc}>Tourkia Diamond programı ile seçili turlarda ve otellerde %15'e varan indirim yakalayın.</Text>
          </View>
          <FontAwesome name="diamond" size={48} color="#fbb117" style={{ opacity: 0.8 }} />
        </View>

        {/* Categories as Destinations/Features */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trend Kategoriler</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.bookingCatPill}>
              <Text style={styles.bookingCatPillText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>



        {/* Tours / Accommodations Box */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sizin için önerilen turlar</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toursScroll}>
          {tours.map(tour => (
            <TouchableOpacity key={tour.id} style={styles.bookingTourCard} activeOpacity={0.9} onPress={() => router.push(`/tour/${tour.id}`)}>
              <View style={styles.tourImageContainer}>
                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                <TouchableOpacity style={styles.heartButton}>
                  <FontAwesome name="heart-o" size={18} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.tourContent}>
                <View style={styles.tourHeaderRow}>
                  <Text style={styles.tourTitle} numberOfLines={2}>{tour.title}</Text>
                  <View style={styles.ratingBadgeBooking}>
                    <Text style={styles.ratingTextBooking}>{tour.rating}</Text>
                  </View>
                </View>

                <Text style={styles.tourDuration}>{tour.duration} • Harika deneyim</Text>
                
                {tour.badge && (
                  <Text style={styles.earlyBirdText}>{tour.badge}</Text>
                )}

                <View style={styles.tourFooter}>
                  <Text style={styles.tourPriceLabel}>1 gece, 2 yetişkin</Text>
                  <Text style={styles.tourPrice}>₺{tour.price.toLocaleString('tr-TR')}</Text>
                  <Text style={styles.priceSubText}>Vergiler ve ücretler dahildir</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '700', color: '#003580' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  
  topBlueHeader: { backgroundColor: '#003580', paddingBottom: 60 /* Forms overlap this */ },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  headerIcons: { flexDirection: 'row', gap: 20 },
  iconBtn: { padding: 4 },
  
  tabsScroll: { paddingHorizontal: 20, marginBottom: 10 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  tabItemActive: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: '#fff' },
  tabText: { color: '#bbccdd', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  tabTextActive: { color: '#fff', fontWeight: '800' },

  mainScroll: { flex: 1, marginTop: -40 /* Bring up to overlap header */ },
  
  searchFormWrapper: { paddingHorizontal: 16, marginBottom: 24 },
  searchForm: { backgroundColor: '#febb02', padding: 4, borderRadius: 8, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  formRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 50, borderRadius: 4 },
  formDivider: { height: 1, backgroundColor: '#febb02' },
  formIcon: { width: 24, marginRight: 12 },
  formTextActive: { fontSize: 16, fontWeight: '800', color: '#333' },
  formText: { fontSize: 16, fontWeight: '500', color: '#666' },
  searchButton: { backgroundColor: '#0071c2', height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  searchButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  geniusBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 16, padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#e6e6e6' },
  geniusContent: { flex: 1, paddingRight: 16 },
  geniusTitle: { fontSize: 16, fontWeight: '900', color: '#000', marginBottom: 6 },
  geniusDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  sectionHeader: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#000' },
  sectionSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  categoryScroll: { paddingHorizontal: 16, gap: 10, marginBottom: 32 },
  bookingCatPill: { borderWidth: 1, borderColor: '#0071c2', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff' },
  bookingCatPillText: { fontSize: 14, fontWeight: '700', color: '#0071c2' },

  destScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 32 },
  bookingDestCard: { width: 140, height: 140, borderRadius: 8, overflow: 'hidden' },
  bookingDestImage: { width: '100%', height: '100%' },
  bookingDestOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  bookingDestName: { position: 'absolute', top: 12, left: 12, color: '#fff', fontSize: 16, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },

  toursScroll: { paddingHorizontal: 16, gap: 16, marginBottom: 20 },
  bookingTourCard: { width: 300, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e6e6e6', paddingBottom: 16 },
  tourImageContainer: { position: 'relative', width: '100%', height: 200 },
  tourImage: { width: '100%', height: '100%' },
  heartButton: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  
  tourContent: { padding: 12 },
  tourHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  tourTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#000', marginRight: 12 },
  ratingBadgeBooking: { backgroundColor: '#003580', paddingHorizontal: 6, paddingVertical: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  ratingTextBooking: { color: '#fff', fontSize: 14, fontWeight: '800' },
  
  tourDuration: { fontSize: 12, color: '#0071c2', fontWeight: '700', marginBottom: 8 },
  earlyBirdText: { alignSelf: 'flex-start', backgroundColor: '#e2f4ea', color: '#0d652d', fontSize: 12, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 16 },
  
  tourFooter: { alignItems: 'flex-end', marginTop: 8 },
  tourPriceLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  tourPrice: { fontSize: 20, fontWeight: '900', color: '#000' },
  priceSubText: { fontSize: 12, color: '#666', marginTop: 2 }
});
