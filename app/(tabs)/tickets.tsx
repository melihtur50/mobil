/**
 * tickets.tsx  —  Biletlerim Sekmesi
 * Tourkia Dijital Voucher Merkezi
 *
 * - Aktif / Geçmiş sekme geçişi
 * - Tur+Yemek paketi için çift QR kart (VoucherCard)
 * - Boş durum + Demo bilet oluşturma
 */

import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VoucherCard from '../../components/VoucherCard';
import {
  OfflineTicket,
  clearOfflineTickets,
  getOfflineTickets,
  saveTicketOffline,
} from '../../services/offlineStorage';
import { scheduleMealReminder } from '../../services/notificationService';
import { fetchTours } from '../../services/tourApi';

type TabType = 'active' | 'past';

// ─── Demo: Tur+Yemek paketi ile test bileti oluştur ─────────────────────────
async function seedDemoTickets() {
  const tours = await fetchTours();
  if (tours.length === 0) return;

  // Demo 1: Sadece Tur
  await saveTicketOffline(tours[0], 'Ahmet Yılmaz', 2, false);

  // Demo İçin: Şu andan 35 dakika sonra bitecek şekilde ayarla (ki 30dk kala tetiklensin)
  const now = new Date();
  const demoEndTime = new Date(now.getTime() + 35 * 60 * 1000); // 35 dk sonra bitiyor
  const demoStartTime = new Date(now.getTime() - 25 * 60 * 1000); // 25 dk önce başladı

  // Demo 2: Tur + Yemek paketi (çift QR)
  const mealTicket = await saveTicketOffline(
    tours[1 % tours.length],
    'Ayşe Kaya',
    3,
    true,
    {
      id: 'rest-001',
      name: 'Cappadocia Sofra',
      address: 'Nevşehir Sok. No:5, Göreme',
    },
    demoStartTime.toISOString(),
    demoEndTime.toISOString()
  );

  // Akıllı bildirimi planla
  await scheduleMealReminder(mealTicket);
}

export default function TicketsTab() {
  const [tickets, setTickets] = useState<OfflineTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [seedBusy, setSeedBusy] = useState(false);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Biletleri yükle ─────────────────────────────────────────────────────
  const loadTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOfflineTickets();
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [tickets]);

  // ── Sekme geçişi animasyonu ────────────────────────────────────────────
  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    Animated.spring(tabIndicatorAnim, {
      toValue: tab === 'active' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  // ── Demo bilet ekim ─────────────────────────────────────────────────────
  const handleSeedDemo = async () => {
    setSeedBusy(true);
    await seedDemoTickets();
    await loadTickets(true);
    setSeedBusy(false);
  };

  // ── Temizle ─────────────────────────────────────────────────────────────
  const handleClear = async () => {
    await clearOfflineTickets();
    setTickets([]);
  };

  // ── Filtrelenmiş biletler ────────────────────────────────────────────────
  const filteredTickets = tickets.filter((t) =>
    activeTab === 'active' ? t.status === 'active' : t.status !== 'active'
  );

  // ── Render: Boş durum ────────────────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient colors={['#f0f9ff', '#e0f2fe']} style={styles.emptyIconBg}>
        <FontAwesome name="ticket" size={48} color="#0ea5e9" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>
        {activeTab === 'active' ? 'Aktif biletin bulunmuyor' : 'Geçmiş bilet yok'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'active'
          ? 'Bir tur satın aldığında dijital biletlerin burada görünür.'
          : 'Tamamlanmış veya iptal edilmiş biletler burada listelenir.'}
      </Text>
      {activeTab === 'active' && (
        <View style={styles.emptyActions}>
          <TouchableOpacity
            style={styles.exploreTourBtn}
            onPress={() => router.push('/(tabs)/explore')}>
            <FontAwesome name="search" size={14} color="#fff" />
            <Text style={styles.exploreTourBtnText}>Tur Ara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={handleSeedDemo}
            disabled={seedBusy}>
            {seedBusy ? (
              <ActivityIndicator color="#008cb3" size="small" />
            ) : (
              <>
                <FontAwesome name="magic" size={14} color="#008cb3" />
                <Text style={styles.demoBtnText}>Demo Bilet Oluştur</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // ── Render: Header ────────────────────────────────────────────────────────
  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderCount}>
        {filteredTickets.length} bilet
        {filteredTickets.some((t) => t.hasMealPackage) && (
          <Text style={styles.mealPackageHint}> · Tur+Yemek paketleri dahil</Text>
        )}
      </Text>
      {tickets.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearChip}>
          <FontAwesome name="trash-o" size={12} color="#ef4444" />
          <Text style={styles.clearChipText}>Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Ana Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#005f80" />

      {/* ── Header ── */}
      <LinearGradient colors={['#005f80', '#008cb3']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>🎫 Biletlerim</Text>
            <Text style={styles.headerSub}>Dijital Voucher Merkezi</Text>
          </View>
          <TouchableOpacity
            style={styles.addDemoBtn}
            onPress={handleSeedDemo}
            disabled={seedBusy}>
            {seedBusy ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <FontAwesome name="plus" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Sekme Toggle ── */}
        <View style={styles.tabBar}>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                left: tabIndicatorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['2%', '51%'],
                }),
              },
            ]}
          />
          <TouchableOpacity style={styles.tabBtn} onPress={() => switchTab('active')}>
            <FontAwesome
              name="check-circle"
              size={13}
              color={activeTab === 'active' ? '#008cb3' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Aktif ({tickets.filter((t) => t.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBtn} onPress={() => switchTab('past')}>
            <FontAwesome
              name="history"
              size={13}
              color={activeTab === 'past' ? '#008cb3' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Geçmiş ({tickets.filter((t) => t.status !== 'active').length})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── İçerik ── */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#008cb3" />
          <Text style={styles.loadingText}>Biletler yükleniyor…</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={filteredTickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VoucherCard ticket={item} onRefresh={() => loadTickets(true)} />
            )}
            ListHeaderComponent={filteredTickets.length > 0 ? <ListHeader /> : null}
            ListEmptyComponent={<EmptyState />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadTickets(true);
                }}
                tintColor="#008cb3"
                colors={['#008cb3']}
              />
            }
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header
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
  headerSub: {
    fontSize: 13,
    color: '#cffafe',
    fontWeight: '600',
    marginTop: 2,
  },
  addDemoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sekme çubuğu
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 44,
    position: 'relative',
    padding: 2,
  },
  tabIndicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#008cb3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabTextActive: { color: '#008cb3' },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { fontSize: 15, color: '#64748b', fontWeight: '600' },

  // Liste
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  listHeaderCount: { fontSize: 13, fontWeight: '700', color: '#475569' },
  mealPackageHint: { color: '#f97316', fontWeight: '800' },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  clearChipText: { fontSize: 12, color: '#ef4444', fontWeight: '700' },

  // Boş durum
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 32,
  },
  emptyActions: { gap: 12, width: '100%' },
  exploreTourBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#008cb3',
    borderRadius: 14,
    height: 52,
  },
  exploreTourBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
  },
  demoBtnText: { color: '#008cb3', fontSize: 15, fontWeight: '800' },
});
