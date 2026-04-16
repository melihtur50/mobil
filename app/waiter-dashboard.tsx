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
import { markMealRedeemed } from '../services/offlineStorage';

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

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setIsScanning(false);
    try {
      if (parsed.type === 'MEAL_REDEMPTION' || data.includes('VIP')) {
        const enhancedData = {
          ...parsed,
          isVip: data.includes('VIP') || parsed.isVip,
          mealDescription: parsed.isVip ? 'VIP ÖZEL TADIM MENÜSÜ' : parsed.mealDescription
        };
        setScannedData(enhancedData);
        setModalVisible(true);
        if (enhancedData.isVip) startConfetti();
      } else {
        Alert.alert('Geçersiz QR', 'Bu bir yemek kuponu değil. Lütfen tur biletindeki yemek QR\'ını tarayın.');
      }
    } catch (e) {
      Alert.alert('Hata', 'QR kodu okunamadı veya geçersiz format.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Garson Paneli 🍽️</Text>
          <Text style={styles.headerSubtitle}>Restoran Operasyon</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <FontAwesome name="user-circle" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* QR Tara Butonu */}
      <TouchableOpacity 
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
          colors={['#008cb3', '#005f80']}
          style={styles.scanBtn}
        >
          <FontAwesome name="qrcode" size={40} color="#fff" />
          <Text style={styles.scanBtnText}>QR KODU TARA</Text>
          <Text style={styles.scanBtnSubtext}>Müşteri Menüsünü Onaylayın</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Bekleyen Rezervasyonlar Listesi */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Bekleyen Rezervasyonlar</Text>
        <FlatList
          data={PENDING_RESERVATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resCard}>
              <View style={styles.resInfo}>
                <Text style={styles.resName}>{item.name}</Text>
                <Text style={styles.resDetail}>{item.guests} Kişi · Saat: {item.time}</Text>
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
            <Text style={styles.cameraText}>Bilet üzerindeki Yemek QR'ını çerçeve içine getirin</Text>
          </SafeAreaView>
        </CameraView>
      </Modal>

      {/* Menü Detay Modalı (Tam Ekran) */}
      <Modal visible={modalVisible} transparent={false} animationType="fade">
        <View style={styles.modalContent}>
          <LinearGradient colors={scannedData?.isVip ? ['#f59e0b', '#d97706'] : ['#f97316', '#ea580c']} style={styles.modalHeader}>
            <FontAwesome name={scannedData?.isVip ? "diamond" : "check-circle"} size={60} color="#fff" />
            <Text style={styles.modalTitle}>{scannedData?.isVip ? '💎 VIP MİSAFİR 💎' : 'DOĞRULAMA BAŞARILI!'}</Text>
          </LinearGradient>

          {scannedData?.isVip && (
            <View style={styles.vipActionBox}>
              <FontAwesome name="star" size={16} color="#d97706" />
              <Text style={styles.vipActionText}>Lütfen misafirimize özel ikramını ve önceliğini sunun.</Text>
            </View>
          )}

          {/* Confetti Effect Rendering */}
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
          
          <View style={styles.modalBody}>
            <Text style={styles.menuLabel}>Müşteri Satın Alımı:</Text>
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>{scannedData?.mealDescription || 'Özel Menü'}</Text>
              <View style={styles.menuDivider} />
              <View style={styles.menuRow}>
                <FontAwesome name="users" size={16} color="#64748b" />
                <Text style={styles.menuValue}>{scannedData?.guests} Kişilik hakediş</Text>
              </View>
              <View style={styles.menuRow}>
                <FontAwesome name="info-circle" size={16} color="#64748b" />
                <Text style={styles.menuValue}>Garson Notu: İçecek dahil menü.</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={async () => {
                // Yerel durumu güncelle ve bildirimi planla
                if (scannedData?.ticketId) {
                  await markMealRedeemed(scannedData.ticketId);
                  scheduleFeedbackNotification(scannedData.restaurantName || 'Restoran');
                }
                setModalVisible(false);
              }}
            >
              <Text style={styles.confirmBtnText}>SERVİSİ BAŞLAT</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  profileBtn: { padding: 5 },
  
  scanBtnOuter: { margin: 20, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#008cb3', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  scanBtn: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  scanBtnText: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 16 },
  scanBtnSubtext: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginTop: 4 },
  
  listSection: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  resCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  resInfo: { flex: 1 },
  resName: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  resDetail: { fontSize: 12, color: '#64748b', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },
  
  cameraOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
  closeCamera: { alignSelf: 'flex-end', marginRight: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  scannerFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#fff', borderRadius: 24, backgroundColor: 'transparent' },
  cameraText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 },
  
  modalContent: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { height: '30%', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 20 },
  modalBody: { padding: 30, flex: 1 },
  menuLabel: { fontSize: 14, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: 12 },
  menuCard: { backgroundColor: '#fff7ed', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#ffedd5', marginBottom: 30 },
  menuTitle: { fontSize: 20, fontWeight: '900', color: '#ea580c', marginBottom: 15 },
  menuDivider: { height: 1, backgroundColor: '#fed7aa', marginBottom: 15 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  menuValue: { fontSize: 15, fontWeight: '700', color: '#9a3412' },
  confirmBtn: { backgroundColor: '#ea580c', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', shadowColor: '#ea580c', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  // VIP Enhancements
  vipActionBox: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 12, marginHorizontal: 30, marginTop: -25, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#fde68a', zIndex: 10 },
  vipActionText: { color: '#b45309', fontSize: 13, fontWeight: '800', flex: 1 },
  confetti: { position: 'absolute', top: 0, zIndex: 99, borderRadius: 2 },
});
