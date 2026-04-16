/**
 * VoucherCard.tsx
 * Tourkia Dijital Voucher Bileşeni
 *
 * Props:
 *   ticket      — OfflineTicket (tekil veya Tur+Yemek paketi)
 *   onRefresh   — Bilet yenileme callback'i
 */

import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { OfflineTicket, markMealRedeemed } from '../services/offlineStorage';
import { MealRedeemPayload, redeemMealVoucher, redeemTourVoucher } from '../services/voucherApi';
import { scheduleFeedbackNotification } from '../services/notificationService';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 40;

// ─── Yardımcı: Kısa Bilet ID ─────────────────────────────────────────────────
const shortId = (id: string) => id.substring(0, 8).toUpperCase();

// ─── Tek QR Blok ─────────────────────────────────────────────────────────────
interface QrBlockProps {
  label: string;
  sublabel: string;
  qrValue: string;
  color: string; // hex — çerçeve rengi
  icon: string;
  badgeText: string;
  badgeColor: string;
  redeemed?: boolean;
  onRedeemPress?: () => void;
  redeemLoading?: boolean;
}

function QrBlock({
  label,
  sublabel,
  qrValue,
  color,
  icon,
  badgeText,
  badgeColor,
  redeemed,
  onRedeemPress,
  redeemLoading,
}: QrBlockProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  React.useEffect(() => {
    if (!redeemed) startPulse();
  }, [redeemed]);

  return (
    <View style={[qrStyles.wrapper, { borderColor: color }]}>
      {/* Başlık */}
      <View style={[qrStyles.labelRow, { backgroundColor: color }]}>
        <FontAwesome name={icon as any} size={13} color="#fff" />
        <Text style={qrStyles.labelText}>{label}</Text>
        <View style={[qrStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={qrStyles.badgeText}>{badgeText}</Text>
        </View>
      </View>

      {/* QR Kodu veya kullanıldı overlay */}
      <View style={qrStyles.qrArea}>
        {redeemed ? (
          <View style={qrStyles.redeemedOverlay}>
            <FontAwesome name="check-circle" size={48} color="#10b981" />
            <Text style={qrStyles.redeemedText}>Kullanıldı</Text>
          </View>
        ) : (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={qrStyles.qrBox}>
              <QRCode value={qrValue} size={130} backgroundColor="white" color="#0f172a" />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Alt açıklama */}
      <Text style={qrStyles.sublabel}>{sublabel}</Text>

      {/* Redeem butonu (opsiyonel) */}
      {onRedeemPress && !redeemed && (
        <TouchableOpacity
          style={[qrStyles.redeemBtn, { backgroundColor: color }]}
          onPress={onRedeemPress}
          disabled={redeemLoading}>
          {redeemLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FontAwesome name="qrcode" size={13} color="#fff" />
              <Text style={qrStyles.redeemBtnText}>QR Doğrula (Test)</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Ana VoucherCard Bileşeni ─────────────────────────────────────────────────
interface VoucherCardProps {
  ticket: OfflineTicket;
  onRefresh: () => void;
}

export default function VoucherCard({ ticket, onRefresh }: VoucherCardProps) {
  const [mealRedeemLoading, setMealRedeemLoading] = useState(false);
  const [tourRedeemLoading, setTourRedeemLoading] = useState(false);
  const [localMealRedeemed, setLocalMealRedeemed] = useState(ticket.mealRedeemed);
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Tur bitti mi? (Sıradaki Durak kontrolü)
  const isTourFinished = ticket.tourEndDate ? new Date() > new Date(ticket.tourEndDate) : false;
  const showGlow = isTourFinished && !localMealRedeemed;

  const purchaseDate = new Date(ticket.purchaseDate);
  const formattedDate = purchaseDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ── Tur QR doğrulama ──────────────────────────────────────────────────────
  const handleTourRedeem = async () => {
    setTourRedeemLoading(true);
    try {
      const qrParsed = JSON.parse(ticket.tourQrData);
      const result = await redeemTourVoucher({
        ticketId: ticket.id,
        tourId: ticket.tourId,
        signature: qrParsed.signature ?? '',
        redeemedAt: new Date().toISOString(),
      });
      Alert.alert(
        result.success ? '✅ Tur Onaylandı' : '❌ Doğrulama Hatası',
        result.message,
        [{ text: 'Tamam' }]
      );
    } catch {
      Alert.alert('Hata', 'Bağlantı hatası, tekrar deneyin.');
    } finally {
      setTourRedeemLoading(false);
    }
  };

  // ── Yemek QR doğrulama (SADECE meal-redeem endpoint'i) ────────────────────
  const handleMealRedeem = async () => {
    if (localMealRedeemed) {
      Alert.alert('Bilgi', 'Bu yemek kuponu daha önce kullanıldı.');
      return;
    }
    setMealRedeemLoading(true);
    try {
      const qrParsed = JSON.parse(ticket.restaurantQrData ?? '{}');
      const payload: MealRedeemPayload = {
        ticketId: ticket.id,
        tourId: ticket.tourId,
        restaurantId: qrParsed.restaurantId ?? ticket.restaurantInfo?.id ?? 'ANY',
        guests: ticket.travelerInfo.guests,
        signature: qrParsed.signature ?? '',
        redeemedAt: new Date().toISOString(),
      };
      const result = await redeemMealVoucher(payload);
      if (result.success) {
        // Yerel depolamada biletin yemek hakedişini 'kullanıldı' olarak işaretle
        await markMealRedeemed(ticket.id);
        setLocalMealRedeemed(true);
        // Değerlendirme bildirimini 2 saat sonrasına planla
        scheduleFeedbackNotification(ticket.restaurantInfo?.name || 'Restoran');
        onRefresh();
      }
      Alert.alert(
        result.success ? '🍽️ Yemek Kupon Aktive Edildi' : '❌ Kupon Hatası',
        result.message,
        [{ text: 'Harika!' }]
      );
    } catch {
      Alert.alert('Hata', 'Bağlantı hatası, tekrar deneyin.');
    } finally {
      setMealRedeemLoading(false);
    }
  };

  useEffect(() => {
    if (showGlow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
        ])
      ).start();
    }
  }, [showGlow]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(249, 115, 22, 0.1)', 'rgba(249, 115, 22, 0.6)']
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.card}>
      {/* ── Kart Üst: Gradient Header ── */}
      <LinearGradient colors={['#005f80', '#008cb3']} style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.tourTitle} numberOfLines={2}>
            {ticket.tour.title}
          </Text>
          {ticket.hasMealPackage && (
            <View style={styles.packageTag}>
              <FontAwesome name="cutlery" size={10} color="#f97316" />
              <Text style={styles.packageTagText}> Tur + Yemek Paketi</Text>
            </View>
          )}
        </View>
        <View style={styles.statusCircle}>
          <FontAwesome
            name={ticket.status === 'active' ? 'check' : 'times'}
            size={18}
            color={ticket.status === 'active' ? '#10b981' : '#ef4444'}
          />
        </View>
      </LinearGradient>

      {/* ── Bilgi Satırı ── */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>YOLCU</Text>
          <Text style={styles.infoValue}>{ticket.travelerInfo.name}</Text>
        </View>
        <View style={styles.infoSep} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>KİŞİ</Text>
          <Text style={styles.infoValue}>{ticket.travelerInfo.guests} Yetişkin</Text>
        </View>
        <View style={styles.infoSep} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TARİH</Text>
          <Text style={styles.infoValue}>{formattedDate}</Text>
        </View>
      </View>

      {/* ── Perforasyon Şeridi ── */}
      <View style={styles.perfRow}>
        <View style={styles.perfNotchL} />
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={i} style={styles.perfDash} />
        ))}
        <View style={styles.perfNotchR} />
      </View>

      {/* ── QR Alanı ── */}
      <View
        style={[
          styles.qrSection,
          ticket.hasMealPackage ? styles.qrSectionDual : styles.qrSectionSingle,
        ]}>
        {/* QR 1: Tur Operasyonu */}
        <QrBlock
          label="Tur Operasyonu"
          sublabel="Rehberinize okutun"
          qrValue={ticket.tourQrData}
          color="#008cb3"
          icon="plane"
          badgeText="TUR"
          badgeColor="#0369a1"
          onRedeemPress={handleTourRedeem}
          redeemLoading={tourRedeemLoading}
        />

        {/* QR 2: Restoran (sadece Tur+Yemek paketinde) */}
        {ticket.hasMealPackage && ticket.restaurantQrData && (
          <Animated.View style={{ 
            flex: 1, 
            borderRadius: 16,
            backgroundColor: showGlow ? glowColor : 'transparent',
            padding: showGlow ? 4 : 0
          }}>
            {showGlow && (
              <View style={styles.nextStopBadge}>
                 <FontAwesome name="map-marker" size={10} color="#fff" />
                 <Text style={styles.nextStopText}>SIRADAKİ DURAK</Text>
              </View>
            )}
            <QrBlock
              label="Restoran Giriş"
              sublabel={ticket.restaurantInfo?.name ?? 'Anlaşmalı Restoran'}
              qrValue={ticket.restaurantQrData}
              color="#f97316"
              icon="cutlery"
              badgeText="YEMEK"
              badgeColor="#ea580c"
              redeemed={localMealRedeemed}
              onRedeemPress={handleMealRedeem}
              redeemLoading={mealRedeemLoading}
            />
          </Animated.View>
        )}
      </View>

      {/* ── Bilet No + Harita Butonu ── */}
      <View style={styles.cardFooter}>
        <Text style={styles.ticketNo}>BİLET: {shortId(ticket.id)}</Text>
        {ticket.tour.meetingPoint && (
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() =>
              Linking.openURL(
                `https://maps.google.com/?q=${ticket.tour.meetingPoint!.lat},${ticket.tour.meetingPoint!.lng}`
              )
            }>
            <FontAwesome name="map-marker" size={13} color="#008cb3" />
            <Text style={styles.mapBtnText}>Buluşma Noktası</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Styles: QrBlock ─────────────────────────────────────────────────────────
const qrStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    minWidth: 150,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
  },
  labelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  qrArea: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  qrBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  redeemedOverlay: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  redeemedText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '900',
    color: '#10b981',
  },
  sublabel: {
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    paddingVertical: 6,
    backgroundColor: '#f8fafc',
  },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  redeemBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});

// ─── Styles: VoucherCard ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#008cb3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    width: CARD_W,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 12,
  },
  headerLeft: { flex: 1 },
  tourTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 6,
  },
  packageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249,115,22,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.4)',
  },
  packageTagText: {
    color: '#fed7aa',
    fontSize: 11,
    fontWeight: '800',
  },
  statusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bilgi satırı
  infoRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoItem: { flex: 1, alignItems: 'center' },
  infoSep: { width: 1, backgroundColor: '#e2e8f0', marginVertical: 4 },
  infoLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  infoValue: { fontSize: 12, fontWeight: '800', color: '#334155', textAlign: 'center' },

  // Perforasyon
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    backgroundColor: '#f8fafc',
  },
  perfNotchL: {
    width: 14,
    height: 28,
    backgroundColor: '#fff',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    marginLeft: -7,
  },
  perfDash: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 2,
  },
  perfNotchR: {
    width: 14,
    height: 28,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    marginRight: -7,
  },

  // QR alanı
  qrSection: {
    padding: 14,
    backgroundColor: '#f8fafc',
  },
  qrSectionSingle: {
    // Tek QR: ortalanmış
  },
  qrSectionDual: {
    flexDirection: 'row',
    gap: 10,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  ticketNo: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#94a3b8',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  mapBtnText: { fontSize: 12, fontWeight: '800', color: '#008cb3' },

  // Animasyon Ekleri
  nextStopBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  nextStopText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  }
});
