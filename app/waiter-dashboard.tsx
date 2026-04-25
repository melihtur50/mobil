import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing, Dimensions } from 'react-native';
import { scheduleFeedbackNotification } from '../services/notificationService';
import { markMealRedeemed, getOfflineTickets } from '../services/offlineStorage';
import { getMerchantBalance } from '../services/financeService';
import { SimulationService } from '../services/simulationService';
import * as Haptics from 'expo-haptics';

// Mock Bekleyen Rezervasyonlar
const PENDING_RESERVATIONS = [
  { id: '1', name: 'Ahmet Yılmaz', guests: 2, time: '13:30', status: 'Onaylandı' },
  { id: '2', name: 'Ayşe Kaya', guests: 4, time: '14:15', status: 'Yolda' },
  { id: '3', name: 'Canberk Arı', guests: 1, time: '15:00', status: 'Bekleniyor' },
];

export default function WaiterDashboard() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [merchantBalance, setMerchantBalance] = useState(14500); // Demo default
  const [customerCount, setCustomerCount] = useState(12); // Demo default
  const [simulationActive, setSimulationActive] = useState(false);
  
  useEffect(() => {
    const init = async () => {
        const bal = await getMerchantBalance('rest-1');
        if (bal > 0) setMerchantBalance(bal);
        
        const sim = await SimulationService.isActive();
        setSimulationActive(sim);
    };
    init();
  }, [modalVisible]);

  const toggleSimulation = async () => {
    const next = !simulationActive;
    await SimulationService.toggleMode(next);
    setSimulationActive(next);
    if (next) {
        Alert.alert('Simülasyon Modu Aktif', 'Her 5 dakikada bir otomatik satın alma yapılacak ve bakiyeniz güncellenecektir.');
    }
  };

  const confettiAnims = React.useRef([...Array(20)].map(() => new Animated.Value(0))).current;

  const startConfetti = () => {
    confettiAnims.forEach((anim) => anim.setValue(0));
    const animations = confettiAnims.map((anim) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 2000 + Math.random() * 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });
    });
    Animated.parallel(animations).start();
  };

  if (!permission) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#008cb3" /></View>;
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setIsScanning(false);
    try {
      const parsed = JSON.parse(data);
      
      // Bilet geçerlilik kontrolü (Offline Storage üzerinden simülasyon)
      const allTickets = await getOfflineTickets();
      const dbTicket = allTickets.find(t => t.id === parsed.ticketId);

      if (dbTicket && dbTicket.mealRedeemed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('⚠️ MÜKERRER KULLANIM', 'Bu bilet daha önce kullanılmıştır! Servis vermeyin.');
        return;
      }

      if (parsed.type === 'MEAL_REDEMPTION' || data.includes('VIP')) {
        const enhancedData = {
          ...parsed,
          isVip: data.includes('VIP') || parsed.isVip,
          mealDescription: parsed.isVip ? 'VIP ÖZEL TADIM MENÜSÜ' : (parsed.mealDescription || 'Testi Kebabı Menüsü')
        };
        
        setScannedData(enhancedData);
        setModalVisible(true);

        // VIP Durumu: Altın Sarısı + Titreşim (Komut 19)
        if (enhancedData.isVip) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          startConfetti();
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Bilet okunduğu an 'Kullanıldı' olarak işaretle (Komut 19)
        if (enhancedData.ticketId) {
            await markMealRedeemed(enhancedData.ticketId);
        }

      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Geçersiz QR', 'Bu bir yemek kuponu değil.');
      }
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Hata', 'QR kodu okunamadı veya geçersiz format.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.roleBadge}>
            <FontAwesome name="briefcase" size={10} color="#0369a1" />
            <Text style={styles.roleBadgeText}>STAFF MODE</Text>
          </View>
          <Text style={styles.headerTitle}>Hızlı Terminal ⚡</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <FontAwesome name="power-off" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Komut 21: Transparent Merchant Dashboard (Finansal Durum Widget'ı) */}
      <View style={styles.financeWidget}>
        <LinearGradient colors={['#fff', '#f8fafc']} style={styles.financeCard}>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Bugün Gelen</Text>
                <Text style={styles.financeValue}>{customerCount}</Text>
                <Text style={styles.financeSub}>Misafir</Text>
            </View>
            <View style={styles.financeSep} />
            <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Gelecek Toplam</Text>
                <Text style={styles.financeValue}>₺{merchantBalance.toLocaleString('tr-TR')}</Text>
                <Text style={styles.financeSub}>Bekleyen Ödeme</Text>
            </View>
          </View>
          <View style={styles.financeFooter}>
            <View style={styles.payoutInfo}>
                <FontAwesome name="calendar-check-o" size={12} color="#16a34a" />
                <Text style={styles.payoutText}>Sıradaki Ödeme Günü: <Text style={{fontWeight: '900'}}>Cuma</Text></Text>
            </View>
            <TouchableOpacity 
                style={[styles.simToggle, simulationActive && styles.simToggleActive]} 
                onPress={toggleSimulation}
            >
                <FontAwesome name={simulationActive ? "bolt" : "flask"} size={12} color={simulationActive ? "#fff" : "#6366f1"} />
                <Text style={[styles.simToggleText, simulationActive && styles.simToggleTextActive]}>
                    {simulationActive ? 'Simülasyon Aktif' : 'Test Modu'}
                </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Komut 18: Devasa QR Tara Butonu (One-Tap Scanner) */}
      <View style={styles.heroSection}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.scanBtnOuter} 
          onPress={() => {
            if (!permission.granted) {
              requestPermission();
            } else {
              setIsScanning(true);
            }
          }}
        >
          <LinearGradient
            colors={['#0284c7', '#0369a1']}
            style={styles.scanBtn}
          >
            <View style={styles.iconCircle}>
                <FontAwesome name="qrcode" size={60} color="#0284c7" />
            </View>
            <Text style={styles.scanBtnText}>QR OKUT</Text>
            <Text style={styles.scanBtnSubtext}>Anında Doğrulama için Dokunun</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bekleyen Rezervasyonlar Listesi */}
      <View style={styles.listSection}>
        <View style={styles.listHeaderRow}>
            <Text style={styles.sectionTitle}>Bugünkü Rezervasyonlar</Text>
            <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{PENDING_RESERVATIONS.length}</Text>
            </View>
        </View>
        <FlatList
          data={PENDING_RESERVATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resCard}>
              <View style={styles.resInfo}>
                <Text style={styles.resName}>{item.name}</Text>
                <Text style={styles.resDetail}>{item.guests} Kişi · {item.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Onaylandı' ? '#dcfce7' : '#f1f5f9' }]}>
                <Text style={[styles.statusText, { color: item.status === 'Onaylandı' ? '#16a34a' : '#64748b' }]}>{item.status}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Kamera Modalı */}
      <Modal visible={isScanning} animationType="slide">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        >
          <SafeAreaView style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeCamera} onPress={() => setIsScanning(false)}>
              <FontAwesome name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.scannerFrame} />
            <Text style={styles.cameraText}>{`Bilet üzerindeki Yemek QR'ını çerçeve içine getirin`}</Text>
          </SafeAreaView>
        </CameraView>
      </Modal>

      {/* Komut 19: Action-Oriented Success Screen (Hareket Emri Ekranı) */}
      <Modal visible={modalVisible} transparent={false} animationType="fade">
        <View style={[styles.modalContent, { backgroundColor: scannedData?.isVip ? '#fefce8' : '#f0fdf4' }]}>
          <LinearGradient 
            colors={scannedData?.isVip ? ['#f59e0b', '#d97706'] : ['#22c55e', '#16a34a']} 
            style={styles.modalHeader}
          >
            <FontAwesome name={scannedData?.isVip ? "diamond" : "check-circle"} size={80} color="#fff" />
            <Text style={styles.modalTitle}>
                {scannedData?.isVip ? 'VIP MİSAFİR' : 'ONAYLANDI!'}
            </Text>
          </LinearGradient>

          {/* Confetti Effect Rendering for VIP */}
          {scannedData?.isVip && confettiAnims.map((anim, i) => {
            const left = Math.random() * 100;
            const size = 5 + Math.random() * 10;
            const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#fff'];
            const color = colors[i % colors.length];
            
            return (
              <Animated.View
                key={i}
                style={[
                  styles.confetti,
                  {
                    left: `${left}%`,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-100, 800],
                        }),
                      },
                      {
                        rotate: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
            );
          })}

          <View style={styles.actionBody}>
            <Text style={styles.actionInstruction}>PERSONEL HAREKET EMRİ:</Text>
            <View style={[styles.actionCard, { borderColor: scannedData?.isVip ? '#fde68a' : '#bbf7d0' }]}>
                <Text style={styles.actionText}>
                    {scannedData?.isVip 
                        ? 'Lütfen misafirimize ÖNCELİKLİ MASA ve VIP İKRAM (Şarap/Meze) sunun.'
                        : `Masaya ${scannedData?.guests} Kişilik ${scannedData?.mealDescription} Servis Edin.`}
                </Text>
            </View>

            <View style={styles.guestDetailBox}>
                <Text style={styles.guestDetailTitle}>Misafir Bilgisi:</Text>
                <Text style={styles.guestDetailValue}>{scannedData?.traveler || 'Müşteri'}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.confirmBtn, { backgroundColor: scannedData?.isVip ? '#d97706' : '#16a34a' }]} 
              onPress={() => {
                if (scannedData?.restaurantName) {
                    scheduleFeedbackNotification(scannedData.restaurantName);
                }
                setModalVisible(false);
                setScannedData(null);
              }}
            >
              <Text style={styles.confirmBtnText}>SERVİS BAŞLATILDI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  profileBtn: { padding: 10, backgroundColor: '#fef2f2', borderRadius: 12 },
  
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4, gap: 5 },
  roleBadgeText: { fontSize: 9, fontWeight: '800', color: '#0369a1' },

  financeWidget: { paddingHorizontal: 20, marginTop: 10 },
  financeCard: { padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  financeRow: { flexDirection: 'row', alignItems: 'center' },
  financeItem: { flex: 1, alignItems: 'center' },
  financeLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' },
  financeValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  financeSub: { fontSize: 10, color: '#64748b', fontWeight: '600', marginTop: 2 },
  financeSep: { width: 1, height: 40, backgroundColor: '#e2e8f0' },
  financeFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  payoutInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  payoutText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  
  simToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f5f3ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#ddd6fe' },
  simToggleActive: { backgroundColor: '#6366f1', borderColor: '#4f46e5' },
  simToggleText: { fontSize: 11, fontWeight: '800', color: '#6366f1' },
  simToggleTextActive: { color: '#fff' },

  heroSection: { padding: 20 },
  scanBtnOuter: { borderRadius: 32, overflow: 'hidden', elevation: 15, shadowColor: '#0284c7', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24 },
  scanBtn: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 100, height: 100, backgroundColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scanBtnText: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  scanBtnSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginTop: 8 },
  
  listSection: { flex: 1, paddingHorizontal: 20 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  countBadge: { backgroundColor: '#0284c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  resCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  resInfo: { flex: 1 },
  resName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  resDetail: { fontSize: 13, color: '#64748b', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  
  cameraOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
  closeCamera: { alignSelf: 'flex-end', marginRight: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  scannerFrame: { width: 280, height: 280, borderWidth: 4, borderColor: '#fff', borderRadius: 40, backgroundColor: 'transparent' },
  cameraText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center', paddingHorizontal: 40, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 12, borderRadius: 20 },
  
  modalContent: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { height: '35%', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 20, textAlign: 'center', paddingHorizontal: 20 },
  modalBody: { padding: 30, flex: 1 },
  
  actionBody: { padding: 24, flex: 1, justifyContent: 'center' },
  actionInstruction: { fontSize: 14, fontWeight: '900', color: '#64748b', letterSpacing: 1.5, marginBottom: 16, textAlign: 'center' },
  actionCard: { backgroundColor: '#fff', borderWidth: 3, borderRadius: 24, padding: 24, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  actionText: { fontSize: 24, fontWeight: '900', color: '#0f172a', textAlign: 'center', lineHeight: 34 },
  
  guestDetailBox: { alignItems: 'center', marginBottom: 40 },
  guestDetailTitle: { fontSize: 13, color: '#94a3b8', fontWeight: '700', marginBottom: 4 },
  guestDetailValue: { fontSize: 18, fontWeight: '800', color: '#334155' },

  confirmBtn: { backgroundColor: '#ea580c', height: 70, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#ea580c', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  confirmBtnText: { color: '#fff', fontSize: 20, fontWeight: '900' },

  // VIP Enhancements
  vipActionBox: { backgroundColor: '#fffbeb', padding: 16, borderRadius: 16, marginHorizontal: 30, marginTop: -35, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderColor: '#fde68a', zIndex: 10 },
  vipActionText: { color: '#b45309', fontSize: 14, fontWeight: '800', flex: 1 },
  confetti: { position: 'absolute', top: 0, zIndex: 99, borderRadius: 2 },
});
