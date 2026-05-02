import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Tour, getDisplayPrice, formatCurrency, formatPriceWithContext } from '../../services/tourApi';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedButton } from '../common/AnimatedButton';
import { useAppContext } from '../../context/AppContext';

interface TourCardProps {
  tour: Tour;
  index?: number;
  style?: any;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, index = 0, style }) => {
  const router = useRouter();
  const { currency, language } = useAppContext();
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  
  // Entrance Animation
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
    
    Animated.spring(translateY, {
      toValue: 0,
      damping: 15,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const displayPrice = getDisplayPrice(tour.price, tour.currency || 'TRY', currency);
  const discountDisplayPrice = tour.discountPrice ? getDisplayPrice(tour.discountPrice, tour.currency || 'TRY', currency) : null;

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY }] }, style && { flex: 1 }]}>
      <AnimatedButton 
        style={[styles.card, style]} 
        onPress={() => router.push(`/tour/${tour.id}`)}
        haptic="medium"
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: tour.image }} style={styles.image} />
          
          {tour.isPremiumPartner && (
            <View style={styles.premiumBadge}>
              <FontAwesome name="bolt" size={10} color={Colors.light.secondary} />
              <Text style={styles.premiumText}>ÖZEL</Text>
            </View>
          )}

          <AnimatedButton style={styles.heartButton} haptic="light">
            <FontAwesome name="heart-o" size={16} color={Colors.light.primary} />
          </AnimatedButton>

          {tour.badge && (
            <View style={styles.floatingBadge}>
              <Text style={styles.floatingBadgeText}>{tour.badge}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.duration}><FontAwesome name="clock-o" size={12} /> {tour.duration}</Text>
            {tour.totalReviews && tour.totalReviews > 0 ? (
              <View style={styles.ratingBox}>
                <FontAwesome name="star" size={10} color={Colors.light.secondary} />
                <Text style={styles.ratingText}>{tour.rating}</Text>
              </View>
            ) : (
              <Text style={styles.newText}>YENİ</Text>
            )}
          </View>

          <Text 
            style={[
              styles.title, 
              language === 'zh' && { fontSize: 18 }
            ]} 
            numberOfLines={2}
            adjustsFontSizeToFit={language === 'ru'}
          >
            {tour.title}
          </Text>
          
          {tour.isVerifiedAgency && (
            <View style={styles.agencyBadge}>
              <FontAwesome name="check-circle" size={12} color={Colors.light.success} />
              <Text style={styles.agencyText}>{tour.agencyName || 'Doğrulanmış'}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              {discountDisplayPrice ? (
                <>
                  <Text style={styles.oldPrice} numberOfLines={1} adjustsFontSizeToFit>{formatPriceWithContext(displayPrice.amount, displayPrice.currency, language)}</Text>
                  <Text 
                    style={[styles.price, language === 'zh' && { fontSize: 20 }]} 
                    numberOfLines={1} 
                    adjustsFontSizeToFit
                  >
                    {formatPriceWithContext(discountDisplayPrice.amount, discountDisplayPrice.currency, language)}
                  </Text>
                </>
              ) : (
                <Text 
                  style={[styles.price, language === 'zh' && { fontSize: 20 }]} 
                  numberOfLines={1} 
                  adjustsFontSizeToFit
                >
                  {formatPriceWithContext(displayPrice.amount, displayPrice.currency, language)}
                </Text>
              )}
            </View>
            
            <View style={styles.goButton}>
              <FontAwesome name="chevron-right" size={12} color="#fff" />
            </View>
          </View>
        </View>

        {/* FOMO Banner */}
        {tour.lastBookedAt && (Date.now() - tour.lastBookedAt < 3600000) && (
            <View style={styles.fomoBanner}>
               <Text style={styles.fomoText}>🔥 Bu tura az önce rezervasyon yapıldı!</Text>
            </View>
        )}
      </AnimatedButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { 
    width: 260, 
    backgroundColor: '#fff', 
    borderRadius: BorderRadius.xl, 
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.md,
  },
  imageContainer: { position: 'relative', width: '100%', height: 160 },
  image: { width: '100%', height: '100%' },
  premiumBadge: { 
    position: 'absolute', 
    top: 12, 
    left: 12, 
    backgroundColor: 'rgba(0, 26, 51, 0.8)', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: BorderRadius.sm, 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 4
  },
  premiumText: { color: Colors.light.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heartButton: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  floatingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: BorderRadius.lg,
  },
  floatingBadgeText: { color: Colors.light.primary, fontSize: 10, fontWeight: '900' },
  
  content: { padding: Spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  duration: { fontSize: 11, color: Colors.light.textMuted, fontWeight: '600' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF9E5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#B08D00' },
  newText: { fontSize: 10, fontWeight: '900', color: Colors.light.secondary, letterSpacing: 0.5 },
  
  title: { fontSize: 16, fontWeight: '800', color: Colors.light.primary, marginBottom: 8 },
  agencyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  agencyText: { color: Colors.light.textMuted, fontSize: 11, fontWeight: '600' },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  priceContainer: { flex: 1, marginRight: 8, flexWrap: 'wrap' },
  oldPrice: { fontSize: 11, color: Colors.light.textMuted, textDecorationLine: 'line-through', marginBottom: 0 },
  price: { fontSize: 18, fontWeight: '900', color: Colors.light.primary },
  goButton: { width: 32, height: 32, backgroundColor: Colors.light.primary, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  
  fomoBanner: { backgroundColor: '#FFF1F1', paddingVertical: 6, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#FFE4E4' },
  fomoText: { fontSize: 10, color: '#D32F2F', fontWeight: '700' },
});
