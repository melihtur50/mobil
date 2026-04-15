import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function DashboardTab() {
  const menuItems = [
    { title: 'Rezervasyonlar', icon: 'check-square-o', color: '#0f172a' },
    { title: 'Turlarım', icon: 'globe', color: '#0f172a' },
    { title: 'Operasyon & Chat', icon: 'comments-o', color: '#f59e0b' },
    { title: 'Hızlı Rezerv.', icon: 'plus', color: '#0f172a' },
    { title: 'Finans & Fatura', icon: 'money', color: '#0f172a' },
    { title: 'B2B Kampanyalar', icon: 'star-o', color: '#0f172a' },
    { title: 'Acenta Bilgileri', icon: 'user-o', color: '#0f172a' },
    { title: 'Blog Yönetimi', icon: 'edit', color: '#4f46e5' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Genel Bakış</Text>
            <Text style={styles.headerSubtitle}>Acenta Yönetim Paneli</Text>
        </View>

        {/* Toplam Satış Card */}
        <View style={styles.revenueCard}>
            <View style={styles.revenueIconBox}>
                <FontAwesome name="dollar" size={24} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.revenueTitle}>TOPLAM SATIŞ</Text>
                <Text style={styles.revenueAmount}>₺145.500,00</Text>
            </View>
        </View>

        {/* Son İşlemler */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>
        </View>
        <View style={styles.cardBlock}>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>MÜŞTERİ</Text>
            </View>
            <View style={styles.transactionRow}>
                <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>AY</Text>
                </View>
                <Text style={styles.transactionName}>Ahmet Yılmaz</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.transactionRow}>
                <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>AK</Text>
                </View>
                <Text style={styles.transactionName}>Ayşe Kaya</Text>
            </View>
        </View>

        {/* Menü Grid */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yönetim İşlemleri</Text>
        </View>
        <View style={styles.gridContainer}>
            {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.gridItem}>
                    <FontAwesome name={item.icon as any} size={22} color={item.color} style={{ marginBottom: 12 }} />
                    <Text style={styles.gridText}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  headerSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

  revenueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, marginBottom: 32 },
  revenueIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  revenueTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 4 },
  revenueAmount: { fontSize: 26, fontWeight: '900', color: '#0f172a' },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  cardBlock: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  tableHeader: { marginBottom: 16 },
  tableHeaderText: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 },
  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  avatarBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  transactionName: { fontSize: 15, fontWeight: '600', color: '#334155' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  gridText: { fontSize: 13, fontWeight: '700', color: '#334155', textAlign: 'center' }
});
