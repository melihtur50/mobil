import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function UpsellScreen() {
  const { id, date } = useLocalSearchParams();
  const router = useRouter();

  const handleNoThanks = () => {
    router.push(`/checkout/${id}?date=${date}&hasMeal=false`);
  };

  const handleAddMeal = () => {
    router.push(`/checkout/${id}?date=${date}&hasMeal=true`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gününüzü Lezzetle Taçlandırın! 🍽️</Text>
          <Text style={styles.headerSubtitle}>Tur sonrası size en yakın partner restoranımızda masanız şimdiden hazır.</Text>
        </View>

        {/* Restaurant Card */}
        <View style={styles.restCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80' }} 
            style={styles.restImage} 
          />
          <View style={styles.restContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>%15 PAKET İNDİRİMİ</Text>
            </View>
            <Text style={styles.restName}>Tourkia Anadolu Mutfağı</Text>
            <Text style={styles.restMenuTitle}>Geleneksel Testi Kebabı Menüsü</Text>
            
            <View style={styles.menuItems}>
              <View style={styles.menuItem}>
                <FontAwesome name="check-circle" size={16} color="#10b981" />
                <Text style={styles.menuItemText}>Özel Terbiye Testi Kebabı</Text>
              </View>
              <View style={styles.menuItem}>
                <FontAwesome name="check-circle" size={16} color="#10b981" />
                <Text style={styles.menuItemText}>Yöresel Mezeler & Salata</Text>
              </View>
              <View style={styles.menuItem}>
                <FontAwesome name="check-circle" size={16} color="#10b981" />
                <Text style={styles.menuItemText}>Sınırsız Meşrubat & Süzme Çay</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.oldPrice}>₺850</Text>
              <Text style={styles.newPrice}>₺550 <Text style={styles.priceSub}>/ Kişi Başı</Text></Text>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefits}>
           <View style={styles.benefitItem}>
              <FontAwesome name="lock" size={20} color="#0071c2" />
              <Text style={styles.benefitText}>Sabit Fiyat Garantisi</Text>
           </View>
           <View style={styles.benefitItem}>
              <FontAwesome name="star" size={20} color="#0071c2" />
              <Text style={styles.benefitText}>Öncelikli Rezervasyon</Text>
           </View>
        </View>

      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddMeal}>
          <LinearGradient 
            colors={['#0071c2', '#005594']} 
            style={styles.gradientBtn}
          >
            <Text style={styles.addBtnText}>Yemeği Sepete Ekle (+₺550)</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleNoThanks}>
          <Text style={styles.skipBtnText}>Hayır, Teşekkürler (Sadece Turu Al)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24, paddingBottom: 120 },
  header: { marginBottom: 32, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 12 },
  headerSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  
  restCard: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  restImage: { width: '100%', height: 200 },
  restContent: { padding: 20 },
  badge: { backgroundColor: '#dcfce7', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: '#16a34a', fontSize: 11, fontWeight: '900' },
  restName: { fontSize: 14, color: '#64748b', fontWeight: '800', marginBottom: 4 },
  restMenuTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
  
  menuItems: { gap: 10, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuItemText: { fontSize: 14, color: '#334155', fontWeight: '600' },
  
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  oldPrice: { fontSize: 18, color: '#94a3b8', textDecorationLine: 'line-through' },
  newPrice: { fontSize: 26, fontWeight: '900', color: '#0071c2' },
  priceSub: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  
  benefits: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 40 },
  benefitItem: { alignItems: 'center', gap: 8 },
  benefitText: { fontSize: 12, fontWeight: '700', color: '#334155' },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  addBtn: { width: '100%', height: 60, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  skipBtn: { width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' },
  skipBtnText: { color: '#64748b', fontSize: 14, fontWeight: '700' }
});
