import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
  ActivityIndicator,
  Dimensions,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { setupRestaurantGeofencing } from '../../services/notificationService';

// ─── Mock data: Anlaşmalı restoranlar (gerçek API bağlantısına geçiş için burası güncellenir) ───
const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Cappadocia Sofra',
    cuisine: 'Türk Mutfağı',
    distance: 0.3,
    rating: 4.8,
    reviewCount: 212,
    address: 'Nevşehir Sok. No:5, Göreme',
    phone: '+905551112233',
    lat: 38.6431,
    lng: 34.8307,
    priceLevel: '₺₺',
    openNow: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=220&fit=crop',
    specialDish: 'Testi Kebabı',
    tourkiaDiscount: 15,
  },
  {
    id: '2',
    name: 'Lav Steakhouse',
    cuisine: 'Izgara & Et',
    distance: 0.7,
    rating: 4.6,
    reviewCount: 178,
    address: 'Merkez Cad. No:12, Ürgüp',
    phone: '+905554445566',
    lat: 38.6325,
    lng: 34.9147,
    priceLevel: '₺₺₺',
    openNow: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=220&fit=crop',
    specialDish: 'Kuzu Tandır',
    tourkiaDiscount: 10,
  },
  {
    id: '3',
    name: 'Panorama Café & Bistro',
    cuisine: 'Akdeniz & Fusion',
    distance: 1.2,
    rating: 4.5,
    reviewCount: 340,
    address: 'Balon Sok. No:3, Uçhisar',
    phone: '+905552223344',
    lat: 38.6254,
    lng: 34.8038,
    priceLevel: '₺₺',
    openNow: false,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=220&fit=crop',
    specialDish: 'Zeytinyağlı Tabak',
    tourkiaDiscount: 20,
  },
  {
    id: '4',
    name: 'Derinkuyu Meze Evi',
    cuisine: 'Meze & Rakı Sofrası',
    distance: 2.1,
    rating: 4.7,
    reviewCount: 95,
    address: 'Yeraltı Cad. No:8, Derinkuyu',
    phone: '+905557778899',
    lat: 38.3763,
    lng: 34.7339,
    priceLevel: '₺₺',
    openNow: true,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=220&fit=crop',
    specialDish: 'Kapadokya Mezesi',
    tourkiaDiscount: 12,
  },
  {
    id: '5',
    name: 'Silk Road Kitchen',
    cuisine: 'Orta Doğu & Türk',
    distance: 2.8,
    rating: 4.4,
    reviewCount: 127,
    address: 'İpek Yolu No:17, Avanos',
    phone: '+905553334455',
    lat: 38.7149,
    lng: 34.8457,
    priceLevel: '₺₺',
    openNow: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=220&fit=crop',
    specialDish: 'Mantu & Ayran',
    tourkiaDiscount: 18,
  },
];

type ViewMode = 'list' | 'map';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Yardımcı: Haversine Mesafe Hesaplama ──────────────────────────────────
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// ─── Harita görünümü ───
function MapCard({
  restaurants,
  userLat,
  userLng,
}: {
  restaurants: typeof MOCK_RESTAURANTS;
  userLat: number;
  userLng: number;
}) {
  const openMap = () => {
    const url = `https://www.google.com/maps/search/restaurant/@${userLat},${userLng},14z`;
    Linking.openURL(url);
  };

  // Static harita görsel (Tourkia partnerleri için özel koyu mavi pinler kullanıldı)
  // pt=lng,lat,pm2{color}{size}{content}
  // pm2bm (Blue Medium) markers for Tourkia Branding
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${userLng},${userLat}&z=13&l=map&size=600,350&lang=tr_TR&pt=${restaurants
    .slice(0, 8)
    .map((r) => `${r.lng},${r.lat},pm2bm`)
    .join('~')}~${userLng},${userLat},pm2wtm`; // Kullanıcı konumu beyaz pin

  return (
    <View style={mapStyles.container}>
      <TouchableOpacity onPress={openMap} activeOpacity={0.9} style={mapStyles.mapWrapper}>
        <Image
          source={{ uri: staticMapUrl }}
          style={mapStyles.mapImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,20,35,0.65)']}
          style={mapStyles.mapOverlay}
        />
        <View style={mapStyles.pinBadge}>
          <FontAwesome name="map-marker" size={14} color="#fff" />
          <Text style={mapStyles.pinBadgeText}>5KM Çapında {restaurants.length} Partner</Text>
        </View>
        <View style={mapStyles.openMapBtn}>
          <Text style={mapStyles.openMapBtnText}>📍 Google Maps'te Detaylı Gör</Text>
        </View>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={mapStyles.horizontalList}>
        {restaurants.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={mapStyles.miniCard}
            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`)}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4}}>
              <Image source={{uri: 'https://i.ibb.co/LhxKkX9/tourkia-favicon.png'}} style={{width: 14, height: 14}} />
              <Text style={mapStyles.miniName} numberOfLines={1}>{r.name}</Text>
            </View>
            <Text style={mapStyles.miniDist}>📍 {r.dist} km mesafe</Text>
            <View style={mapStyles.miniRating}>
              <FontAwesome name="star" size={10} color="#f59e0b" />
              <Text style={mapStyles.miniRatingText}>{r.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Restoran Kartı ───
function RestaurantCard({ item }: { item: any }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const openInMaps = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`);
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} resizeMode="cover" />
        <LinearGradient
          colors={['#f97316', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.specialMenuBadge}>
          <FontAwesome name="cutlery" size={10} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.specialMenuText}>Tourkia Özel Menü</Text>
        </LinearGradient>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>%{item.tourkiaDiscount}</Text>
          <Text style={styles.discountLabel}>İndirim</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={13} color="#f59e0b" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineText}>{item.cuisine}</Text>
          </View>
          <View style={styles.distancePill}>
            <FontAwesome name="map-marker" size={12} color="#008cb3" />
            <Text style={styles.distanceText}> {item.dist} km</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mapBtn} onPress={openInMaps}>
          <FontAwesome name="map" size={14} color="#008cb3" />
          <Text style={styles.mapBtnText}>Haritada Gör & Yol Tarifi</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Ana Ekran ───
export default function LezzetScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('En Yakın');
  const toggleAnim = useRef(new Animated.Value(0)).current;

  const FILTERS = ['En Yakın', 'En Yüksek Puan', 'Açık'];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('denied');
        setUserLocation({ lat: 38.6431, lng: 34.8307 });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setLocationStatus('granted');
    })();
  }, []);

  useEffect(() => {
    if (userLocation) {
      applyFilter(selectedFilter);
    }
  }, [selectedFilter, userLocation]);

  const applyFilter = (filter: string) => {
    if (!userLocation) return;

    // 1. Mesafe hesapla ve 5km ile filtrele
    let result = MOCK_RESTAURANTS.map(r => ({
      ...r,
      dist: calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng)
    })).filter(r => r.dist <= 5);

    // 2. Sırala
    if (filter === 'En Yakın') {
      result.sort((a, b) => a.dist - b.dist);
    } else if (filter === 'En Yüksek Puan') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filter === 'Açık') {
      result = result.filter((r) => r.openNow);
    }

    setFilteredRestaurants(result);

    // Geo-Push Geofencing kur
    if (result.length > 0) {
      setupRestaurantGeofencing(result);
    }
  };

  const switchMode = (mode: ViewMode) => {
    setViewMode(mode);
    Animated.spring(toggleAnim, {
      toValue: mode === 'list' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const toggleLeft = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, (SCREEN_WIDTH - 48) / 2],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008cb3" />

      <LinearGradient colors={['#005f80', '#008cb3']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>🍽️ Lezzet</Text>
            <Text style={styles.headerSubtitle}>5KM Çapındaki Partnerler</Text>
          </View>
          {locationStatus === 'granted' && (
            <View style={styles.gpsTag}>
              <FontAwesome name="check-circle" size={11} color="#10b981" />
              <Text style={styles.gpsTagText}>Canlı Konum</Text>
            </View>
          )}
        </View>

        <View style={styles.toggleContainer}>
          <Animated.View style={[styles.toggleSlider, { left: toggleLeft, width: (SCREEN_WIDTH - 52) / 2 }]} />
          <TouchableOpacity style={styles.toggleBtn} onPress={() => switchMode('list')}>
            <FontAwesome name="list" size={14} color={viewMode === 'list' ? '#008cb3' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Liste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleBtn} onPress={() => switchMode('map')}>
            <FontAwesome name="map" size={14} color={viewMode === 'map' ? '#008cb3' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Harita</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {locationStatus === 'loading' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#008cb3" />
          <Text style={styles.loadingText}>Restoranlar taranıyor…</Text>
        </View>
      ) : (
        <>
          {viewMode === 'list' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
              style={styles.filtersScrollView}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(f)}>
                  <Text style={[styles.filterChipText, selectedFilter === f && styles.filterChipTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {viewMode === 'list' ? (
            <FlatList
              data={filteredRestaurants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RestaurantCard item={item} />}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsCount}>{filteredRestaurants.length} Partner Restoran</Text>
                  <View style={styles.tourkiaBadge}>
                    <Text style={styles.tourkiaBadgeText}>5KM Filtresi Aktif</Text>
                  </View>
                </View>
              }
            />
          ) : (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {userLocation && (
                <MapCard
                  restaurants={filteredRestaurants}
                  userLat={userLocation.lat}
                  userLng={userLocation.lng}
                />
              )}
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Stil: Harita Bileşeni ───
const mapStyles = StyleSheet.create({
  container: { flex: 1 },
  mapWrapper: {
    height: 240,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  pinBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,140,179,0.9)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  pinBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  openMapBtn: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  openMapBtnText: { color: '#008cb3', fontSize: 13, fontWeight: '800' },
  horizontalList: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  miniCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  miniName: { fontSize: 12, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  miniDist: { fontSize: 11, color: '#64748b', marginBottom: 4 },
  miniRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  miniRatingText: { fontSize: 12, fontWeight: '700', color: '#f59e0b' },
});

// ─── Stil: Ana Ekran ───
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#cffafe',
    fontWeight: '600',
    marginTop: 2,
  },
  gpsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
  },
  gpsTagText: { fontSize: 11, color: '#10b981', fontWeight: '700' },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 2,
    position: 'relative',
    height: 44,
  },
  toggleSlider: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#008cb3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
  },
  toggleTextActive: { color: '#008cb3' },

  // Filtreler
  filtersScrollView: { maxHeight: 56 },
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#008cb3',
    borderColor: '#008cb3',
  },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterChipTextActive: { color: '#fff' },

  // Yükleniyor
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 15, color: '#64748b', fontWeight: '600' },

  // Liste
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  resultsCount: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  tourkiaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tourkiaBadgeText: { fontSize: 11, color: '#16a34a', fontWeight: '700' },

  // Kart
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: { height: 190, position: 'relative' },
  restaurantImage: { width: '100%', height: '100%' },

  // Tourkia Özel Menü Etiketi — Dinamik Overlay
  specialMenuBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  specialMenuText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  // İndirim rozeti
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  discountText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  discountLabel: { color: '#fecaca', fontSize: 9, fontWeight: '700' },

  // Açık/Kapalı
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  // Kart içerik
  cardContent: { padding: 14 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginRight: 8,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  reviewCount: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },

  cuisineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cuisineText: { fontSize: 12, color: '#008cb3', fontWeight: '700' },
  priceLevel: { fontSize: 14, fontWeight: '900', color: '#334155' },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: { flex: 1, fontSize: 12, color: '#64748b', fontWeight: '500' },
  distancePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: { fontSize: 11, color: '#475569', fontWeight: '700' },

  specialDishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
    gap: 4,
  },
  specialDishText: { fontSize: 12, color: '#92400e', fontWeight: '600' },
  specialDishName: { fontSize: 12, color: '#b45309', fontWeight: '800' },

  // Aksiyon butonları
  actionRow: { flexDirection: 'row', gap: 10 },
  mapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  mapBtnText: { fontSize: 13, fontWeight: '700', color: '#008cb3' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#008cb3',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 20,
  },
  callBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Harita modu liste
  mapListSection: { padding: 16 },
  mapListTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
  },
  mapListItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  mapListImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  mapListBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f97316',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  mapListBadgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  mapListInfo: { flex: 1 },
  mapListName: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  mapListCuisine: { fontSize: 11, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  mapListRow: { flexDirection: 'row', alignItems: 'center' },
  mapListRating: { fontSize: 11, color: '#f59e0b', fontWeight: '700' },
  mapListDist: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  mapListStatus: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mapListDiscount: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  mapListDiscountText: { color: '#fff', fontSize: 13, fontWeight: '900' },
});
