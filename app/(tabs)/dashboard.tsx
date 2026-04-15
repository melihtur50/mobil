import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardTab() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <FontAwesome name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Genel Bakış</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Metric Cards - Yatay Kaydırılabilir */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsScroll} snapToInterval={280} decelerationRate="fast">
            
            {/* Toplam Satış */}
            <View style={[styles.metricCard, { borderLeftColor: '#10b981', borderLeftWidth: 4 }]}>
                <View style={styles.metricRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#d1fae5' }]}>
                        <FontAwesome name="dollar" size={18} color="#10b981" />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricTitle}>TOPLAM SATIŞ</Text>
                        <Text style={styles.metricValue}>₺145.500,00</Text>
                    </View>
                </View>
            </View>

            {/* Aktif İşlemler */}
            <View style={[styles.metricCard, { borderLeftColor: '#3b82f6', borderLeftWidth: 4 }]}>
                <View style={styles.metricRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#dbeafe' }]}>
                        <FontAwesome name="calendar" size={18} color="#3b82f6" />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricTitle}>AKTİF İŞLEMLER</Text>
                        <Text style={styles.metricValue}>34</Text>
                    </View>
                </View>
            </View>

            {/* Bekleyen Hakediş */}
            <View style={[styles.metricCard, { borderLeftColor: '#f59e0b', borderLeftWidth: 4 }]}>
                <View style={styles.metricRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
                        <FontAwesome name="clock-o" size={18} color="#f59e0b" />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricTitle}>BEKLEYEN HAKEDİŞ (₺)</Text>
                        <Text style={styles.metricValue}>₺29.100,00</Text>
                    </View>
                </View>
            </View>
            
        </ScrollView>

        {/* Son İşlemler Card (Masaüstü Tablosunun Mobil Versiyonu) */}
        <View style={styles.tableCard}>
            <View style={styles.tableCardHeader}>
                <Text style={styles.tableCardTitle}>Son İşlemler</Text>
                <TouchableOpacity>
                    <Text style={styles.tableCardAction}>Tümünü Gör ➝</Text>
                </TouchableOpacity>
            </View>

            {/* Item 1 */}
            <View style={styles.listItem}>
                <View style={styles.listItemTop}>
                    <Text style={styles.listCustomer}>Ahmet Yılmaz</Text>
                    <View style={styles.badgeSuccess}>
                        <Text style={styles.badgeSuccessText}>ÖDENDİ</Text>
                    </View>
                </View>
                <Text style={styles.listTour}>Kapadokya Balon Turu</Text>
                <Text style={styles.listPrice}>₺3.400,00</Text>
            </View>

            <View style={styles.divider} />

            {/* Item 2 */}
            <View style={styles.listItem}>
                <View style={styles.listItemTop}>
                    <Text style={styles.listCustomer}>Ayşe Kaya</Text>
                    <View style={styles.badgeWarning}>
                        <Text style={styles.badgeWarningText}>TAMAMLANDI</Text>
                    </View>
                </View>
                <Text style={styles.listTour}>Büyük İtalya Turu</Text>
                <Text style={styles.listPrice}>₺18.150,00</Text>
            </View>
            
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f6', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { padding: 8, marginLeft: -8 },
  headerBarTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  scrollContent: { paddingVertical: 24, paddingBottom: 100 },
  
  metricsScroll: { paddingHorizontal: 20, gap: 16, paddingRight: 40 },
  metricCard: { width: 260, backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  metricRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  metricInfo: { flex: 1 },
  metricTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },

  tableCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 24, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  tableCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tableCardTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  tableCardAction: { fontSize: 13, fontWeight: '700', color: '#3b82f6' },

  listItem: { paddingVertical: 12 },
  listItemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  listCustomer: { fontSize: 15, fontWeight: '800', color: '#334155' },
  listTour: { fontSize: 14, fontWeight: '500', color: '#64748b', marginBottom: 4 },
  listPrice: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  
  badgeSuccess: { backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeSuccessText: { fontSize: 11, fontWeight: '800', color: '#059669', letterSpacing: 0.5 },
  
  badgeWarning: { backgroundColor: '#ffedd5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeWarningText: { fontSize: 11, fontWeight: '800', color: '#ea580c', letterSpacing: 0.5 },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 }
});
