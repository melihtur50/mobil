import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTours, Tour } from '../services/tourApi';

export default function VipPrivilegesScreen() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    fetchTours().then(setTours);
  }, []);

  // Sadece VIP Privilege'ı olanları filtrele (Mock)
  const vipBusinesses = tours.filter(t => t.vipPerks && t.vipPerks.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VIP Ayrıcalıklarım 💎</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Intro Card */}
        <View style={styles.introCard}>
           <Text style={styles.introTitle}>Platinum Üyeliğiniz Aktif!</Text>
           <Text style={styles.introText}>
             Tourkia VIP üyesi olarak anlaşmalı olduğumuz tüm acenta ve restoranlarda 
             aşağıdaki ekstra ayrıcalıklardan ücretsiz faydalanabilirsiniz.
           </Text>
        </View>

        <Text style={styles.sectionTitle}>Aktif VIP Ayrıcalıkları</Text>
        
        {vipBusinesses.map((biz) => (
          <View key={biz.id} style={styles.perkCard}>
            <View style={styles.perkHeader}>
              <Text style={styles.bizName}>{biz.agencyName || 'Partner İşletme'}</Text>
              <View style={styles.bizBadge}>
                <Text style={styles.bizBadgeText}>DOĞRULANMIŞ</Text>
              </View>
            </View>
            <Text style={styles.tourTitle}>{biz.title}</Text>
            
            <View style={styles.perksList}>
              {biz.vipPerks?.map((perk, idx) => (
                <View key={idx} style={styles.perkItem}>
                  <View style={styles.perkIconBox}>
                    <FontAwesome name="star" size={14} color="#f59e0b" />
                  </View>
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
              
              {/* Standart VIP Perks add-ons */}
              <View style={styles.perkItem}>
                  <View style={styles.perkIconBox}>
                    <FontAwesome name="coffee" size={12} color="#f59e0b" />
                  </View>
                  <Text style={styles.perkText}>Ücretsiz Karşılama İçeceği</Text>
              </View>
              <View style={styles.perkItem}>
                  <View style={styles.perkIconBox}>
                    <FontAwesome name="calendar-check-o" size={12} color="#f59e0b" />
                  </View>
                  <Text style={styles.perkText}>Restoranda En İyi Masa Rezervasyonu</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => router.push(`/tour/${biz.id}`)}
            >
              <Text style={styles.actionBtnText}>Detaylı Bilgi & Rezervasyon</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.infoBox}>
           <FontAwesome name="info-circle" size={16} color="#64748b" />
           <Text style={styles.infoBoxText}>
             Bu ayrıcalıklardan faydalanmak için işletmeye giriş yaparken VIP Dijital Kartınızı göstermeniz yeterlidir.
           </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    height: 100, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  
  scrollContent: { padding: 24 },
  
  introCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  introTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
  introText: { fontSize: 14, color: '#64748b', lineHeight: 22 },
  
  sectionTitle: { fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1 },
  
  perkCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  perkHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bizName: { fontSize: 12, color: '#0071c2', fontWeight: '800' },
  bizBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  bizBadgeText: { fontSize: 9, color: '#10b981', fontWeight: '900' },
  tourTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
  
  perksList: { gap: 12, marginBottom: 20 },
  perkItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fef3c7' },
  perkText: { fontSize: 14, color: '#334155', fontWeight: '700' },
  
  actionBtn: { width: '100%', height: 48, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#0071c2', fontSize: 14, fontWeight: '800' },
  
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#f1f5f9', padding: 16, borderRadius: 16, marginTop: 20 },
  infoBoxText: { flex: 1, fontSize: 12, color: '#64748b', lineHeight: 18, fontWeight: '500' }
});
