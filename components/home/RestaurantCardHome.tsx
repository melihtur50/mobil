import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Restaurant } from '../../services/tourApi';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedButton } from '../common/AnimatedButton';
import { useRouter } from 'expo-router';

interface RestaurantCardHomeProps {
  restaurant: Restaurant;
}

export const RestaurantCardHome: React.FC<RestaurantCardHomeProps> = ({ restaurant }) => {
  const router = useRouter();

  return (
    <AnimatedButton 
      style={styles.card} 
      onPress={() => router.push('/lezzet')}
      haptic="light"
    >
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <View style={styles.row}>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          <View style={styles.dot} />
          <View style={styles.ratingBox}>
            <FontAwesome name="star" size={10} color={Colors.light.secondary} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
        <View style={styles.footer}>
           <Text style={styles.discountText}>%{restaurant.tourkiaDiscount} İndirim</Text>
           <FontAwesome name="chevron-right" size={10} color={Colors.light.primary} />
        </View>
      </View>
    </AnimatedButton>
  );
};

const styles = StyleSheet.create({
  card: { 
    width: 180, 
    backgroundColor: '#fff', 
    borderRadius: BorderRadius.lg, 
    marginRight: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden'
  },
  image: { width: '100%', height: 100 },
  content: { padding: Spacing.sm },
  name: { fontSize: 14, fontWeight: '800', color: Colors.light.primary, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cuisine: { fontSize: 10, color: Colors.light.textMuted, fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.light.border, marginHorizontal: 6 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 10, fontWeight: '800', color: Colors.light.primary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.light.background, paddingTop: 8 },
  discountText: { fontSize: 11, fontWeight: '900', color: Colors.light.success },
});
