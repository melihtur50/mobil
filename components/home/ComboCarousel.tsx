import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Tour, getDisplayPrice, formatPriceWithContext } from '../../services/tourApi';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedButton } from '../common/AnimatedButton';
import { useAppContext } from '../../context/AppContext';

interface ComboCarouselProps {
  tours: Tour[];
  onComboSelect: (tour: Tour) => void;
  loading?: boolean;
}

const ComboCard = ({ tour, index, onComboSelect, currency, language }: any) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                delay: index * 150,
                useNativeDriver: true,
            })
        ]).start();
    }, [index]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <AnimatedButton 
                style={styles.card}
                onPress={() => onComboSelect(tour)}
                haptic="heavy"
            >
                <Image source={{ uri: tour.image }} style={styles.image} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.overlay}>
                    <View style={styles.priceTag}>
                        <Text style={styles.priceText}>{formatPriceWithContext(getDisplayPrice(tour.price, tour.currency || 'TRY', currency).amount, currency, language)}</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{tour.title}</Text>
                    <View style={styles.includedRow}>
                        <View style={styles.pill}>
                            <FontAwesome name="map-marker" size={10} color="#fff" />
                            <Text style={styles.pillText}>TUR</Text>
                        </View>
                        <Text style={styles.plus}>+</Text>
                        <View style={[styles.pill, { backgroundColor: Colors.light.secondary }]}>
                            <FontAwesome name="cutlery" size={10} color={Colors.light.primary} />
                            <Text style={[styles.pillText, { color: Colors.light.primary }]}>YEMEK</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>%15 İNDİRİM</Text>
                </View>
            </AnimatedButton>
        </Animated.View>
    );
};

export const ComboCarousel: React.FC<ComboCarouselProps> = ({ tours, onComboSelect, loading }) => {
  const { currency, language, t } = useAppContext();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <View style={{ width: 150, height: 20, backgroundColor: '#eee', borderRadius: 4 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {[1, 2].map(i => (
             <View key={'combo-s-'+i} style={[styles.card, { backgroundColor: '#f5f5f5' }]} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{t('combo_deals')} 🔥</Text>
          <Text style={styles.sectionSubtitle}>{t('combo_subtitle')}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tours.filter(tour => tour.price > 1000).slice(0, 4).map((tour, index) => (
            <ComboCard 
                key={'combo-'+tour.id} 
                tour={tour} 
                index={index} 
                onComboSelect={onComboSelect}
                currency={currency}
                language={language}
            />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.xl },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: Spacing.lg, 
    marginBottom: Spacing.md 
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: Colors.light.primary },
  sectionSubtitle: { fontSize: 13, color: Colors.light.textMuted, marginTop: 2 },
  viewAll: { color: Colors.light.secondary, fontWeight: '800', fontSize: 14 },
  scrollContent: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: 10 },
  card: { 
    width: 300, 
    height: 200, 
    borderRadius: BorderRadius.xxl, 
    overflow: 'hidden', 
    backgroundColor: '#eee', 
    ...Shadows.lg 
  },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: Spacing.lg },
  priceTag: { 
    backgroundColor: Colors.light.secondary, 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: BorderRadius.sm, 
    marginBottom: 8 
  },
  priceText: { fontSize: 13, fontWeight: '900', color: Colors.light.primary },
  title: { color: '#fff', fontSize: 20, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  includedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.xs },
  pillText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  plus: { color: '#fff', fontSize: 16, fontWeight: '400', opacity: 0.6 },
  discountBadge: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    backgroundColor: Colors.light.accent, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: BorderRadius.sm,
    transform: [{ rotate: '5deg' }]
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '900' },
});
