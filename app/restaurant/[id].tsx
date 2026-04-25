import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
} from 'react-native-reanimated';
import { ImmersiveMediaHeader } from '../../components/common/ImmersiveMediaHeader';
import { fetchRestaurants, Restaurant } from '../../services/tourApi';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/theme';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.5;

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useEffect(() => {
    const loadData = async () => {
      const all = await fetchRestaurants();
      const found = all.find(r => r.id === id) || all[0];
      setRestaurant(found);
    };
    loadData();
  }, [id]);

  if (!restaurant) return null;

  const mediaItems = [
    { 
      id: 'video-food', 
      type: 'video' as const, 
      url: 'https://player.vimeo.com/external/434045526.hd.mp4?s=69431497223e3e2b262d3a3f5f3e2a225e5e2e2e&profile_id=175' // Generic luxury food/ambiance
    },
    { id: 'img-main', type: 'image' as const, url: restaurant.image },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImmersiveMediaHeader media={mediaItems} scrollY={scrollY} />

      {/* Navigation */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtn}>
          <FontAwesome name="share" size={18} color={Colors.light.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: HEADER_HEIGHT - 60 }} />
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingBox}>
              <FontAwesome name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.tag}>
              <FontAwesome name="map-marker" size={12} color={Colors.light.secondary} />
              <Text style={styles.tagText}>{restaurant.distance} km</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Menü & Deneyim</Text>
          <Text style={styles.description}>
            Tourkia misafirlerine özel hazırlanan bu menüde, bölgenin en taze malzemeleriyle harmanlanmış geleneksel lezzetleri keşfedeceksiniz. {restaurant.name}, otantik atmosferiyle unutulmaz bir akşam yemeği vadediyor.
          </Text>

          <View style={styles.infoBox}>
            <FontAwesome name="clock-o" size={18} color={Colors.light.secondary} />
            <Text style={styles.infoText}>Hafta içi: 10:00 - 22:00 | Hafta sonu: 09:00 - 23:00</Text>
          </View>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`)}
          >
            <FontAwesome name="map" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Yol Tarifi Al</Text>
          </TouchableOpacity>
          
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { 
    position: 'absolute', 
    top: 40, 
    left: 20, 
    right: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    zIndex: 10 
  },
  circleBtn: { 
    width: 44, 
    height: 44, 
    backgroundColor: '#fff', 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...Shadows.md
  },
  content: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24, 
    minHeight: height - HEADER_HEIGHT + 60 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16 
  },
  name: { fontSize: 28, fontWeight: '900', color: Colors.light.primary, flex: 1 },
  ratingBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fffbeb', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12 
  },
  ratingText: { marginLeft: 4, fontWeight: '800', color: '#92400e' },
  tagRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  tag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12, 
    gap: 6 
  },
  tagText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.light.primary, marginBottom: 12 },
  description: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 24 },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f0f9ff', 
    padding: 16, 
    borderRadius: 16, 
    gap: 12,
    marginBottom: 32
  },
  infoText: { fontSize: 14, color: '#0369a1', fontWeight: '600', flex: 1 },
  actionBtn: { 
    backgroundColor: Colors.light.secondary, 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12 
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
